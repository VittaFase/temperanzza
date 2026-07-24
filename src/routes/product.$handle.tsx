import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  STOREFRONT_QUERY,
  formatBRL,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { FlavorTiles } from "@/components/site/FlavorTiles";
import { CombinaCom } from "@/components/site/CombinaCom";
import { getProductImage } from "@/lib/productImages";
import { getProductDiet } from "@/lib/dietCompatibility";
import { DietCompatibilityPanel } from "@/components/site/DietCompatibilityPanel";
import { getRecipesByHandle } from "@/lib/recipes";
import { BookOpen } from "lucide-react";

const SITE_URL = "https://temperanzza.com.br";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  options?: Array<{ name: string; values: string[] }>;
}

function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

const productQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: async (): Promise<ProductNode> => {
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      const p = res?.data?.productByHandle;
      if (!p) throw notFound();
      return p as ProductNode;
    },
  });

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(productQueryOptions(params.handle)),
  head: ({ params, loaderData }) => {
    const url = `${SITE_URL}/product/${params.handle}`;
    const p = loaderData as ProductNode | undefined;
    if (!p) {
      return {
        meta: [
          { title: `${params.handle} — Temperanzza` },
          { name: "description", content: `Produto ${params.handle} da casa Temperanzza.` },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const description = (
      p.description ||
      `${p.title} — tempero artesanal Temperanzza, embalado a cada lote em Minas Gerais.`
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);
    const imageAbs =
      toAbsoluteUrl(getProductImage(p.handle)) ?? toAbsoluteUrl(p.images.edges[0]?.node.url);
    const price = p.priceRange.minVariantPrice.amount;
    const currency = p.priceRange.minVariantPrice.currencyCode;
    const anyAvailable = p.variants.edges.some((v) => v.node.availableForSale);
    const productLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      description,
      sku: p.handle,
      brand: { "@type": "Brand", name: "Temperanzza" },
      category: "Temperos e Especiarias",
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: currency,
        price,
        availability: anyAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };
    if (imageAbs) productLd.image = imageAbs;

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/produtos` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    };

    return {
      meta: [
        { title: `${p.title} — Temperanzza` },
        { name: "description", content: description },
        { property: "og:title", content: `${p.title} — Temperanzza` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(imageAbs
          ? [
              { property: "og:image", content: imageAbs },
              { name: "twitter:image", content: imageAbs },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: url },
        ...(imageAbs
          ? [
              {
                rel: "preload",
                as: "image" as const,
                href: imageAbs,
                fetchpriority: "high",
              },
            ]
          : []),
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl py-24 px-6 text-center">
        <h1 className="font-display uppercase text-4xl">Produto não encontrado</h1>
        <Link to="/produtos" className="inline-block mt-6 underline underline-offset-4">
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
      const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      const p = res?.data?.productByHandle;
      if (!p) throw notFound();
      return p;
    },
  });

  const { data: allProducts } = useQuery({
    queryKey: ["shopify-products", 24],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: 24,
        query: null,
      });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <Link
          to="/produtos"
          className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-display font-bold hover:text-accent mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* GALERIA — vitrine clara, pote flutuando sobre cream */}
          <div>
            <div className="relative aspect-square bg-brand-cream bg-paper-grain overflow-hidden border border-foreground/10">
              <div
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[58%] h-[6%] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.08) 50%, transparent 78%)",
                  filter: "blur(4px)",
                }}
              />
              {mainImage ? (
                <img
                  src={getProductImage(handle, mainImage.url) ?? mainImage.url}
                  alt={mainImage.altText || product.title}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-[74%] h-[88%] m-auto object-contain drop-shadow-[0_32px_36px_rgba(0,0,0,0.22)]"
                />
              ) : null}

            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img: { node: { url: string; altText: string | null } }, i: number) => (
                  <button
                    key={img.node.url}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Ver imagem ${i + 1} de ${product.title}`}
                    aria-pressed={i === imgIdx}
                    className={`relative aspect-square overflow-hidden border-2 bg-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      i === imgIdx ? "border-accent" : "border-foreground/10 hover:border-foreground/30"
                    }`}
                  >
                    <img
                      src={getProductImage(handle, img.node.url) ?? img.node.url}
                      alt=""
                      className="absolute inset-0 w-[78%] h-[86%] m-auto object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* INFO */}
          <div>
            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground font-display font-bold uppercase tracking-widest text-xs">
              Temperanzza
            </span>
            <h1 className="font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl mt-4 tracking-tight leading-[0.92]">
              {product.title}
            </h1>
            <p className="mt-5 font-display font-black text-4xl text-accent leading-none">
              {formatBRL(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
            {product.description && (
              <p className="mt-6 text-foreground/80 leading-relaxed whitespace-pre-line font-serif italic text-lg">
                {product.description}
              </p>
            )}

            {variant?.title && variant.title !== "Default Title" && (
              <div className="mt-8">
                <p className="font-display uppercase tracking-wider text-xs text-foreground/60">
                  Tamanho
                </p>
                <p className="mt-1 font-display text-lg">{variant.title}</p>
              </div>
            )}

            <div className="mt-10 flex items-stretch gap-3">
              <div className="flex items-center border-2 border-foreground">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-14 w-12 hover:bg-foreground hover:text-background"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-display font-black text-xl">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-14 w-12 hover:bg-foreground hover:text-background"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={isLoading || !variant?.availableForSale}
                size="lg"
                className="flex-1 rounded-none h-14 bg-accent text-accent-foreground hover:bg-foreground font-display uppercase tracking-widest text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Adicionar à Sacola
                  </>
                )}
              </Button>
            </div>
            {variant && !variant.availableForSale && (
              <p className="mt-4 text-sm text-accent font-display font-bold uppercase tracking-wider">
                Esgotado no momento
              </p>
            )}

            {/* Grid de outros sabores */}
            {allProducts && allProducts.length > 1 && (
              <FlavorTiles products={allProducts} currentHandle={handle} />
            )}
          </div>
        </div>

        {/* Compatibilidade dietética */}
        <DietSectionForProduct handle={handle} />
      </div>
    </SiteLayout>
  );
}

function DietSectionForProduct({ handle }: { handle: string }) {
  const diet = getProductDiet(handle);
  const recipes = getRecipesByHandle(handle);
  if (!diet && recipes.length === 0) return null;
  return (
    <section className="mt-16 lg:mt-24 grid lg:grid-cols-3 gap-8">
      {diet && (
        <div className="lg:col-span-2">
          <DietCompatibilityPanel diet={diet} />
        </div>
      )}
      <aside className="border border-foreground/15 bg-brand-cream/60 bg-paper-grain p-6 lg:p-7 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            Na Cozinha Temperanzza
          </span>
        </div>
        <h3 className="font-display font-black uppercase text-2xl leading-[0.95]">
          {recipes.length > 0
            ? `${recipes.length} receita${recipes.length > 1 ? "s" : ""} com este tempero`
            : "Explore receitas para sua dieta"}
        </h3>
        <ul className="mt-5 space-y-3 flex-1">
          {recipes.slice(0, 4).map((r, idx) => (
            <li key={r.slug}>
              <Link
                to="/cozinha/$slug"
                params={{ slug: r.slug }}
                className="group flex items-start gap-3 text-sm hover:text-accent"
              >
                <span
                  className="shrink-0 h-8 w-8 grid place-items-center font-display font-black text-[11px] tracking-tight text-brand-paper"
                  style={{ background: r.hero.color }}
                  aria-hidden
                >
                  Nº{String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-medium leading-snug">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/cozinha"
          className="mt-6 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest text-accent hover:underline underline-offset-4"
        >
          Ir para a Cozinha →
        </Link>
      </aside>
    </section>
  );
}
