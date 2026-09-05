import Link from 'next/link'
import { Ruler } from 'lucide-react'
import { AuthStatus } from '@/components/auth-status'

export function SiteHeader() {
  return (
    <header className="border-b border-foreground bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center border border-foreground text-wood">
            <Ruler className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">Smeta AI</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">— O‘zbekiston</span>
        </Link>

        <nav aria-label="Asosiy" className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/#kalkulyator" className="text-foreground/80 transition-colors hover:text-foreground">
            Kalkulyator
          </Link>
          <Link href="/materiallar" className="text-foreground/80 transition-colors hover:text-foreground">
            Materiallar
          </Link>
          <Link href="/#qanday" className="text-foreground/80 transition-colors hover:text-foreground">
            Qanday ishlaydi
          </Link>
        </nav>

        <AuthStatus />
      </div>
    </header>
  )
}
