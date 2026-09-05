export function FinalCta() {
  return (
    <section className="border-y border-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="flex flex-col gap-4">
          <h2 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Ta‘mirni taxmin bilan emas,
            <br />
            hisob bilan boshlang
          </h2>
          <p className="max-w-lg text-pretty leading-relaxed text-foreground/80">
            Bepul, ro‘yxatdan o‘tishsiz. O‘zbekiston bo‘yicha 12 000+ smeta shu kalkulyator yordamida tuzilgan.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#kalkulyator"
            className="inline-flex h-12 items-center justify-center bg-accent px-7 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-[#d4551f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Hisoblashni boshlash
          </a>
          <a
            href="#qanday"
            className="inline-flex h-12 items-center justify-center border border-foreground px-7 font-heading text-base font-medium transition-colors hover:bg-foreground hover:text-primary-foreground"
          >
            Qanday ishlaydi
          </a>
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-[1fr_auto_auto] md:items-start">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-base font-semibold">Smeta AI</span>
          <p className="max-w-xs text-primary-foreground/70">
            Ta‘mirlash va qurilish xarajatlarini hisoblash uchun sun‘iy intellekt vositasi. Toshkent, O‘zbekiston.
          </p>
        </div>
        <nav aria-label="Pastki menyu" className="flex flex-col gap-2 text-primary-foreground/80">
          <a href="/#kalkulyator" className="hover:text-primary-foreground">
            Kalkulyator
          </a>
          <a href="/materiallar" className="hover:text-primary-foreground">
            Materiallar
          </a>
          <a href="/#qanday" className="hover:text-primary-foreground">
            Qanday ishlaydi
          </a>
        </nav>
        <div className="flex flex-col gap-2 text-primary-foreground/80">
          <a href="mailto:salom@smeta.uz" className="hover:text-primary-foreground">
            salom@smeta.uz
          </a>
          <a href="tel:+998712000000" className="tabular hover:text-primary-foreground">
            +998 71 200 00 00
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:justify-between">
          <span>© 2026 Smeta AI. Narxlar ma‘lumot uchun, yakuniy smeta usta bilan kelishiladi.</span>
          <span className="tabular">Varaq A-01 · Masshtab 1:50 · Rev. 03</span>
        </div>
      </div>
    </footer>
  )
}
