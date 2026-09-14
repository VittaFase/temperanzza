import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { getHomeFeaturedRank, isHomeFeaturedHandle } from "@/lib/rebrandCatalog";
import { ProductGrid } from "./ProductGrid";
import { FeaturedRow } from "./FeaturedRow";

/**
 * FeaturedProducts — discovery-first product experience for the Home.
 * Shopify continua sendo a fonte comercial; a primeira faixa segue uma curadoria
 * explícita e ordenada, sem inferir status comercial a partir do handle.
 */
export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products-home"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, { first: 24 });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  const editorialProducts = products
    ?.filter((product) => isHomeFeaturedHandle(product.node.handle))
    .sort(
      (a, b) =>
        (getHomeFeaturedRank(a.node.handle) ?? Number.MAX_SAFE_INTEGER) -
        (getHomeFeaturedRank(b.node.handle) ?? Number.MAX_SAFE_INTEGER),
    )
    .slice(0, 8);

  return (
    <section className="section-space overflow-hidden bg-brand-paper">
      <div className="page-shell">
        {editorialProducts && editorialProducts.length > 0 && (
          <FeaturedRow label="Descubra seu sabor" products={editorialProducts} />
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
