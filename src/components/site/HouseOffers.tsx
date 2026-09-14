import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyPrices";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/shopify";
import { FlavorCarousel } from "@/components/site/FlavorCarousel";
import { HOUSE_OFFERS, type HouseOffer } from "@/lib/offers";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";
import type { ShopifyProduct } from "@/lib/shopify";
import { trackEvent, toAnalyticsItem } from "@/lib/analytics";

export function HouseOffers() {
  const { products, loading } = useShopifyProducts();

  return (
    <section className="section-space bg-brand-cream/45">
      <div className="page-shell">
        <div className="grid gap-6 border-b border-brand-ink/10 pb-8 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Escolhas da Casa</span>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-[.92] tracking-[-0.035em] text-brand-ink sm:text-6xl">
              Mais de um sabor à mesa.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">
            Combinações prontas e caixas para explorar a linha Temperanzza com preços atualizados pela loja.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
          {HOUSE_OFFERS.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} products={products} loadingPrices={loading} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({
  offer,
  products,
  loadingPrices,
}: {
  offer: HouseOffer;
  products: Map<string, ShopifyProduct> | null;
  loadingPrices: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const isAdding = useCartStore((state) => state.isLoading);
  const eligibleHandles = offer.handles.filter((handle) => isRebrandEligibleHandle(handle));
  const resolved = eligibleHandles.map((handle) => products?.get(handle)).filter((product): product is ShopifyProduct => Boolean(product));
  const isKit = offer.kind === "kit";
  const complete = isKit && resolved.length === eligibleHandles.length && eligibleHandles.length === offer.handles.length;

  if (isKit && eligibleHandles.length !== offer.handles.length) return null;
  if (isKit && !loadingPrices && products && !complete) return null;

  const total = resolved.reduce((sum, product) => sum + parseFloat(product.node.priceRange.minVariantPrice.amount || "0"), 0);
  const currency = resolved[0]?.node.priceRange.minVariantPrice.currencyCode ?? "BRL";
  const available = resolved.every((product) => product.node.variants.edges.some((variant) => variant.node.availableForSale));

  const handleAddKit = async () => {
    for (const product of resolved) {
      const variant = product.node.variants.edges[0]?.node;
      if (!variant) continue;
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
    }

    trackEvent("select_promotion", {
      promotion_name: offer.title,
      currency,
      value: total,
      items: resolved.map((product) =>
        toAnalyticsItem({
          handle: product.node.handle,
          title: product.node.title,
          price: product.node.priceRange.minVariantPrice.amount,
          quantity: 1,
          listName: `Oferta: ${offer.title}`,
        }),
      ),
    });
    toast.success(`${offer.title} foi para a sacola`);
  };

  const sceneHandles = (offer.sceneHandles ?? eligibleHandles).filter((handle) => isRebrandEligibleHandle(handle));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2.25rem] bg-white shadow-[0_16px_50px_rgba(34,31,27,.06)] ring-1 ring-brand-ink/6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(34,31,27,.09)]">
      <div className="overflow-hidden bg-brand-paper">
        <FlavorCarousel handles={sceneHandles} products={products} countLabel={offer.sceneLabel} />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="self-start rounded-full bg-brand-cream px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink/65">
          {offer.tag}
        </span>
        <h3 className="mt-5 font-display text-3xl font-semibold leading-[.95] tracking-[-0.025em] text-brand-ink">{offer.title}</h3>
        <p className="mt-3 text-base leading-6 text-brand-ink/72">{offer.promise}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{offer.contains}</p>

        {isKit && total > 0 ? (
          <p className="mt-6 font-display text-3xl font-semibold text-brand-ink">{formatBRL(total, currency)}</p>
        ) : (
          <div className="mt-6 h-9" aria-hidden="true" />
        )}

        <div className="mt-7 flex flex-1 items-end">
          {isKit ? (
            <button
              type="button"
              onClick={handleAddKit}
              disabled={loadingPrices || isAdding || !complete || !available}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-6 text-sm font-semibold text-brand-paper transition hover:bg-brand-ink/88 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loadingPrices || isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="h-4 w-4" />{available ? offer.cta : "Esgotado no momento"}</>}
            </button>
          ) : (
            <Link
              to={offer.to ?? "/sua-caixa"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-brand-ink/18 bg-brand-paper px-6 text-sm font-semibold text-brand-ink transition hover:border-brand-ink hover:bg-brand-ink hover:text-brand-paper"
            >
              {offer.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {offer.note && <p className="mt-4 text-xs leading-5 text-muted-foreground">{offer.note}</p>}
      </div>
    </article>
  );
}
