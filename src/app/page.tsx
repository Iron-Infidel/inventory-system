import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Iron Infidel Ops</h1>
          <p className="text-gray-400 mt-1">Welcome, {user.email}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Order Calculator', desc: 'Build manufacturer purchase orders', status: 'Coming soon' },
            { title: 'Inventory Dashboard', desc: 'FBA, AWD & G10 stock levels', status: 'Coming soon' },
            { title: 'SKU Management', desc: 'Products, case packs & thresholds', status: 'Coming soon' },
            { title: 'Order History', desc: 'Past and submitted POs', status: 'Coming soon' },
          ].map((card) => (
            <div key={card.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold text-lg">{card.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
              <span className="inline-block mt-4 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                {card.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
