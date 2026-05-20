'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type LineItemInput = {
  productId:       string | null
  description:     string
  manufacturerSku: string
  qty:             number
  unitPrice:       number
  lineNumber:      number
}

export type SavePOInput = {
  poNumber:         string
  poDate:           string
  exwDate:          string
  manufacturerId:   string
  vendorName:       string
  vendorAddr1:      string
  vendorAddr2:      string
  vendorCity:       string
  vendorCountry:    string
  shipTo:           string
  shipVia:          string
  fob:              string
  freightForwarder: string
  taxAmount:        number
  shippingAmount:   number
  otherAmount:      number
  comments:         string
  lineItems:        LineItemInput[]
}

export async function savePO(input: SavePOInput, existingId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Persist any vendor address edits back to the manufacturer record
  if (input.manufacturerId) {
    await supabase.from('manufacturers').update({
      address_line1: input.vendorAddr1 || null,
      address_line2: input.vendorAddr2 || null,
      city:          input.vendorCity  || null,
      country:       input.vendorCountry || null,
    }).eq('id', input.manufacturerId)
  }

  const poPayload = {
    po_number:         input.poNumber   || null,
    po_date:           input.poDate     || new Date().toISOString().slice(0, 10),
    exw_date:          input.exwDate    || null,
    manufacturer_id:   input.manufacturerId || null,
    ship_to:           input.shipTo,
    ship_via:          input.shipVia,
    fob:               input.fob        || null,
    freight_forwarder: input.freightForwarder || null,
    tax_amount:        input.taxAmount,
    shipping_amount:   input.shippingAmount,
    other_amount:      input.otherAmount,
    comments:          input.comments   || null,
    status:            'draft',
    created_by:        user.email ?? null,
    updated_at:        new Date().toISOString(),
  }

  let poId: string

  if (existingId) {
    const { error } = await supabase
      .from('purchase_orders')
      .update(poPayload)
      .eq('id', existingId)
    if (error) throw new Error(error.message)
    poId = existingId

    // Delete existing line items and re-insert
    await supabase.from('po_line_items').delete().eq('po_id', poId)
  } else {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert(poPayload)
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    poId = data.id
  }

  // Insert line items
  if (input.lineItems.length > 0) {
    const lineRows = input.lineItems.map(li => ({
      po_id:           poId,
      product_id:      li.productId || null,
      line_number:     li.lineNumber,
      description:     li.description,
      manufacturer_sku: li.manufacturerSku || null,
      qty:             li.qty,
      unit_price:      li.unitPrice,
    }))
    const { error } = await supabase.from('po_line_items').insert(lineRows)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/orders')
  return { id: poId }
}

export async function addVendor(data: {
  name:          string
  type:          string
  addressLine1?: string
  addressLine2?: string
  city?:         string
  country?:      string
  contactEmail?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: mfr, error } = await supabase
    .from('manufacturers')
    .insert({
      name:              data.name,
      manufacturer_type: data.type || null,
      address_line1:     data.addressLine1 || null,
      address_line2:     data.addressLine2 || null,
      city:              data.city         || null,
      country:           data.country      || null,
      contact_email:     data.contactEmail || null,
    })
    .select('id, name, manufacturer_type, address_line1, address_line2, city, country, contact_email')
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/orders/new')
  return mfr
}
