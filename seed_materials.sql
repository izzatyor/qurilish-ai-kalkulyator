-- Found 25 materials

-- Yangi materials jadvali (eski jadvalni almashtiradi)
DROP TABLE IF EXISTS materials CASCADE;

CREATE TABLE materials (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    category VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    spec VARCHAR(150),
    description TEXT,
    unit VARCHAR(20),
    price NUMERIC NOT NULL,
    consumption VARCHAR(100),
    origin VARCHAR(150),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO materials (id, code, category, name, spec, description, unit, price, consumption, origin) VALUES
('sement', 'Q-01', 'qora', 'Sement', 'M400, 50 kg qop', 'Pol styajkasi, g‘isht terish va suvoq aralashmalari uchun asosiy bog‘lovchi. Quruq joyda saqlanadi.', 'qop', 52000, '≈ 0.4 qop / m² styajka (5 sm)', 'Qizilqumsement, Bekobod'),
('qum', 'Q-02', 'qora', 'Qum', 'Yuvilgan, daryo qumi', 'Sement bilan 1:3 nisbatda styajka va suvoq uchun. Toza, loysiz bo‘lishi shart.', 'm³', 180000, '≈ 0.05 m³ / m² styajka', 'Chirchiq, Ohangaron'),
('gipsokarton', 'Q-03', 'qora', 'Gipsokarton', '12.5 mm, 1200 × 2500 mm', 'Devorlarni tekislash va ariq-shift (potolok) konstruksiyalari uchun list. Namlik uchun yashil turi mavjud.', 'list', 78000, '1 list = 3 m²', 'Knauf, Volma'),
('profil', 'Q-04', 'qora', 'Metall profil', 'CD 60 × 27, 3 m', 'Gipsokarton karkasi uchun rux qoplamali profil. Har 60 sm da o‘rnatiladi.', 'dona', 24000, '≈ 2 dona / m² shift', 'Mahalliy, Rossiya'),
('laminat', 'P-01', 'pol', 'Laminat', '32-klass, 8 mm, AC4', 'Yashash xonalari uchun optimal tanlov. Chizilishga bardoshli, oson yig‘iladi. Kesish yo‘qotmasi 8 %.', 'm²', 98000, '1.08 m² / m² pol', 'Kronospan, Tarkett, Floorpan'),
('parket', 'P-02', 'pol', 'Parket taxta', 'Eman, 14 mm, 3 qatlam', 'Tabiiy yog‘och yuza, laklangan. Issiq va uzoq muddatli, lekin namlikka sezgir.', 'm²', 240000, '1.10 m² / m² pol', 'Barlinek, Coswick'),
('linoleum', 'P-03', 'pol', 'Linoleum', 'Yarim tijorat, 2.5 mm', 'Ekonom variant: namlikka chidamli, oshxona va yo‘lak uchun qulay. Rulon eni 3–4 m.', 'm²', 62000, '1.05 m² / m² pol', 'Tarkett, Juteks'),
('plitka-pol', 'P-04', 'pol', 'Pol plitkasi', 'Keramogranit 600 × 600, R10', 'Hammom, oshxona va yo‘lak uchun. Sirpanmaydigan yuza (R10). Kesish yo‘qotmasi 10–12 %.', 'm²', 145000, '1.12 m² / m² pol', 'Angren Keramika, Kerama Marazzi'),
('tagqoplama', 'P-05', 'pol', 'Tagqoplama', 'Poliuretan, 3 mm', 'Laminat va parket ostiga tovush va issiqlik izolyatsiyasi. Mayda notekisliklarni yashiradi.', 'm²', 9000, '1.05 m² / m² pol', 'Mahalliy, Turkiya'),
('plintus', 'P-06', 'pol', 'Plintus', 'MDF, 80 mm, 2.5 m', 'Pol va devor tutashuvini yopadi. Kabel kanali bilan variantlar mavjud. Rang laminatga moslanadi.', 'dona', 38000, 'Perimetr ÷ 2.5 m', 'Arbiton, Deconika'),
('plitka-yelim', 'P-07', 'pol', 'Plitka yelimi', 'C1, 25 kg', 'Keramogranit va keramika uchun sementli yelim. Katta formatli plitka uchun C2 tavsiya etiladi.', 'qop', 45000, '≈ 5 kg / m² (0.2 qop)', 'Ceresit, Knauf, Mahalliy'),
('shpaklyovka', 'D-01', 'devor', 'Shpaklyovka', 'Gips asosli, 25 kg', 'Devor va shiftni bo‘yashdan oldin silliqlash. Start (yirik) va finish (mayda) turlari mavjud.', 'qop', 68000, '1.2 kg / m² (2 qatlam)', 'Knauf Rotband, Volma'),
('gruntovka', 'D-02', 'devor', 'Gruntovka', 'Chuqur kirib boruvchi, 10 L', 'Yuzani mustahkamlaydi va bo‘yoq/yelim sarfini kamaytiradi. Har qatlamdan oldin qo‘llaniladi.', 'kanistr', 125000, '0.15 L / m²', 'Ceresit CT17, Tikkurila'),
('boyoq-devor', 'D-03', 'devor', 'Devor bo‘yog‘i', 'Suv-dispersion, yuviladigan, 10 L', 'Matoviy yoki yarim matoviy. Yuviladigan turi bolalar xonasi va oshxona uchun. 2 qatlam kerak.', 'bank', 290000, '0.12 L / m² × 2 qatlam', 'Dulux, Tikkurila, Alpina'),
('oboi', 'D-04', 'devor', 'Gulqog‘oz (oboi)', 'Vinil, flizelin asosli, 1.06 × 10 m', 'Bo‘yoqqa alternativa. Flizelin asos yelimni devorga surtishga imkon beradi. Naqsh mosligini hisobga oling.', 'rulon', 185000, '1 rulon ≈ 5 m² devor', 'Erismann, AS Creation'),
('plitka-devor', 'D-05', 'devor', 'Devor plitkasi', 'Keramika 300 × 600, glazur', 'Hammom va oshxona fartugi uchun. Kesish yo‘qotmasi 10 %. Fuga rangi alohida tanlanadi.', 'm²', 120000, '1.10 m² / m² devor', 'Angren Keramika, Cersanit'),
('serpyanka', 'D-06', 'devor', 'Serpyanka lenta', 'Shisha tola, 50 mm × 45 m', 'Gipsokarton choklari va yoriqlarni mustahkamlash uchun yopishqoq to‘r lenta.', 'rulon', 14000, 'Chok uzunligi ÷ 45 m', 'Mahalliy, Xitoy'),
('boyoq-shift', 'S-01', 'shift', 'Shift bo‘yog‘i', 'Oq, chuqur matoviy, 10 L', 'Yorug‘lik aksini kamaytiradigan matoviy bo‘yoq. Shift notekisliklarini yashiradi.', 'bank', 260000, '0.12 L / m² × 2 qatlam', 'Dulux, Alpina'),
('natyajnoy', 'S-02', 'shift', 'Tortma shift', 'PVX, matoviy, o‘rnatish bilan', 'Tez o‘rnatiladi (1 kun), suv o‘tkazmaydi. Narxga material va o‘rnatish kiradi.', 'm²', 110000, '1.0 m² / m² shift', 'MSD, Pongs'),
('kabel', 'E-01', 'elektr', 'Kabel', 'VVGnG 3 × 2.5 mm², mis', 'Rozetka liniyalari uchun. Yoritish uchun 3 × 1.5 mm² yetarli. Yonmaydigan izolyatsiya.', 'm', 14500, '≈ 8–10 m / m² xona', 'Uzkabel, Andijan Kabel'),
('rozetka', 'E-02', 'elektr', 'Rozetka', 'Yerlangan, 16 A, ichki', 'Podrozetnik alohida (4 000 so‘m). Oshxonada har 60 sm ish yuzasiga 1 dona tavsiya etiladi.', 'dona', 32000, '≈ 1 dona / 3 m² xona', 'Schneider, Legrand, Viko'),
('avtomat', 'E-03', 'elektr', 'Avtomat', 'C16, 1P, 6 kA', 'Har bir liniya uchun alohida avtomat. Rozetkalarga C16, yoritishga C10.', 'dona', 48000, '1 dona / liniya', 'Schneider, ABB, IEK'),
('truba-pp', 'T-01', 'santexnika', 'Polipropilen truba', 'PN20, Ø 20 mm, 4 m', 'Issiq va sovuq suv uchun. Payvandlab ulanadi. Isitish uchun armirlangan PN25 tavsiya etiladi.', 'dona', 42000, 'Trassa uzunligi ÷ 4 m', 'Valtec, Kalde, Mahalliy'),
('gidroizol', 'T-02', 'santexnika', 'Gidroizolyatsiya', 'Polimer mastika, 7 kg', 'Hammom poli va devorlarning pastki 20 sm qismiga 2 qatlam. Plitka ostidan suv o‘tishini oldini oladi.', 'chelak', 220000, '1.5 kg / m² (2 qatlam)', 'Ceresit CL51, Knauf Flächendicht'),
('smesitel', 'T-03', 'santexnika', 'Smesitel', 'Bir richagli, keramik kartridj', 'Oshxona yoki hammom uchun. Keramik kartridj 5–7 yil xizmat qiladi. Xrom qoplama.', 'dona', 380000, '1 dona / nuqta', 'Grohe, Lemark, Frap');
