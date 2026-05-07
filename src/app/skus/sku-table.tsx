'use client'

import { useState, useRef, useCallback } from 'react'
import { updateProduct, updateManufacturerSku } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

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

type SortField =
  | 'name' | 'product_line' | 'asin' | 'fba_sku' | 'g10_sku' | 'shopify_sku'
  | 'sales_pct' | 'units_per_carton' | 'cbm_per_carton' | 'moq' | 'low_stock_threshold'
type SortDir = 'asc' | 'desc'

// ─── Editable cell ────────────────────────────────────────────────────────────

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
          px-2 py-1 rounded text-sm bg-white border border-blue-400
          outline-none w-full min-w-[60px] text-gray-900
          ${align === 'right' ? 'text-right' : 'text-left'}
        `}
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      className={`
        px-2 py-1 rounded text-sm cursor-text min-w-[60px] select-none transition-colors
        ${align === 'right' ? 'text-right' : 'text-left'}
        ${saving ? 'text-yellow-600' : ''}
        ${saved   ? 'text-green-700 bg-green-50' : ''}
        ${error   ? 'text-red-600 bg-red-50' : ''}
        ${!saving && !saved && !error ? 'hover:bg-blue-50 text-gray-900' : ''}
      `}
    >
      {saving ? <span className="opacity-60">saving…</span>
       : saved  ? <span>✓ {localValue || placeholder}</span>
       : error  ? <span>✗ error</span>
       : <span className={!String(value ?? '').length ? 'text-gray-300' : ''}>
           {value != null ? String(value) : placeholder}
         </span>}
    </div>
  )
}

// ─── Active toggle (fixed, last column) ──────────────────────────────────────

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
        relative inline-flex w-10 h-6 rounded-full transition-colors duration-200 shrink-0
        ${value ? 'bg-green-500' : 'bg-gray-300'}
        ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span className={`
        absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
        ${value ? 'translate-x-5' : 'translate-x-1'}
      `} />
    </button>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <span className="text-gray-300 ml-1">↕</span>
  return <span className="text-blue-500 ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

// ─── Sortable header cell ─────────────────────────────────────────────────────

function SortableTh({
  field, label, sortField, sortDir, onSort, right,
}: {
  field: SortField
  label: string
  sortField: SortField
  sortDir: SortDir
  onSort: (f: SortField) => void
  right?: boolean
}) {
  return (
    <th
      onClick={() => onSort(field)}
      className={`
        px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide
        whitespace-nowrap cursor-pointer select-none hover:text-gray-800 transition-colors
        ${right ? 'text-right' : 'text-left'}
      `}
    >
      {label}
      <SortIcon field={field} current={sortField} dir={sortDir} />
    </th>
  )
}

function StaticTh({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`
      px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap
      ${right ? 'text-right' : 'text-left'}
    `}>
      {children}
    </th>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

export default function SkuTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts]     = useState<Product[]>(initialProducts)
  const [search, setSearch]         = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [mfrFilter, setMfrFilter]   = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active')
  const [hasGapsOnly, setHasGapsOnly]   = useState(false)
  const [sortField, setSortField]   = useState<SortField>('product_line')
  const [sortDir, setSortDir]       = useState<SortDir>('asc')

  // Derived filter options
  const productLines = Array.from(new Set(initialProducts.map(p => p.product_line))).sort()
  const manufacturers = Array.from(new Set(
    initialProducts.flatMap(p =>
      p.manufacturer_sku_map
        .filter(m => m.manufacturer.manufacturer_type !== 'patch')
        .map(m => m.manufacturer.name)
    )
  )).sort()

  // Sort handler
  const handleSort = (field: SortField) => {
    if (field === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  // Filter + sort
  const filtered = products
    .filter(p => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.asin.toLowerCase().includes(q) ||
        (p.fba_sku ?? '').toLowerCase().includes(q) ||
        (p.g10_sku ?? '').toLowerCase().includes(q) ||
        (p.shopify_sku ?? '').toLowerCase().includes(q) ||
        p.manufacturer_sku_map.some(m => m.manufacturer_sku.toLowerCase().includes(q))

      const matchLine = !lineFilter || p.product_line === lineFilter

      const primaryMfr = p.manufacturer_sku_map.find(
        m => m.manufacturer.manufacturer_type !== 'patch'
      )
      const matchMfr = !mfrFilter || primaryMfr?.manufacturer.name === mfrFilter

      const matchActive =
        activeFilter === 'all'      ? true :
        activeFilter === 'active'   ? p.is_active :
        !p.is_active

      const matchGaps = !hasGapsOnly || (
        p.units_per_carton == null || p.cbm_per_carton == null
      )

      return matchSearch && matchLine && matchMfr && matchActive && matchGaps
    })
    .sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

  const handleActiveChange = (id: string, active: boolean) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: active } : p))

  const makeProductUpdater = (id: string, field: keyof Product) =>
    async (val: string) => {
      const parsed = val === '' ? null : (
        ['units_per_carton', 'moq', 'low_stock_threshold'].includes(field as string)
          ? parseInt(val, 10)
          : ['cbm_per_carton', 'sales_pct'].includes(field as string)
          ? parseFloat(val)
          : val
      )
      await updateProduct(id, { [field]: parsed })
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: parsed } : p))
    }

  const makeMfrSkuUpdater = (mapId: string, productId: string) =>
    async (val: string) => {
      await updateManufacturerSku(mapId, val)
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p
        return {
          ...p,
          manufacturer_sku_map: p.manufacturer_sku_map.map(m =>
            m.id === mapId ? { ...m, manufacturer_sku: val } : m
          ),
        }
      }))
    }

  const clearFilters = () => {
    setSearch('')
    setLineFilter('')
    setMfrFilter('')
    setActiveFilter('active')
    setHasGapsOnly(false)
  }

  const hasActiveFilters = search || lineFilter || mfrFilter ||
    activeFilter !== 'active' || hasGapsOnly

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-end">

          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Search</label>
            <input
              type="text"
              placeholder="Name, ASIN, any SKU…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 w-52"
            />
          </div>

          {/* Product line */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Product Line</label>
            <select
              value={lineFilter}
              onChange={e => setLineFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">All lines</option>
              {productLines.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Manufacturer */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Manufacturer</label>
            <select
              value={mfrFilter}
              onChange={e => setMfrFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">All manufacturers</option>
              {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Active status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Status</label>
            <div className="flex rounded overflow-hidden border border-gray-700 text-sm">
              {(['active', 'all', 'inactive'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-colors ${
                    activeFilter === f
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 bg-gray-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Has gaps (missing case pack / CBM) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Data gaps</label>
            <button
              onClick={() => setHasGapsOnly(v => !v)}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                hasGapsOnly
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Missing case pack / CBM
            </button>
          </div>

          {/* Result count + clear */}
          <div className="flex items-end gap-3 ml-auto">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-white transition-colors py-1.5"
              >
                Clear filters
              </button>
            )}
            <span className="text-gray-400 text-sm pb-1.5">
              {filtered.length} / {products.length} SKUs
            </span>
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-x-scroll overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-sm border-collapse font-mono">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <SortableTh field="name"               label="Product"           sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableTh field="product_line"        label="Product Line"      sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableTh field="asin"               label="ASIN"              sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableTh field="fba_sku"            label="FBA SKU"           sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableTh field="g10_sku"            label="G10 SKU"           sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableTh field="shopify_sku"        label="Shopify SKU"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <StaticTh>Primary MNFR</StaticTh>
              <StaticTh>Primary MNFR SKU</StaticTh>
              <StaticTh>Patch SKU</StaticTh>
              <SortableTh field="sales_pct"          label="Sales %"           sortField={sortField} sortDir={sortDir} onSort={handleSort} right />
              <SortableTh field="units_per_carton"   label="Units/Ctn"         sortField={sortField} sortDir={sortDir} onSort={handleSort} right />
              <SortableTh field="cbm_per_carton"     label="CBM/Ctn"           sortField={sortField} sortDir={sortDir} onSort={handleSort} right />
              <SortableTh field="moq"                label="MOQ"               sortField={sortField} sortDir={sortDir} onSort={handleSort} right />
              <SortableTh field="low_stock_threshold" label="Low Stock"        sortField={sortField} sortDir={sortDir} onSort={handleSort} right />
              <StaticTh>Active</StaticTh>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={15} className="text-center py-12 text-gray-400">
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
                    border-b border-gray-100 transition-colors
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${!p.is_active ? 'opacity-40' : 'hover:bg-blue-50/30'}
                  `}
                >
                  {/* Product name */}
                  <td className="px-3 py-2 text-gray-900 font-medium max-w-[200px]">
                    <span className="block truncate" title={p.name}>{p.name}</span>
                  </td>

                  {/* Product line */}
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{p.product_line}</td>

                  {/* ASIN */}
                  <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{p.asin}</td>

                  {/* FBA SKU */}
                  <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{p.fba_sku ?? '—'}</td>

                  {/* G10 SKU */}
                  <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{p.g10_sku ?? '—'}</td>

                  {/* Shopify SKU */}
                  <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{p.shopify_sku ?? '—'}</td>

                  {/* Primary MNFR name */}
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap text-xs">
                    {primaryMfr?.manufacturer.name ?? '—'}
                  </td>

                  {/* Primary MNFR SKU — editable */}
                  <td className="px-1 py-1">
                    {primaryMfr
                      ? <EditableCell value={primaryMfr.manufacturer_sku} onSave={makeMfrSkuUpdater(primaryMfr.id, p.id)} />
                      : <span className="px-2 text-gray-300">—</span>}
                  </td>

                  {/* Patch SKU — editable */}
                  <td className="px-1 py-1">
                    {patchMfr
                      ? <EditableCell value={patchMfr.manufacturer_sku} onSave={makeMfrSkuUpdater(patchMfr.id, p.id)} />
                      : <span className="px-2 text-gray-300">—</span>}
                  </td>

                  {/* Sales % */}
                  <td className="px-1 py-1 w-20">
                    <EditableCell value={p.sales_pct} onSave={makeProductUpdater(p.id, 'sales_pct')} type="number" placeholder="—" align="right" />
                  </td>

                  {/* Units/carton */}
                  <td className="px-1 py-1 w-20">
                    <EditableCell value={p.units_per_carton} onSave={makeProductUpdater(p.id, 'units_per_carton')} type="number" placeholder="—" align="right" />
                  </td>

                  {/* CBM/carton */}
                  <td className="px-1 py-1 w-24">
                    <EditableCell value={p.cbm_per_carton} onSave={makeProductUpdater(p.id, 'cbm_per_carton')} type="number" placeholder="—" align="right" />
                  </td>

                  {/* MOQ */}
                  <td className="px-1 py-1 w-20">
                    <EditableCell value={p.moq} onSave={makeProductUpdater(p.id, 'moq')} type="number" placeholder="—" align="right" />
                  </td>

                  {/* Low stock */}
                  <td className="px-1 py-1 w-24">
                    <EditableCell value={p.low_stock_threshold} onSave={makeProductUpdater(p.id, 'low_stock_threshold')} type="number" placeholder="—" align="right" />
                  </td>

                  {/* Active toggle — last column */}
                  <td className="px-3 py-2">
                    <ActiveToggle productId={p.id} value={p.is_active} onChange={handleActiveChange} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 text-xs">
        Click any cell in the last 6 columns to edit inline. Press Enter or click away to save.
      </p>
    </div>
  )
}
