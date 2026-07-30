/**
 * Camada de rastreamento da casa — agnóstica de fornecedor.
 *
 * Nada de terceiros é carregado aqui. Os eventos são empilhados em
 * `window.dataLayer` no formato GA4 e repassados a `gtag`/`fbq` apenas se
 * alguma tag já estiver presente na página. Assim, no dia em que o Google
 * Analytics 4, o GTM ou o Meta Pixel forem instalados, todos os eventos
 * de conversão já existem e começam a chegar sem tocar nos componentes.
 *
 * Regra de privacidade (LGPD): nunca enviar e-mail, telefone, CPF, endereço
 * ou qualquer dado pessoal. Só handle, nome do produto, preço e quantidade.
 */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_list_name?: string;
};

export type AnalyticsEvent =
  | "view_item"
  | "view_item_list"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "select_promotion"
  | "view_recipe"
  | "generate_lead";

type AnalyticsPayload = {
  currency?: string;
  value?: number;
  coupon?: string;
  items?: AnalyticsItem[];
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENT_MAP: Partial<Record<AnalyticsEvent, string>> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  generate_lead: "Lead",
};

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const data = { event, ...payload };

  // Fila padrão GA4/GTM — funciona mesmo antes de qualquer tag existir.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);

  try {
    window.gtag?.("event", event, payload);

    const metaEvent = META_EVENT_MAP[event];
    if (metaEvent) {
      window.fbq?.("track", metaEvent, {
        currency: payload.currency,
        value: payload.value,
        content_ids: payload.items?.map((i) => i.item_id),
        content_type: "product",
      });
    }
  } catch {
    // Rastreamento nunca pode quebrar a loja.
  }
}

/** Converte uma linha de carrinho/produto no formato de item do GA4. */
export function toAnalyticsItem(input: {
  handle: string;
  title: string;
  price?: string | number;
  quantity?: number;
  listName?: string;
}): AnalyticsItem {
  const price =
    typeof input.price === "string" ? parseFloat(input.price) : input.price;
  return {
    item_id: input.handle,
    item_name: input.title,
    ...(Number.isFinite(price) ? { price: price as number } : {}),
    ...(input.quantity ? { quantity: input.quantity } : {}),
    ...(input.listName ? { item_list_name: input.listName } : {}),
  };
}
