/**
 * POST /api/g10/webhook
 *
 * Receives a full inventory dump from G10 3PL.
 * G10 pushes this daily at 4 AM ET, 1 hour before the 5 AM inventory sync.
 *
 * Expected payload (JSON array):
 *   [{ "ItemID": "BB128-MCB", "AvailableQty": 120 }, ...]
 *
 * Auth: x-csrf-token header must match G10_CSRF_TOKEN env var.
 *
 * On success: upserts all items into g10_latest, returns 200 + summary.
 * On auth failure: returns 401.
 * On bad payload: returns 400.
 */

import { NextResponse } from 'next/server'
import { createClient }  from '@supabase/supabase-js'

type G10Item = {
  ItemID:       string
  AvailableQty: number
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: Request) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const csrfToken    = process.env.G10_CSRF_TOKEN
  const incomingToken = req.headers.get('x-csrf-token') ?? ''

  if (!csrfToken) {
    console.error('[g10/webhook] G10_CSRF_TOKEN env var not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (incomingToken !== csrfToken) {
    console.warn('[g10/webhook] Invalid x-csrf-token received')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let items: G10Item[]
  try {
    const body = await req.json()
    // Accept both a top-level array or a wrapped object { items: [...] }
    items = Array.isArray(body) ? body : (body.items ?? body.inventory ?? [])
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Expected a non-empty array of inventory items' }, { status: 400 })
  }

  // ── Validate + normalize ──────────────────────────────────────────────────
  const rows = items
    .filter(item => item.ItemID && typeof item.ItemID === 'string')
    .map(item => ({
      item_id:       item.ItemID.trim(),
      available_qty: Math.max(0, Math.round(Number(item.AvailableQty) || 0)),
      received_at:   new Date().toISOString(),
    }))

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No valid items found in payload' }, { status: 400 })
  }

  // ── Upsert into g10_latest ────────────────────────────────────────────────
  // Full dump — overwrite qty + timestamp for every item received.
  // Items not in this push keep their previous qty (G10 sends everything each time).
  const supabase = adminClient()
  const { error } = await supabase
    .from('g10_latest')
    .upsert(rows, { onConflict: 'item_id' })

  if (error) {
    console.error('[g10/webhook] Supabase upsert error:', error.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  console.log(`[g10/webhook] Received ${rows.length} items at ${new Date().toISOString()}`)

  return NextResponse.json({
    ok:         true,
    received:   rows.length,
    received_at: new Date().toISOString(),
  })
}

// ── GET /api/g10/webhook — status check ──────────────────────────────────────
// Returns the last push timestamp and item count. No auth required (read-only).

export async function GET() {
  const supabase = adminClient()

  const { data, error } = await supabase
    .from('g10_latest')
    .select('item_id, available_qty, received_at')
    .order('received_at', { ascending: false })
    .limit(1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { count } = await supabase
    .from('g10_latest')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({
    status:        count && count > 0 ? 'ok' : 'no_data',
    total_items:   count ?? 0,
    last_received: data?.[0]?.received_at ?? null,
  })
}
