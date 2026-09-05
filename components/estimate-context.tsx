'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { estimate, type Estimate, type RoomInput, type Tier } from '@/lib/estimate'

interface EstimateContextValue {
  input: RoomInput
  result: Estimate
  setDimension: (key: 'width' | 'length' | 'height', value: number) => void
  setTier: (tier: Tier) => void
}

const EstimateContext = createContext<EstimateContextValue | null>(null)

const DEFAULT_INPUT: RoomInput = { width: 4.2, length: 3.5, height: 2.8, tier: 'standart' }

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<RoomInput>(DEFAULT_INPUT)

  const value = useMemo<EstimateContextValue>(
    () => ({
      input,
      result: estimate(input),
      setDimension: (key, v) => setInput((s) => ({ ...s, [key]: v })),
      setTier: (tier) => setInput((s) => ({ ...s, tier })),
    }),
    [input],
  )

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>
}

export function useEstimate() {
  const ctx = useContext(EstimateContext)
  if (!ctx) throw new Error('useEstimate must be used inside EstimateProvider')
  return ctx
}
