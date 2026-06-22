import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { FlavorTile } from "./FlavorTile";
import { ProductBadge } from "./ProductBadge";
import { getBadge } from "@/lib/flavorPalette";
import { getProductImage } from "@/lib/productImages";

export function ProductCard({
  product,
  variant = "color",
}: {
  product: ShopifyProduct;
  /** "color" = bloco de cor (padrão C Kinder's); "paper" = vitrine sobre cream (padrão A) */
  variant?: "color" | "paper";
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const v = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const handle = product.node.handle;
  const imgUrl = getProductImage(handle, image?.url);
  const badge = getBadge(handle, product.node.title);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!v) return;
    await addItem({
      product,
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions || [],
    });
    toast.success(`${product.node.title} adicionado à sacola`);
  };

  const StageContent = (
    <>
      {badge && (
        <ProductBadge label={badge} size="md" className="top-3 left-3" />
      )}
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={image?.altText || product.node.title}
          className="absolute inset-0 w-[82%] h-[92%] m-auto object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.05]"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-background/70 font-display text-xs uppercase tracking-widest">
          Em breve
        </div>
      )}
      {v && !v.availableForSale && (
        <span className="absolute bottom-3 left-3 label-tag">Esgotado</span>
      )}
    </>
  );

  return (
    <Link
      to="/product/$handle"
      params={{ handle }}
      className="group block bg-background border border-foreground/15"
    >
      {variant === "paper" ? (
        <div className="relative aspect-[4/5] bg-brand-cream bg-paper-grain overflow-hidden">
          {/* ground shadow soft */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[68%] h-[8%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 45%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />
          {StageContent}
        </div>
      ) : (
        <FlavorTile
          handle={handle}
          title={product.node.title}
          className="aspect-[4/5]"
        >
          {StageContent}
        </FlavorTile>
      )}

      {/* Faixa branca colada ao tile, info em duas linhas */}
      <div className="bg-background border-t border-foreground/15 px-4 sm:px-5 pt-4 pb-4 flex flex-col gap-3">
        <h3 className="font-display font-black uppercase tracking-tight text-xl sm:text-2xl leading-[0.92] text-center">
          {product.node.title}
        </h3>
        <div className="flex items-end justify-between gap-3">
          <span className="font-display font-black text-2xl text-accent leading-none">
            {formatBRL(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !v?.availableForSale}
            className="rounded-none h-9 px-3 bg-foreground hover:bg-accent text-background font-display uppercase tracking-wider text-xs"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Sacola
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
