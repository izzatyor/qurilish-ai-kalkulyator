'use client'

import { useState, type FormEvent } from 'react'
import { Download, Share2, BookmarkPlus, Check, Loader2, X, RotateCcw, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEstimate } from '@/components/estimate-context'
import { useAuth } from '@/components/auth-context'
import { saveCalculation } from '@/lib/calculations'
import { TIER_LABELS, formatNum, formatUZS } from '@/lib/estimate'
import { MATERIALS } from '@/lib/materials'

export function BudgetBreakdown() {
  const {
    input,
    result,
    toggleMaterial,
    setQty,
    resetQty,
    addCustomMaterial,
    updateCustomMaterial,
    removeCustomMaterial,
  } = useEstimate()
  const { user } = useAuth()
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', spec: '', qty: '1', unit: 'dona', unitPrice: '' })
  // Miqdor maydonlari uchun vaqtinchalik matn holati. Bu yo'q bo'lsa, foydalanuvchi
  // raqamni o'chirib qayta yozmoqchi bo'lganda maydon avtomatik eski qiymatga qaytib
  // ketadi (chunki input to'g'ridan-to'g'ri hisoblangan raqamga bog'langan bo'lardi).
  const [qtyDrafts, setQtyDrafts] = useState<Record<string, string>>({})

  const commitQty = (id: string, isCustom: boolean) => {
    const raw = qtyDrafts[id]
    if (raw === undefined) return
    const v = parseFloat(raw.replace(',', '.'))
    if (Number.isFinite(v) && v >= 0) {
      isCustom ? updateCustomMaterial(id, { qty: v }) : setQty(id, v)
    }
    setQtyDrafts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault()
    const qty = parseFloat(form.qty)
    const unitPrice = parseFloat(form.unitPrice)
    if (!form.name.trim() || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) return
    addCustomMaterial({ name: form.name.trim(), spec: form.spec.trim(), qty, unit: form.unit.trim() || 'dona', unitPrice })
    setForm({ name: '', spec: '', qty: '1', unit: 'dona', unitPrice: '' })
    setAddOpen(false)
  }

  /** Nom maydonidan chiqilganda, agar katalogda aynan shu nomdagi material bo'lsa,
   * uning tavsifi/birligi/narxini avtomatik to'ldiradi — foydalanuvchi qo'lda
   * qidirib narx yozishga majbur bo'lmaydi. */
  const handleNameBlur = () => {
    const match = MATERIALS.find((mat) => mat.name.toLowerCase() === form.name.trim().toLowerCase())
    if (!match) return
    setForm((s) => ({
      ...s,
      spec: s.spec || match.spec,
      unit: match.unit,
      unitPrice: s.unitPrice || String(match.price),
    }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaveState('saving')
    try {
      await saveCalculation(user.id, input, result)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3000)
    } catch (e) {
      console.error(e)
      setSaveState('error')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Smeta AI — ta‘mirlash smetasi',
      text: `Mening ${formatNum(input.width, 1)}×${formatNum(input.length, 1)} m xonam uchun taxminiy byudjet: ${formatUZS(result.total)}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // Foydalanuvchi ulashishni bekor qilgan bo'lishi mumkin — bu xato emas
      }
      return
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 2500)
    }
  }

  const segments = [
    { label: 'Materiallar', value: result.materialsTotal, color: 'bg-primary-foreground' },
    { label: 'Ish haqi', value: result.labor, color: 'bg-accent' },
    { label: 'Zaxira 10 %', value: result.reserve, color: 'bg-primary-foreground/40' },
  ]

  return (
    <section id="materiallar" className="bg-grid-dark scroll-mt-14 text-primary-foreground print:bg-white print:text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20 print:px-0 print:py-6">
        <div className="mb-8 hidden items-center gap-2.5 print:flex">
          <span className="font-heading text-lg font-bold">Smeta AI</span>
          <span className="text-sm text-muted-foreground">
            — {new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-3 text-sm text-primary-foreground/70">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Smeta № 2026-0905 · {TIER_LABELS[input.tier]}
            </p>
            <h2 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Materiallar va byudjet taqsimoti
            </h2>
          </div>
          <div className="flex gap-px print:hidden">
            {user ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saveState === 'saving'}
                className="inline-flex h-10 items-center gap-2 border border-primary-foreground/50 px-4 text-sm transition-colors hover:bg-primary-foreground hover:text-primary disabled:opacity-60"
              >
                {saveState === 'saving' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {saveState === 'saved' && <Check className="h-4 w-4" aria-hidden="true" />}
                {(saveState === 'idle' || saveState === 'error') && (
                  <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                )}
                {saveState === 'saved' ? 'Saqlandi' : saveState === 'error' ? 'Xatolik, qayta urinib ko‘ring' : 'Saqlash'}
              </button>
            ) : (
              <Link
                href="/kirish"
                className="inline-flex h-10 items-center gap-2 border border-primary-foreground/50 px-4 text-sm transition-colors hover:bg-primary-foreground hover:text-primary"
              >
                <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                Saqlash uchun kiring
              </Link>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-10 items-center gap-2 border border-l-0 border-primary-foreground/50 px-4 text-sm transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              PDF yuklab olish
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-2 border border-l-0 border-primary-foreground/50 px-4 text-sm transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              {shareState === 'copied' ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Share2 className="h-4 w-4" aria-hidden="true" />
              )}
              {shareState === 'copied' ? 'Nusxalandi' : 'Ulashish'}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Materials table */}
          <div>
            <p className="mb-3 text-xs text-primary-foreground/60 print:hidden">
              Kerak bo‘lmagan materialni <span className="font-medium text-primary-foreground">✕</span> tugmasi orqali
              olib tashlang — byudjet avtomatik qayta hisoblanadi.
            </p>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">Materiallar ro‘yxati va narxlari</caption>
              <thead>
                <tr className="border-y border-primary-foreground/60 text-left text-xs text-primary-foreground/70">
                  <th scope="col" className="py-2.5 pr-3 font-normal">
                    №
                  </th>
                  <th scope="col" className="py-2.5 pr-3 font-normal">
                    Material
                  </th>
                  <th scope="col" className="py-2.5 pr-3 text-right font-normal">
                    Miqdor
                  </th>
                  <th scope="col" className="py-2.5 pr-3 text-right font-normal">
                    Narx
                  </th>
                  <th scope="col" className="py-2.5 text-right font-normal">
                    Jami
                  </th>
                  <th scope="col" className="py-2.5 pl-3 font-normal print:hidden">
                    <span className="sr-only">Amal</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.materials.map((m, i) => {
                  const isCustom = m.id.startsWith('custom-')
                  return (
                    <tr
                      key={m.id}
                      className={`border-b border-primary-foreground/20 ${
                        m.excluded ? 'opacity-40 print:hidden' : ''
                      }`}
                    >
                      <td className="tabular py-3 pr-3 text-primary-foreground/50">{String(i + 1).padStart(2, '0')}</td>
                      <td className="py-3 pr-3">
                        <div className={`font-medium ${m.excluded ? 'line-through' : ''}`}>
                          {m.name}
                          {isCustom && <span className="ml-2 text-xs font-normal text-accent">· qo‘lda qo‘shilgan</span>}
                        </div>
                        <div className="text-xs text-primary-foreground/60">
                          {m.spec}
                          {m.excluded && <span className="ml-2 text-accent">· olib tashlandi</span>}
                        </div>
                      </td>
                      <td className="tabular py-3 pr-3 text-right font-heading">
                        <div className="flex items-center justify-end gap-1.5 print:hidden">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={qtyDrafts[m.id] ?? formatNum(m.qty, 2)}
                            disabled={m.excluded}
                            onChange={(e) => setQtyDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                            onBlur={() => commitQty(m.id, isCustom)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur()
                            }}
                            className="w-16 border-b border-primary-foreground/40 bg-transparent py-0.5 text-right tabular outline-none focus:border-accent disabled:opacity-50"
                          />
                          <span className="text-xs text-primary-foreground/60">{m.unit}</span>
                          {!isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                setQtyDrafts((prev) => {
                                  const next = { ...prev }
                                  delete next[m.id]
                                  return next
                                })
                                resetQty(m.id)
                              }}
                              title="Avtomatik hisoblangan miqdorga qaytarish"
                              aria-label="Avtomatik miqdorga qaytarish"
                              className="text-primary-foreground/40 transition-colors hover:text-accent"
                            >
                              <RotateCcw className="h-3 w-3" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <span className="hidden print:inline">
                          {formatNum(m.qty, 1)} {m.unit}
                        </span>
                      </td>
                      <td className="tabular py-3 pr-3 text-right text-primary-foreground/80">
                        {m.unitPrice.toLocaleString('ru-RU')}
                      </td>
                      <td className="tabular py-3 text-right font-heading font-semibold">
                        {m.total.toLocaleString('ru-RU')}
                      </td>
                      <td className="py-3 pl-3 text-right print:hidden">
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={() => removeCustomMaterial(m.id)}
                            aria-label={`${m.name} o‘chirish`}
                            title="Butunlay o‘chirish"
                            className="inline-flex h-7 w-7 items-center justify-center border border-primary-foreground/40 text-primary-foreground/70 transition-colors hover:border-accent hover:text-accent"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleMaterial(m.id)}
                            aria-label={m.excluded ? `${m.name} qaytarish` : `${m.name} olib tashlash`}
                            title={m.excluded ? 'Qaytarish' : 'Kerak emas'}
                            className="inline-flex h-7 w-7 items-center justify-center border border-primary-foreground/40 text-primary-foreground/70 transition-colors hover:border-accent hover:text-accent"
                          >
                            {m.excluded ? (
                              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-b border-primary-foreground/60">
                  <td colSpan={4} className="py-3 pr-3 text-right text-primary-foreground/80">
                    Materiallar jami
                  </td>
                  <td className="tabular py-3 text-right font-heading font-semibold">
                    {result.materialsTotal.toLocaleString('ru-RU')}
                  </td>
                  <td className="print:hidden" />
                </tr>
              </tfoot>
            </table>
            </div>

            <div className="mt-4 print:hidden">
              {!addOpen ? (
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-2 border border-dashed border-primary-foreground/40 px-4 py-2 text-sm text-primary-foreground/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Material qo‘shish
                </button>
              ) : (
                <form
                  onSubmit={handleAddSubmit}
                  className="grid gap-3 border border-primary-foreground/40 p-4 sm:grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.9fr_auto]"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-foreground/60">Nomi</label>
                    <input
                      required
                      list="material-suggestions"
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      onBlur={handleNameBlur}
                      placeholder="Masalan: Kafel"
                      className="border-b-2 border-primary-foreground/50 bg-transparent py-1 text-sm outline-none focus:border-accent"
                    />
                    <datalist id="material-suggestions">
                      {MATERIALS.map((mat) => (
                        <option key={mat.id} value={mat.name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-foreground/60">Tavsif (ixtiyoriy)</label>
                    <input
                      value={form.spec}
                      onChange={(e) => setForm((s) => ({ ...s, spec: e.target.value }))}
                      placeholder="Masalan: 30×30 sm"
                      className="border-b-2 border-primary-foreground/50 bg-transparent py-1 text-sm outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-foreground/60">Miqdor</label>
                    <input
                      required
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      value={form.qty}
                      onChange={(e) => setForm((s) => ({ ...s, qty: e.target.value }))}
                      className="border-b-2 border-primary-foreground/50 bg-transparent py-1 text-sm tabular outline-none focus:border-accent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-foreground/60">Birlik</label>
                    <input
                      value={form.unit}
                      onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                      placeholder="dona / m² / qop"
                      className="border-b-2 border-primary-foreground/50 bg-transparent py-1 text-sm outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-foreground/60">Narxi, so‘m</label>
                    <input
                      required
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={500}
                      value={form.unitPrice}
                      onChange={(e) => setForm((s) => ({ ...s, unitPrice: e.target.value }))}
                      className="border-b-2 border-primary-foreground/50 bg-transparent py-1 text-sm tabular outline-none focus:border-accent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center bg-accent px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#d4551f]"
                    >
                      Qo‘shish
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddOpen(false)}
                      className="inline-flex h-9 items-center justify-center border border-primary-foreground/40 px-3 text-sm text-primary-foreground/70 hover:text-primary-foreground"
                    >
                      Bekor
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-b border-primary-foreground/60 pb-6">
              <span className="text-sm text-primary-foreground/70">Umumiy byudjet</span>
              <span className="font-heading tabular text-4xl font-bold leading-none sm:text-5xl">
                {formatNum(result.total / 1_000_000, 2)}
                <span className="ml-2 text-lg font-medium text-primary-foreground/70">mln so‘m</span>
              </span>
              <span className="tabular text-sm text-primary-foreground/70">
                ≈ {formatNum(result.total / result.floorArea / 1000, 0)} ming so‘m / m² · {formatUZS(result.total)}
              </span>
            </div>

            {/* Stacked bar */}
            <div className="flex flex-col gap-3">
              <div className="flex h-3 w-full" role="img" aria-label="Byudjet taqsimoti diagrammasi">
                {segments.map((s) => (
                  <span
                    key={s.label}
                    className={`${s.color} h-full`}
                    style={{ width: `${(s.value / result.total) * 100}%` }}
                  />
                ))}
              </div>
              <ul className="flex flex-col">
                {segments.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center justify-between border-b border-primary-foreground/20 py-2.5 text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 ${s.color}`} aria-hidden="true" />
                      {s.label}
                    </span>
                    <span className="flex items-baseline gap-3">
                      <span className="tabular text-xs text-primary-foreground/60">
                        {formatNum((s.value / result.total) * 100, 0)} %
                      </span>
                      <span className="tabular font-heading font-semibold">{s.value.toLocaleString('ru-RU')}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-primary-foreground/60">Pol</dt>
                <dd className="tabular font-heading font-semibold">{formatNum(result.floorArea, 2)} m²</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-primary-foreground/60">Devor (eshik/deraza chiqarilgan)</dt>
                <dd className="tabular font-heading font-semibold">{formatNum(result.wallArea, 2)} m²</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-primary-foreground/60">Shift</dt>
                <dd className="tabular font-heading font-semibold">{formatNum(result.ceilingArea, 2)} m²</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-primary-foreground/60">Perimetr</dt>
                <dd className="tabular font-heading font-semibold">{formatNum(result.perimeter, 2)} m</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
