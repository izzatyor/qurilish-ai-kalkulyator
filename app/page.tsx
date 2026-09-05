import { EstimateProvider } from '@/components/estimate-context'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Calculator } from '@/components/calculator'
import { BudgetBreakdown } from '@/components/budget-breakdown'
import { HowItWorks } from '@/components/how-it-works'
import { FinalCta, SiteFooter } from '@/components/final-cta'
import { DimensionDivider } from '@/components/dimension-divider'

export default function Page() {
  return (
    <EstimateProvider>
      <SiteHeader />
      <main>
        <Hero />
        <div className="pt-8">
          <DimensionDivider label="01 · Kirish ma‘lumotlari" note="A × B × H" />
        </div>
        <Calculator />
        <div className="pb-8">
          <DimensionDivider label="02 · Hisob-kitob" note="m² → so‘m" />
        </div>
        <BudgetBreakdown />
        <div className="pt-8">
          <DimensionDivider label="03 · Jarayon" />
        </div>
        <HowItWorks />
        <FinalCta />
      </main>
      <SiteFooter />
    </EstimateProvider>
  )
}
