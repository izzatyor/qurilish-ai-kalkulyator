'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/final-cta'
import { DimensionDivider } from '@/components/dimension-divider'
import { useAuth } from '@/components/auth-context'
import { deleteCalculation, getMyCalculations, type SavedCalculation } from '@/lib/calculations'
import { TIER_LABELS, formatNum, formatUZS } from '@/lib/estimate'

export default function TarixPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<SavedCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/kirish')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    getMyCalculations()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id: string) => {
    const prev = items
    setItems((s) => s.filter((i) => i.id !== id))
    try {
      await deleteCalculation(id)
    } catch (e) {
      console.error(e)
      setItems(prev)
    }
  }

  if (authLoading || !user) {
    return null
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Mening smetalarim</h1>
        <p className="mt-2 text-muted-foreground">Saqlangan hisob-kitoblaringiz ro‘yxati.</p>

        <div className="mt-10">
          <DimensionDivider label="Tarix" note={`${items.length} ta smeta`} />
        </div>

        <div className="mt-8">
          {loading && <p className="text-sm text-muted-foreground">Yuklanmoqda…</p>}
          {error && <p className="text-sm text-accent">Xatolik: {error}</p>}

          {!loading && items.length === 0 && (
            <div className="border border-dashed border-border p-10 text-center text-muted-foreground">
              Hali hech qanday smeta saqlanmagan. Kalkulyatorda hisoblab, "Saqlash" tugmasini bosing.
            </div>
          )}

          <ul className="flex flex-col gap-4">
            {items.map((c) => (
              <li key={c.id} className="border border-foreground p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-lg font-semibold">
                      {formatNum(c.room_width, 1)} × {formatNum(c.room_length, 1)} × {formatNum(c.room_height, 1)} m
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {TIER_LABELS[c.tier as keyof typeof TIER_LABELS] ?? c.tier} ·{' '}
                      {new Date(c.created_at).toLocaleDateString('uz-UZ', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-xl font-bold text-accent">{formatUZS(c.total_budget)}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      aria-label="O‘chirish"
                      className="border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
