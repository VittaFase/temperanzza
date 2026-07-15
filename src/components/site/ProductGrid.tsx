import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  first?: number;
  /** Storefront search query (e.g. exclude handles) */
  query?: string | null;
  /** Post-fetch: remove these handles from the result */
  excludeHandles?: string[];
  /** Post-fetch: force these handles to appear first, in this order */
  prependHandles?: string[];
}

export function ProductGrid({
  first = 24,
  query = null,
  excludeHandles,
  prependHandles,
}: ProductGridProps) {
  // Fetch extra when we're going to filter/reorder client-side
  const fetchCount =
    excludeHandles || prependHandles ? Math.max(first + 10, 24) : first;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "shopify-products",
      fetchCount,
      query,
      excludeHandles?.join(",") ?? "",
      prependHandles?.join(",") ?? "",
      first,
    ],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: fetchCount,
        query,
      });
      let edges = (res?.data?.products?.edges ?? []) as ShopifyProduct[];

      if (excludeHandles?.length) {
        const ex = new Set(excludeHandles);
        edges = edges.filter((e) => !ex.has(e.node.handle));
      }

      if (prependHandles?.length) {
        const order = prependHandles;
        const priority = edges.filter((e) => order.includes(e.node.handle));
        priority.sort(
          (a, b) =>
            order.indexOf(a.node.handle) - order.indexOf(b.node.handle),
        );
        const rest = edges.filter((e) => !order.includes(e.node.handle));
        edges = [...priority, ...rest];
      }

      return edges.slice(0, first);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Não foi possível carregar o catálogo agora.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border-2 border-dashed border-foreground/15 py-20 px-6 text-center">
        <p className="font-display text-2xl uppercase tracking-wide">
          Catálogo em curadoria
        </p>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Os 19 temperos da casa estão sendo finalizados no estoque. Volte em
          instantes — em breve as latas ficam disponíveis aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {data.map((p) => (
        <ProductCard key={p.node.id} product={p} />
      ))}
    </div>
  );
}
