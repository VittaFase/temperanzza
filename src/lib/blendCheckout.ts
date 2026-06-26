import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { BLEND_DISCOUNT_CODE } from "@/lib/blendPricing";

/** Aplica `?discount=CODE` à URL de checkout do Shopify. */
export function appendDiscountToCheckoutUrl(
  url: string,
  code = BLEND_DISCOUNT_CODE,
): string {
  try {
    const u = new URL(url);
    u.searchParams.set("discount", code);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Adiciona handles (com quantidades) ao carrinho Shopify.
 * Retorna a URL final de checkout já com o cupom aplicado.
 */
export async function addPicksToCart(
  picks: Record<string, number>,
  products: Map<string, ShopifyProduct>,
): Promise<string | null> {
  const { addItem, getCheckoutUrl } = useCartStore.getState();

  for (const [handle, qty] of Object.entries(picks)) {
    if (!qty) continue;
    const product = products.get(handle);
    const variant = product?.node.variants.edges[0]?.node;
    if (!product || !variant) continue;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
  }

  const url = getCheckoutUrl();
  return url ? appendDiscountToCheckoutUrl(url) : null;
}

/** Conta os handles agregados (handles repetidos viram quantidade). */
export function handlesToPicks(handles: string[]): Record<string, number> {
  const picks: Record<string, number> = {};
  for (const h of handles) picks[h] = (picks[h] ?? 0) + 1;
  return picks;
}
