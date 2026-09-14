import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyPrices";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/shopify";
import { trackEvent, toAnalyticsItem } from "@/lib/analytics";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

/**
 * Loop Cozinha → Carrinho.
 * Adiciona o condimento protagonista da receita direto na sacola,
 * sem tirar o leitor do modo de fazer.
 */
export function RecipeAddToCart({ handle, label }: { handle: string; label: string }) {
  const { products, loading } = useShopifyProducts();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const eligible = isRebrandEligibleHandle(handle);

  const product = eligible ? products?.get(handle) : undefined;
  const variant = product?.node.variants.edges[0]?.node;
  const price = product?.node.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!eligible || !product || !variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    trackEvent("add_to_cart", {
      currency: variant.price.currencyCode,
      value: parseFloat(variant.price.amount),
      item_list_name: "Cozinha Temperanzza",
      items: [
        toAnalyticsItem({
          handle,
          title: product.node.title,
          price: variant.price.amount,
          quantity: 1,
          listName: "Cozinha Temperanzza",
        }),
      ],
    });
    toast.success(`${product.node.title} foi para a sacola`);
  };

  if (!eligible) return null;

  return (
    <div className="mt-8">
      {price && (
        <p className="font-display font-black text-3xl text-brand-mustard leading-none">
          {formatBRL(price.amount, price.currencyCode)}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-stretch gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || isLoading || !variant?.availableForSale}
          className="inline-flex min-h-[44px] items-center gap-3 bg-brand-mustard text-brand-ink hover:bg-brand-paper disabled:opacity-50 px-6 py-4 font-display uppercase tracking-widest text-sm transition"
        >
          {loading || isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao Carrinho
            </>
          )}
        </button>
        <Link
          to="/product/$handle"
          params={{ handle }}
          className="inline-flex min-h-[44px] items-center gap-2 border border-brand-paper/40 hover:border-brand-mustard px-6 py-4 font-display uppercase tracking-widest text-sm transition"
        >
          Ver o pote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {variant && !variant.availableForSale && (
        <p className="mt-4 font-display uppercase tracking-widest text-xs text-brand-mustard">
          {label} está esgotado no momento
        </p>
      )}
      <p className="mt-4 text-xs text-brand-paper/60 leading-relaxed max-w-sm">
        Embalado lote a lote em Minas Gerais · Envio calculado no fechamento do pedido ·{" "}
        <Link
          to="/sua-caixa"
          className="font-display uppercase tracking-wider text-brand-mustard border-b border-brand-mustard/40 hover:border-brand-mustard"
        >
          12 potes com desconto
        </Link>
      </p>
    </div>
  );
}
