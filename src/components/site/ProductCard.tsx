import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const v = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const handle = product.node.handle;
  const imageResolution = resolveProductImage(handle, image?.url);
  const imgUrl = imageResolution.url;
  const badge = getBadge(handle, product.node.title);
  const isPaper = variant === "paper";
  const geometry = getProductStageGeometry(handle, "catalog");

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!v) return;
    await addItem({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions || [] });
    toast.success(`${product.node.title} adicionado à sacola`);
  };

  const imageSizeClass = isPaper ? geometry.imageClass : "h-[90%] w-[82%]";
  const StageContent = <>
    {badge && !isPaper && <ProductBadge label={badge} size="md" className="top-3 left-3" />}
    {imgUrl ? <img decoding="async" src={imgUrl} alt={image?.altText || product.node.title} data-product-handle={handle} data-image-source={imageResolution.source} className={`absolute inset-0 m-auto object-contain drop-shadow-[0_20px_22px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.025] ${imageSizeClass}`} loading="lazy" /> : <div className="absolute inset-0 grid place-items-center text-foreground/40 font-display text-xs uppercase tracking-widest">Em breve</div>}
    {v && !v.availableForSale && <span className="absolute bottom-3 left-3 label-tag">Esgotado</span>}
  </>;

  return <Link to="/product/$handle" params={{ handle }} data-product-card={handle} data-image-source={imageResolution.source} className="group block bg-background border border-foreground/15">
    {isPaper ? <div className="relative aspect-[4/5] bg-brand-cream bg-paper-grain overflow-hidden">
      <div aria-hidden className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/14 blur-lg pointer-events-none ${geometry.shadowClass}`} />
      {StageContent}
    </div> : <FlavorTile handle={handle} title={product.node.title} className="aspect-[4/5]">{StageContent}</FlavorTile>}
    <div className="bg-background border-t border-foreground/15 px-4 sm:px-5 pt-4 pb-4 flex flex-col gap-3">
      <h3 className="font-display font-black uppercase tracking-tight text-xl sm:text-2xl leading-[0.92] text-center">{product.node.title}</h3>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <span className="font-display font-black text-2xl text-accent leading-none text-center sm:text-left">{formatBRL(price.amount, price.currencyCode)}</span>
        <Button size="sm" onClick={handleAdd} disabled={isLoading || !v?.availableForSale} className="w-full sm:w-auto rounded-none h-11 min-w-11 px-3 bg-foreground hover:bg-accent text-background font-display uppercase tracking-wider text-xs whitespace-nowrap">{isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Plus className="w-3.5 h-3.5 mr-1" />Sacola</>}</Button>
      </div>
      <ProductDietDots handle={handle} />
    </div>
  </Link>;
}

function ProductDietDots({ handle }: { handle: string }) {
  const diet = getProductDiet(handle);
  if (!diet) return null;
  return <div className="flex items-center justify-between pt-2 border-t border-foreground/10" title="Compatibilidade dietética"><span className="text-xs font-display uppercase tracking-widest text-muted-foreground">Dietas</span><DietDotStrip verdicts={diet.verdicts} diets={DIETS.map((d) => d.key)} /></div>;
}
