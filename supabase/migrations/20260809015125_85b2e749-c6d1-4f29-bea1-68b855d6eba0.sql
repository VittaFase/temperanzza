
-- 1. Enum para status do embaixador
DO $$ BEGIN
    CREATE TYPE public.ambassador_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Lifestyles (Territórios)
CREATE TABLE IF NOT EXISTS public.lifestyles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    tone_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT SELECT ON public.lifestyles TO authenticated, anon;
GRANT ALL ON public.lifestyles TO service_role;
ALTER TABLE public.lifestyles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read lifestyles" ON public.lifestyles FOR SELECT TO anon, authenticated USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabela de Embaixadores
CREATE TABLE IF NOT EXISTS public.ambassadors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lifestyle_id UUID REFERENCES public.lifestyles(id) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    coupon_code TEXT UNIQUE NOT NULL,
    status public.ambassador_status NOT NULL DEFAULT 'active',
    curation_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT SELECT ON public.ambassadors TO authenticated, anon;
GRANT ALL ON public.ambassadors TO service_role;
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public read ambassadors" ON public.ambassadors FOR SELECT TO anon, authenticated USING (status = 'active');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Seed de Lifestyles
INSERT INTO public.lifestyles (slug, name, description, tone_settings) VALUES
('keto-performance', 'Cetogênica', 'Alta gordura, proteínas moderadas, carboidratos silenciados. Sabor sem concessão.', '{"tone": "brave", "accent": "brand-red", "romano": "I"}'),
('low-carb-gourmet', 'Low Carb', 'Menos carboidrato, mais textura. A cozinha que sustenta sem pesar.', '{"tone": "elegant", "accent": "brand-mustard", "romano": "II"}'),
('carnivore-flex', 'Carnívora Flexível', 'Proteína animal no centro, temperos vegetais como pontuação.', '{"tone": "raw", "accent": "brand-ink", "romano": "III"}'),
('dieta-da-selva', 'Dieta da Selva', 'Carne, ovo e o que a natureza oferece sem industrialização. Tempero que valoriza o ingrediente.', '{"tone": "primitive", "accent": "brand-amber", "romano": "IV"}'),
('tradicional', 'Cozinha Tradicional', 'A mesa de todos os dias, elevada por temperos com autoria mineira.', '{"tone": "homely", "accent": "brand-emerald", "romano": "V"}')
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    tone_settings = EXCLUDED.tone_settings;
