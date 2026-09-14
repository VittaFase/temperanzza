import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { FlavorTile } from "./FlavorTile";
import { ProductBadge } from "./ProductBadge";
import { getBadge } from "@/lib/flavorPalette";
import { resolveProductImage } from "@/lib/productImages";
import { getProductStageGeometry } from "@/lib/productVisualStage";
import { DietDotStrip } from "./DietBadge";
import { getProductDiet } from "@/lib/dietCompatibility";
import { DIETS } from "@/lib/diets";

export function ProductCard({ product, variant = "paper" }: { product: ShopifyProduct; variant?: "color" | "paper" }) {
  const addItem = useCartStore((s) => s.addItem); const isLoading = useCartStore((s) => s.isLoading);
  const v = product.node.variants.edges[0]?.node; const image = product.node.images.edges[0]?.node; const price = product.node.priceRange.minVariantPrice; const handle = product.node.handle;
  const imageResolution = resolveProductImage(handle, image?.url); const imgUrl = imageResolution.url; const badge = getBadge(handle, product.node.title); const isPaper = variant === "paper"; const geometry = getProductStageGeometry(handle, "catalog");
  const handleAdd = async (e: React.MouseEvent) => { e.preventDefault(); if (!v) return; await addItem({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions || [] }); toast.success(`${product.node.title} adicionado à sacola`); };
  const StageContent = <>{badge && !isPaper && <ProductBadge label={badge} size="md" className="top-3 left-3" />}{imgUrl ? <img decoding="async" src={imgUrl} alt={image?.altText || product.node.title} data-product-handle={handle} data-image-source={imageResolution.source} className={`absolute inset-0 m-auto object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,.12)] transition duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.035] ${isPaper ? geometry.imageClass : "h-[90%] w-[82%]"}`} loading="lazy" /> : <div className="absolute inset-0 grid place-items-center text-foreground/40 text-xs uppercase tracking-widest">Em breve</div>}{v && !v.availableForSale && <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-widest">Esgotado</span>}</>;
  return <Link to="/product/$handle" params={{ handle }} data-product-card={handle} data-image-source={imageResolution.source} className="group block min-w-0 bg-transparent">
    {isPaper ? <div className="relative aspect-[4/5] overflow-hidden bg-transparent"><div aria-hidden className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/10 blur-lg pointer-events-none ${geometry.shadowClass}`} />{StageContent}</div> : <FlavorTile handle={handle} title={product.node.title} className="aspect-[4/5]">{StageContent}</FlavorTile>}
    <div className="pt-5 text-center"><h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[.95] tracking-tight text-brand-ink">{product.node.title}</h3><div className="mt-3 flex flex-col items-center gap-3"><span className="text-base font-semibold tabular-nums text-brand-ink">{formatBRL(price.amount, price.currencyCode)}</span><button type="button" onClick={handleAdd} disabled={isLoading || !v?.availableForSale} className="inline-flex min-h-10 items-center justify-center gap-2 border-b border-brand-ink/30 px-1 pb-1 text-xs font-semibold uppercase tracking-[.12em] text-brand-ink transition hover:border-brand-ink disabled:opacity-40">{isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Plus className="h-3.5 w-3.5" />Adicionar à sacola</>}</button></div><ProductDietDots handle={handle} /></div>
  </Link>;
}
function ProductDietDots({ handle }: { handle: string }) { const diet = getProductDiet(handle); if (!diet) return null; return <div className="mt-4 flex items-center justify-center gap-3 border-t border-brand-ink/8 pt-3" title="Compatibilidade dietética"><span className="text-[9px] uppercase tracking-[.16em] text-muted-foreground">Dietas</span><DietDotStrip verdicts={diet.verdicts} diets={DIETS.map((d) => d.key)} /></div>; }
