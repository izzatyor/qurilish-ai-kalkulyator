-- ============================================================
-- 1) Eski, Supabase Auth bilan mos kelmaydigan jadvallarni tuzatish
-- ============================================================

-- Eski "users" jadvali endi kerak emas — Supabase Auth
-- foydalanuvchilarni o'zining "auth.users" jadvalida saqlaydi.
DROP TABLE IF EXISTS calculations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Yangi calculations jadvali: user_id endi Supabase Auth'ning
-- haqiqiy foydalanuvchi ID'siga (UUID) bog'langan.
CREATE TABLE calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_width NUMERIC NOT NULL,
    room_length NUMERIC NOT NULL,
    room_height NUMERIC NOT NULL,
    tier VARCHAR(20) NOT NULL,
    materials_result JSONB NOT NULL,
    total_budget NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2) Xavfsizlik: Row Level Security (RLS)
-- Bu shuni ta'minlaydi: har bir foydalanuvchi FAQAT o'zining
-- hisob-kitoblarini ko'ra oladi, boshqalarnikini emas.
-- ============================================================

ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "O'z hisob-kitobini ko'rish"
  ON calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "O'z hisob-kitobini qo'shish"
  ON calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "O'z hisob-kitobini o'chirish"
  ON calculations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3) Materiallar jadvali — hammaga ochiq o'qish uchun RLS
-- (Bu jadval maxfiy emas, katalog sifatida hamma ko'rishi kerak)
-- ============================================================

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materiallarni hamma ko'ra oladi"
  ON materials FOR SELECT
  USING (true);
