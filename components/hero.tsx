'use client'

import { ArrowDown } from 'lucide-react'
import { RoomDiagram } from '@/components/room-diagram'
import { useEstimate } from '@/components/estimate-context'
import { formatNum, formatUZS } from '@/lib/estimate'

export function Hero() {
  const { result, input } = useEstimate()

  return (
    <section className="bg-grid border-b border-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:py-20">
        {/* Copy */}
        <div className="flex flex-col justify-center gap-8">
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-8 bg-foreground" aria-hidden="true" />
            Sun‘iy intellekt asosidagi smeta
          </p>

          <h1 className="text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Ta‘mirlash narxini
            <br />
            <span className="text-accent">chizmadek aniq</span>
            <br />
            hisoblang
          </h1>

          <p className="max-w-md text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
            Xona o‘lchamlarini kiriting — dastur zarur materiallar miqdorini, ishchi kuchi
            narxini va umumiy byudjetni Toshkent va viloyatlar bozor narxlarida hisoblab beradi.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#kalkulyator"
              className="inline-flex h-12 items-center justify-center gap-2 bg-accent px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-[#d4551f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Hisoblashni boshlash
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-sm text-muted-foreground">Ro‘yxatdan o‘tish shart emas · 30 soniya</span>
          </div>

          {/* Live readout — technical measurements */}
          <dl className="grid grid-cols-3 border-t border-foreground pt-5">
            <div className="flex flex-col gap-1 border-r border-border pr-4">
              <dt className="text-xs text-muted-foreground">Pol maydoni</dt>
              <dd className="font-heading tabular text-xl font-semibold sm:text-2xl">
                {formatNum(result.floorArea, 2)} <span className="text-sm font-medium text-muted-foreground">m²</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-r border-border px-4">
              <dt className="text-xs text-muted-foreground">Devor maydoni</dt>
              <dd className="font-heading tabular text-xl font-semibold sm:text-2xl">
                {formatNum(result.wallArea, 1)} <span className="text-sm font-medium text-muted-foreground">m²</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 pl-4">
              <dt className="text-xs text-muted-foreground">Taxminiy byudjet</dt>
              <dd className="font-heading tabular text-xl font-semibold text-accent sm:text-2xl">
                {formatNum(result.total / 1_000_000, 1)}{' '}
                <span className="text-sm font-medium text-muted-foreground">mln so‘m</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Drawing */}
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between border-b border-foreground pb-2 text-xs text-muted-foreground">
            <span>
              Plan · {formatNum(input.width, 1)} m × {formatNum(input.length, 1)} m
            </span>
            <span className="tabular">{formatUZS(result.total)}</span>
          </div>
          <div className="border border-t-0 border-foreground bg-background/60 p-3 sm:p-5">
            <RoomDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}
