import { Ruler, Cpu, ClipboardList, Hammer } from 'lucide-react'

const STEPS = [
  {
    icon: Ruler,
    title: 'O‘lchang',
    text: 'Xonaning kengligi, uzunligi va balandligini kiriting. Eshik va derazalar avtomatik hisobga olinadi.',
  },
  {
    icon: Cpu,
    title: 'AI tahlil qiladi',
    text: 'Model devor va pol maydonini, material sarfini va zaxirani texnik me‘yorlar asosida hisoblaydi.',
  },
  {
    icon: ClipboardList,
    title: 'Smeta oling',
    text: 'Materiallar ro‘yxati, ish haqi va umumiy byudjet — bir jadvalda, joriy bozor narxlarida.',
  },
  {
    icon: Hammer,
    title: 'Ishga tushiring',
    text: 'PDF smetani ustaga yuboring yoki do‘konga olib boring — ortiqcha xarid qilmaysiz.',
  },
]

export function HowItWorks() {
  return (
    <section id="qanday" className="scroll-mt-14">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              O‘lchovdan smetagacha
            </h2>
            <p className="text-pretty leading-relaxed text-foreground/80">
              Chizmadagi har bir chiziq kabi — hisob-kitob ham aniq va tekshiriladigan bo‘lishi kerak.
              Jarayon to‘rt bosqichdan iborat.
            </p>
          </div>

          <ol className="grid border-t border-foreground sm:grid-cols-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <li
                  key={s.title}
                  className={`flex flex-col gap-4 border-b border-border py-6 ${
                    i % 2 === 0 ? 'sm:border-r sm:pr-8' : 'sm:pl-8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-wood" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-heading tabular text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, '0')} / 04
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/75">{s.text}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
