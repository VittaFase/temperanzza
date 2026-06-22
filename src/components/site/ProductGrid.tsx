import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export function ProductGrid({ first = 24 }: { first?: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify-products", first],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first,
        query: null,
      });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10">
      {data.map((p) => (
        <div key={p.node.id} className="bg-background">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
