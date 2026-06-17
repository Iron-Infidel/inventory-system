import { NextResponse }   from 'next/server'
import { createClient }   from '@supabase/supabase-js'
import { getAccessToken } from '@/lib/amazon/spapi'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ─── Amazon: 3 parallel 30-day windows → units sold by ASIN ──────────────────

async function fetchAmazonSalesByAsin(): Promise<Map<string, number>> {
  const BASE    = 'https://sellingpartnerapi-na.amazon.com'
  const MKT     = process.env.AMAZON_MARKETPLACE_ID ?? 'ATVPDKIKX0DER'
  const token   = await getAccessToken()
  const now     = Date.now()

  // Flat-file orders report supports max 30 days — request 3 windows in parallel
  const windows = [
    { start: new Date(now - 90 * 86_400_000), end: new Date(now - 60 * 86_400_000) },
    { start: new Date(now - 60 * 86_400_000), end: new Date(now - 30 * 86_400_000) },
    { start: new Date(now - 30 * 86_400_000), end: new Date(now) },
  ]

  const reportIds = await Promise.all(windows.map(async (w) => {
    const res = await fetch(`${BASE}/reports/2021-06-30/reports`, {
      method:  'POST',
      headers: { 'x-amz-access-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportType:     'GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL',
        marketplaceIds: [MKT],
        dataStartTime:  w.start.toISOString(),
        dataEndTime:    w.end.toISOString(),
      }),
    })
    if (!res.ok) throw new Error(`Amazon report create failed: ${res.status}`)
    return (await res.json()).reportId as string
  }))

  // Poll all 3 concurrently until done (up to 3 minutes)
  const docIds: (string | undefined)[] = [undefined, undefined, undefined]
  for (let attempt = 0; attempt < 36; attempt++) {
    await new Promise(r => setTimeout(r, 5000))
    if (docIds.every(Boolean)) break

    await Promise.all(reportIds.map(async (id, i) => {
      if (docIds[i]) return
      const res    = await fetch(`${BASE}/reports/2021-06-30/reports/${id}`, {
        headers: { 'x-amz-access-token': token },
      })
      const report = await res.json()
      if (report.processingStatus === 'DONE')                                  docIds[i] = report.reportDocumentId
      if (['FATAL', 'CANCELLED'].includes(report.processingStatus))
        throw new Error(`Amazon report ${i} failed: ${report.processingStatus}`)
    }))
  }
  if (!docIds.every(Boolean)) throw new Error('Amazon reports timed out')

  // Download + parse all 3, accumulate into one map
  const byAsin = new Map<string, number>()
  await Promise.all(docIds.map(async (docId) => {
    const { url, compressionAlgorithm } = await (await fetch(`${BASE}/reports/2021-06-30/documents/${docId}`, {
      headers: { 'x-amz-access-token': token },
    })).json()

    const fileRes = await fetch(url)
    let text: string
    if (compressionAlgorithm === 'GZIP') {
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
      const merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0))
      let offset = 0
      for (const c of chunks) { merged.set(c, offset); offset += c.length }
      text = new TextDecoder().decode(merged)
    } else {
      text = await fileRes.text()
    }

    const lines   = text.split('\n').filter(Boolean)
    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase())
    const asinIdx = headers.indexOf('asin')
    const qtyIdx  = headers.findIndex(h => h.includes('quantity-purchased'))

    if (asinIdx === -1 || qtyIdx === -1)
      throw new Error(`Unexpected Amazon report columns: ${headers.slice(0, 12).join(' | ')}`)

    for (const line of lines.slice(1)) {
      const cols = line.split('\t')
      const asin = cols[asinIdx]?.trim()
      const qty  = parseInt(cols[qtyIdx] ?? '0', 10) || 0
      if (asin) byAsin.set(asin, (byAsin.get(asin) ?? 0) + qty)
    }
  }))

  return byAsin
}

// ─── Shopify: last-90-day units sold by SKU ───────────────────────────────────

async function fetchShopifySalesBySku(): Promise<Map<string, number>> {
  const store = process.env.SHOPIFY_STORE!
  const token = process.env.SHOPIFY_ACCESS_TOKEN!
  if (!token) throw new Error('SHOPIFY_ACCESS_TOKEN env var not set')

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000).toISOString()
  const bySku         = new Map<string, number>()
  let   pageInfo: string | null = null
  let   firstPage               = true

  while (firstPage || pageInfo) {
    firstPage = false

    // Shopify rejects extra params alongside page_info — keep them separate
    const params = new URLSearchParams({ limit: '250' })
    if (pageInfo) {
      params.set('page_info', pageInfo)
    } else {
      params.set('status',         'any')
      params.set('created_at_min', ninetyDaysAgo)
    }

    const res = await fetch(
      `https://${store}/admin/api/2024-01/orders.json?${params}`,
      { headers: { 'X-Shopify-Access-Token': token } },
    )
    if (!res.ok) throw new Error(`Shopify orders fetch failed: ${res.status}`)

    for (const order of (await res.json()).orders ?? []) {
      for (const item of order.line_items ?? []) {
        const sku = item.sku?.trim()
        const qty = item.quantity ?? 0
        if (sku) bySku.set(sku, (bySku.get(sku) ?? 0) + qty)
      }
    }

    const link = res.headers.get('Link') ?? ''
    const next = link.match(/<[^>]*page_info=([^>&"]+)[^>]*>;\s*rel="next"/)
    pageInfo   = next ? next[1] : null
  }

  return bySku
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET()  { return handler() }
export async function POST() { return handler() }

async function handler() {
  const supabase = adminClient()

  try {
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, asin, shopify_sku')
      .eq('is_active', true)
    if (prodErr) throw new Error(prodErr.message)

    const [amazonResult, shopifyResult] = await Promise.allSettled([
      fetchAmazonSalesByAsin(),
      fetchShopifySalesBySku(),
    ])

    const amazonByAsin = amazonResult.status === 'fulfilled' ? amazonResult.value : new Map()
    const shopifyBySku = shopifyResult.status === 'fulfilled' ? shopifyResult.value : new Map()
    const amazonError  = amazonResult.status === 'rejected'  ? String(amazonResult.reason) : null
    const shopifyError = shopifyResult.status === 'rejected' ? String(shopifyResult.reason) : null

    let updated = 0
    for (const p of products ?? []) {
      const amazonQty  = p.asin        ? (amazonByAsin.get(p.asin)        ?? 0) : 0
      const shopifyQty = p.shopify_sku ? (shopifyBySku.get(p.shopify_sku) ?? 0) : 0
      const total      = amazonQty + shopifyQty
      if (total === 0) continue

      await supabase.from('products').update({ avg_90_day_sales: total }).eq('id', p.id)
      updated++
    }

    return NextResponse.json({
      ok:           true,
      updated_skus: updated,
      amazon_asins: amazonByAsin.size,
      shopify_skus: shopifyBySku.size,
      fetched_at:   new Date().toISOString(),
      errors: { amazon: amazonError, shopify: shopifyError },
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sales-sync]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
