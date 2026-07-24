import { Link } from "@tanstack/react-router";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatBRL } from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { getProductDiet } from "@/lib/dietCompatibility";
import { Sparkles } from "lucide-react";

/**
 * "Combina com" — cross-sell curado por perfil sensorial.
 * Sugere 3 temperos que dividem o mesmo perfil (defumado, ervas, cítrico…)
 * do tempero atual, excluindo o próprio.
 */
export function CombinaCom({
  currentHandle,
  products,
}: {
  currentHandle: string;
  products: ShopifyProduct[];
}) {
  const currentProfile = getProductDiet(currentHandle)?.profile;
  if (!currentProfile) return null;

  const suggestions = products
    .filter((p) => p.node.handle !== currentHandle)
    .filter((p) => getProductDiet(p.node.handle)?.profile === currentProfile)
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24 border-t border-foreground/15 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-[10px] font-display uppercase tracking-[0.35em] text-foreground/60">
          Combina com
        </span>
        <span aria-hidden className="flex-1 h-px bg-foreground/10" />
      </div>
      <p className="max-w-2xl mb-8 font-serif italic text-lg text-foreground/75">
        Temperos do mesmo perfil sensorial — pense em como se harmonizam num
        mesmo prato ou dividem espaço na sua prateleira.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {suggestions.map((p) => {
          const img =
            getProductImage(p.node.handle) ??
            p.node.images.edges[0]?.node.url;
          const price = p.node.priceRange.minVariantPrice;
          return (
            <Link
              key={p.node.id}
              to="/product/$handle"
              params={{ handle: p.node.handle }}
              className="group block bg-brand-cream bg-paper-grain border border-foreground/10 hover:border-accent transition-colors"
            >
              <div className="relative aspect-square overflow-hidden">
                {img && (
                  <img
                    src={img}
                    alt={p.node.title}
                    loading="lazy"
                    className="absolute inset-0 w-[72%] h-[86%] m-auto object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="p-4 border-t border-foreground/10">
                <h3 className="font-display font-black uppercase text-sm tracking-tight leading-tight line-clamp-2">
                  {p.node.title}
                </h3>
                <p className="mt-2 font-display font-black text-accent text-base">
                  {formatBRL(price.amount, price.currencyCode)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
