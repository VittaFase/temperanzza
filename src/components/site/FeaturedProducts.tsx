import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductGrid } from "./ProductGrid";
import { FeaturedRow } from "./FeaturedRow";

/**
 * FeaturedProducts — discovery-first product experience for the Home.
 */
export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products-home"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, { first: 8 });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  return (
    <section className="section-space overflow-hidden bg-brand-paper">
      <div className="page-shell">
        {products && products.length > 0 && (
          <FeaturedRow label="Descubra seu sabor" products={products} />
        )}

        <div className="mt-24 sm:mt-32">
          <div className="mb-10 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Todos os sabores
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none text-brand-ink sm:text-5xl">
              A despensa da Casa Temperanzza
            </h2>
          </div>
          <ProductGrid first={8} />
        </div>
      </div>
    </section>
  );
}
