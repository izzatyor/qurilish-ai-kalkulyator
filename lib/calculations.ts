import { supabase } from '@/lib/supabase'
import type { Estimate, RoomInput } from '@/lib/estimate'

export interface SavedCalculation {
  id: string
  user_id: string
  room_width: number
  room_length: number
  room_height: number
  tier: string
  materials_result: Estimate
  total_budget: number
  created_at: string
}

/**
 * Hisob-kitobni joriy foydalanuvchi nomidan Supabase'ga saqlaydi.
 * RLS (Row Level Security) tufayli foydalanuvchi faqat o'zi uchun yoza oladi.
 */
export async function saveCalculation(userId: string, input: RoomInput, result: Estimate) {
  const { data, error } = await supabase
    .from('calculations')
    .insert({
      user_id: userId,
      room_width: input.width,
      room_length: input.length,
      room_height: input.height,
      tier: input.tier,
      materials_result: result,
      total_budget: result.total,
    })
    .select()
    .single()

  if (error) throw error
  return data as SavedCalculation
}

/** Joriy foydalanuvchining barcha saqlangan hisob-kitoblarini oladi (eng yangisi birinchi). */
export async function getMyCalculations(): Promise<SavedCalculation[]> {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SavedCalculation[]
}

export async function deleteCalculation(id: string) {
  const { error } = await supabase.from('calculations').delete().eq('id', id)
  if (error) throw error
}
