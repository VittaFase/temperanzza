import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductGrid } from "./ProductGrid";
import { FeaturedRow } from "./FeaturedRow";

/**
 * FeaturedProducts — Bloco de produtos em destaque na Home.
 */
export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products-home"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, { first: 3 });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {products && products.length > 0 && (
          <FeaturedRow 
            label="Nossas Estrelas"
            products={products}
          />
        )}
        
        <div className="mt-20">
          <div className="mb-10 text-center">
            <span className="font-display uppercase tracking-[0.3em] text-[10px] text-muted-foreground">Catálogo</span>
            <h2 className="mt-2 font-display font-black uppercase text-4xl sm:text-5xl">Os 19 da Casa</h2>
          </div>
          <ProductGrid first={8} />
        </div>
      </div>
    </section>
  );
}

