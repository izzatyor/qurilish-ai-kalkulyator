'use client'

import { useId } from 'react'
import { useEstimate } from '@/components/estimate-context'
import { TIER_LABELS, formatNum, type Tier } from '@/lib/estimate'

const DIMENSIONS: { key: 'width' | 'length' | 'height'; label: string; hint: string; min: number; max: number }[] = [
  { key: 'width', label: 'Kenglik', hint: 'A', min: 1, max: 30 },
  { key: 'length', label: 'Uzunlik', hint: 'B', min: 1, max: 30 },
  { key: 'height', label: 'Balandlik', hint: 'H', min: 2, max: 6 },
]

export function Calculator() {
  const { input, result, setDimension, setTier } = useEstimate()
  const baseId = useId()

  return (
    <section id="kalkulyator" className="scroll-mt-14">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-5">
          <h2 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Xona o‘lchamlarini kiriting
          </h2>
          <p className="max-w-sm text-pretty leading-relaxed text-foreground/80">
            Ruletka bilan o‘lchagan raqamlarni yozing. Har bir o‘zgarish yuqoridagi chizma va
            quyidagi smetada darhol aks etadi.
          </p>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="h-px w-5 bg-wood" aria-hidden="true" />
              Standart eshik 0.90 × 2.10 m va deraza 1.50 × 1.40 m hisobga olinadi
            </li>
            <li className="flex items-center gap-3">
              <span className="h-px w-5 bg-wood" aria-hidden="true" />
              Materiallarga 5–8 % zaxira qo‘shiladi
            </li>
            <li className="flex items-center gap-3">
              <span className="h-px w-5 bg-wood" aria-hidden="true" />
              Narxlar 2026-yil sentyabr holatiga ko‘ra
            </li>
          </ul>
        </div>

        <form
          className="border border-foreground"
          onSubmit={(e) => {
            e.preventDefault()
            document.getElementById('materiallar')?.scrollIntoView({ behavior: 'smooth' })
          }}
          aria-labelledby={`${baseId}-legend`}
        >
          <div id={`${baseId}-legend`} className="flex items-center justify-between border-b border-foreground px-5 py-3">
            <span className="font-heading text-sm font-semibold">Kirish ma‘lumotlari</span>
            <span className="tabular text-xs text-muted-foreground">
              Perimetr {formatNum(result.perimeter, 2)} m
            </span>
          </div>

          <div className="grid sm:grid-cols-3">
            {DIMENSIONS.map((d, i) => {
              const id = `${baseId}-${d.key}`
              return (
                <div
                  key={d.key}
                  className={`flex flex-col gap-2 p-5 ${i < DIMENSIONS.length - 1 ? 'border-b border-border sm:border-b-0 sm:border-r' : ''}`}
                >
                  <label htmlFor={id} className="flex items-center justify-between text-sm">
                    <span>{d.label}</span>
                    <span className="font-heading text-xs text-muted-foreground">{d.hint}</span>
                  </label>
                  <div className="flex items-baseline gap-1 border-b-2 border-foreground focus-within:border-accent">
                    <input
                      id={id}
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      min={d.min}
                      max={d.max}
                      value={input[d.key]}
                      onChange={(e) => setDimension(d.key, parseFloat(e.target.value))}
                      className="tabular w-full bg-transparent py-1 font-heading text-3xl font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="pb-1 text-sm text-muted-foreground">m</span>
                  </div>
                  <input
                    aria-label={`${d.label} slayderi`}
                    type="range"
                    min={d.min}
                    max={d.max}
                    step={0.1}
                    value={input[d.key]}
                    onChange={(e) => setDimension(d.key, parseFloat(e.target.value))}
                    className="h-px w-full cursor-ew-resize appearance-none bg-border accent-accent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-foreground [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
                  />
                </div>
              )
            })}
          </div>

          <fieldset className="border-t border-foreground p-5">
            <legend className="sr-only">Ta‘mirlash darajasi</legend>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>Ta‘mirlash darajasi</span>
              <span className="text-xs text-muted-foreground">Material sifati va ish narxi</span>
            </div>
            <div className="grid grid-cols-3 border border-foreground" role="radiogroup">
              {(Object.keys(TIER_LABELS) as Tier[]).map((tier, i) => {
                const active = input.tier === tier
                return (
                  <label
                    key={tier}
                    className={`flex cursor-pointer items-center justify-center py-2.5 font-heading text-sm font-medium transition-colors ${
                      i > 0 ? 'border-l border-foreground' : ''
                    } ${active ? 'bg-foreground text-primary-foreground' : 'hover:bg-secondary'}`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={tier}
                      checked={active}
                      onChange={() => setTier(tier)}
                      className="sr-only"
                    />
                    {TIER_LABELS[tier]}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-foreground p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Hisoblangan maydon</span>
              <span className="font-heading tabular text-lg font-semibold">
                {formatNum(result.floorArea, 2)} m² pol · {formatNum(result.wallArea, 1)} m² devor
              </span>
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center bg-accent px-6 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#d4551f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Hisoblashni boshlash
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
