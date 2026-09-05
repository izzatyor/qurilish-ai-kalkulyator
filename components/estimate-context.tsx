'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { DEFAULT_PRICES, estimate, type Estimate, type PriceMap, type RoomInput, type Tier } from '@/lib/estimate'

interface EstimateContextValue {
  input: RoomInput
  result: Estimate
  setDimension: (key: 'width' | 'length' | 'height', value: number) => void
  setTier: (tier: Tier) => void
  /** Narxlar Supabase'dan hali yuklanayotgan bo'lsa true (statik defaultlar ishlatiladi) */
  pricesLoading: boolean
  /** Material ro'yxatdan olib tashlangan/qaytarilganda chaqiriladi (masalan mijozda allaqachon bor bo'lsa) */
  toggleMaterial: (id: string) => void
}

const EstimateContext = createContext<EstimateContextValue | null>(null)

const DEFAULT_INPUT: RoomInput = { width: 4.2, length: 3.5, height: 2.8, tier: 'standart' }

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<RoomInput>(DEFAULT_INPUT)
  const [excludedIds, setExcludedIds] = useState<string[]>([])
  // Sahifa ochilganda avval statik narxlar bilan ishlaymiz (kalkulyator darhol
  // ko'rinadi), keyin fonda Supabase'dan haqiqiy narxlarni olib, ularni almashtiramiz.
  const [prices, setPrices] = useState<PriceMap>(DEFAULT_PRICES)
  const [pricesLoading, setPricesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('materials')
      .select('id, price')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data || data.length === 0) {
          console.error('Supabase\'dan narxlarni olishda xatolik, statik narxlar ishlatilmoqda:', error?.message)
          setPricesLoading(false)
          return
        }
        const fresh: PriceMap = Object.fromEntries(data.map((m) => [m.id, m.price]))
        setPrices((prev) => ({ ...prev, ...fresh }))
        setPricesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<EstimateContextValue>(
    () => ({
      input,
      result: estimate(input, prices, excludedIds),
      setDimension: (key, v) => setInput((s) => ({ ...s, [key]: v })),
      setTier: (tier) => setInput((s) => ({ ...s, tier })),
      pricesLoading,
      toggleMaterial: (id) =>
        setExcludedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    }),
    [input, prices, pricesLoading, excludedIds],
  )

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>
}

export function useEstimate() {
  const ctx = useContext(EstimateContext)
  if (!ctx) throw new Error('useEstimate must be used inside EstimateProvider')
  return ctx
}
