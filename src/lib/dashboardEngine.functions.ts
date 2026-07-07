import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SHOPIFY_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2024-01";

// ---------- Types (Manus / Temperanza Dashboard) ----------
export type Variaveis = {
  pote: number; lacre: number; rotulo: number; caixa: number; termoencolhivel: number;
  simplesNacional: number; custoFabril: number; comissao: number; transporte: number;
  markupAtacado: number; markupCliente: number;
  contabilidadeMensal: number; producaoEstimada: number;
};

export type CustosFixosOverride = Partial<{
  pote: number; lacre: number; rotulo: number; caixa: number; termoencolhivel: number;
}>;

export type Tempero = {
  id: string; nome: string; sku: string | null; ean: string | null;
  precoKg: number; gramasPote: number;
  estoqueAtual: number; estoqueMinimo: number; ordem: number;
  fotoPath: string | null; ativo: boolean;
  custosFixosOverride: CustosFixosOverride | null;
};

export type CalculoTempero = {
  custoMateriaPrima: number; custosFixos: number; rateioContabilidade: number;
  custoDireto: number; custoComFabril: number; custoTotal: number;
  precoAtacado: number; precoCliente: number;
  margemAtacadoPct: number; margemClientePct: number;
};

// ---------- Formula ----------
export function calcularTempero(t: Pick<Tempero, "precoKg" | "gramasPote" | "custosFixosOverride">, v: Variaveis): CalculoTempero {
  const custoMateriaPrima = (t.precoKg * t.gramasPote) / 1000;
  const ov = t.custosFixosOverride ?? {};
  const custosFixos =
    (ov.pote ?? v.pote) + (ov.lacre ?? v.lacre) + (ov.rotulo ?? v.rotulo) +
    (ov.caixa ?? v.caixa) + (ov.termoencolhivel ?? v.termoencolhivel);
  const rateioContabilidade = v.producaoEstimada > 0 ? v.contabilidadeMensal / v.producaoEstimada : 0;
  const custoDireto = custoMateriaPrima + custosFixos + rateioContabilidade;
  const custoComFabril = custoDireto * (1 + v.custoFabril / 100);
  const divisor = Math.max(0.01, 1 - v.simplesNacional / 100 - v.comissao / 100 - v.transporte / 100);
  const custoTotal = custoComFabril / divisor;
  const precoAtacado = custoTotal * v.markupAtacado;
  const precoCliente = custoTotal * v.markupCliente;
  const margemAtacadoPct = precoAtacado > 0 ? ((precoAtacado - custoTotal) / precoAtacado) * 100 : 0;
  const margemClientePct = precoCliente > 0 ? ((precoCliente - custoTotal) / precoCliente) * 100 : 0;
  return {
    custoMateriaPrima, custosFixos, rateioContabilidade,
    custoDireto, custoComFabril, custoTotal,
    precoAtacado, precoCliente, margemAtacadoPct, margemClientePct,
  };
}

// ---------- helpers ----------
async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId, _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito: apenas administradores");
}

function rowToVariaveis(r: any): Variaveis {
  return {
    pote: Number(r.pote), lacre: Number(r.lacre), rotulo: Number(r.rotulo),
    caixa: Number(r.caixa), termoencolhivel: Number(r.termoencolhivel),
    simplesNacional: Number(r.simples_nacional), custoFabril: Number(r.custo_fabril),
    comissao: Number(r.comissao), transporte: Number(r.transporte),
    markupAtacado: Number(r.markup_atacado), markupCliente: Number(r.markup_cliente),
    contabilidadeMensal: Number(r.contabilidade_mensal),
    producaoEstimada: Number(r.producao_estimada),
  };
}

function rowToTempero(r: any): Tempero {
  return {
    id: r.id, nome: r.nome, sku: r.sku ?? null, ean: r.ean ?? null,
    precoKg: Number(r.preco_kg), gramasPote: Number(r.gramas_pote),
    estoqueAtual: Number(r.estoque_atual), estoqueMinimo: Number(r.estoque_minimo),
    ordem: Number(r.ordem), fotoPath: r.foto_path ?? null, ativo: r.ativo,
    custosFixosOverride: r.custos_fixos_override ?? null,
  };
}

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

// ---------- Server functions ----------

export const getEngineState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const [{ data: vrow }, { data: trows }] = await Promise.all([
      context.supabase.from("dashboard_variables").select("*").limit(1).maybeSingle(),
      context.supabase.from("dashboard_temperos").select("*").order("ordem"),
    ]);
    if (!vrow) throw new Error("Variáveis não inicializadas");
    const variaveis = rowToVariaveis(vrow);
    const temperos = (trows ?? []).map(rowToTempero);
    return { variaveis, temperos, variaveisId: vrow.id as string };
  });

export const updateVariaveis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; variaveis: Variaveis }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const v = data.variaveis;
    const { error } = await context.supabase.from("dashboard_variables").update({
      pote: v.pote, lacre: v.lacre, rotulo: v.rotulo, caixa: v.caixa,
      termoencolhivel: v.termoencolhivel,
      simples_nacional: v.simplesNacional, custo_fabril: v.custoFabril,
      comissao: v.comissao, transporte: v.transporte,
      markup_atacado: v.markupAtacado, markup_cliente: v.markupCliente,
      contabilidade_mensal: v.contabilidadeMensal,
      producao_estimada: v.producaoEstimada,
      updated_by: context.userId,
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const upsertTempero = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; nome: string; sku?: string | null; ean?: string | null;
    precoKg: number; gramasPote: number;
    estoqueAtual?: number; estoqueMinimo?: number; ordem?: number;
    fotoPath?: string | null; ativo?: boolean;
    custosFixosOverride?: CustosFixosOverride | null;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const payload: Record<string, unknown> = {
      nome: data.nome, sku: data.sku ?? null, ean: data.ean ?? null,
      preco_kg: data.precoKg, gramas_pote: data.gramasPote,
      estoque_atual: data.estoqueAtual ?? 0, estoque_minimo: data.estoqueMinimo ?? 0,
      ordem: data.ordem ?? 0, foto_path: data.fotoPath ?? null,
      ativo: data.ativo ?? true, custos_fixos_override: data.custosFixosOverride ?? null,
      updated_by: context.userId,
    };
    if (data.id) {
      const { error } = await context.supabase.from("dashboard_temperos").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await context.supabase
      .from("dashboard_temperos").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteTempero = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("dashboard_temperos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Preview + Apply engine → Shopify ----------

type ShopifyVariantLite = { variantId: string; sku: string; productTitle: string; currentPrice: number };

async function loadShopifyVariantsBySku(): Promise<Map<string, ShopifyVariantLite>> {
  type Resp = {
    products: { edges: Array<{ node: {
      id: string; title: string;
      variants: { edges: Array<{ node: { id: string; sku: string | null; price: string } }> };
    } }> };
  };
  const data = await adminGraphQL<Resp>(`
    query { products(first: 100) { edges { node {
      id title
      variants(first: 20) { edges { node { id sku price } } }
    } } } }
  `);
  const map = new Map<string, ShopifyVariantLite>();
  for (const p of data.products.edges) {
    for (const v of p.node.variants.edges) {
      if (!v.node.sku) continue;
      map.set(v.node.sku, {
        variantId: v.node.id, sku: v.node.sku,
        productTitle: p.node.title, currentPrice: Number(v.node.price) || 0,
      });
    }
  }
  return map;
}

export const previewEngineToShopify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { target?: "cliente" | "atacado" }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const target = data.target ?? "cliente";
    const [{ data: vrow }, { data: trows }] = await Promise.all([
      context.supabase.from("dashboard_variables").select("*").limit(1).maybeSingle(),
      context.supabase.from("dashboard_temperos").select("*").eq("ativo", true).order("ordem"),
    ]);
    if (!vrow) throw new Error("Variáveis não inicializadas");
    const v = rowToVariaveis(vrow);
    const temperos = (trows ?? []).map(rowToTempero);
    const shopifyMap = await loadShopifyVariantsBySku();

    const affected: Array<{
      temperoId: string; nome: string; sku: string;
      variantId: string; previousPrice: number; newPrice: number; delta: number;
      custoTotal: number; margemPct: number;
    }> = [];
    const unmatched: Array<{ nome: string; sku: string | null; reason: string }> = [];

    for (const t of temperos) {
      const calc = calcularTempero(t, v);
      const newPrice = Math.round((target === "cliente" ? calc.precoCliente : calc.precoAtacado) * 100) / 100;
      if (!t.sku) { unmatched.push({ nome: t.nome, sku: null, reason: "SKU não definido no dashboard" }); continue; }
      const sv = shopifyMap.get(t.sku);
      if (!sv) { unmatched.push({ nome: t.nome, sku: t.sku, reason: "SKU não encontrado na Shopify" }); continue; }
      affected.push({
        temperoId: t.id, nome: t.nome, sku: t.sku,
        variantId: sv.variantId, previousPrice: sv.currentPrice,
        newPrice, delta: Math.round((newPrice - sv.currentPrice) * 100) / 100,
        custoTotal: calc.custoTotal, margemPct: target === "cliente" ? calc.margemClientePct : calc.margemAtacadoPct,
      });
    }
    const totalDelta = affected.reduce((s, a) => s + a.delta, 0);
    return { target, affected, unmatched, totalDelta };
  });

export const applyEngineToShopify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { target?: "cliente" | "atacado"; reason?: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const target = data.target ?? "cliente";
    const [{ data: vrow }, { data: trows }] = await Promise.all([
      context.supabase.from("dashboard_variables").select("*").limit(1).maybeSingle(),
      context.supabase.from("dashboard_temperos").select("*").eq("ativo", true).order("ordem"),
    ]);
    if (!vrow) throw new Error("Variáveis não inicializadas");
    const v = rowToVariaveis(vrow);
    const temperos = (trows ?? []).map(rowToTempero);
    const shopifyMap = await loadShopifyVariantsBySku();

    let applied = 0;
    const errors: Array<{ sku: string; message: string }> = [];
    for (const t of temperos) {
      if (!t.sku) continue;
      const sv = shopifyMap.get(t.sku);
      if (!sv) continue;
      const calc = calcularTempero(t, v);
      const newPrice = Math.round((target === "cliente" ? calc.precoCliente : calc.precoAtacado) * 100) / 100;
      if (newPrice <= 0) continue;

      const mutation = `mutation upd($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) { userErrors { field message } }
      }`;
      try {
        const resp = await adminGraphQL<{ productVariantUpdate: { userErrors: Array<{ message: string }> } }>(
          mutation, { input: { id: sv.variantId, price: newPrice.toFixed(2) } },
        );
        if (resp.productVariantUpdate.userErrors?.length) {
          errors.push({ sku: t.sku, message: resp.productVariantUpdate.userErrors.map((e) => e.message).join("; ") });
          continue;
        }
        await context.supabase.from("pricing_history").insert({
          rule_id: null, sku: t.sku, shopify_variant_id: sv.variantId,
          previous_price: sv.currentPrice, new_price: newPrice, currency: "BRL",
          reason: data.reason ?? `Engine → Shopify (${target})`, applied_by: context.userId,
        });
        applied++;
      } catch (e) {
        errors.push({ sku: t.sku, message: (e as Error).message });
      }
    }
    return { applied, errors, target };
  });
