
-- ============ product_costs ============
CREATE TABLE public.product_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  unit_cost NUMERIC(10,4) NOT NULL CHECK (unit_cost >= 0),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','bling')),
  notes TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_costs TO authenticated;
GRANT ALL ON public.product_costs TO service_role;
ALTER TABLE public.product_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage product_costs" ON public.product_costs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ pricing_rules ============
CREATE TABLE public.pricing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sublinha TEXT NOT NULL CHECK (sublinha IN ('core','premium','temperaflix','custom')),
  markup_multiplier NUMERIC(6,4) NOT NULL CHECK (markup_multiplier > 0),
  min_margin_pct NUMERIC(5,2),
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_rules TO authenticated;
GRANT ALL ON public.pricing_rules TO service_role;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pricing_rules" ON public.pricing_rules
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ pricing_history ============
CREATE TABLE public.pricing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.pricing_rules(id) ON DELETE SET NULL,
  sku TEXT NOT NULL,
  shopify_variant_id TEXT,
  previous_price NUMERIC(10,2),
  new_price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  reason TEXT,
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reverted BOOLEAN NOT NULL DEFAULT false,
  reverted_at TIMESTAMPTZ,
  reverted_by UUID REFERENCES auth.users(id)
);
CREATE INDEX idx_pricing_history_sku_applied ON public.pricing_history(sku, applied_at DESC);
CREATE INDEX idx_pricing_history_rule ON public.pricing_history(rule_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_history TO authenticated;
GRANT ALL ON public.pricing_history TO service_role;
ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage pricing_history" ON public.pricing_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ trigger updated_at ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_product_costs_updated
  BEFORE UPDATE ON public.product_costs
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER trg_pricing_rules_updated
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
