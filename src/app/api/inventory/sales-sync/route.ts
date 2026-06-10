/**
 * GET/POST /api/inventory/sales-sync
 *
 * Pulls last 90 days of order data from Amazon SP-API and Shopify,
 * sums units sold per SKU, and updates avg_90_day_sales on products.
 *
 * Called by Vercel Cron at midnight ET (05:00 UTC) daily.
 * Also callable manually from the browser for testing.
 */

import { NextResponse }     from 'next/server'
import { createClient }     from '@supabase/supabase-js'
import { getAccessToken }   from '@/lib/amazon/spapi'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ─── Amazon: last-90-day units sold by ASIN via Orders report ────────────────

async function fetchAmazonSalesByAsin(): Promise<Map<string, number>> {
  const SP_API_BASE    = 'https://sellingpartnerapi-na.amazon.com'
  const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID ?? 'ATVPDKIKX0DER'
  const token          = await getAccessToken()

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10)

  // Request flat-file orders report for last 90 days
  const createRes = await fetch(`${SP_API_BASE}/reports/2021-06-30/reports`, {
    method:  'POST',
    headers: { 'x-amz-access-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reportType:     'GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL',
      marketplaceIds: [MARKETPLACE_ID],
      dataStartTime:  `${ninetyDaysAgo}T00:00:00Z`,
      dataEndTime:    new Date().toISOString(),
    }),
  })
  if (!createRes.ok) throw new Error(`Amazon orders report create failed: ${createRes.status}`)
  const { reportId } = await createRes.json()

  // Poll until done (up to 3 minutes)
  let reportDocumentId: string | undefined
  for (let i = 0; i < 36; i++) {
    await new Promise(r => setTimeout(r, 5000))
    const pollRes = await fetch(`${SP_API_BASE}/reports/2021-06-30/reports/${reportId}`, {
      headers: { 'x-amz-access-token': token },
    })
    const report = await pollRes.json()
    if (report.processingStatus === 'DONE') { reportDocumentId = report.reportDocumentId; break }
    if (report.processingStatus === 'FATAL' || report.processingStatus === 'CANCELLED') {
      throw new Error(`Amazon orders report failed: ${report.processingStatus}`)
    }
  }
  if (!reportDocumentId) throw new Error('Amazon orders report timed out')

  // Download report
  const docRes  = await fetch(`${SP_API_BASE}/reports/2021-06-30/documents/${reportDocumentId}`, {
    headers: { 'x-amz-access-token': token },
  })
  const { url } = await docRes.json()
  const text    = await (await fetch(url)).text()

  // Parse TSV: find asin-code and quantity-purchased columns
  const lines   = text.split('\n').filter(Boolean)
  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase())
  const asinIdx = headers.indexOf('asin')
  const qtyIdx  = headers.findIndex(h => h.includes('quantity-purchased') || h === 'quantity purchased')

  if (asinIdx === -1 || qtyIdx === -1) {
    throw new Error(`Unexpected Amazon orders report columns: ${headers.slice(0, 10).join(', ')}`)
  }

  const byAsin = new Map<string, number>()
  for (const line of lines.slice(1)) {
    const cols = line.split('\t')
    const asin = cols[asinIdx]?.trim()
    const qty  = parseInt(cols[qtyIdx] ?? '0', 10) || 0
    if (asin) byAsin.set(asin, (byAsin.get(asin) ?? 0) + qty)
  }
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
    const params = new URLSearchParams({
      status:           'any',
      fulfillment_status: 'shipped,partial',
      created_at_min:   ninetyDaysAgo,
      limit:            '250',
      fields:           'line_items',
    })
    if (pageInfo) { params.set('page_info', pageInfo); params.delete('created_at_min') }

    const res = await fetch(
      `https://${store}/admin/api/2024-01/orders.json?${params}`,
      { headers: { 'X-Shopify-Access-Token': token } },
    )
    if (!res.ok) throw new Error(`Shopify orders fetch failed: ${res.status}`)

    const data    = await res.json()
    const orders  = data.orders ?? []

    for (const order of orders) {
      for (const item of order.line_items ?? []) {
        const sku = item.sku?.trim()
        const qty = item.quantity ?? 0
        if (sku) bySku.set(sku, (bySku.get(sku) ?? 0) + qty)
      }
    }

    // Pagination via Link header
    const link = res.headers.get('Link') ?? ''
    const next = link.match(/<[^>]*page_info=([^>&"]+)[^>]*>;\s*rel="next"/)
    pageInfo   = next ? next[1] : null
  }

  return bySku
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET() { return handler() }
export async function POST() { return handler() }

async function handler() {
  const supabase = adminClient()

  try {
    // Load active products
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, asin, shopify_sku')
      .eq('is_active', true)
    if (prodErr) throw new Error(prodErr.message)

    // Fetch sales data from both sources in parallel
    const [amazonResult, shopifyResult] = await Promise.allSettled([
      fetchAmazonSalesByAsin(),
      fetchShopifySalesBySku(),
    ])

    const amazonByAsin = amazonResult.status === 'fulfilled' ? amazonResult.value : new Map()
    const shopifyBySku = shopifyResult.status === 'fulfilled' ? shopifyResult.value : new Map()
    const amazonError  = amazonResult.status === 'rejected'  ? String(amazonResult.reason) : null
    const shopifyError = shopifyResult.status === 'rejected' ? String(shopifyResult.reason) : null

    // Combine and update
    let updated = 0
    for (const p of products ?? []) {
      const amazonQty  = p.asin        ? (amazonByAsin.get(p.asin)        ?? 0) : 0
      const shopifyQty = p.shopify_sku ? (shopifyBySku.get(p.shopify_sku) ?? 0) : 0
      const total      = amazonQty + shopifyQty
      if (total === 0) continue

      await supabase
        .from('products')
        .update({ avg_90_day_sales: total })
        .eq('id', p.id)
      updated++
    }

    return NextResponse.json({
      ok:             true,
      updated_skus:   updated,
      amazon_asins:   amazonByAsin.size,
      shopify_skus:   shopifyBySku.size,
      fetched_at:     new Date().toISOString(),
      errors: { amazon: amazonError, shopify: shopifyError },
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sales-sync]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
