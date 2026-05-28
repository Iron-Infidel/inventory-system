/**
 * POST /api/inventory/sync
 *
 * Fetches current FBA stock (via Reports API) + AWD stock, merges with the
 * most-recent G10 snapshot from Supabase, and upserts today's
 * inventory_snapshots row for every active product.
 *
 * Called manually from the Inventory Dashboard ("Sync Now" button)
 * and by the Cloud Scheduler at 5 AM ET daily.
 *
 * Note: uses GET for easy browser testing; production calls use POST.
 */

import { NextResponse } from 'next/server'
import { createClient }  from '@supabase/supabase-js'
import { fetchAmazonInventory } from '@/lib/amazon/spapi'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') ?? ''
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = adminClient()
  const today    = new Date().toISOString().slice(0, 10)

  try {
    // ── 1. Fetch Amazon FBA (report) + AWD ────────────────────────────────
    const amazon = await fetchAmazonInventory()
    const { fbaByAsin } = amazon

    const awdBySku = new Map<string, number>()
    for (const item of amazon.awd) {
      awdBySku.set(item.sku, item.availableQuantity ?? 0)
    }

    // ── 2. Load active products ───────────────────────────────────────────
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, asin, fba_sku, g10_sku, is_active')
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

    // ── 4. Build snapshot rows ────────────────────────────────────────────
    const snapshots = products.map(p => ({
      snapshot_date: today,
      product_id:    p.id,
      fba_qty:       p.asin ? (fbaByAsin.get(p.asin) ?? 0) : 0,
      awd_qty:       p.fba_sku ? (awdBySku.get(p.fba_sku) ?? 0) : 0,
      g10_qty:       p.g10_sku ? (g10ByItemId.get(p.g10_sku) ?? 0) : 0,
    }))

    // ── 5. Upsert into inventory_snapshots ────────────────────────────────
    const { error: upsertError } = await supabase
      .from('inventory_snapshots')
      .upsert(snapshots, { onConflict: 'snapshot_date,product_id' })

    if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`)

    // ── 6. Summary ────────────────────────────────────────────────────────
    const matched = snapshots.filter(s => s.fba_qty > 0).length

    return NextResponse.json({
      ok:                true,
      date:              today,
      products:          snapshots.length,
      fba_asins_in_report: fbaByAsin.size,
      fba_products_matched: matched,
      awd_skus_matched:  awdBySku.size,
      g10_skus_matched:  g10ByItemId.size,
      totals: {
        fba: snapshots.reduce((s, r) => s + r.fba_qty, 0),
        awd: snapshots.reduce((s, r) => s + r.awd_qty, 0),
        g10: snapshots.reduce((s, r) => s + r.g10_qty, 0),
      },
      fetched_at: amazon.fetchedAt,
      errors: {
        fba: amazon.fbaError ?? null,
        awd: amazon.awdError ?? null,
      },
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[inventory/sync]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const GET = POST
