/**
 * GET/POST /api/inventory/report
 *
 * Runs the inventory sync, then posts a daily summary to Slack:
 *   🔴 Out of Stock   — total_qty = 0
 *   🟡 Low Stock      — days_remaining < low_stock_threshold (days)
 *   🟢 Restocked      — was 0 yesterday, > 0 today
 *
 * Called by Vercel Cron at 5 AM ET (10:00 UTC) daily.
 * Also callable manually from the browser for testing.
 */

import { NextResponse } from 'next/server'
import { createClient }  from '@supabase/supabase-js'
import { postSlackMessage } from '@/lib/slack'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function daysRemaining(totalQty: number, avg90DaySales: number): number | null {
  if (!avg90DaySales || avg90DaySales <= 0) return null
  const dailyRate = avg90DaySales / 90
  return Math.round(totalQty / dailyRate)
}

export async function GET() {
  return handler()
}
export async function POST() {
  return handler()
}

async function handler() {
  const supabase = adminClient()
  const today    = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  try {
    // ── 1. Load products with sales data ──────────────────────────────────
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, asin, avg_90_day_sales, low_stock_threshold')
      .eq('is_active', true)

    if (prodErr) throw new Error(`Products load failed: ${prodErr.message}`)

    // ── 2. Load today's and yesterday's snapshots ──────────────────────────
    const { data: todaySnaps } = await supabase
      .from('inventory_snapshots')
      .select('product_id, fba_qty, awd_qty, g10_qty, total_qty')
      .eq('snapshot_date', today)

    const { data: yestSnaps } = await supabase
      .from('inventory_snapshots')
      .select('product_id, total_qty')
      .eq('snapshot_date', yesterday)

    const todayMap = new Map((todaySnaps ?? []).map(s => [s.product_id, s]))
    const yestMap  = new Map((yestSnaps  ?? []).map(s => [s.product_id, s.total_qty as number]))

    // ── 3. Classify each product ───────────────────────────────────────────
    type AlertItem = { name: string; days: number | null; fba: number; awd: number; g10: number; total: number }

    const outOfStock:  AlertItem[] = []
    const lowStock:    AlertItem[] = []
    const restocked:   AlertItem[] = []

    for (const p of products ?? []) {
      const snap      = todayMap.get(p.id)
      const totalQty  = snap?.total_qty ?? 0
      const yestTotal = yestMap.get(p.id) ?? 0
      const threshold = p.low_stock_threshold ?? 60
      const days      = daysRemaining(totalQty, p.avg_90_day_sales ?? 0)

      const item: AlertItem = {
        name:  p.name,
        days,
        fba:   snap?.fba_qty ?? 0,
        awd:   snap?.awd_qty ?? 0,
        g10:   snap?.g10_qty ?? 0,
        total: totalQty,
      }

      if (totalQty === 0) {
        outOfStock.push(item)
      } else if (yestTotal === 0 && totalQty > 0) {
        restocked.push(item)
      } else if (days !== null && days < threshold) {
        lowStock.push(item)
      }
    }

    // Sort low stock by days ascending (most urgent first)
    lowStock.sort((a, b) => (a.days ?? 999) - (b.days ?? 999))

    // ── 4. Build Slack message ─────────────────────────────────────────────
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      timeZone: 'America/New_York',
    })

    const blocks: object[] = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📦 Daily Inventory Report — ${dateStr}` },
      },
      { type: 'divider' },
    ]

    // Restocked
    if (restocked.length > 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*🟢 RESTOCKED (${restocked.length})*` },
      })
      for (const item of restocked) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `• *${item.name}* — ${item.total.toLocaleString()} units back in stock` +
                  `  _(FBA: ${item.fba} · AWD: ${item.awd} · G10: ${item.g10})_`,
          },
        })
      }
      blocks.push({ type: 'divider' })
    }

    // Out of stock
    if (outOfStock.length > 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*🔴 OUT OF STOCK (${outOfStock.length})*` },
      })
      for (const item of outOfStock) {
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `• *${item.name}*` },
        })
      }
      blocks.push({ type: 'divider' })
    }

    // Low stock
    if (lowStock.length > 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*🟡 LOW STOCK (${lowStock.length})*` },
      })
      for (const item of lowStock) {
        const daysStr = item.days !== null ? `${item.days}d left` : 'unknown days'
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `• *${item.name}* — ${daysStr}` +
                  `  _(FBA: ${item.fba} · AWD: ${item.awd} · G10: ${item.g10})_`,
          },
        })
      }
      blocks.push({ type: 'divider' })
    }

    // All clear
    if (outOfStock.length === 0 && lowStock.length === 0 && restocked.length === 0) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: '✅ *All clear — no stock alerts today.*' },
      })
    }

    // Footer
    blocks.push({
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: `Synced at ${new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} ET · <https://ops.ironinfidel.com/inventory|View Dashboard>`,
      }],
    })

    // ── 5. Post to Slack ───────────────────────────────────────────────────
    const fallbackText = [
      outOfStock.length  > 0 ? `🔴 ${outOfStock.length} OOS` : '',
      lowStock.length    > 0 ? `🟡 ${lowStock.length} low stock` : '',
      restocked.length   > 0 ? `🟢 ${restocked.length} restocked` : '',
    ].filter(Boolean).join(' · ') || '✅ All clear'

    await postSlackMessage(blocks, `Daily inventory report: ${fallbackText}`)

    return NextResponse.json({
      ok:         true,
      date:       today,
      out_of_stock: outOfStock.length,
      low_stock:    lowStock.length,
      restocked:    restocked.length,
      posted_to_slack: true,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[inventory/report]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
