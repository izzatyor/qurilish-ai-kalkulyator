import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/final-cta'
import { MaterialsCatalog } from '@/components/materials-catalog'
import { CATEGORY_ORDER, getMaterials } from '@/lib/materials'

export const metadata: Metadata = {
  title: 'Materiallar katalogi — Smeta AI',
  description:
    'Qurilish va ta‘mirlash materiallari: laminat, plitka, bo‘yoq, shpaklyovka va boshqalar. Birlik narxlari, sarf me‘yorlari va tavsiflar.',
}

export default async function MateriallarPage() {
  const materials = await getMaterials()

  return (
    <>
      <SiteHeader />
      <main>
        {/* Sheet header */}
        <section className="bg-grid border-b border-foreground">
          <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 lg:pb-16 lg:pt-16">
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Varaq M-01 · Materiallar spetsifikatsiyasi
            </p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <h1 className="text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Qurilish materiallari va ularning narxlari
              </h1>
              <p className="max-w-md text-pretty leading-relaxed text-foreground/80">
                Toshkent bozoridagi 2026-yil sentabr narxlari, «Standart» toifasi uchun. Sarf me‘yorlari va yo‘qotish
                foizlari hisob-kitobda avtomatik qo‘llaniladi.
              </p>
            </div>

            {/* Sheet data strip */}
            <dl className="mt-10 grid grid-cols-2 border border-foreground sm:grid-cols-4">
              <Stat label="Pozitsiyalar" value={String(materials.length)} />
              <Stat label="Bo‘limlar" value={String(CATEGORY_ORDER.length)} />
              <Stat label="Yangilangan" value="05.09.2026" />
              <Stat label="Valyuta" value="so‘m" last />
            </dl>
          </div>
        </section>

        <div className="pt-12">
          <MaterialsCatalog materials={materials} />
        </div>

        {/* Bottom CTA */}
        <section className="mt-16 border-t border-foreground bg-primary text-primary-foreground">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">Xonangiz uchun aniq miqdorni hisoblang</h2>
              <p className="mt-2 text-primary-foreground/70">
                O‘lchamlarni kiriting — kalkulyator har bir materialdan qancha kerakligini ko‘rsatadi.
              </p>
            </div>
            <Link
              href="/#kalkulyator"
              className="inline-flex h-12 shrink-0 items-center gap-2 bg-accent px-6 font-heading font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Hisoblashni boshlash
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function Stat({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 px-4 py-3 ${last ? '' : 'border-r border-foreground'} [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r max-sm:[&:nth-child(-n+2)]:border-b`}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="tabular font-heading text-lg font-semibold">{value}</dd>
    </div>
  )
}
