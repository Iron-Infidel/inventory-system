import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Nav              from '@/components/nav'
import POForm           from './po-form'

export default async function NewOrderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch manufacturers (vendors)
  const { data: manufacturers, error: mfrError } = await supabase
    .from('manufacturers')
    .select('id, name, manufacturer_type, address_line1, address_line2, city, country, contact_email')
    .order('name', { ascending: true })

  if (mfrError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav current="/orders/new" />
        <main className="flex-1 p-8">
          <p className="text-red-400">Failed to load manufacturers: {mfrError.message}</p>
        </main>
      </div>
    )
  }

  // Fetch active products with their manufacturer SKU mappings
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select(`
      id, name, product_line, asin, units_per_carton,
      manufacturer_sku_map (
        id,
        manufacturer_sku,
        manufacturer:manufacturers ( id, name )
      )
    `)
    .eq('is_active', true)
    .order('product_line', { ascending: true })
    .order('name',         { ascending: true })

  if (prodError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav current="/orders/new" />
        <main className="flex-1 p-8">
          <p className="text-red-400">Failed to load products: {prodError.message}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Nav current="/orders/new" />
      <main className="flex-1 px-6 py-6">
        <POForm
          manufacturers={manufacturers ?? []}
          products={(products ?? []) as Parameters<typeof POForm>[0]['products']}
        />
      </main>
    </div>
  )
}
