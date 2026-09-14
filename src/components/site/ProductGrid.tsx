import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { isRebrandExcludedHandle } from "@/lib/rebrandCatalog";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  first?: number;
  /** Storefront search query. */
  query?: string | null;
  /** Additional post-fetch exclusions beyond the central rebrand scope. */
  excludeHandles?: string[];
  /** Post-fetch: force these eligible handles to appear first, in this order. */
  prependHandles?: string[];
}

export function ProductGrid({
  first = 24,
  query = null,
  excludeHandles,
  prependHandles,
}: ProductGridProps) {
  // Always fetch a buffer because the central rebrand gate can remove Shopify results.
  const fetchCount = Math.max(first + 10, 24);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "shopify-products",
      "rebrand-scope",
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

      edges = edges.filter((edge) => !isRebrandExcludedHandle(edge.node.handle));

      if (excludeHandles?.length) {
        const additionalExclusions = new Set(excludeHandles);
        edges = edges.filter((edge) => !additionalExclusions.has(edge.node.handle));
      }

      if (prependHandles?.length) {
        const order = prependHandles.filter((handle) => !isRebrandExcludedHandle(handle));
        const priority = edges.filter((edge) => order.includes(edge.node.handle));
        priority.sort(
          (a, b) => order.indexOf(a.node.handle) - order.indexOf(b.node.handle),
        );
        const rest = edges.filter((edge) => !order.includes(edge.node.handle));
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
        <p className="font-display text-2xl uppercase tracking-wide">Catálogo em curadoria</p>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Os sabores da Casa Temperanzza estão sendo finalizados no estoque. Volte em
          instantes — em breve os produtos ficam disponíveis aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5" data-rebrand-product-grid>
      {data.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
}
