import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { FlavorTile } from "./FlavorTile";
import { ProductBadge } from "./ProductBadge";
import { getBadge } from "@/lib/flavorPalette";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const handle = product.node.handle;
  const badge = getBadge(handle, product.node.title);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.node.title} adicionado à sacola`);
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle }}
      className="group block bg-card"
    >
      <FlavorTile
        handle={handle}
        title={product.node.title}
        className="aspect-[4/5]"
      >
        {badge && (
          <ProductBadge label={badge} size="md" className="top-4 left-4" />
        )}
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            className="absolute inset-0 w-[72%] h-[82%] m-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] group-hover:scale-[1.06] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-background/70 font-display text-xs uppercase tracking-widest">
            Em breve
          </div>
        )}
        {variant && !variant.availableForSale && (
          <span className="absolute bottom-4 left-4 label-tag">Esgotado</span>
        )}
      </FlavorTile>

      <div className="p-4 sm:p-5 flex flex-col gap-2 border-x border-b border-foreground/10">
        <h3 className="font-display font-black uppercase tracking-tight text-xl leading-[0.95]">
          {product.node.title}
        </h3>
        <div className="flex items-end justify-between gap-3 mt-1">
          <span className="font-display font-black text-2xl text-accent leading-none">
            {formatBRL(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
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
