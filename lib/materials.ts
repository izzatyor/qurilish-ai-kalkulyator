import { supabase } from '@/lib/supabase'

export type MaterialCategory = 'pol' | 'devor' | 'shift' | 'santexnika' | 'elektr' | 'qora'

export interface CatalogMaterial {
  id: string
  name: string
  spec: string
  description: string
  category: MaterialCategory
  unit: string
  /** Standart tier price in so‘m per unit */
  price: number
  /** Typical consumption / coverage note, e.g. "1.08 m²/m²" */
  consumption: string
  /** Common brands or origin on UZ market */
  origin: string
  /** Sheet-style item code */
  code: string
}

export const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  pol: 'Pol qoplamalari',
  devor: 'Devor pardozi',
  shift: 'Shift ishlari',
  santexnika: 'Santexnika',
  elektr: 'Elektr',
  qora: 'Qora ishlar',
}

export const CATEGORY_ORDER: MaterialCategory[] = ['qora', 'pol', 'devor', 'shift', 'elektr', 'santexnika']

export const MATERIALS: CatalogMaterial[] = [
  // ---- Qora ishlar
  {
    id: 'sement',
    code: 'Q-01',
    category: 'qora',
    name: 'Sement',
    spec: 'M400, 50 kg qop',
    description: 'Pol styajkasi, g‘isht terish va suvoq aralashmalari uchun asosiy bog‘lovchi. Quruq joyda saqlanadi.',
    unit: 'qop',
    price: 52_000,
    consumption: '≈ 0.4 qop / m² styajka (5 sm)',
    origin: 'Qizilqumsement, Bekobod',
  },
  {
    id: 'qum',
    code: 'Q-02',
    category: 'qora',
    name: 'Qum',
    spec: 'Yuvilgan, daryo qumi',
    description: 'Sement bilan 1:3 nisbatda styajka va suvoq uchun. Toza, loysiz bo‘lishi shart.',
    unit: 'm³',
    price: 180_000,
    consumption: '≈ 0.05 m³ / m² styajka',
    origin: 'Chirchiq, Ohangaron',
  },
  {
    id: 'gipsokarton',
    code: 'Q-03',
    category: 'qora',
    name: 'Gipsokarton',
    spec: '12.5 mm, 1200 × 2500 mm',
    description: 'Devorlarni tekislash va ariq-shift (potolok) konstruksiyalari uchun list. Namlik uchun yashil turi mavjud.',
    unit: 'list',
    price: 78_000,
    consumption: '1 list = 3 m²',
    origin: 'Knauf, Volma',
  },
  {
    id: 'profil',
    code: 'Q-04',
    category: 'qora',
    name: 'Metall profil',
    spec: 'CD 60 × 27, 3 m',
    description: 'Gipsokarton karkasi uchun rux qoplamali profil. Har 60 sm da o‘rnatiladi.',
    unit: 'dona',
    price: 24_000,
    consumption: '≈ 2 dona / m² shift',
    origin: 'Mahalliy, Rossiya',
  },

  // ---- Pol
  {
    id: 'laminat',
    code: 'P-01',
    category: 'pol',
    name: 'Laminat',
    spec: '32-klass, 8 mm, AC4',
    description: 'Yashash xonalari uchun optimal tanlov. Chizilishga bardoshli, oson yig‘iladi. Kesish yo‘qotmasi 8 %.',
    unit: 'm²',
    price: 98_000,
    consumption: '1.08 m² / m² pol',
    origin: 'Kronospan, Tarkett, Floorpan',
  },
  {
    id: 'parket',
    code: 'P-02',
    category: 'pol',
    name: 'Parket taxta',
    spec: 'Eman, 14 mm, 3 qatlam',
    description: 'Tabiiy yog‘och yuza, laklangan. Issiq va uzoq muddatli, lekin namlikka sezgir.',
    unit: 'm²',
    price: 240_000,
    consumption: '1.10 m² / m² pol',
    origin: 'Barlinek, Coswick',
  },
  {
    id: 'linoleum',
    code: 'P-03',
    category: 'pol',
    name: 'Linoleum',
    spec: 'Yarim tijorat, 2.5 mm',
    description: 'Ekonom variant: namlikka chidamli, oshxona va yo‘lak uchun qulay. Rulon eni 3–4 m.',
    unit: 'm²',
    price: 62_000,
    consumption: '1.05 m² / m² pol',
    origin: 'Tarkett, Juteks',
  },
  {
    id: 'plitka-pol',
    code: 'P-04',
    category: 'pol',
    name: 'Pol plitkasi',
    spec: 'Keramogranit 600 × 600, R10',
    description: 'Hammom, oshxona va yo‘lak uchun. Sirpanmaydigan yuza (R10). Kesish yo‘qotmasi 10–12 %.',
    unit: 'm²',
    price: 145_000,
    consumption: '1.12 m² / m² pol',
    origin: 'Angren Keramika, Kerama Marazzi',
  },
  {
    id: 'tagqoplama',
    code: 'P-05',
    category: 'pol',
    name: 'Tagqoplama',
    spec: 'Poliuretan, 3 mm',
    description: 'Laminat va parket ostiga tovush va issiqlik izolyatsiyasi. Mayda notekisliklarni yashiradi.',
    unit: 'm²',
    price: 9_000,
    consumption: '1.05 m² / m² pol',
    origin: 'Mahalliy, Turkiya',
  },
  {
    id: 'plintus',
    code: 'P-06',
    category: 'pol',
    name: 'Plintus',
    spec: 'MDF, 80 mm, 2.5 m',
    description: 'Pol va devor tutashuvini yopadi. Kabel kanali bilan variantlar mavjud. Rang laminatga moslanadi.',
    unit: 'dona',
    price: 38_000,
    consumption: 'Perimetr ÷ 2.5 m',
    origin: 'Arbiton, Deconika',
  },
  {
    id: 'plitka-yelim',
    code: 'P-07',
    category: 'pol',
    name: 'Plitka yelimi',
    spec: 'C1, 25 kg',
    description: 'Keramogranit va keramika uchun sementli yelim. Katta formatli plitka uchun C2 tavsiya etiladi.',
    unit: 'qop',
    price: 45_000,
    consumption: '≈ 5 kg / m² (0.2 qop)',
    origin: 'Ceresit, Knauf, Mahalliy',
  },

  // ---- Devor
  {
    id: 'shpaklyovka',
    code: 'D-01',
    category: 'devor',
    name: 'Shpaklyovka',
    spec: 'Gips asosli, 25 kg',
    description: 'Devor va shiftni bo‘yashdan oldin silliqlash. Start (yirik) va finish (mayda) turlari mavjud.',
    unit: 'qop',
    price: 68_000,
    consumption: '1.2 kg / m² (2 qatlam)',
    origin: 'Knauf Rotband, Volma',
  },
  {
    id: 'gruntovka',
    code: 'D-02',
    category: 'devor',
    name: 'Gruntovka',
    spec: 'Chuqur kirib boruvchi, 10 L',
    description: 'Yuzani mustahkamlaydi va bo‘yoq/yelim sarfini kamaytiradi. Har qatlamdan oldin qo‘llaniladi.',
    unit: 'kanistr',
    price: 125_000,
    consumption: '0.15 L / m²',
    origin: 'Ceresit CT17, Tikkurila',
  },
  {
    id: 'boyoq-devor',
    code: 'D-03',
    category: 'devor',
    name: 'Devor bo‘yog‘i',
    spec: 'Suv-dispersion, yuviladigan, 10 L',
    description: 'Matoviy yoki yarim matoviy. Yuviladigan turi bolalar xonasi va oshxona uchun. 2 qatlam kerak.',
    unit: 'bank',
    price: 290_000,
    consumption: '0.12 L / m² × 2 qatlam',
    origin: 'Dulux, Tikkurila, Alpina',
  },
  {
    id: 'oboi',
    code: 'D-04',
    category: 'devor',
    name: 'Gulqog‘oz (oboi)',
    spec: 'Vinil, flizelin asosli, 1.06 × 10 m',
    description: 'Bo‘yoqqa alternativa. Flizelin asos yelimni devorga surtishga imkon beradi. Naqsh mosligini hisobga oling.',
    unit: 'rulon',
    price: 185_000,
    consumption: '1 rulon ≈ 5 m² devor',
    origin: 'Erismann, AS Creation',
  },
  {
    id: 'plitka-devor',
    code: 'D-05',
    category: 'devor',
    name: 'Devor plitkasi',
    spec: 'Keramika 300 × 600, glazur',
    description: 'Hammom va oshxona fartugi uchun. Kesish yo‘qotmasi 10 %. Fuga rangi alohida tanlanadi.',
    unit: 'm²',
    price: 120_000,
    consumption: '1.10 m² / m² devor',
    origin: 'Angren Keramika, Cersanit',
  },
  {
    id: 'serpyanka',
    code: 'D-06',
    category: 'devor',
    name: 'Serpyanka lenta',
    spec: 'Shisha tola, 50 mm × 45 m',
    description: 'Gipsokarton choklari va yoriqlarni mustahkamlash uchun yopishqoq to‘r lenta.',
    unit: 'rulon',
    price: 14_000,
    consumption: 'Chok uzunligi ÷ 45 m',
    origin: 'Mahalliy, Xitoy',
  },

  // ---- Shift
  {
    id: 'boyoq-shift',
    code: 'S-01',
    category: 'shift',
    name: 'Shift bo‘yog‘i',
    spec: 'Oq, chuqur matoviy, 10 L',
    description: 'Yorug‘lik aksini kamaytiradigan matoviy bo‘yoq. Shift notekisliklarini yashiradi.',
    unit: 'bank',
    price: 260_000,
    consumption: '0.12 L / m² × 2 qatlam',
    origin: 'Dulux, Alpina',
  },
  {
    id: 'natyajnoy',
    code: 'S-02',
    category: 'shift',
    name: 'Tortma shift',
    spec: 'PVX, matoviy, o‘rnatish bilan',
    description: 'Tez o‘rnatiladi (1 kun), suv o‘tkazmaydi. Narxga material va o‘rnatish kiradi.',
    unit: 'm²',
    price: 110_000,
    consumption: '1.0 m² / m² shift',
    origin: 'MSD, Pongs',
  },

  // ---- Elektr
  {
    id: 'kabel',
    code: 'E-01',
    category: 'elektr',
    name: 'Kabel',
    spec: 'VVGnG 3 × 2.5 mm², mis',
    description: 'Rozetka liniyalari uchun. Yoritish uchun 3 × 1.5 mm² yetarli. Yonmaydigan izolyatsiya.',
    unit: 'm',
    price: 14_500,
    consumption: '≈ 8–10 m / m² xona',
    origin: 'Uzkabel, Andijan Kabel',
  },
  {
    id: 'rozetka',
    code: 'E-02',
    category: 'elektr',
    name: 'Rozetka',
    spec: 'Yerlangan, 16 A, ichki',
    description: 'Podrozetnik alohida (4 000 so‘m). Oshxonada har 60 sm ish yuzasiga 1 dona tavsiya etiladi.',
    unit: 'dona',
    price: 32_000,
    consumption: '≈ 1 dona / 3 m² xona',
    origin: 'Schneider, Legrand, Viko',
  },
  {
    id: 'avtomat',
    code: 'E-03',
    category: 'elektr',
    name: 'Avtomat',
    spec: 'C16, 1P, 6 kA',
    description: 'Har bir liniya uchun alohida avtomat. Rozetkalarga C16, yoritishga C10.',
    unit: 'dona',
    price: 48_000,
    consumption: '1 dona / liniya',
    origin: 'Schneider, ABB, IEK',
  },

  // ---- Santexnika
  {
    id: 'truba-pp',
    code: 'T-01',
    category: 'santexnika',
    name: 'Polipropilen truba',
    spec: 'PN20, Ø 20 mm, 4 m',
    description: 'Issiq va sovuq suv uchun. Payvandlab ulanadi. Isitish uchun armirlangan PN25 tavsiya etiladi.',
    unit: 'dona',
    price: 42_000,
    consumption: 'Trassa uzunligi ÷ 4 m',
    origin: 'Valtec, Kalde, Mahalliy',
  },
  {
    id: 'gidroizol',
    code: 'T-02',
    category: 'santexnika',
    name: 'Gidroizolyatsiya',
    spec: 'Polimer mastika, 7 kg',
    description: 'Hammom poli va devorlarning pastki 20 sm qismiga 2 qatlam. Plitka ostidan suv o‘tishini oldini oladi.',
    unit: 'chelak',
    price: 220_000,
    consumption: '1.5 kg / m² (2 qatlam)',
    origin: 'Ceresit CL51, Knauf Flächendicht',
  },
  {
    id: 'smesitel',
    code: 'T-03',
    category: 'santexnika',
    name: 'Smesitel',
    spec: 'Bir richagli, keramik kartridj',
    description: 'Oshxona yoki hammom uchun. Keramik kartridj 5–7 yil xizmat qiladi. Xrom qoplama.',
    unit: 'dona',
    price: 380_000,
    consumption: '1 dona / nuqta',
    origin: 'Grohe, Lemark, Frap',
  },
]

/**
 * Materiallarni Supabase database'dan oladi.
 * Agar so'rov muvaffaqiyatsiz bo'lsa (masalan, internet yo'q yoki
 * database vaqtincha ishlamayotgan bo'lsa), yuqoridagi statik MATERIALS
 * ro'yxatiga qaytadi — shunda sahifa hech qachon bo'sh chiqmaydi.
 */
export async function getMaterials(): Promise<CatalogMaterial[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('id, code, category, name, spec, description, unit, price, consumption, origin')
    .order('code', { ascending: true })

  if (error || !data || data.length === 0) {
    console.error('Supabase\'dan materiallarni olishda xatolik, statik ro\'yxat ishlatilmoqda:', error?.message)
    return MATERIALS
  }

  return data as CatalogMaterial[]
}
