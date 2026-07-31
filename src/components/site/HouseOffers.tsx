import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyPrices";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { HOUSE_OFFERS, type HouseOffer } from "@/lib/offers";
import type { ShopifyProduct } from "@/lib/shopify";
import { trackEvent, toAnalyticsItem } from "@/lib/analytics";

/**
 * Ofertas da Casa — blocos de oferta estruturada com preço real da Shopify.
 * Kits adicionam todos os potes na sacola de uma vez; a caixa de 12 leva
 * para o construtor de blend.
 */
export function HouseOffers() {
  const { products, loading } = useShopifyProducts();

  return (
    <section className="border-y border-foreground/15 bg-brand-cream/60 bg-paper-grain py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-foreground pb-4">
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight">
            Ofertas da Casa
          </h2>
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            Combinações prontas · preço real
          </span>
        </div>
        <p className="mt-5 max-w-2xl text-foreground/75 leading-relaxed">
          Três formas de entrar na casa: o combo da linha de sofá, o duo de
          moagem fina e a caixa que você assina como Chefe da Casa.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {HOUSE_OFFERS.map((offer) => (
            <OfferCard
              key={offer.slug}
              offer={offer}
              products={products}
              loadingPrices={loading}
            />
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
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const resolved = offer.handles
    .map((h) => products?.get(h))
    .filter((p): p is ShopifyProduct => Boolean(p));

  const isKit = offer.kind === "kit";
  const complete = isKit && resolved.length === offer.handles.length;

  // Kit sem todos os potes disponíveis na loja não é exibido.
  if (isKit && !loadingPrices && products && !complete) return null;

  const total = resolved.reduce(
    (sum, p) => sum + parseFloat(p.node.priceRange.minVariantPrice.amount || "0"),
    0,
  );
  const currency =
    resolved[0]?.node.priceRange.minVariantPrice.currencyCode ?? "BRL";
  const available = resolved.every((p) =>
    p.node.variants.edges.some((v) => v.node.availableForSale),
  );

  const handleAddKit = async () => {
    for (const p of resolved) {
      const v = p.node.variants.edges[0]?.node;
      if (!v) continue;
      await addItem({
        product: p,
        variantId: v.id,
        variantTitle: v.title,
        price: v.price,
        quantity: 1,
        selectedOptions: v.selectedOptions || [],
      });
    }
    trackEvent("select_promotion", {
      promotion_name: offer.title,
      currency,
      value: total,
      items: resolved.map((p) =>
        toAnalyticsItem({
          handle: p.node.handle,
          title: p.node.title,
          price: p.node.priceRange.minVariantPrice.amount,
          quantity: 1,
          listName: `Oferta: ${offer.title}`,
        }),
      ),
    });
    toast.success(`${offer.title} foi para a sacola`);
  };

  const sceneHandles = isKit
    ? offer.handles
    : (offer.sceneHandles ?? []);

  return (
    <article className="flex flex-col border border-foreground/15 bg-background">
      {/* potes reais em cena */}
      <div className="relative h-40 sm:h-48 border-b border-foreground/10 bg-brand-cream bg-paper-grain overflow-hidden">
        <div
          className={
            isKit
              ? "absolute inset-0 flex items-end justify-center gap-1 sm:gap-2 pb-3"
              : "absolute inset-0 flex items-end justify-center pb-3 px-2"
          }
        >
          {sceneHandles.map((h) => {
            const src = getProductImage(
              h,
              products?.get(h)?.node.images.edges[0]?.node.url,
            );
            if (!src) return null;
            return (
              <img
                key={h}
                src={src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className={
                  isKit
                    ? "h-[86%] w-auto object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.22)]"
                    : "h-[62%] sm:h-[70%] w-auto object-contain -ml-[7%] first:ml-0 drop-shadow-[0_14px_18px_rgba(0,0,0,0.2)]"
                }
              />
            );
          })}
        </div>
        {!isKit && sceneHandles.length > 0 && (
          <span className="absolute left-3 top-3 bg-foreground text-background px-2 py-1 font-display uppercase tracking-widest text-[10px]">
            {sceneHandles.length} sabores da casa
          </span>
        )}
      </div>


      <div className="p-6 flex flex-col flex-1">
        <span className="inline-flex self-start bg-foreground text-background px-2.5 py-1 font-display uppercase tracking-widest text-[10px]">
          {offer.tag}
        </span>
        <h3 className="mt-4 font-display font-black uppercase text-2xl leading-[0.95]">
          {offer.title}
        </h3>
        <p className="mt-3 font-serif italic text-lg text-foreground/80 leading-snug">
          {offer.promise}
        </p>
        <p className="mt-3 text-sm text-foreground/65 leading-relaxed">
          {offer.contains}
        </p>

        {isKit && total > 0 && (
          <p className={`mt-5 font-display font-black text-3xl leading-none ${offer.accentClass}`}>
            {formatBRL(total, currency)}
          </p>
        )}

        <div className="mt-6 flex-1 flex items-end">
          {isKit ? (
            <button
              type="button"
              onClick={handleAddKit}
              disabled={loadingPrices || isAdding || !complete || !available}
              className="w-full inline-flex min-h-[48px] items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-foreground hover:text-background disabled:opacity-50 px-6 font-display uppercase tracking-widest text-sm transition"
            >
              {loadingPrices || isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {available ? offer.cta : "Esgotado no momento"}
                </>
              )}
            </button>
          ) : (
            <Link
              to={offer.to ?? "/blends"}
              className="w-full inline-flex min-h-[48px] items-center justify-center gap-2 border-2 border-foreground hover:bg-foreground hover:text-background px-6 font-display uppercase tracking-widest text-sm transition"
            >
              {offer.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {offer.note && (
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            {offer.note}
          </p>
        )}
      </div>
    </article>
  );
}
