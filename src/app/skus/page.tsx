import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Nav from '@/components/nav'
import SkuTable, { type Product } from './sku-table'

export default async function SkusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, asin, name, product_line,
      fba_sku, g10_sku, shopify_sku,
      units_per_carton, cbm_per_carton,
      moq, low_stock_threshold, sales_pct,
      requires_patch, is_active,
      manufacturer_sku_map (
        id,
        manufacturer_sku,
        manufacturer:manufacturers (
          id, name, manufacturer_type
        )
      )
    `)
    .order('product_line', { ascending: true })
    .order('name',         { ascending: true })

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav current="/skus" />
        <main className="flex-1 p-8">
          <p className="text-red-400">Failed to load products: {error.message}</p>
          <p className="text-gray-500 text-sm mt-2">
            Make sure you have run the migration and seed SQL in Supabase.
          </p>
        </main>
      </div>
    )
  }

  const products = (data ?? []) as unknown as Product[]

  return (
    <div className="min-h-screen flex flex-col">
      <Nav current="/skus" />
      <main className="flex-1 p-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-5">
            <h1 className="text-2xl font-bold">SKU Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              {products.length} products loaded · Click any highlighted cell to edit
            </p>
          </div>
          {products.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 font-medium">No products in database yet.</p>
              <p className="text-gray-600 text-sm mt-2">
                Run <code className="text-gray-400">migrations/001_add_sku_fields.sql</code> then{' '}
                <code className="text-gray-400">seed.sql</code> in your Supabase SQL Editor.
              </p>
            </div>
          ) : (
            <SkuTable initialProducts={products} />
          )}
        </div>
      </main>
    </div>
  )
}
