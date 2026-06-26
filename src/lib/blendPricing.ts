import type { PriceInfo } from "@/hooks/useShopifyPrices";

export const BLEND_DISCOUNT_CODE = "BLENDS10";
export const BLEND_DISCOUNT_PCT = 10;
export const BLEND_DISCOUNT_MIN_ITEMS = 12;

export interface BlendPrice {
  full: number;
  discounted: number;
  currencyCode: string;
  /** true se todos os 12 handles tinham preço encontrado. */
  complete: boolean;
}

export function computeBlendTotal(
  handles: string[],
  prices: Map<string, PriceInfo> | null,
): BlendPrice | null {
  if (!prices) return null;
  let total = 0;
  let currency = "BRL";
  let complete = true;
  for (const h of handles) {
    const p = prices.get(h);
    if (!p) {
      complete = false;
      continue;
    }
    total += p.amount;
    currency = p.currencyCode;
  }
  return {
    full: total,
    discounted: total * (1 - BLEND_DISCOUNT_PCT / 100),
    currencyCode: currency,
    complete,
  };
}

export function computePicksTotal(
  picks: Record<string, number>,
  prices: Map<string, PriceInfo> | null,
): BlendPrice | null {
  if (!prices) return null;
  let total = 0;
  let qty = 0;
  let currency = "BRL";
  for (const [h, q] of Object.entries(picks)) {
    const p = prices.get(h);
    if (!p) continue;
    total += p.amount * q;
    qty += q;
    currency = p.currencyCode;
  }
  const eligible = qty >= BLEND_DISCOUNT_MIN_ITEMS;
  return {
    full: total,
    discounted: eligible ? total * (1 - BLEND_DISCOUNT_PCT / 100) : total,
    currencyCode: currency,
    complete: eligible,
  };
}
