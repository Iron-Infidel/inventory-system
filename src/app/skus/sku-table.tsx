'use client'

import { useState, useRef, useCallback } from 'react'
import { updateProduct, updateManufacturerSku } from './actions'

// ─── Types ───────────────────────────────────────────────────────────────────

type MfrSkuEntry = {
  id: string
  manufacturer_sku: string
  manufacturer: {
    id: string
    name: string
    manufacturer_type: string | null
  }
}

export type Product = {
  id: string
  asin: string
  name: string
  product_line: string
  fba_sku: string | null
  g10_sku: string | null
  shopify_sku: string | null
  units_per_carton: number | null
  cbm_per_carton: number | null
  moq: number | null
  low_stock_threshold: number | null
  sales_pct: number | null
  requires_patch: boolean
  is_active: boolean
  manufacturer_sku_map: MfrSkuEntry[]
}

// ─── Editable cell ───────────────────────────────────────────────────────────

function EditableCell({
  value,
  onSave,
  type = 'text',
  placeholder = '—',
  align = 'left',
}: {
  value: string | number | null
  onSave: (value: string) => Promise<void>
  type?: 'text' | 'number'
  placeholder?: string
  align?: 'left' | 'right'
}) {
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value != null ? String(value) : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const originalValue = useRef(value != null ? String(value) : '')

  const startEdit = () => {
    setLocalValue(value != null ? String(value) : '')
    originalValue.current = value != null ? String(value) : ''
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const cancel = () => {
    setLocalValue(originalValue.current)
    setEditing(false)
  }

  const save = useCallback(async () => {
    if (localValue === originalValue.current) { setEditing(false); return }
    setSaving(true)
    setEditing(false)
    setError(false)
    try {
      await onSave(localValue)
      originalValue.current = localValue
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError(true)
      setLocalValue(originalValue.current)
      setTimeout(() => setError(false), 3000)
    } finally {
      setSaving(false)
    }
  }, [localValue, onSave])

  const displayValue = editing ? localValue : (value != null ? String(value) : '')

  const cellClass = `
    px-2 py-1 rounded text-sm cursor-text min-w-[60px] transition-colors
    ${align === 'right' ? 'text-right' : 'text-left'}
    ${saving  ? 'text-yellow-400' : ''}
    ${saved   ? 'text-green-400 bg-green-400/10' : ''}
    ${error   ? 'text-red-400 bg-red-400/10' : ''}
    ${!saving && !saved && !error ? 'hover:bg-gray-700/60' : ''}
  `

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={localValue}
        autoFocus
        onChange={e => setLocalValue(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') cancel()
        }}
        className={`
          px-2 py-1 rounded text-sm bg-gray-700 border border-blue-500
          outline-none w-full min-w-[60px]
          ${align === 'right' ? 'text-right' : 'text-left'}
        `}
      />
    )
  }

  return (
    <div onClick={startEdit} className={cellClass}>
      {saving ? (
        <span className="opacity-60">saving…</span>
      ) : saved ? (
        <span>✓ {displayValue || placeholder}</span>
      ) : error ? (
        <span>✗ error</span>
      ) : (
        <span className={!displayValue ? 'text-gray-600' : ''}>
          {displayValue || placeholder}
        </span>
      )}
    </div>
  )
}

// ─── Active toggle ────────────────────────────────────────────────────────────

function ActiveToggle({
  productId,
  value,
  onChange,
}: {
  productId: string
  value: boolean
  onChange: (id: string, active: boolean) => void
}) {
  const [saving, setSaving] = useState(false)

  const toggle = async () => {
    setSaving(true)
    try {
      await updateProduct(productId, { is_active: !value })
      onChange(productId, !value)
    } finally {
      setSaving(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`
        w-9 h-5 rounded-full transition-colors relative shrink-0
        ${saving ? 'opacity-50' : ''}
        ${value ? 'bg-green-500' : 'bg-gray-700'}
      `}
    >
      <span className={`
        absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
        ${value ? 'translate-x-4' : 'translate-x-0.5'}
      `} />
    </button>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

const ALL_LINES = 'All product lines'

export default function SkuTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [lineFilter, setLineFilter] = useState(ALL_LINES)
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active')

  // Unique product lines for filter dropdown
  const productLines = [ALL_LINES, ...Array.from(
    new Set(initialProducts.map(p => p.product_line))
  ).sort()]

  // Filtered products
  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.asin.toLowerCase().includes(search.toLowerCase()) ||
      (p.fba_sku ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.g10_sku ?? '').toLowerCase().includes(search.toLowerCase())
    const matchLine = lineFilter === ALL_LINES || p.product_line === lineFilter
    const matchActive =
      activeFilter === 'all' ? true :
      activeFilter === 'active' ? p.is_active :
      !p.is_active
    return matchSearch && matchLine && matchActive
  })

  const handleActiveChange = (id: string, active: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: active } : p))
  }

  const makeProductUpdater = (id: string, field: keyof Product) =>
    async (val: string) => {
      const parsed = val === '' ? null : (
        ['units_per_carton', 'moq', 'low_stock_threshold'].includes(field)
          ? parseInt(val, 10)
          : ['cbm_per_carton', 'sales_pct'].includes(field)
          ? parseFloat(val)
          : val
      )
      await updateProduct(id, { [field]: parsed })
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: parsed } : p))
    }

  const makeMfrSkuUpdater = (mapId: string, productId: string, isPatch: boolean) =>
    async (val: string) => {
      await updateManufacturerSku(mapId, val)
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p
        return {
          ...p,
          manufacturer_sku_map: p.manufacturer_sku_map.map(m =>
            m.id === mapId ? { ...m, manufacturer_sku: val } : m
          )
        }
      }))
    }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search name, ASIN, SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 w-56"
        />
        <select
          value={lineFilter}
          onChange={e => setLineFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gray-500"
        >
          {productLines.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <div className="flex rounded overflow-hidden border border-gray-700 text-sm">
          {(['active', 'all', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-gray-500 text-sm ml-auto">
          {filtered.length} of {products.length} SKUs
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <Th>On</Th>
              <Th>Name</Th>
              <Th>Line</Th>
              <Th>ASIN</Th>
              <Th>FBA SKU</Th>
              <Th>G10 SKU</Th>
              <Th>Primary Mfr</Th>
              <Th>Primary Mfr SKU</Th>
              <Th>Patch SKU</Th>
              <Th right>Sales %</Th>
              <Th right>Units/Ctn</Th>
              <Th right>CBM/Ctn</Th>
              <Th right>MOQ</Th>
              <Th right>Low Stock</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={14} className="text-center py-12 text-gray-600">
                  No products match your filters
                </td>
              </tr>
            )}
            {filtered.map((p, i) => {
              const primaryMfr = p.manufacturer_sku_map.find(
                m => m.manufacturer.manufacturer_type !== 'patch'
              )
              const patchMfr = p.manufacturer_sku_map.find(
                m => m.manufacturer.manufacturer_type === 'patch'
              )

              return (
                <tr
                  key={p.id}
                  className={`
                    border-b border-gray-800/60 transition-colors
                    ${i % 2 === 0 ? 'bg-gray-900/20' : ''}
                    ${!p.is_active ? 'opacity-40' : 'hover:bg-gray-800/30'}
                  `}
                >
                  {/* Active toggle */}
                  <td className="px-3 py-2 w-12">
                    <ActiveToggle
                      productId={p.id}
                      value={p.is_active}
                      onChange={handleActiveChange}
                    />
                  </td>

                  {/* Name */}
                  <td className="px-3 py-2 font-medium text-white max-w-[200px]">
                    <span className="block truncate" title={p.name}>{p.name}</span>
                  </td>

                  {/* Product line */}
                  <td className="px-3 py-2 text-gray-400 whitespace-nowrap">{p.product_line}</td>

                  {/* ASIN */}
                  <td className="px-3 py-2 text-gray-500 font-mono text-xs">{p.asin}</td>

                  {/* FBA SKU */}
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs whitespace-nowrap">
                    {p.fba_sku ?? '—'}
                  </td>

                  {/* G10 SKU */}
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs whitespace-nowrap">
                    {p.g10_sku ?? '—'}
                  </td>

                  {/* Primary manufacturer name */}
                  <td className="px-3 py-2 text-gray-400 whitespace-nowrap text-xs">
                    {primaryMfr?.manufacturer.name ?? '—'}
                  </td>

                  {/* Primary mfr SKU — editable */}
                  <td className="px-2 py-1 font-mono text-xs">
                    {primaryMfr ? (
                      <EditableCell
                        value={primaryMfr.manufacturer_sku}
                        onSave={makeMfrSkuUpdater(primaryMfr.id, p.id, false)}
                        placeholder="—"
                      />
                    ) : <span className="text-gray-600 px-2">—</span>}
                  </td>

                  {/* Patch SKU — editable, only for requires_patch products */}
                  <td className="px-2 py-1 font-mono text-xs">
                    {patchMfr ? (
                      <EditableCell
                        value={patchMfr.manufacturer_sku}
                        onSave={makeMfrSkuUpdater(patchMfr.id, p.id, true)}
                        placeholder="—"
                      />
                    ) : <span className="text-gray-600 px-2">—</span>}
                  </td>

                  {/* Sales % */}
                  <td className="px-2 py-1 w-20">
                    <EditableCell
                      value={p.sales_pct}
                      onSave={makeProductUpdater(p.id, 'sales_pct')}
                      type="number"
                      placeholder="—"
                      align="right"
                    />
                  </td>

                  {/* Units/carton */}
                  <td className="px-2 py-1 w-20">
                    <EditableCell
                      value={p.units_per_carton}
                      onSave={makeProductUpdater(p.id, 'units_per_carton')}
                      type="number"
                      placeholder="—"
                      align="right"
                    />
                  </td>

                  {/* CBM/carton */}
                  <td className="px-2 py-1 w-24">
                    <EditableCell
                      value={p.cbm_per_carton}
                      onSave={makeProductUpdater(p.id, 'cbm_per_carton')}
                      type="number"
                      placeholder="—"
                      align="right"
                    />
                  </td>

                  {/* MOQ */}
                  <td className="px-2 py-1 w-20">
                    <EditableCell
                      value={p.moq}
                      onSave={makeProductUpdater(p.id, 'moq')}
                      type="number"
                      placeholder="—"
                      align="right"
                    />
                  </td>

                  {/* Low stock threshold */}
                  <td className="px-2 py-1 w-24">
                    <EditableCell
                      value={p.low_stock_threshold}
                      onSave={makeProductUpdater(p.id, 'low_stock_threshold')}
                      type="number"
                      placeholder="—"
                      align="right"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-gray-600 text-xs">
        Click any editable cell to change it. Press Enter or click away to save. Changes take effect immediately.
      </p>
    </div>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`
      px-3 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap
      ${right ? 'text-right' : 'text-left'}
    `}>
      {children}
    </th>
  )
}
