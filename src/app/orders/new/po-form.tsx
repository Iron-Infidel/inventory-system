'use client'

import { useState, useCallback, useId } from 'react'
import { savePO, addVendor, type LineItemInput } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type Manufacturer = {
  id:                string
  name:              string
  manufacturer_type: string | null
  address_line1:     string | null
  address_line2:     string | null
  city:              string | null
  country:           string | null
  contact_email:     string | null
}

type MfrSkuEntry = {
  id:               string
  manufacturer_sku: string
  manufacturer: { id: string; name: string }
}

type Product = {
  id:                   string
  name:                 string
  product_line:         string
  asin:                 string
  units_per_carton:     number | null
  manufacturer_sku_map: MfrSkuEntry[]
}

type LineItem = {
  _key:        string
  productId:   string | null
  description: string
  mfrSku:      string
  qty:         number | string
  unitPrice:   number | string
}

type NewVendorForm = {
  name:         string
  type:         string
  addressLine1: string
  addressLine2: string
  city:         string
  country:      string
  contactEmail: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function toNum(v: number | string): number {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return isNaN(n) ? 0 : n
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', placeholder = '', readOnly = false, className = '',
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  placeholder?: string
  readOnly?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{label}</label>
      {readOnly
        ? <div className="text-xs text-gray-800 py-1 border-b border-gray-200 min-h-[26px]">{value || <span className="text-gray-300">—</span>}</div>
        : <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange?.(e.target.value)}
            className="text-xs text-gray-900 border-b border-gray-300 focus:border-gray-700 outline-none py-1 bg-transparent w-full"
          />
      }
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function POForm({
  manufacturers: initialManufacturers,
  products,
}: {
  manufacturers: Manufacturer[]
  products:      Product[]
}) {
  const uid = useId()

  // ── PO Header State ──────────────────────────────────────────────────────
  const [manufacturers, setManufacturers] = useState(initialManufacturers)
  const [vendorId,       setVendorId]    = useState('')
  const [vendorName,     setVendorName]  = useState('')
  const [vendorAddr1,    setVendorAddr1] = useState('')
  const [vendorAddr2,    setVendorAddr2] = useState('')
  const [vendorCity,     setVendorCity]  = useState('')
  const [vendorCountry,  setVendorCountry] = useState('')
  const [poNumber,       setPoNumber]    = useState('')
  const [poDate,         setPoDate]      = useState(today())
  const [exwDate,        setExwDate]     = useState('')
  const [shipTo,         setShipTo]      = useState('Amazon AWD or G10 Fulfillment')
  const [shipVia,        setShipVia]     = useState('Ocean')
  const [fob,            setFob]         = useState('')
  const [freightFwd,     setFreightFwd]  = useState('')

  // ── Line Items ────────────────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState<LineItem[]>([])

  // ── Totals ────────────────────────────────────────────────────────────────
  const [tax,      setTax]      = useState('')
  const [shipping, setShipping] = useState('')
  const [other,    setOther]    = useState('')
  const [comments, setComments] = useState('')

  // ── UI State ──────────────────────────────────────────────────────────────
  const [showNewVendor, setShowNewVendor] = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [savedId,       setSavedId]       = useState<string | undefined>()
  const [saveMsg,       setSaveMsg]       = useState('')
  const [newVendor, setNewVendor] = useState<NewVendorForm>({
    name: '', type: '', addressLine1: '', addressLine2: '', city: '', country: '', contactEmail: '',
  })
  const [addingVendor, setAddingVendor] = useState(false)

  // ── Derived ───────────────────────────────────────────────────────────────
  const vendorProducts = vendorId
    ? products.filter(p => p.manufacturer_sku_map.some(m => m.manufacturer.id === vendorId))
    : []

  const subtotal = lineItems.reduce((sum, li) => sum + toNum(li.qty) * toNum(li.unitPrice), 0)
  const total    = subtotal + toNum(tax) + toNum(shipping) + toNum(other)
  const unitTotal = lineItems.reduce((sum, li) => sum + toNum(li.qty), 0)

  // ── Vendor selection ──────────────────────────────────────────────────────
  const selectVendor = useCallback((id: string) => {
    if (id === '__new__') { setShowNewVendor(true); return }
    const mfr = manufacturers.find(m => m.id === id)
    if (!mfr) return
    setVendorId(id)
    setVendorName(mfr.name)
    setVendorAddr1(mfr.address_line1 ?? '')
    setVendorAddr2(mfr.address_line2 ?? '')
    setVendorCity(mfr.city ?? '')
    setVendorCountry(mfr.country ?? '')
    setLineItems([]) // clear line items when vendor changes
  }, [manufacturers])

  // ── Line item ops ─────────────────────────────────────────────────────────
  const addLineItem = () => {
    setLineItems(prev => [...prev, {
      _key: `${uid}-${Date.now()}`,
      productId: null, description: '', mfrSku: '', qty: '', unitPrice: '',
    }])
  }

  const updateLineItem = (key: string, field: keyof LineItem, value: string) => {
    setLineItems(prev => prev.map(li => {
      if (li._key !== key) return li
      if (field === 'productId') {
        const p  = vendorProducts.find(p => p.id === value)
        const ms = p?.manufacturer_sku_map.find(m => m.manufacturer.id === vendorId)
        return { ...li, productId: value, description: p?.name ?? '', mfrSku: ms?.manufacturer_sku ?? '' }
      }
      return { ...li, [field]: value }
    }))
  }

  const removeLineItem = (key: string) => setLineItems(prev => prev.filter(li => li._key !== key))

  // ── Add new vendor ────────────────────────────────────────────────────────
  const handleAddVendor = async () => {
    if (!newVendor.name.trim()) return
    setAddingVendor(true)
    try {
      const mfr = await addVendor(newVendor)
      const full: Manufacturer = {
        id: mfr.id, name: mfr.name, manufacturer_type: mfr.manufacturer_type,
        address_line1: mfr.address_line1, address_line2: mfr.address_line2,
        city: mfr.city, country: mfr.country, contact_email: mfr.contact_email,
      }
      setManufacturers(prev => [...prev, full].sort((a, b) => a.name.localeCompare(b.name)))
      setShowNewVendor(false)
      setNewVendor({ name: '', type: '', addressLine1: '', addressLine2: '', city: '', country: '', contactEmail: '' })
      selectVendor(mfr.id)
    } finally {
      setAddingVendor(false)
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const result = await savePO({
        poNumber, poDate, exwDate,
        manufacturerId: vendorId,
        vendorName, vendorAddr1, vendorAddr2, vendorCity, vendorCountry,
        shipTo, shipVia, fob, freightForwarder: freightFwd,
        taxAmount: toNum(tax), shippingAmount: toNum(shipping), otherAmount: toNum(other),
        comments,
        lineItems: lineItems.map((li, i) => ({
          productId:       li.productId,
          description:     li.description,
          manufacturerSku: li.mfrSku,
          qty:             toNum(li.qty),
          unitPrice:       toNum(li.unitPrice),
          lineNumber:      i + 1,
        } satisfies LineItemInput)),
      }, savedId)
      setSavedId(result.id)
      setSaveMsg('Saved ✓')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      setSaveMsg(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSaving(false)
    }
  }

  // ── Cell style ────────────────────────────────────────────────────────────
  const td = 'border border-gray-300 px-2 py-1.5 text-xs text-gray-800'
  const th = 'border border-gray-300 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 bg-gray-50'

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">New Purchase Order</h1>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span className={`text-sm ${saveMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : savedId ? 'Save Changes' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* ── PO Document ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none">

        {/* ── Row 1: Title ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-gray-200">
          <div>
            <p className="text-base font-bold text-gray-900 tracking-tight">Iron Infidel Holdings, Inc.</p>
            <p className="text-xs text-gray-500">30 N. Gould St., Ste R · Sheridan, WY 82801</p>
            <p className="text-xs text-gray-500">262.522.9876</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-extrabold tracking-widest text-gray-800 uppercase">Purchase Order</h2>
          </div>
        </div>

        {/* ── Row 2: Date / PO# / EXW ──────────────────────────────── */}
        <div className="grid grid-cols-3 gap-0 border-b border-gray-200">
          <div className="px-6 py-3 border-r border-gray-200">
            <Field label="Date" type="date" value={poDate} onChange={setPoDate} />
          </div>
          <div className="px-6 py-3 border-r border-gray-200">
            <Field label="PO Number" value={poNumber} onChange={setPoNumber} placeholder="e.g. II-2026-001" />
          </div>
          <div className="px-6 py-3">
            <Field label="EXW Date" type="date" value={exwDate} onChange={setExwDate} />
          </div>
        </div>

        {/* ── Row 3: Vendor | Ship To ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-0 border-b border-gray-200">

          {/* Vendor */}
          <div className="px-6 py-4 border-r border-gray-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Vendor</p>

            {/* Vendor dropdown */}
            <div className="mb-3">
              <select
                value={vendorId}
                onChange={e => selectVendor(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:border-blue-400"
              >
                <option value="">— Select vendor —</option>
                {manufacturers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
                <option value="__new__">＋ Add new vendor…</option>
              </select>
            </div>

            {vendorId && (
              <div className="space-y-1.5">
                <Field label="Company Name"    value={vendorName}    onChange={setVendorName}    placeholder="Vendor name" />
                <Field label="Address Line 1"  value={vendorAddr1}   onChange={setVendorAddr1}   placeholder="Street address" />
                <Field label="Address Line 2"  value={vendorAddr2}   onChange={setVendorAddr2}   placeholder="Suite, building, etc." />
                <Field label="City / Province" value={vendorCity}    onChange={setVendorCity}    placeholder="City" />
                <Field label="Country"         value={vendorCountry} onChange={setVendorCountry} placeholder="Country" />
              </div>
            )}

            {!vendorId && (
              <p className="text-xs text-gray-400 italic">Select a vendor above to populate address fields.</p>
            )}
          </div>

          {/* Ship To */}
          <div className="px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Ship To (Consignee)</p>
            <div className="space-y-1.5">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Destination</label>
                <select
                  value={shipTo}
                  onChange={e => setShipTo(e.target.value)}
                  className="w-full mt-0.5 text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 focus:outline-none focus:border-blue-400"
                >
                  <option value="Amazon AWD or G10 Fulfillment">Amazon AWD or G10 Fulfillment (TBD)</option>
                  <option value="Amazon AWD">Amazon AWD</option>
                  <option value="G10 Fulfillment">G10 Fulfillment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {shipTo === 'Other' && (
                <Field label="Custom Destination" value={shipTo} onChange={setShipTo} placeholder="Enter destination" />
              )}
              <div className="mt-3 p-2 bg-gray-50 rounded text-[10px] text-gray-500 leading-relaxed border border-gray-100">
                Destinations TBD near completion of order. Iron Infidel Holdings, Inc. currently uses a Freight
                Forwarder/Customs Broker for all US shipments. All goods should be palletized prior to loading
                unless otherwise noted.
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 4: Buyer / Ship Via / FOB / Freight ──────────────── */}
        <div className="grid grid-cols-4 gap-0 border-b border-gray-200 bg-gray-50">
          <div className="px-4 py-2 border-r border-gray-200">
            <Field label="Buyer" value="Iron Infidel Holdings, Inc." readOnly />
          </div>
          <div className="px-4 py-2 border-r border-gray-200">
            <Field label="Ship Via" value={shipVia} onChange={setShipVia} placeholder="Ocean" />
          </div>
          <div className="px-4 py-2 border-r border-gray-200">
            <Field label="F.O.B." value={fob} onChange={setFob} placeholder="Origin" />
          </div>
          <div className="px-4 py-2">
            <Field label="Freight Forwarder" value={freightFwd} onChange={setFreightFwd} placeholder="Forwarder name" />
          </div>
        </div>

        {/* ── Line Items Table ──────────────────────────────────────── */}
        <div className="px-0">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className={`${th} w-12 text-center`}>Item #</th>
                <th className={`${th} w-20`}>MFR SKU</th>
                <th className={th}>Description</th>
                <th className={`${th} w-24 text-right`}>Qty</th>
                <th className={`${th} w-28 text-right`}>Unit Price</th>
                <th className={`${th} w-28 text-right`}>Total</th>
                <th className="border border-gray-300 w-8 bg-gray-50" />
              </tr>
            </thead>
            <tbody>
              {lineItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-xs text-gray-400 border border-gray-200">
                    {vendorId ? 'No line items yet — click "+ Add Line Item" below.' : 'Select a vendor to begin adding products.'}
                  </td>
                </tr>
              )}
              {lineItems.map((li, i) => {
                const lineTotal = toNum(li.qty) * toNum(li.unitPrice)
                return (
                  <tr key={li._key} className="hover:bg-blue-50/20">
                    <td className={`${td} text-center text-gray-500`}>{i + 1}</td>

                    {/* MFR SKU */}
                    <td className={`${td} font-mono text-gray-500`}>
                      <input
                        value={li.mfrSku}
                        onChange={e => updateLineItem(li._key, 'mfrSku', e.target.value)}
                        className="w-full bg-transparent outline-none text-xs"
                        placeholder="—"
                      />
                    </td>

                    {/* Description — product dropdown or free text */}
                    <td className={td}>
                      {vendorProducts.length > 0
                        ? <select
                            value={li.productId ?? ''}
                            onChange={e => updateLineItem(li._key, 'productId', e.target.value)}
                            className="w-full bg-transparent outline-none text-xs text-gray-800 focus:bg-blue-50 rounded px-0.5"
                          >
                            <option value="">— Select product —</option>
                            {vendorProducts.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        : <input
                            value={li.description}
                            onChange={e => updateLineItem(li._key, 'description', e.target.value)}
                            placeholder="Enter description"
                            className="w-full bg-transparent outline-none text-xs"
                          />
                      }
                    </td>

                    {/* Qty */}
                    <td className={`${td} text-right`}>
                      <input
                        type="number"
                        value={li.qty}
                        onChange={e => updateLineItem(li._key, 'qty', e.target.value)}
                        className="w-full bg-transparent outline-none text-xs text-right"
                        placeholder="0"
                        min={0}
                      />
                    </td>

                    {/* Unit Price */}
                    <td className={`${td} text-right`}>
                      <div className="flex items-center justify-end gap-0.5">
                        <span className="text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          value={li.unitPrice}
                          onChange={e => updateLineItem(li._key, 'unitPrice', e.target.value)}
                          className="w-20 bg-transparent outline-none text-xs text-right"
                          placeholder="0.00"
                          step="0.0001"
                          min={0}
                        />
                      </div>
                    </td>

                    {/* Total */}
                    <td className={`${td} text-right font-medium`}>
                      {lineTotal > 0 ? fmt(lineTotal) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Delete */}
                    <td className="border border-gray-300 text-center">
                      <button
                        onClick={() => removeLineItem(li._key)}
                        className="text-gray-300 hover:text-red-400 transition-colors text-base leading-none px-1"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Add line item */}
          <div className="border-t border-gray-200 px-4 py-2">
            <button
              onClick={addLineItem}
              disabled={!vendorId}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              + Add Line Item
            </button>
          </div>
        </div>

        {/* ── Totals + Comments ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-0 border-t border-gray-200">

          {/* Left: unit total + comments */}
          <div className="px-6 py-4 border-r border-gray-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
              Unit Quantity Total: <span className="text-gray-800 text-xs">{unitTotal.toLocaleString()}</span>
            </p>
            <div className="mt-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                Comments / Special Instructions
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={4}
                placeholder="Enter any comments or special instructions…"
                className="mt-1 w-full text-xs text-gray-800 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Right: subtotal / tax / shipping / other / total */}
          <div className="px-6 py-4">
            <table className="w-full text-xs">
              <tbody>
                {[
                  { label: 'Subtotal', value: fmt(subtotal), input: false },
                  { label: 'Tax',      value: tax,      input: true, setter: setTax },
                  { label: 'Shipping', value: shipping, input: true, setter: setShipping },
                  { label: 'Other',    value: other,    input: true, setter: setOther },
                ].map(row => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="py-2 text-gray-500 font-medium uppercase text-[10px] tracking-wide w-24">{row.label}</td>
                    <td className="py-2 text-right text-gray-800">
                      {row.input
                        ? <div className="flex items-center justify-end gap-0.5">
                            <span className="text-gray-400">$</span>
                            <input
                              type="number"
                              value={row.value as string}
                              onChange={e => row.setter?.(e.target.value)}
                              className="w-24 text-right outline-none border-b border-gray-200 focus:border-gray-500 bg-transparent"
                              placeholder="0.00"
                              step="0.01"
                              min={0}
                            />
                          </div>
                        : row.value
                      }
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-400">
                  <td className="pt-3 pb-1 font-extrabold text-gray-900 uppercase text-xs tracking-wide">Total</td>
                  <td className="pt-3 pb-1 text-right font-extrabold text-gray-900 text-sm">{fmt(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between text-[10px] text-gray-400">
          <span>Questions? Contact Jackson Trigg at jackson@ironinfidel.com</span>
          <span>Mike Kasdorf at mike@ironinfidel.com</span>
        </div>
      </div>

      {/* ── New Vendor Modal ──────────────────────────────────────────── */}
      {showNewVendor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Add New Vendor</h2>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Company Name *</label>
                <input
                  value={newVendor.name}
                  onChange={e => setNewVendor(v => ({ ...v, name: e.target.value }))}
                  placeholder="e.g. Northfox Manufacturing"
                  className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Type</label>
                <select
                  value={newVendor.type}
                  onChange={e => setNewVendor(v => ({ ...v, type: e.target.value }))}
                  className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                >
                  <option value="">— Select type —</option>
                  <option value="bottle">Bottle</option>
                  <option value="sleeve">Sleeve</option>
                  <option value="patch">Patch</option>
                  <option value="accessory">Accessory</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address Line 1</label>
                  <input value={newVendor.addressLine1} onChange={e => setNewVendor(v => ({ ...v, addressLine1: e.target.value }))}
                    className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address Line 2</label>
                  <input value={newVendor.addressLine2} onChange={e => setNewVendor(v => ({ ...v, addressLine2: e.target.value }))}
                    className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                  <input value={newVendor.city} onChange={e => setNewVendor(v => ({ ...v, city: e.target.value }))}
                    className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Country</label>
                  <input value={newVendor.country} onChange={e => setNewVendor(v => ({ ...v, country: e.target.value }))}
                    className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contact Email</label>
                <input
                  type="email"
                  value={newVendor.contactEmail}
                  onChange={e => setNewVendor(v => ({ ...v, contactEmail: e.target.value }))}
                  className="mt-0.5 w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowNewVendor(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                disabled={!newVendor.name.trim() || addingVendor}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {addingVendor ? 'Adding…' : 'Add Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
