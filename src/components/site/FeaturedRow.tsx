import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { getFlavorTone } from "@/lib/flavorPalette";
import { toast } from "sonner";

/**
 * Padrão B — Faixa editorial estilo "Featured Products" do Kinder's:
 * moldura vermelha fina, label centralizado no topo cortando a borda,
 * linhas horizontais com pote miniatura + título stencil + CTA.
 */
export function FeaturedRow({
  products,
  label = "Em destaque",
}: {
  products: ShopifyProduct[];
  label?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async (p: ShopifyProduct) => {
    const v = p.node.variants.edges[0]?.node;
    if (!v) return;
    await addItem({
      product: p,
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions || [],
    });
    toast.success(`${p.node.title} adicionado à sacola`);
  };

  if (!products?.length) return null;

  return (
    <div className="relative border-2 border-accent px-4 sm:px-10 py-12 sm:py-14">
      {/* label cortando a borda */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-5">
        <span className="font-display font-black uppercase tracking-[0.4em] text-xs sm:text-sm text-accent">
          ─ {label} ─
        </span>
      </div>

      <ul className="divide-y divide-foreground/10">
        {products.map((p) => {
          const handle = p.node.handle;
          const image = p.node.images.edges[0]?.node;
          const img = getProductImage(handle, image?.url);
          const tone = getFlavorTone(handle, p.node.title);
          const price = p.node.priceRange.minVariantPrice;

          return (
            <li
              key={p.node.id}
              className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr_auto] items-center gap-4 sm:gap-8 py-6 sm:py-8 group"
            >
              <Link
                to="/product/$handle"
                params={{ handle }}
                className="relative aspect-square overflow-hidden block"
                style={{ backgroundColor: tone.bg }}
              >
                {img && (
                  <img decoding="async"
                    src={img}
                    alt={image?.altText || p.node.title}
                    className="absolute inset-0 w-[78%] h-[88%] m-auto object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)] group-hover:scale-[1.06] transition-transform duration-500"
                    loading="lazy"
                  />
                )}
              </Link>

              <Link
                to="/product/$handle"
                params={{ handle }}
                className="min-w-0"
              >
                <h3 className="font-display font-black uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.9] tracking-tight group-hover:text-accent transition-colors">
                  {p.node.title}
                </h3>
                <p className="mt-2 sm:hidden font-display font-black text-2xl text-accent">
                  {formatBRL(price.amount, price.currencyCode)}
                </p>
              </Link>

              <div className="hidden sm:flex flex-col items-end gap-3">
                <span className="font-display font-black text-3xl text-accent leading-none">
                  {formatBRL(price.amount, price.currencyCode)}
                </span>
                <button
                  onClick={() => handleAdd(p)}
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center gap-1.5 px-1 font-display font-bold uppercase tracking-[0.18em] text-xs text-accent hover:text-foreground border-b border-accent/60 hover:border-foreground"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Sacola
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => handleAdd(p)}
                disabled={isLoading}
                className="sm:hidden col-span-2 inline-flex min-h-11 items-center gap-1.5 py-2 font-display font-bold uppercase tracking-[0.18em] text-xs text-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                Sacola
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
