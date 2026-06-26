import { useEffect, useState } from "react";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";

export interface PriceInfo {
  amount: number;
  currencyCode: string;
}

interface CacheShape {
  prices: Map<string, PriceInfo>;
  products: Map<string, ShopifyProduct>;
}

let cache: CacheShape | null = null;
let pending: Promise<CacheShape> | null = null;

async function fetchAll(): Promise<CacheShape> {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 50, query: null });
    const prices = new Map<string, PriceInfo>();
    const products = new Map<string, ShopifyProduct>();
    const edges: ShopifyProduct[] = data?.data?.products?.edges ?? [];
    for (const e of edges) {
      const p = e.node.priceRange.minVariantPrice;
      prices.set(e.node.handle, {
        amount: parseFloat(p.amount),
        currencyCode: p.currencyCode,
      });
      products.set(e.node.handle, e);
    }
    cache = { prices, products };
    return cache;
  })();
  return pending;
}

/** Hook que retorna o mapa handle → preço unitário. */
export function useShopifyPrices() {
  const [prices, setPrices] = useState<Map<string, PriceInfo> | null>(
    cache?.prices ?? null,
  );
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setPrices(cache.prices);
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchAll()
      .then((c) => {
        if (!mounted) return;
        setPrices(c.prices);
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

/** Hook que retorna o mapa handle → ShopifyProduct (com variantes). */
export function useShopifyProducts() {
  const [products, setProducts] = useState<Map<string, ShopifyProduct> | null>(
    cache?.products ?? null,
  );
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setProducts(cache.products);
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchAll()
      .then((c) => {
        if (!mounted) return;
        setProducts(c.products);
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

  return { products, loading };
}
