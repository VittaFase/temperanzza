/**
 * Bling: create sales order from a Shopify order + attempt NFe issuance.
 */
import { blingFetch, getServiceClient, logSync } from "./client.server";

export interface ShopifyOrderPayload {
  id: number;
  name: string;
  email?: string | null;
  total_price: string;
  currency: string;
  line_items: Array<{
    sku: string | null;
    name: string;
    quantity: number;
    price: string;
  }>;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
  } | null;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string | null;
    city?: string;
    province?: string;
    province_code?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    phone?: string | null;
  } | null;
  billing_address?: ShopifyOrderPayload["shipping_address"];
  note_attributes?: Array<{ name: string; value: string }>;
}

function extractCpfCnpj(order: ShopifyOrderPayload): string | null {
  const attrs = order.note_attributes ?? [];
  const cand = attrs.find((a) =>
    /cpf|cnpj|documento|document/i.test(a.name ?? ""),
  );
  if (!cand) return null;
  return cand.value.replace(/\D/g, "") || null;
}

interface BlingContactCreated {
  data: { id: number };
}

interface BlingContactList {
  data: Array<{ id: number; nome?: string; numeroDocumento?: string; email?: string }>;
}

async function findBlingContact(
  doc: string | null,
  email: string | null,
): Promise<number | null> {
  const tries: string[] = [];
  if (doc) tries.push(`/contatos?numeroDocumento=${encodeURIComponent(doc)}`);
  if (email) tries.push(`/contatos?pesquisa=${encodeURIComponent(email)}`);
  for (const path of tries) {
    try {
      const res = await blingFetch<BlingContactList>(path);
      const hit = res?.data?.[0];
      if (hit?.id) return hit.id;
    } catch {
      // ignore and try next strategy
    }
  }
  return null;
}

async function upsertBlingContact(order: ShopifyOrderPayload): Promise<number | null> {
  const addr = order.shipping_address ?? order.billing_address ?? null;
  const first = order.customer?.first_name ?? addr?.first_name ?? "Cliente";
  const last = order.customer?.last_name ?? addr?.last_name ?? "";
  const name = `${first} ${last}`.trim() || "Cliente Shopify";
  const doc = extractCpfCnpj(order);
  const email = order.email ?? order.customer?.email ?? null;

  const payload: Record<string, unknown> = {
    nome: name,
    tipo: doc && doc.length === 14 ? "J" : "F", // J=jurídica, F=física
    numeroDocumento: doc ?? undefined,
    email: email ?? undefined,
    telefone: order.customer?.phone ?? addr?.phone ?? undefined,
    endereco: addr
      ? {
          endereco: addr.address1 ?? "",
          numero: "",
          complemento: addr.address2 ?? undefined,
          municipio: addr.city ?? "",
          uf: addr.province_code ?? "",
          cep: addr.zip?.replace(/\D/g, "") ?? "",
          pais: addr.country ?? "Brasil",
        }
      : undefined,
  };

  try {
    const res = await blingFetch<BlingContactCreated>("/contatos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res?.data?.id) return res.data.id;
  } catch (err) {
    console.error("[bling] contact create failed, trying lookup", err);
  }
  // Contato já existe (ou criação falhou): busca o existente
  return findBlingContact(doc, email);
}

/** Resolve o id do produto no Bling a partir do SKU (mapa local + busca na API). */
async function resolveBlingProductId(sku: string): Promise<string | null> {
  try {
    const sb = getServiceClient();
    const { data } = await sb
      .from("bling_product_map")
      .select("bling_product_id")
      .eq("sku", sku)
      .maybeSingle();
    if (data?.bling_product_id) return data.bling_product_id;
  } catch {
    // continua para busca na API
  }
  try {
    const res = await blingFetch<{ data: Array<{ id: number; codigo?: string }> }>(
      `/produtos?codigo=${encodeURIComponent(sku)}`,
    );
    const hit = res?.data?.find((p) => (p.codigo ?? "").trim() === sku) ?? res?.data?.[0];
    return hit?.id ? String(hit.id) : null;
  } catch {
    return null;
  }
}


interface BlingOrderCreated {
  data: { id: number; numero?: number };
}

export interface CreateOrderResult {
  blingOrderId: string | null;
  blingOrderNumber: string | null;
  nfeId: string | null;
  nfeStatus: "issued" | "pending" | "error" | "not_attempted";
  nfeError?: string;
}

export async function createBlingOrderFromShopify(
  order: ShopifyOrderPayload,
): Promise<CreateOrderResult> {
  const contactId = await upsertBlingContact(order);

  const itens = order.line_items
    .filter((li) => li.sku)
    .map((li) => ({
      codigo: li.sku!,
      descricao: li.name,
      quantidade: li.quantity,
      valor: Number(li.price),
    }));

  const payload: Record<string, unknown> = {
    data: new Date().toISOString().slice(0, 10),
    numeroLoja: order.name,
    contato: contactId ? { id: contactId } : { nome: "Cliente Shopify" },
    itens,
  };

  const orderRes = await blingFetch<BlingOrderCreated>("/pedidos/vendas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const blingOrderId = orderRes?.data?.id ? String(orderRes.data.id) : null;
  const blingOrderNumber = orderRes?.data?.numero ? String(orderRes.data.numero) : null;

  await logSync("order_created", "success", `Pedido Bling criado (${order.name})`, {
    shopify_order: order.name,
    bling_order_id: blingOrderId,
  });

  // Attempt NFe issuance
  let nfeId: string | null = null;
  let nfeStatus: CreateOrderResult["nfeStatus"] = "not_attempted";
  let nfeError: string | undefined;

  if (blingOrderId) {
    try {
      // Generate NFe from the sales order
      const nfeRes = await blingFetch<{ data: { id: number } }>(
        `/nfe/pedidosVendas/${blingOrderId}`,
        { method: "POST", body: JSON.stringify({}) },
      );
      nfeId = nfeRes?.data?.id ? String(nfeRes.data.id) : null;

      // Try to send (emit) the NFe
      if (nfeId) {
        try {
          await blingFetch(`/nfe/${nfeId}/enviar`, { method: "POST" });
          nfeStatus = "issued";
          await logSync("nfe_issued", "success", `NFe emitida para ${order.name}`, {
            nfe_id: nfeId,
          });
        } catch (sendErr) {
          nfeStatus = "pending";
          nfeError = sendErr instanceof Error ? sendErr.message : String(sendErr);
          await logSync(
            "nfe_issued",
            "error",
            `NFe gerada mas não emitida (${order.name})`,
            { nfe_id: nfeId, error: nfeError },
          );
        }
      }
    } catch (err) {
      nfeStatus = "error";
      nfeError = err instanceof Error ? err.message : String(err);
      await logSync(
        "nfe_issued",
        "error",
        `Falha ao gerar NFe para ${order.name}`,
        { error: nfeError },
      );
    }
  }

  // Persist mapping
  const sb = getServiceClient();
  await sb.from("bling_order_map").upsert({
    shopify_order_id: String(order.id),
    shopify_order_name: order.name,
    bling_order_id: blingOrderId,
    bling_nfe_id: nfeId,
    nfe_status: nfeStatus === "not_attempted" ? "pending" : nfeStatus,
    nfe_number: blingOrderNumber,
    error_message: nfeError ?? null,
  });

  return { blingOrderId, blingOrderNumber, nfeId, nfeStatus, nfeError };
}
