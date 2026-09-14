import { Link } from "@tanstack/react-router";
import { FlavorTile } from "./FlavorTile";
import type { ShopifyProduct } from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

/**
 * Grid de mini-tiles coloridos para "outros sabores da linha".
 * Espelha o seletor de flavors da Kinder's na PDP sem expor SKUs fora do rebrand.
 */
export function FlavorTiles({
  products,
  currentHandle,
  title = "Outros sabores da linha",
}: {
  products: ShopifyProduct[];
  currentHandle?: string;
  title?: string;
}) {
  const items = products
    .filter((p) => p.node.handle !== currentHandle)
    .filter((p) => isRebrandEligibleHandle(p.node.handle))
    .slice(0, 8);
  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-display font-black uppercase tracking-wider text-sm text-foreground/70 mb-4">
        {title}{" "}
        <span className="text-foreground/40">({items.length})</span>
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {items.map((p) => {
          const image = p.node.images.edges[0]?.node;
          const imgSrc = getProductImage(p.node.handle, image?.url) ?? image?.url ?? null;
          return (
            <Link
              key={p.node.id}
              to="/product/$handle"
              params={{ handle: p.node.handle }}
              className="group block"
              data-flavor-tile={p.node.handle}
            >
              <FlavorTile handle={p.node.handle} title={p.node.title} className="aspect-square">
                {imgSrc ? (
                  <img
                    decoding="async"
                    src={imgSrc}
                    alt={image?.altText || p.node.title}
                    className="absolute inset-0 w-[72%] h-[80%] m-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)] group-hover:scale-[1.06] transition-transform duration-300"
                    loading="lazy"
                  />
                ) : null}
              </FlavorTile>
              <p className="mt-2 font-display uppercase text-[11px] leading-tight tracking-wide text-foreground/80 line-clamp-2">
                {p.node.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
