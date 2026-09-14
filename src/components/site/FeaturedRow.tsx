import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { getFlavorTone } from "@/lib/flavorPalette";
import { toast } from "sonner";

/**
 * Product stage inspired by premium seasoning storefront mechanics:
 * native swipe on mobile, drag on desktop, partial neighboring cards and active-state emphasis.
 * All imagery comes from the official product source; labels are never AI-recreated here.
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: products.length > 3,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(products.length);

  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncSelection();
    emblaApi.on("select", syncSelection);
    emblaApi.on("reInit", syncSelection);
    return () => {
      emblaApi.off("select", syncSelection);
      emblaApi.off("reInit", syncSelection);
    };
  }, [emblaApi, syncSelection]);

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
    <section aria-label={label} className="relative min-w-0 overflow-hidden py-4">
      <div className="mb-8 flex items-end justify-between gap-6 px-1 sm:mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Casa Temperanzza
          </span>
          <h2 className="mt-2 font-display text-4xl font-semibold leading-none text-brand-ink sm:text-5xl">
            {label}
          </h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} className="grid h-12 w-12 place-items-center rounded-full border border-brand-ink/10 bg-white text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-ink/25" aria-label="Produto anterior"><ArrowLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} className="grid h-12 w-12 place-items-center rounded-full bg-brand-ink text-brand-paper transition hover:-translate-y-0.5 hover:opacity-90" aria-label="Próximo produto"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div ref={emblaRef} className="w-full min-w-0 overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing">
        <div className="flex -ml-3 sm:-ml-5">
          {products.map((p, index) => {
            const handle = p.node.handle;
            const image = p.node.images.edges[0]?.node;
            const img = getProductImage(handle, image?.url);
            const tone = getFlavorTone(handle, p.node.title);
            const price = p.node.priceRange.minVariantPrice;
            const active = index === selectedIndex;

            return (
              <article key={p.node.id} className="min-w-0 flex-[0_0_84%] pl-3 sm:flex-[0_0_48%] sm:pl-5 lg:flex-[0_0_32%]" aria-current={active ? "true" : undefined}>
                <div className={`group relative flex min-h-[510px] flex-col overflow-hidden rounded-[2.25rem] p-6 transition-[transform,opacity] duration-500 ease-out sm:min-h-[570px] sm:p-8 ${active ? "scale-100 opacity-100" : "scale-[.94] opacity-70"}`} style={{ backgroundColor: tone.bg }}>
                  <Link to="/product/$handle" params={{ handle }} className="relative flex min-h-[310px] flex-1 items-center justify-center sm:min-h-[355px]" aria-label={`Ver ${p.node.title}`}>
                    {img ? <img decoding="async" src={img} alt={image?.altText || p.node.title} className={`h-[300px] w-[78%] object-contain drop-shadow-[0_22px_24px_rgba(0,0,0,.18)] transition-transform duration-500 ease-out sm:h-[350px] ${active ? "translate-y-0 scale-100" : "translate-y-3 scale-[.96]"} group-hover:-translate-y-1 group-hover:scale-[1.025]`} loading={index < 2 ? "eager" : "lazy"} /> : <div className="flex h-[280px] w-[70%] items-center justify-center rounded-[2rem] border border-brand-ink/10 bg-white/25 px-8 text-center text-sm text-brand-ink/55">Imagem oficial do produto</div>}
                  </Link>

                  <div className="relative z-10 mt-2 text-center">
                    <Link to="/product/$handle" params={{ handle }}><h3 className="font-display text-3xl font-semibold leading-[.95] text-brand-ink sm:text-4xl">{p.node.title}</h3></Link>
                    <p className="mt-3 text-sm font-semibold text-brand-ink/75">{formatBRL(price.amount, price.currencyCode)}</p>
                    <div className="mt-5 flex items-center justify-center gap-2">
                      <Link to="/product/$handle" params={{ handle }} className="inline-flex min-h-11 items-center rounded-full bg-white/90 px-5 py-2 text-xs font-semibold text-brand-ink transition hover:bg-white">Ver produto</Link>
                      <button type="button" onClick={() => handleAdd(p)} disabled={isLoading} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-ink px-5 py-2 text-xs font-semibold text-brand-paper transition hover:opacity-90 disabled:opacity-50">
                        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Sacola
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center gap-2" aria-label="Paginação do carrossel">
        {Array.from({ length: snapCount }).map((_, index) => <button key={index} type="button" onClick={() => emblaApi?.scrollTo(index)} className={`h-2 rounded-full transition-all duration-300 ${selectedIndex === index ? "w-8 bg-brand-ink" : "w-2 bg-brand-ink/20 hover:bg-brand-ink/35"}`} aria-label={`Ir para produto ${index + 1}`} aria-current={selectedIndex === index ? "true" : undefined} />)}
      </div>
    </section>
  );
}
