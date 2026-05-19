/**
 * Amazon SP-API client
 * Handles access token refresh and fetches FBA + AWD inventory.
 */

const LWA_TOKEN_URL = 'https://api.amazon.com/auth/o2/token'
const SP_API_BASE   = 'https://sellingpartnerapi-na.amazon.com'

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
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000 // refresh 5 min early
  return cachedToken!
}

// ─── Generic SP-API request helper ───────────────────────────────────────────

async function spRequest<T>(path: string, params?: Record<string, string>): Promise<T> {
  const token = await getAccessToken()
  const url   = new URL(`${SP_API_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: {
      'x-amz-access-token': token,
      'Content-Type':       'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SP-API ${path} failed: ${res.status} ${text}`)
  }

  return res.json()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type FbaInventoryItem = {
  asin:            string
  fnSku:           string
  sellerSku:       string
  condition:       string
  inventoryDetails: {
    fulfillableQuantity:          number
    inboundWorkingQuantity:       number
    inboundShippedQuantity:       number
    inboundReceivingQuantity:     number
    reservedQuantity:             { totalReservedQuantity: number }
    researchingQuantity:          { totalResearchingQuantity: number }
    unfulfillableQuantity:        { totalUnfulfillableQuantity: number }
  }
  lastUpdatedTime: string
  productName:     string
  totalQuantity:   number
}

export type AwdInventoryItem = {
  sku:               string
  totalOnhandQuantity: number
  availableQuantity:   number
}

export type AmazonInventory = {
  fba: FbaInventoryItem[]
  awd: AwdInventoryItem[]
  fetchedAt: string
}

// ─── FBA inventory ────────────────────────────────────────────────────────────

async function fetchFbaInventory(): Promise<FbaInventoryItem[]> {
  const marketplaceId = process.env.AMAZON_MARKETPLACE_ID ?? 'ATVPDKIKX0DER'
  const items: FbaInventoryItem[] = []
  let nextToken: string | undefined

  do {
    const params: Record<string, string> = {
      details:       'true',
      granularityType: 'Marketplace',
      granularityId: marketplaceId,
      marketplaceIds: marketplaceId,
    }
    if (nextToken) params.nextToken = nextToken

    const data = await spRequest<{
      payload: {
        granularity:    unknown
        inventorySummaries: FbaInventoryItem[]
      }
      pagination?: { nextToken?: string }
    }>('/fba/inventory/v1/summaries', params)

    items.push(...(data.payload?.inventorySummaries ?? []))
    nextToken = data.pagination?.nextToken
  } while (nextToken)

  return items
}

// ─── AWD inventory ────────────────────────────────────────────────────────────

async function fetchAwdInventory(): Promise<AwdInventoryItem[]> {
  const items: AwdInventoryItem[] = []
  let nextToken: string | undefined

  do {
    const params: Record<string, string> = { maxResults: '50' }
    if (nextToken) params.nextToken = nextToken

    const data = await spRequest<{
      inventory: AwdInventoryItem[]
      nextToken?: string
    }>('/awd/2024-05-09/inventory', params)

    items.push(...(data.inventory ?? []))
    nextToken = data.nextToken
  } while (nextToken)

  return items
}

// ─── Public: fetch both ───────────────────────────────────────────────────────

export async function fetchAmazonInventory(): Promise<AmazonInventory> {
  const [fba, awd] = await Promise.all([
    fetchFbaInventory(),
    fetchAwdInventory(),
  ])
  return { fba, awd, fetchedAt: new Date().toISOString() }
}
