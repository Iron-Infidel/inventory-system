import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

const links = [
  { href: '/',            label: 'Dashboard'   },
  { href: '/skus',        label: 'SKUs'        },
  { href: '/inventory',   label: 'Inventory'   },
  { href: '/orders/new',  label: 'New Order'   },
  { href: '/orders',      label: 'Order History'},
]

export default async function Nav({ current }: { current: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center gap-6">
        {/* Brand */}
        <span className="font-bold text-white text-sm tracking-wide shrink-0">
          Iron Infidel Ops
        </span>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {links.map(({ href, label }) => {
            const active = current === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-gray-500 text-xs">{user?.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
