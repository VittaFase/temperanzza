import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Film, Popcorn, Flame } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  formatBRL,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { getProductImage } from "@/lib/productImages";
import { toast } from "sonner";

export const Route = createFileRoute("/temperaflix")({
  head: () => ({
    meta: [
      { title: "Temperaflix — O tempero que entra em cena | Temperanzza" },
      {
        name: "description",
        content:
          "Linha de shakers Temperaflix: Tradicional, Ervas Finas e Bacon. O sabor oficial dos seus momentos de tela — pipoca, snacks, séries e filmes.",
      },
      { property: "og:title", content: "Temperaflix — O tempero que entra em cena" },
      {
        property: "og:description",
        content:
          "Três shakers para temperar seus momentos de tela. Pipoca, snacks e maratonas com o sabor Temperanzza.",
      },
    ],
  }),
  component: TemperaflixPage,
});

const GENRES: Record<
  string,
  { genre: string; tagline: string; pairing: string; Icon: typeof Film }
> = {
  tradicional: {
    genre: "O Clássico",
    tagline: "Atemporal. Vai bem com qualquer trama.",
    pairing: "Pipoca de cinema, batata rústica, amendoim torrado.",
    Icon: Popcorn,
  },
  ervas: {
    genre: "O Drama Sofisticado",
    tagline: "Aromático, elegante, para cenas memoráveis.",
    pairing: "Pipoca gourmet, castanhas, snacks premium.",
    Icon: Film,
  },
  bacon: {
    genre: "O Blockbuster",
    tagline: "Defumado, intenso, indulgente.",
    pairing: "Batata frita, torresmo, pipoca de bacon.",
    Icon: Flame,
  },
};

function classify(title: string): keyof typeof GENRES {
  const t = title.toLowerCase();
  if (t.includes("bacon")) return "bacon";
  if (t.includes("ervas")) return "ervas";
  return "tradicional";
}

function useTemperaflix() {
  return useQuery({
    queryKey: ["shopify-temperaflix"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: 10,
        query: "title:Temperaflix*",
      });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });
}

function ShakerCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const meta = GENRES[classify(product.node.title)];
  const Icon = meta.Icon;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.node.title} entrou na sacola`);
  };

  return (
    <article className="group flex flex-col border border-foreground/15 bg-background overflow-hidden">
      <Link
        to="/product/$handle"
        params={{ handle: product.node.handle }}
        className="relative block aspect-[4/5] bg-brand-cream bg-paper-grain overflow-hidden"
      >
        <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-accent text-background px-2.5 py-1 text-[10px] font-display uppercase tracking-[0.2em]">
          <Icon className="w-3 h-3" /> {meta.genre}
        </span>
        {/* ground shadow */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[68%] h-[8%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 45%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
        {image ? (
          <img
            src={getProductImage(product.node.handle, image.url) ?? image.url}
            alt={image.altText || product.node.title}
            className="absolute inset-0 w-[82%] h-[92%] m-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.4)] group-hover:-translate-y-1 group-hover:scale-[1.05] transition-transform duration-500"
            loading="lazy"
          />
        ) : null}
      </Link>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-black uppercase text-2xl leading-[0.95] tracking-tight">
          {product.node.title}
        </h3>
        <p className="font-serif italic text-foreground/70 leading-snug">
          {meta.tagline}
        </p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Combina com: {meta.pairing}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="font-display font-black text-3xl text-accent leading-none">
            {formatBRL(price.amount, price.currencyCode)}
          </span>
          <Button
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
            className="rounded-none h-10 px-4 bg-foreground hover:bg-accent text-background font-display uppercase tracking-wider text-xs"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Sacola
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

function TemperaflixPage() {
  const { data, isLoading, error } = useTemperaflix();
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const handleCombo = async () => {
    if (!data || data.length === 0) return;
    for (const p of data) {
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
    toast.success("Combo Maratona adicionado à sacola");
  };

  const total =
    data?.reduce(
      (sum, p) =>
        sum + parseFloat(p.node.priceRange.minVariantPrice.amount || "0"),
      0,
    ) ?? 0;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, oklch(0.52 0.21 28 / 0.6), transparent 55%), radial-gradient(circle at 80% 70%, oklch(0.7 0.16 70 / 0.4), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-background/70 border-l-2 border-accent pl-3">
            <Film className="w-3.5 h-3.5" /> Temperaflix · Uma linha Temperanzza
          </span>
          <h1 className="mt-6 font-display font-black uppercase text-6xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tight max-w-4xl">
            O tempero que <span className="text-accent">entra em cena</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/75 leading-relaxed">
            Três shakers prontos para a hora do sofá. Pipoca, batata,
            amendoim — o sabor oficial dos seus momentos de tela, do clássico
            de domingo à maratona de madrugada.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#shakers">
              <Button className="rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                Ver os 3 sabores
              </Button>
            </a>
            <a href="#combo">
              <Button
                variant="outline"
                className="rounded-none h-12 px-6 border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground font-display uppercase tracking-wider"
              >
                Levar o combo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SHAKERS */}
      <section id="shakers" className="py-20 sm:py-24 border-b border-foreground/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Três shakers, três gêneros
              </span>
              <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl tracking-tight">
                Escolha sua sessão
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Cada blend foi pensado para um tipo de noite. Misture, alterne,
              colecione os três.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error || !data || data.length === 0 ? (
            <div className="border-2 border-dashed border-foreground/15 py-20 px-6 text-center">
              <p className="font-display text-2xl uppercase tracking-wide">
                Shakers a caminho
              </p>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                A linha Temperaflix está sendo finalizada no estoque. Volte em
                instantes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.map((p) => (
                <ShakerCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MOMENTOS DE TELA */}
      <section className="py-20 sm:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Momentos de tela
          </span>
          <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl tracking-tight max-w-3xl">
            Como temperar sua maratona
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                t: "Domingo de filme em família",
                d: "Tigela de pipoca no centro, Tradicional na mão. O sabor que todo mundo aprova sem discussão.",
              },
              {
                t: "Noite de série, luz baixa",
                d: "Ervas Finas em castanhas e pipoca gourmet. Aroma que pede uma segunda taça.",
              },
              {
                t: "Game night, jogo decisivo",
                d: "Bacon defumado em batata frita e petiscos. Intensidade à altura da rodada.",
              },
            ].map((m) => (
              <div
                key={m.t}
                className="border-l-2 border-accent pl-5 py-1"
              >
                <h3 className="font-serif italic text-2xl leading-tight">
                  {m.t}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMBO */}
      <section
        id="combo"
        className="py-20 sm:py-24 bg-foreground text-background"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-display uppercase tracking-[0.35em] text-accent">
            Combo Maratona
          </span>
          <h2 className="mt-4 font-display font-black uppercase text-5xl sm:text-6xl tracking-tight">
            Os três, no mesmo sofá
          </h2>
          <p className="mt-6 text-background/75 max-w-2xl mx-auto leading-relaxed">
            Tradicional, Ervas Finas e Bacon — pronto para qualquer gênero que
            a noite pedir. Adicione os três à sacola em um clique.
          </p>
          {data && data.length > 0 && (
            <p className="mt-6 font-display text-3xl text-accent">
              {formatBRL(total, "BRL")}
              <span className="ml-2 text-sm uppercase tracking-[0.3em] text-background/60">
                pelos 3 shakers
              </span>
            </p>
          )}
          <div className="mt-10">
            <Button
              onClick={handleCombo}
              disabled={isAdding || !data || data.length === 0}
              className="rounded-none h-12 px-8 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Adicionar os 3 à sacola"
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* FAIXA DE MARCA */}
      <section className="py-16 border-b border-foreground/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif italic text-xl text-foreground/80">
              Uma marca Temperanzza · Casa de temperos de Minas Gerais
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore o catálogo completo com os 19 temperos da casa.
            </p>
          </div>
          <Link to="/produtos">
            <Button
              variant="outline"
              className="rounded-none h-11 px-6 border-foreground/30 bg-transparent font-display uppercase tracking-wider"
            >
              Ver catálogo completo
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
