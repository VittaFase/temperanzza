import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SHOPIFY_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2024-01";

type Sublinha = "core" | "premium" | "temperaflix" | "custom";

async function adminGraphQL<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) throw new Error("SHOPIFY_ADMIN_TOKEN não configurado");
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Admin ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}

async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId, _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito: apenas administradores");
}

function inferSublinha(tags: string[], title: string): Sublinha {
  const t = tags.map((x) => x.toLowerCase());
  const titleLower = title.toLowerCase();
  if (t.includes("temperaflix") || titleLower.includes("temperaflix")) return "temperaflix";
  if (t.includes("premium") || t.includes("premium-black") || titleLower.includes("premium")) return "premium";
  if (t.includes("core")) return "core";
  return "core";
}

type VariantRow = {
  variantId: string;
  productId: string;
  productTitle: string;
  sku: string;
  price: number;
  currency: string;
  sublinha: Sublinha;
  cost: number | null;
  marginPct: number | null;
};

/** Snapshot: variantes Shopify + custos + regras ativas. */
export const getPricingSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);

    type Resp = {
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            tags: string[];
            variants: {
              edges: Array<{
                node: {
                  id: string;
                  sku: string | null;
                  price: string;
                  contextualPricing?: { price: { currencyCode: string } } | null;
                };
              }>;
            };
          };
        }>;
      };
    };

    const data = await adminGraphQL<Resp>(`
      query { products(first: 100) { edges { node {
        id title tags
        variants(first: 20) { edges { node { id sku price } } }
      } } } }
    `);

    const rows: VariantRow[] = [];
    for (const p of data.products.edges) {
      const sublinha = inferSublinha(p.node.tags, p.node.title);
      for (const v of p.node.variants.edges) {
        if (!v.node.sku) continue;
        rows.push({
          variantId: v.node.id,
          productId: p.node.id,
          productTitle: p.node.title,
          sku: v.node.sku,
          price: Number(v.node.price) || 0,
          currency: "BRL",
          sublinha,
          cost: null,
          marginPct: null,
        });
      }
    }

    // Junta custos
    const { data: costs } = await context.supabase.from("product_costs").select("sku, unit_cost");
    const costMap = new Map<string, number>();
    (costs ?? []).forEach((c: { sku: string; unit_cost: number }) => costMap.set(c.sku, Number(c.unit_cost)));
    for (const row of rows) {
      const c = costMap.get(row.sku);
      if (c != null) {
        row.cost = c;
        row.marginPct = row.price > 0 ? ((row.price - c) / row.price) * 100 : null;
      }
    }

    const { data: rules } = await context.supabase
      .from("pricing_rules").select("*").eq("active", true).order("created_at", { ascending: false });

    return { variants: rows, rules: rules ?? [] };
  });

/** Preview: aplica multiplicador a todos SKUs da sublinha; não grava. */
export const previewPriceChanges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ruleId: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);

    const { data: rule, error } = await context.supabase
      .from("pricing_rules").select("*").eq("id", data.ruleId).single();
    if (error || !rule) throw new Error("Regra não encontrada");

    const snap = await (getPricingSnapshot as any)();
    const variants: VariantRow[] = snap.variants;

    const affected = variants
      .filter((v) => rule.sublinha === "custom" || v.sublinha === rule.sublinha)
      .filter((v) => v.cost != null)
      .map((v) => {
        const newPrice = Math.round(Number(v.cost) * Number(rule.markup_multiplier) * 100) / 100;
        return {
          variantId: v.variantId, sku: v.sku, productTitle: v.productTitle,
          previousPrice: v.price, newPrice,
          delta: Math.round((newPrice - v.price) * 100) / 100,
          newMarginPct: newPrice > 0 && v.cost != null ? ((newPrice - v.cost) / newPrice) * 100 : null,
        };
      });

    const totalDelta = affected.reduce((s, a) => s + a.delta, 0);
    return { rule, affected, totalDelta, affectedCount: affected.length };
  });

/** Aplica regra: bulk update na Shopify + grava histórico. */
export const applyPricingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ruleId: string; reason?: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);

    const preview = await (previewPriceChanges as any)({ data: { ruleId: data.ruleId } });
    if (preview.affected.length === 0) return { applied: 0, historyIds: [] };

    // Agrupa por productId para bulk update (Shopify aceita até 250 variants por produto por request).
    // Estratégia simples: 1 request por variante via productVariantUpdate para evitar edge cases.
    // Para escala maior, migrar para productVariantsBulkUpdate por produto.
    const historyIds: string[] = [];
    for (const a of preview.affected) {
      const mutation = `mutation upd($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) { productVariant { id price } userErrors { field message } }
      }`;
      const resp = await adminGraphQL<{ productVariantUpdate: { userErrors: Array<{ message: string }> } }>(
        mutation,
        { input: { id: a.variantId, price: a.newPrice.toFixed(2) } },
      );
      if (resp.productVariantUpdate.userErrors?.length) {
        throw new Error(`Falha em ${a.sku}: ${resp.productVariantUpdate.userErrors.map((e) => e.message).join("; ")}`);
      }
      const { data: hist, error } = await context.supabase.from("pricing_history").insert({
        rule_id: data.ruleId,
        sku: a.sku,
        shopify_variant_id: a.variantId,
        previous_price: a.previousPrice,
        new_price: a.newPrice,
        currency: "BRL",
        reason: data.reason ?? preview.rule.name,
        applied_by: context.userId,
      }).select("id").single();
      if (!error && hist) historyIds.push(hist.id);
    }
    return { applied: preview.affected.length, historyIds };
  });

/** Reverte uma entrada de histórico (aplica previous_price de volta). */
export const revertPriceHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { historyId: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: h, error } = await context.supabase
      .from("pricing_history").select("*").eq("id", data.historyId).single();
    if (error || !h) throw new Error("Registro não encontrado");
    if (h.reverted) throw new Error("Já revertido");
    if (h.previous_price == null || !h.shopify_variant_id) throw new Error("Sem preço anterior para reverter");

    const mutation = `mutation upd($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) { userErrors { message } }
    }`;
    const resp = await adminGraphQL<{ productVariantUpdate: { userErrors: Array<{ message: string }> } }>(
      mutation,
      { input: { id: h.shopify_variant_id, price: Number(h.previous_price).toFixed(2) } },
    );
    if (resp.productVariantUpdate.userErrors?.length) {
      throw new Error(resp.productVariantUpdate.userErrors.map((e) => e.message).join("; "));
    }
    await context.supabase.from("pricing_history").update({
      reverted: true, reverted_at: new Date().toISOString(), reverted_by: context.userId,
    }).eq("id", data.historyId);
    return { ok: true };
  });

/** Upsert de custo de um SKU. */
export const upsertProductCost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { sku: string; unitCost: number; notes?: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("product_costs").upsert({
      sku: data.sku, unit_cost: data.unitCost, notes: data.notes ?? null,
      source: "manual", updated_by: context.userId, updated_at: new Date().toISOString(),
    }, { onConflict: "sku" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Cria/atualiza regra de markup. */
export const upsertPricingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; name: string; sublinha: Sublinha;
    markupMultiplier: number; minMarginPct?: number | null; active?: boolean;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const payload = {
      name: data.name, sublinha: data.sublinha,
      markup_multiplier: data.markupMultiplier,
      min_margin_pct: data.minMarginPct ?? null,
      active: data.active ?? true,
      created_by: context.userId,
    };
    if (data.id) {
      const { error } = await context.supabase.from("pricing_rules").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await context.supabase
      .from("pricing_rules").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

/** Últimas N entradas de histórico. */
export const getPricingHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("pricing_history").select("*").order("applied_at", { ascending: false }).limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
