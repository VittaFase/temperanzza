import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  formatBRL,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Temperanzza` },
      {
        name: "description",
        content: `Produto ${params.handle} da casa Temperanzza.`,
      },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl py-24 px-6 text-center">
        <h1 className="font-display uppercase text-4xl">Produto não encontrado</h1>
        <Link
          to="/produtos"
          className="inline-block mt-6 underline underline-offset-4"
        >
          Voltar ao catálogo
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl py-24 px-6 text-center">
        <h1 className="font-display uppercase text-4xl">Erro ao carregar</h1>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, {
        handle,
      });
      const p = res?.data?.productByHandle;
      if (!p) throw notFound();
      return p;
    },
  });

  if (loadingProduct) {
    return (
      <SiteLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }
  if (!product) return null;

  const variant = product.variants.edges[0]?.node;
  const images = product.images.edges;
  const mainImage = images[imgIdx]?.node || images[0]?.node;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.title} adicionado à sacola`);
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link
          to="/produtos"
          className="inline-flex items-center text-sm uppercase tracking-wider font-semibold hover:text-accent mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao catálogo
        </Link>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="aspect-square bg-brand-cream overflow-hidden border border-foreground/10">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img: any, i: number) => (
                  <button
                    key={img.node.url}
                    onClick={() => setImgIdx(i)}
                    className={`aspect-square overflow-hidden border ${
                      i === imgIdx
                        ? "border-accent"
                        : "border-foreground/10 hover:border-foreground/30"
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Temperanzza
            </span>
            <h1 className="font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl mt-3 tracking-tight leading-[0.95]">
              {product.title}
            </h1>
            <p className="mt-6 text-3xl font-bold">
              {formatBRL(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
            {product.description && (
              <p className="mt-6 text-foreground/80 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-foreground/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-12 w-12"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-12 w-12"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={isLoading || !variant?.availableForSale}
                size="lg"
                className="flex-1 rounded-none h-12 bg-foreground text-background hover:bg-accent font-display uppercase tracking-widest"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Adicionar à Sacola
                  </>
                )}
              </Button>
            </div>
            {variant && !variant.availableForSale && (
              <p className="mt-4 text-sm text-accent font-semibold uppercase tracking-wider">
                Esgotado no momento
              </p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
