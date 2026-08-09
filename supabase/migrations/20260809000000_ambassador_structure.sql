-- Enum para status do embaixador
CREATE TYPE public.ambassador_status AS ENUM ('active', 'inactive');

-- Tabela de Lifestyles (Territórios)
CREATE TABLE public.lifestyles (
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
CREATE POLICY "Public read lifestyles" ON public.lifestyles FOR SELECT TO anon, authenticated USING (true);

-- Tabela de Embaixadores
CREATE TABLE public.ambassadors (
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
CREATE POLICY "Public read ambassadors" ON public.ambassadors FOR SELECT TO anon, authenticated USING (status = 'active');

-- Inserir Lifestyles iniciais
INSERT INTO public.lifestyles (slug, name, description, tone_settings) VALUES
('keto-performance', 'Keto & Performance', 'Para quem busca densidade nutricional e energia constante.', '{"tone": "brave", "accent": "brand-red"}'),
('carnivore-flex', 'Carnívora Flexível', 'Onde a proteína é a lei e o tempero é a alma.', '{"tone": "raw", "accent": "brand-ink"}'),
('low-carb-gourmet', 'Low Carb Gourmet', 'Gastronomia de verdade, sem o peso do amido.', '{"tone": "elegant", "accent": "brand-mustard"}');
