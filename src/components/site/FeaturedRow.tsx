import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { resolveProductImage } from "@/lib/productImages";
import { getProductStageGeometry } from "@/lib/productVisualStage";
import { toast } from "sonner";

export function FeaturedRow({ products, label = "Em destaque" }: { products: ShopifyProduct[]; label?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: products.length > 4, skipSnaps: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(products.length);
  const syncSelection = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); setSnapCount(emblaApi.scrollSnapList().length); }, [emblaApi]);
  useEffect(() => { if (!emblaApi) return; syncSelection(); emblaApi.on("select", syncSelection); emblaApi.on("reInit", syncSelection); return () => { emblaApi.off("select", syncSelection); emblaApi.off("reInit", syncSelection); }; }, [emblaApi, syncSelection]);
  const handleAdd = async (p: ShopifyProduct) => { const v = p.node.variants.edges[0]?.node; if (!v) return; await addItem({ product: p, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions || [] }); toast.success(`${p.node.title} adicionado à sacola`); };
  if (!products?.length) return null;

  return <section aria-label={label} className="relative min-w-0 max-w-full overflow-hidden py-5 sm:py-8">
    <div className="mb-10 flex items-end justify-between gap-6 px-1 sm:mb-14"><div><span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Casa Temperanzza</span><h2 className="mt-2 font-display text-4xl font-semibold leading-none text-brand-ink sm:text-5xl">{label}</h2></div><div className="hidden gap-2 sm:flex"><button type="button" onClick={() => emblaApi?.scrollPrev()} className="grid h-11 w-11 place-items-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-ink/35" aria-label="Produto anterior"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => emblaApi?.scrollNext()} className="grid h-11 w-11 place-items-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-ink/35" aria-label="Próximo produto"><ArrowRight className="h-4 w-4" /></button></div></div>
    <div ref={emblaRef} className="w-full max-w-full min-w-0 overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"><div className="flex min-w-0">{products.map((p, index) => {
      const handle = p.node.handle; const image = p.node.images.edges[0]?.node; const imageResolution = resolveProductImage(handle, image?.url); const img = imageResolution.url; const price = p.node.priceRange.minVariantPrice; const geometry = getProductStageGeometry(handle, "featured");
      return <article key={p.node.id} data-featured-product={handle} data-image-source={imageResolution.source} className="min-w-0 flex-[0_0_70%] px-1.5 sm:flex-[0_0_40%] sm:px-3 lg:flex-[0_0_25%]">
        <div className="group flex min-h-[440px] min-w-0 flex-col bg-transparent px-2 pb-5 text-center sm:min-h-[500px] sm:px-4">
          <Link to="/product/$handle" params={{ handle }} className="relative flex min-h-[300px] min-w-0 flex-1 items-end justify-center overflow-hidden pb-5 sm:min-h-[350px]" aria-label={`Ver ${p.node.title}`}>
            <div aria-hidden className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/10 blur-lg ${geometry.shadowClass}`} />
            {img ? <img decoding="async" src={img} alt={image?.altText || p.node.title} data-product-handle={handle} data-image-source={imageResolution.source} className={`${geometry.imageClass} relative z-[1] max-w-full object-contain drop-shadow-[0_16px_16px_rgba(0,0,0,.12)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.025]`} loading={index < 4 ? "eager" : "lazy"} /> : <div className="flex h-[260px] w-[70%] items-center justify-center px-8 text-center text-sm text-brand-ink/55">Imagem oficial do produto</div>}
          </Link>
          <div className="relative z-10 border-t border-brand-ink/8 pt-5"><Link to="/product/$handle" params={{ handle }}><h3 className="font-display text-2xl font-semibold leading-[1] text-brand-ink sm:text-[1.7rem]">{p.node.title}</h3></Link><div className="mt-4 flex items-center justify-center gap-3 text-sm"><strong className="font-semibold text-brand-ink">{formatBRL(price.amount, price.currencyCode)}</strong><span className="h-4 w-px bg-brand-ink/20" aria-hidden="true" /><button type="button" onClick={() => handleAdd(p)} disabled={isLoading} className="inline-flex min-h-10 items-center gap-1.5 font-semibold uppercase tracking-[0.08em] text-brand-ink transition hover:opacity-55 disabled:opacity-50">{isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Adicionar</button></div></div>
        </div>
      </article>;
    })}</div></div>
    <div className="mt-4 flex items-center justify-center gap-2" aria-label="Paginação do carrossel">{Array.from({ length: snapCount }).map((_, index) => <button key={index} type="button" onClick={() => emblaApi?.scrollTo(index)} className={`h-1.5 rounded-full transition-all duration-300 ${selectedIndex === index ? "w-7 bg-brand-ink" : "w-1.5 bg-brand-ink/20 hover:bg-brand-ink/35"}`} aria-label={`Ir para produto ${index + 1}`} aria-current={selectedIndex === index ? "true" : undefined} />)}</div>
  </section>;
}
