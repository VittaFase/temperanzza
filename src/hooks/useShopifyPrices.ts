import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";

export interface PriceInfo {
  amount: number;
  currencyCode: string;
}

let cache: Map<string, PriceInfo> | null = null;
let pending: Promise<Map<string, PriceInfo>> | null = null;

async function fetchPrices(): Promise<Map<string, PriceInfo>> {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 50, query: null });
    const map = new Map<string, PriceInfo>();
    const edges: ShopifyProduct[] = data?.data?.products?.edges ?? [];
    for (const e of edges) {
      const p = e.node.priceRange.minVariantPrice;
      map.set(e.node.handle, {
        amount: parseFloat(p.amount),
        currencyCode: p.currencyCode,
      });
    }
    cache = map;
    return map;
  })();
  return pending;
}

/** Hook que retorna o mapa handle → preço unitário. */
export function useShopifyPrices() {
  const [prices, setPrices] = useState<Map<string, PriceInfo> | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setPrices(cache);
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchPrices()
      .then((m) => {
        if (!mounted) return;
        setPrices(m);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { prices, loading };
}
