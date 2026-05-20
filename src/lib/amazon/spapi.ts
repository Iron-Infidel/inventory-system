/**
 * Amazon SP-API client
 * Handles access token refresh and fetches FBA inventory (via Reports API)
 * and AWD inventory.
 */

const LWA_TOKEN_URL = 'https://api.amazon.com/auth/o2/token'
const SP_API_BASE   = 'https://sellingpartnerapi-na.amazon.com'
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID ?? 'ATVPDKIKX0DER'

// ─── Access token cache (in-process, 55-min TTL) ─────────────────────────────

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const res = await fetch(LWA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: process.env.AMAZON_REFRESH_TOKEN!,
      client_id:     process.env.AMAZON_CLIENT_ID!,
      client_secret: process.env.AMAZON_CLIENT_SECRET!,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LWA token exchange failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  cachedToken    = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000
  return cachedToken!
}

// ─── SP-API request helpers ───────────────────────────────────────────────────

async function spGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const token = await getAccessToken()
  const url   = new URL(`${SP_API_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: { 'x-amz-access-token': token, 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SP-API ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function spPost<T>(path: string, body: unknown): Promise<T> {
  const token = await getAccessToken()

  const res = await fetch(`${SP_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'x-amz-access-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SP-API ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

// ─── Types ────────────────────────────────────────────────────────────────────

// Simplified: ASIN → fulfillable quantity (what we actually need)
export type FbaInventoryByAsin = Map<string, number>

export type AwdInventoryItem = {
  sku:                 string
  totalOnhandQuantity: number
  availableQuantity:   number
}

export type AmazonInventoryResult = {
  fbaByAsin: FbaInventoryByAsin
  awd:       AwdInventoryItem[]
  fetchedAt: string
  fbaError?: string
  awdError?: string
}

// ─── FBA inventory via Reports API ───────────────────────────────────────────
// Uses GET_FBA_MYI_ALL_INVENTORY_DATA report (TSV).
// Much better rate limits than the direct Inventory API — designed for batch use.

async function fetchFbaInventoryViaReport(): Promise<FbaInventoryByAsin> {
  // 1. Request the report
  const { reportId } = await spPost<{ reportId: string }>(
    '/reports/2021-06-30/reports',
    {
      reportType:     'GET_FBA_MYI_ALL_INVENTORY_DATA',
      marketplaceIds: [MARKETPLACE_ID],
    }
  )

  // 2. Poll until DONE (up to 90 seconds, every 5s)
  let reportDocumentId: string | undefined
  for (let attempt = 0; attempt < 18; attempt++) {
    await new Promise(r => setTimeout(r, 5000))

    const report = await spGet<{
      processingStatus: string
      reportDocumentId?: string
    }>(`/reports/2021-06-30/reports/${reportId}`)

    if (report.processingStatus === 'DONE') {
      reportDocumentId = report.reportDocumentId
      break
    }
    if (report.processingStatus === 'FATAL' || report.processingStatus === 'CANCELLED') {
      throw new Error(`FBA report failed with status: ${report.processingStatus}`)
    }
    // IN_QUEUE or IN_PROGRESS — keep polling
  }

  if (!reportDocumentId) {
    throw new Error('FBA report timed out after 90 seconds')
  }

  // 3. Get the pre-signed download URL
  const { url, compressionAlgorithm } = await spGet<{
    url: string
    compressionAlgorithm?: string
  }>(`/reports/2021-06-30/documents/${reportDocumentId}`)

  // 4. Download the report (plain fetch — pre-signed S3 URL, no auth headers)
  const fileRes = await fetch(url)
  if (!fileRes.ok) throw new Error(`Failed to download report: ${fileRes.status}`)

  let text: string
  if (compressionAlgorithm === 'GZIP') {
    // Decompress gzip
    const buffer = await fileRes.arrayBuffer()
    const ds     = new DecompressionStream('gzip')
    const writer = ds.writable.getWriter()
    const reader = ds.readable.getReader()
    writer.write(new Uint8Array(buffer))
    writer.close()
    const chunks: Uint8Array[] = []
    let done = false
    while (!done) {
      const { value, done: d } = await reader.read()
      if (value) chunks.push(value)
      done = d
    }
    text = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length)
        merged.set(acc)
        merged.set(c, acc.length)
        return merged
      }, new Uint8Array(0))
    )
  } else {
    text = await fileRes.text()
  }

  // 5. Parse TSV → ASIN → fulfillable quantity
  // Columns include: sku, fnsku, asin, product-name, condition,
  //   afn-fulfillable-quantity, afn-warehouse-quantity, afn-total-quantity, ...
  const lines   = text.split('\n').filter(Boolean)
  const headers = lines[0].split('\t').map(h => h.trim())
  const asinIdx = headers.indexOf('asin')
  const qtyIdx  = headers.indexOf('afn-fulfillable-quantity')

  if (asinIdx === -1 || qtyIdx === -1) {
    throw new Error(`Unexpected report columns: ${headers.join(', ')}`)
  }

  const byAsin: FbaInventoryByAsin = new Map()
  for (const line of lines.slice(1)) {
    const cols = line.split('\t')
    const asin = cols[asinIdx]?.trim()
    const qty  = parseInt(cols[qtyIdx] ?? '0', 10) || 0
    if (asin) byAsin.set(asin, (byAsin.get(asin) ?? 0) + qty)
  }

  return byAsin
}

// ─── AWD inventory ────────────────────────────────────────────────────────────

async function fetchAwdInventory(): Promise<AwdInventoryItem[]> {
  const items: AwdInventoryItem[] = []
  let nextToken: string | undefined

  do {
    const params: Record<string, string> = { maxResults: '50' }
    if (nextToken) params.nextToken = nextToken

    const data = await spGet<{
      inventory: AwdInventoryItem[]
      nextToken?: string
    }>('/awd/2024-05-09/inventory', params)

    items.push(...(data.inventory ?? []))
    nextToken = data.nextToken
  } while (nextToken)

  return items
}

// ─── Public: fetch both ───────────────────────────────────────────────────────

export async function fetchAmazonInventory(): Promise<AmazonInventoryResult> {
  const [fbaResult, awdResult] = await Promise.allSettled([
    fetchFbaInventoryViaReport(),
    fetchAwdInventory(),
  ])

  const fbaByAsin = fbaResult.status === 'fulfilled' ? fbaResult.value : new Map()
  const awd       = awdResult.status === 'fulfilled' ? awdResult.value : []

  const fbaError = fbaResult.status === 'rejected' ? String(fbaResult.reason) : undefined
  const awdError = awdResult.status === 'rejected' ? String(awdResult.reason) : undefined

  if (fbaError) console.error('[spapi] FBA report failed:', fbaError)
  if (awdError) console.warn('[spapi] AWD fetch failed:', awdError)

  return { fbaByAsin, awd, fetchedAt: new Date().toISOString(), fbaError, awdError }
}
