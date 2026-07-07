
-- Variáveis operacionais (single row)
CREATE TABLE public.dashboard_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pote numeric NOT NULL DEFAULT 0.95,
  lacre numeric NOT NULL DEFAULT 0.03,
  rotulo numeric NOT NULL DEFAULT 0.44,
  caixa numeric NOT NULL DEFAULT 0.12,
  termoencolhivel numeric NOT NULL DEFAULT 0.10,
  simples_nacional numeric NOT NULL DEFAULT 4.9,
  custo_fabril numeric NOT NULL DEFAULT 6,
  comissao numeric NOT NULL DEFAULT 5,
  transporte numeric NOT NULL DEFAULT 3,
  markup_atacado numeric NOT NULL DEFAULT 2.3,
  markup_cliente numeric NOT NULL DEFAULT 4.0,
  contabilidade_mensal numeric NOT NULL DEFAULT 500,
  producao_estimada numeric NOT NULL DEFAULT 2000,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dashboard_variables TO authenticated;
GRANT ALL ON public.dashboard_variables TO service_role;
ALTER TABLE public.dashboard_variables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dashboard_variables" ON public.dashboard_variables
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_dashboard_variables_updated
  BEFORE UPDATE ON public.dashboard_variables
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Catálogo de temperos (19 SKUs)
CREATE TABLE public.dashboard_temperos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  sku text UNIQUE,
  ean text,
  preco_kg numeric NOT NULL DEFAULT 0,
  gramas_pote numeric NOT NULL DEFAULT 0,
  estoque_atual numeric NOT NULL DEFAULT 0,
  estoque_minimo numeric NOT NULL DEFAULT 0,
  ordem integer NOT NULL DEFAULT 0,
  foto_path text,
  custos_fixos_override jsonb,
  tabela_nutricional jsonb,
  ativo boolean NOT NULL DEFAULT true,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dashboard_temperos TO authenticated;
GRANT ALL ON public.dashboard_temperos TO service_role;
ALTER TABLE public.dashboard_temperos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dashboard_temperos" ON public.dashboard_temperos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_dashboard_temperos_updated
  BEFORE UPDATE ON public.dashboard_temperos
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed variáveis iniciais
INSERT INTO public.dashboard_variables DEFAULT VALUES;

-- Seed dos 19 temperos
INSERT INTO public.dashboard_temperos (nome, preco_kg, gramas_pote, estoque_atual, estoque_minimo, ordem) VALUES
('Ervas Finas', 10.35, 20, 253, 50, 1),
('Cebola em Pó', 15.0, 35, 132, 30, 2),
('Chimi Churri sem Pimenta', 16.0, 40, 127, 30, 3),
('Lemon Pepper', 13.0, 50, 100, 20, 4),
('Tempero do Edu', 17.5, 45, 112, 20, 5),
('Ana Maria', 13.4, 55, 91, 20, 6),
('Páprica Picante', 8.3, 60, 112, 20, 7),
('Páprica Defumada', 9.0, 60, 85, 20, 8),
('Temperaflix Tradicional', 7.0, 60, 169, 30, 9),
('Salsa, Cebola e Alho', 20.5, 30, 170, 30, 10),
('Du Chefe com Páprica', 14.5, 45, 113, 20, 11),
('Tempero Mineiro', 15.3, 50, 101, 20, 12),
('Temperaflix Bacon', 7.3, 65, 75, 20, 13),
('Cúrcuma', 9.0, 40, 124, 20, 14),
('Páprica Doce', 7.3, 45, 113, 20, 15),
('Chimi Churri Picante', 17.5, 39, 129, 20, 16),
('Temperaflix Ervas Finas', 7.0, 75, 67, 20, 17),
('Pimenta Moída', 19.0, 50, 1200, 50, 18),
('Canela Moída', 15.0, 30, 5600, 50, 19);
