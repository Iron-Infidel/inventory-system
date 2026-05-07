import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/nav'

const cards = [
  {
    title: 'Order Calculator',
    desc: 'Build manufacturer purchase orders',
    href: '/orders/new',
    ready: false,
  },
  {
    title: 'Inventory Dashboard',
    desc: 'FBA, AWD & G10 stock levels',
    href: '/inventory',
    ready: false,
  },
  {
    title: 'SKU Management',
    desc: 'Products, case packs & thresholds',
    href: '/skus',
    ready: true,
  },
  {
    title: 'Order History',
    desc: 'Past and submitted POs',
    href: '/orders',
    ready: false,
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <Nav current="/" />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Iron Infidel Ops</h1>
            <p className="text-gray-400 mt-1">Welcome, {user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors group"
              >
                <h2 className="font-semibold text-lg group-hover:text-white">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
                <span
                  className={`inline-block mt-4 text-xs px-2 py-1 rounded ${
                    card.ready
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-yellow-500 bg-yellow-500/10'
                  }`}
                >
                  {card.ready ? 'Live' : 'Coming soon'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
