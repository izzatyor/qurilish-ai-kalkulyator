'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CatalogMaterial,
  type MaterialCategory,
} from '@/lib/materials'
import { formatUZS } from '@/lib/estimate'
import { DimensionDivider } from '@/components/dimension-divider'

type Filter = 'all' | MaterialCategory

export function MaterialsCatalog({ materials }: { materials: CatalogMaterial[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return materials.filter((m) => {
      if (filter !== 'all' && m.category !== filter) return false
      if (!q) return true
      return (
        m.name.toLowerCase().includes(q) ||
        m.spec.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.origin.toLowerCase().includes(q)
      )
    })
  }, [filter, query])

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: filtered.filter((m) => m.category === cat),
  })).filter((g) => g.items.length > 0)

  const counts = materials.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      {/* Filter bar — styled like a drawing legend */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-4 border border-foreground md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-wrap" role="group" aria-label="Kategoriya bo‘yicha filtr">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} count={materials.length}>
              Barchasi
            </FilterButton>
            {CATEGORY_ORDER.map((cat) => (
              <FilterButton key={cat} active={filter === cat} onClick={() => setFilter(cat)} count={counts[cat]}>
                {CATEGORY_LABELS[cat]}
              </FilterButton>
            ))}
          </div>
          <label className="flex items-center gap-2 border-t border-foreground px-3 md:w-72 md:border-l md:border-t-0">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Material qidirish</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qidirish: laminat, Knauf…"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="mx-auto w-full max-w-6xl px-6 py-16 text-center text-muted-foreground">
          «{query}» bo‘yicha hech narsa topilmadi.
        </p>
      ) : null}

      {grouped.map((g, gi) => (
        <section key={g.cat} aria-labelledby={`cat-${g.cat}`} className="scroll-mt-16" id={g.cat}>
          <div className="pt-12">
            <DimensionDivider
              label={`${String(gi + 1).padStart(2, '0')} · ${CATEGORY_LABELS[g.cat]}`}
              note={`${g.items.length} pozitsiya`}
            />
          </div>
          <h2 id={`cat-${g.cat}`} className="sr-only">
            {CATEGORY_LABELS[g.cat]}
          </h2>

          <div className="mx-auto mt-6 w-full max-w-6xl px-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <caption className="sr-only">{CATEGORY_LABELS[g.cat]} — materiallar, tavsif va narxlar</caption>
                <thead>
                  <tr className="border-y border-foreground text-left text-xs text-muted-foreground">
                    <th scope="col" className="w-14 py-2.5 pr-3 font-normal">
                      Kod
                    </th>
                    <th scope="col" className="w-56 py-2.5 pr-3 font-normal">
                      Material
                    </th>
                    <th scope="col" className="py-2.5 pr-3 font-normal">
                      Tavsif
                    </th>
                    <th scope="col" className="w-40 py-2.5 pr-3 font-normal">
                      Sarf
                    </th>
                    <th scope="col" className="w-40 py-2.5 text-right font-normal">
                      Birlik narxi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((m) => (
                    <tr key={m.id} className="border-b border-border align-top transition-colors hover:bg-foreground/[0.03]">
                      <td className="tabular py-4 pr-3 font-heading text-xs text-muted-foreground">{m.code}</td>
                      <td className="py-4 pr-3">
                        <div className="font-heading font-semibold">{m.name}</div>
                        <div className="tabular mt-0.5 text-xs text-muted-foreground">{m.spec}</div>
                      </td>
                      <td className="py-4 pr-3">
                        <p className="max-w-prose leading-relaxed text-foreground/85">{m.description}</p>
                        <p className="mt-1.5 text-xs text-wood">{m.origin}</p>
                      </td>
                      <td className="tabular py-4 pr-3 text-xs leading-relaxed text-muted-foreground">{m.consumption}</td>
                      <td className="py-4 text-right">
                        <div className="tabular font-heading text-base font-semibold">{formatUZS(m.price)}</div>
                        <div className="text-xs text-muted-foreground">/ {m.unit}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-11 items-center gap-2 border-r border-foreground px-4 font-heading text-sm transition-colors last:border-r-0 ${
        active ? 'bg-foreground text-primary-foreground' : 'hover:bg-foreground/5'
      }`}
    >
      {children}
      <span className={`tabular text-xs ${active ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{count}</span>
    </button>
  )
}
