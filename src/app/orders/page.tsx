import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import Nav              from '@/components/nav'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders, error } = await supabase
    .from('purchase_orders')
    .select(`
      id, po_number, po_date, exw_date, status,
      manufacturer:manufacturers ( name ),
      po_line_items ( qty )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav current="/orders" />
        <main className="flex-1 p-8">
          <p className="text-red-400">Failed to load orders: {error.message}</p>
          <p className="text-gray-500 text-sm mt-2">
            Make sure you have run <code className="text-gray-400">supabase/migrations/002_purchase_orders.sql</code> in your Supabase SQL Editor.
          </p>
        </main>
      </div>
    )
  }

  const statusColor: Record<string, string> = {
    draft:     'text-gray-400 bg-gray-800',
    sent:      'text-blue-300 bg-blue-900/40',
    confirmed: 'text-green-300 bg-green-900/40',
    cancelled: 'text-red-400 bg-red-900/30',
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Nav current="/orders" />
      <main className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Order History</h1>
            <p className="text-gray-400 text-sm mt-1">{orders?.length ?? 0} purchase orders</p>
          </div>
          <Link
            href="/orders/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + New Order
          </Link>
        </div>

        {(!orders || orders.length === 0) ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-400 font-medium">No purchase orders yet.</p>
            <Link href="/orders/new" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              Create your first PO →
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">PO #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">PO Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">EXW Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Units</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((po, i) => {
                  const totalUnits = Array.isArray(po.po_line_items)
                    ? po.po_line_items.reduce((s: number, li: { qty: number }) => s + (li.qty ?? 0), 0)
                    : 0
                  const vendor = (po.manufacturer as { name?: string } | null)?.name ?? '—'
                  return (
                    <tr
                      key={po.id}
                      className={`border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}
                    >
                      <td className="px-5 py-3 font-mono text-gray-200">{po.po_number || <span className="text-gray-600 italic">Draft</span>}</td>
                      <td className="px-5 py-3 text-gray-300">{vendor}</td>
                      <td className="px-5 py-3 text-gray-400">{po.po_date ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-400">{po.exw_date ?? '—'}</td>
                      <td className="px-5 py-3 text-right text-gray-300">{totalUnits.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor[po.status] ?? 'text-gray-400'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/orders/${po.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
