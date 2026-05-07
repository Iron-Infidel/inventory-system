'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProduct(
  id: string,
  data: {
    units_per_carton?: number | null
    cbm_per_carton?: number | null
    moq?: number | null
    low_stock_threshold?: number | null
    sales_pct?: number | null
    is_active?: boolean
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/skus')
}

export async function updateManufacturerSku(mapId: string, manufacturerSku: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('manufacturer_sku_map')
    .update({ manufacturer_sku: manufacturerSku.trim() })
    .eq('id', mapId)
  if (error) throw new Error(error.message)
  revalidatePath('/skus')
}
