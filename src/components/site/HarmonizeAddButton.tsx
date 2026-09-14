import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyPrices";
import { useCartStore } from "@/stores/cartStore";
import { trackEvent, toAnalyticsItem } from "@/lib/analytics";
import { isRebrandExcludedHandle } from "@/lib/rebrandCatalog";

/**
 * Botão compacto "Adicionar" para os cards de harmonização.
 * Reaproveita integralmente o carrinho existente (useCartStore + Shopify).
 */
export function HarmonizeAddButton({
  handle,
  name,
}: {
  handle: string;
  name: string;
}) {
  const { products, loading } = useShopifyProducts();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const isExcluded = isRebrandExcludedHandle(handle);

  const product = isExcluded ? undefined : products?.get(handle);
  const variant = product?.node.variants.edges[0]?.node;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExcluded || !product || !variant) return;
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
      item_list_name: "Harmoniza também com",
      items: [
        toAnalyticsItem({
          handle,
          title: product.node.title,
          price: variant.price.amount,
          quantity: 1,
          listName: "Harmoniza também com",
        }),
      ],
    });
    toast.success(`${product.node.title} foi para a sacola`);
  };

  if (isExcluded) return null;

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={loading || isLoading || !variant?.availableForSale}
      aria-label={`Adicionar ${name} ao carrinho`}
      className="mt-4 inline-flex min-h-[40px] items-center gap-2 border border-brand-ink/30 hover:border-accent hover:bg-brand-ink hover:text-brand-paper disabled:opacity-40 px-4 py-2 font-display uppercase tracking-[0.2em] text-[10px] transition-colors"
    >
      {loading || isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </>
      )}
    </button>
  );
}
