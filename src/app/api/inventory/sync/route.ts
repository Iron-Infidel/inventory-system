/**
 * POST /api/inventory/sync
 *
 * Fetches current FBA + AWD stock from Amazon SP-API, merges with the
 * most-recent G10 snapshot from Supabase, and upserts today's
 * inventory_snapshots row for every product.
 *
 * Called manually from the Inventory Dashboard ("Sync Now" button)
 * and by the Cloud Scheduler at 5 AM ET daily.
 */

import { NextResponse } from 'next/server'
import { createClient }  from '@supabase/supabase-js'
import { fetchAmazonInventory } from '@/lib/amazon/spapi'

// Service-role Supabase client (bypasses RLS — server only)
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: Request) {
  // Allow Cloud Scheduler to call this with a shared secret
  const authHeader = req.headers.get('authorization') ?? ''
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = adminClient()
  const today    = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  try {
    // ── 1. Fetch Amazon FBA + AWD ──────────────────────────────────────────
    const amazon = await fetchAmazonInventory()

    // Build lookup maps: sellerSku → qty
    const fbaBySellerSku = new Map<string, number>()
    for (const item of amazon.fba) {
      const existing = fbaBySellerSku.get(item.sellerSku) ?? 0
      fbaBySellerSku.set(item.sellerSku, existing + (item.totalQuantity ?? 0))
    }

    const awdBySku = new Map<string, number>()
    for (const item of amazon.awd) {
      awdBySku.set(item.sku, item.availableQuantity ?? 0)
    }

    // ── 2. Load all products with their SKU fields ─────────────────────────
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, fba_sku, g10_sku, is_active')
      .eq('is_active', true)

    if (prodError) throw new Error(`Failed to load products: ${prodError.message}`)
    if (!products?.length) return NextResponse.json({ message: 'No active products found' })

    // ── 3. Load latest G10 inventory ──────────────────────────────────────
    const { data: g10Rows } = await supabase
      .from('g10_latest')
      .select('item_id, available_qty')

    const g10ByItemId = new Map<string, number>()
    for (const row of g10Rows ?? []) {
      g10ByItemId.set(row.item_id, row.available_qty ?? 0)
    }

    // ── 4. Build snapshot rows ─────────────────────────────────────────────
    const snapshots = products.map(p => {
      const fbaQty = p.fba_sku ? (fbaBySellerSku.get(p.fba_sku) ?? 0) : 0
      const awdQty = p.fba_sku ? (awdBySku.get(p.fba_sku) ?? 0) : 0
      const g10Qty = p.g10_sku ? (g10ByItemId.get(p.g10_sku) ?? 0) : 0

      return {
        snapshot_date: today,
        product_id:    p.id,
        fba_qty:       fbaQty,
        awd_qty:       awdQty,
        g10_qty:       g10Qty,
      }
    })

    // ── 5. Upsert into inventory_snapshots ────────────────────────────────
    const { error: upsertError } = await supabase
      .from('inventory_snapshots')
      .upsert(snapshots, { onConflict: 'snapshot_date,product_id' })

    if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`)

    // ── 6. Return summary ──────────────────────────────────────────────────
    const totalFba = snapshots.reduce((s, r) => s + r.fba_qty, 0)
    const totalAwd = snapshots.reduce((s, r) => s + r.awd_qty, 0)
    const totalG10 = snapshots.reduce((s, r) => s + r.g10_qty, 0)

    return NextResponse.json({
      ok:          true,
      date:        today,
      products:    snapshots.length,
      fba_skus_matched: fbaBySellerSku.size,
      awd_skus_matched: awdBySku.size,
      g10_skus_matched: g10ByItemId.size,
      totals: { fba: totalFba, awd: totalAwd, g10: totalG10 },
      amazon_fetched_at: amazon.fetchedAt,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[inventory/sync]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Also allow GET for easy manual testing in the browser
export const GET = POST
