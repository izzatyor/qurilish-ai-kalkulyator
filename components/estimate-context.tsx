'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import {
  combineWithCustom,
  DEFAULT_PRICES,
  DEFAULT_ROOM_INPUT,
  estimate,
  type CustomMaterial,
  type Estimate,
  type PriceMap,
  type QtyOverrides,
  type RoomInput,
  type Tier,
} from '@/lib/estimate'

type NumericField =
  | 'width'
  | 'length'
  | 'height'
  | 'doorCount'
  | 'doorWidth'
  | 'doorHeight'
  | 'windowCount'
  | 'windowWidth'
  | 'windowHeight'

interface EstimateContextValue {
  input: RoomInput
  result: Estimate
  setDimension: (key: NumericField, value: number) => void
  setTier: (tier: Tier) => void
  /** Narxlar Supabase'dan hali yuklanayotgan bo'lsa true (statik defaultlar ishlatiladi) */
  pricesLoading: boolean
  /** Material ro'yxatdan olib tashlangan/qaytarilganda chaqiriladi (masalan mijozda allaqachon bor bo'lsa) */
  toggleMaterial: (id: string) => void
  /** Materialning avtomatik hisoblangan miqdorini qo'lda o'zgartirish */
  setQty: (id: string, qty: number) => void
  /** Miqdorni qayta avtomatik hisoblashga qaytarish */
  resetQty: (id: string) => void
  /** Ro'yxatda yo'q materialni qo'lda qo'shish */
  addCustomMaterial: (data: Omit<CustomMaterial, 'id'>) => void
  /** Qo'lda qo'shilgan materialning miqdori yoki narxini yangilash */
  updateCustomMaterial: (id: string, patch: Partial<Omit<CustomMaterial, 'id'>>) => void
  /** Qo'lda qo'shilgan materialni ro'yxatdan butunlay o'chirish */
  removeCustomMaterial: (id: string) => void
}

const EstimateContext = createContext<EstimateContextValue | null>(null)

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<RoomInput>(DEFAULT_ROOM_INPUT)
  const [excludedIds, setExcludedIds] = useState<string[]>([])
  const [qtyOverrides, setQtyOverrides] = useState<QtyOverrides>({})
  const [customMaterials, setCustomMaterials] = useState<CustomMaterial[]>([])
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
          console.error("Supabase'dan narxlarni olishda xatolik, statik narxlar ishlatilmoqda:", error?.message)
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

  const value = useMemo<EstimateContextValue>(() => {
    const base = estimate(input, prices, excludedIds, qtyOverrides)
    const result = combineWithCustom(base, customMaterials, excludedIds)

    return {
      input,
      result,
      setDimension: (key, v) => setInput((s) => ({ ...s, [key]: v })),
      setTier: (tier) => setInput((s) => ({ ...s, tier })),
      pricesLoading,
      toggleMaterial: (id) =>
        setExcludedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      setQty: (id, qty) => setQtyOverrides((prev) => ({ ...prev, [id]: qty })),
      resetQty: (id) =>
        setQtyOverrides((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        }),
      addCustomMaterial: (data) =>
        setCustomMaterials((prev) => [
          ...prev,
          { ...data, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ]),
      updateCustomMaterial: (id, patch) =>
        setCustomMaterials((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      removeCustomMaterial: (id) => setCustomMaterials((prev) => prev.filter((c) => c.id !== id)),
    }
  }, [input, prices, pricesLoading, excludedIds, qtyOverrides, customMaterials])

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>
}

export function useEstimate() {
  const ctx = useContext(EstimateContext)
  if (!ctx) throw new Error('useEstimate must be used inside EstimateProvider')
  return ctx
}
