import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

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
      params={{ handle: product.node.handle }}
      className="group block border border-foreground/10 bg-card hover:border-accent transition-colors"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-display text-xs uppercase">
            Sem imagem
          </div>
        )}
        {variant && !variant.availableForSale && (
          <span className="absolute top-3 left-3 label-tag bg-foreground/80">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col gap-2">
        <h3 className="font-display uppercase tracking-wide text-lg leading-tight">
          {product.node.title}
        </h3>
        <div className="flex items-end justify-between gap-3 mt-1">
          <span className="font-bold text-lg">
            {formatBRL(price.amount, price.currencyCode)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
            className="rounded-none h-9 px-3 bg-foreground hover:bg-accent text-background font-semibold uppercase tracking-wider text-xs"
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
