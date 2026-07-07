
-- Bling integration tables

-- 1. OAuth tokens (single row keyed by singleton id)
CREATE TABLE public.bling_tokens (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bling_tokens_singleton CHECK (id = TRUE)
);
GRANT ALL ON public.bling_tokens TO service_role;
GRANT SELECT ON public.bling_tokens TO authenticated;
ALTER TABLE public.bling_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view bling_tokens" ON public.bling_tokens
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER bling_tokens_set_updated_at BEFORE UPDATE ON public.bling_tokens
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2. Sync log
CREATE TABLE public.bling_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL, -- 'product_sync' | 'order_created' | 'nfe_issued' | 'oauth' | 'error'
  status TEXT NOT NULL, -- 'success' | 'error' | 'info'
  message TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.bling_sync_log TO service_role;
GRANT SELECT ON public.bling_sync_log TO authenticated;
ALTER TABLE public.bling_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view bling_sync_log" ON public.bling_sync_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX bling_sync_log_created_at_idx ON public.bling_sync_log (created_at DESC);

-- 3. Product mapping (Bling <-> Shopify by SKU)
CREATE TABLE public.bling_product_map (
  sku TEXT PRIMARY KEY,
  bling_product_id TEXT,
  shopify_variant_id TEXT,
  shopify_inventory_item_id TEXT,
  last_synced_at TIMESTAMPTZ,
  last_price NUMERIC(12,2),
  last_stock INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.bling_product_map TO service_role;
GRANT SELECT ON public.bling_product_map TO authenticated;
ALTER TABLE public.bling_product_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view bling_product_map" ON public.bling_product_map
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER bling_product_map_set_updated_at BEFORE UPDATE ON public.bling_product_map
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. Order mapping (Shopify order -> Bling order + NFe)
CREATE TABLE public.bling_order_map (
  shopify_order_id TEXT PRIMARY KEY,
  shopify_order_name TEXT,
  bling_order_id TEXT,
  bling_nfe_id TEXT,
  nfe_status TEXT, -- 'pending' | 'issued' | 'rejected' | 'error'
  nfe_number TEXT,
  nfe_key TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.bling_order_map TO service_role;
GRANT SELECT ON public.bling_order_map TO authenticated;
ALTER TABLE public.bling_order_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view bling_order_map" ON public.bling_order_map
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER bling_order_map_set_updated_at BEFORE UPDATE ON public.bling_order_map
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
