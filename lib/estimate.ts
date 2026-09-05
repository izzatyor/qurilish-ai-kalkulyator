import { MATERIALS } from '@/lib/materials'

export type Tier = 'ekonom' | 'standart' | 'premium'

export interface RoomInput {
  width: number // m
  length: number // m
  height: number // m
  tier: Tier
}

export interface MaterialLine {
  name: string
  spec: string
  qty: number
  unit: string
  unitPrice: number
  total: number
}

export interface Estimate {
  floorArea: number
  wallArea: number
  ceilingArea: number
  perimeter: number
  materials: MaterialLine[]
  materialsTotal: number
  labor: number
  reserve: number
  total: number
}

const DOOR = { w: 0.9, h: 2.1 }
const WINDOW = { w: 1.5, h: 1.4 }

/**
 * Har bir tier (daraja) uchun qaysi pol qoplamasi ID'si ishlatilishi va
 * ish haqi/narx koeffitsienti. Narxning o'zi endi shu yerda emas —
 * PriceMap orqali (Supabase materials jadvalidan) olinadi.
 */
const TIERS: Record<Tier, { label: string; priceFactor: number; laborPerM2: number; floorId: string; floorName: string }> = {
  ekonom: { label: 'Ekonom', priceFactor: 0.8, laborPerM2: 160_000, floorId: 'linoleum', floorName: 'Linoleum 2.5 mm' },
  standart: { label: 'Standart', priceFactor: 1, laborPerM2: 230_000, floorId: 'laminat', floorName: 'Laminat 32-klass' },
  premium: { label: 'Premium', priceFactor: 1.55, laborPerM2: 360_000, floorId: 'parket', floorName: 'Parket taxta' },
}

export const TIER_LABELS = Object.fromEntries(
  Object.entries(TIERS).map(([k, v]) => [k, v.label]),
) as Record<Tier, string>

/** Material ID -> birlik narxi (standart tier uchun so'mda). */
export type PriceMap = Record<string, number>

/**
 * Statik MATERIALS ro'yxatidan yasalgan standart narxlar.
 * Supabase'dan narx olishning iloji bo'lmasa (masalan tarmoq xatosi),
 * kalkulyator shu narxlar bilan ishlashda davom etadi.
 */
export const DEFAULT_PRICES: PriceMap = Object.fromEntries(MATERIALS.map((m) => [m.id, m.price]))

const roundTo = (n: number, step: number) => Math.round(n / step) * step
const ceil = (n: number) => Math.ceil(n - 1e-9)

export function estimate(input: RoomInput, prices: PriceMap = DEFAULT_PRICES): Estimate {
  const w = clamp(input.width, 1, 30)
  const l = clamp(input.length, 1, 30)
  const h = clamp(input.height, 2, 6)
  const tier = TIERS[input.tier]
  const f = tier.priceFactor

  const floorArea = w * l
  const ceilingArea = floorArea
  const perimeter = 2 * (w + l)
  const wallArea = Math.max(perimeter * h - DOOR.w * DOOR.h - WINDOW.w * WINDOW.h, 0)

  /** Supabase'dan kelgan narx bo'lsa o'shani, bo'lmasa statik defaultni ishlatadi. */
  const priceOf = (id: string) => prices[id] ?? DEFAULT_PRICES[id] ?? 0

  const materials: MaterialLine[] = []
  const add = (id: string, name: string, spec: string, qty: number, unit: string) => {
    const price = roundTo(priceOf(id) * f, 500)
    materials.push({ name, spec, qty, unit, unitPrice: price, total: qty * price })
  }

  // Floor covering with 8% waste allowance
  add(tier.floorId, 'Pol qoplamasi', tier.floorName, ceil(floorArea * 1.08 * 10) / 10, 'm²')
  // Underlay
  add('tagqoplama', 'Tagqoplama', 'Poliuretan 3 mm', ceil(floorArea * 1.05 * 10) / 10, 'm²')
  // Skirting boards, 2.5 m planks
  add('plintus', 'Plintus', 'MDF 80 mm, 2.5 m', ceil((perimeter - DOOR.w) / 2.5), 'dona')
  // Putty: 1.2 kg/m² on walls + ceiling, 25 kg bags
  add('shpaklyovka', 'Shpaklyovka', 'Knauf 25 kg', ceil(((wallArea + ceilingArea) * 1.2) / 25), 'qop')
  // Primer: 0.15 L/m², 10 L cans
  add('gruntovka', 'Gruntovka', 'Chuqur kirib boruvchi, 10 L', ceil(((wallArea + ceilingArea) * 0.15) / 10), 'kanistr')
  // Wall paint: 2 coats, 0.12 L/m² each, 10 L
  add('boyoq-devor', 'Devor bo‘yog‘i', 'Suv-dispersion, 10 L', ceil((wallArea * 0.24) / 10), 'bank')
  // Ceiling paint
  add('boyoq-shift', 'Shift bo‘yog‘i', 'Oq matoviy, 10 L', ceil((ceilingArea * 0.24) / 10), 'bank')
  // Serpyanka / tape for joints, 45 m rolls
  add('serpyanka', 'Serpyanka lenta', '45 m rulon', ceil(perimeter / 45) + 1, 'rulon')

  const materialsTotal = materials.reduce((s, m) => s + m.total, 0)
  const labor = roundTo(floorArea * tier.laborPerM2, 10_000)
  const reserve = roundTo((materialsTotal + labor) * 0.1, 10_000)
  const total = materialsTotal + labor + reserve

  return { floorArea, wallArea, ceilingArea, perimeter, materials, materialsTotal, labor, reserve, total }
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min
  return Math.min(Math.max(n, min), max)
}

export function formatUZS(n: number) {
  return `${Math.round(n).toLocaleString('ru-RU')} so‘m`
}

export function formatNum(n: number, digits = 1) {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: digits })
}
