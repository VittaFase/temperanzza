import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";
import { BrandSeal } from "@/components/site/BrandSeal";
import { FeaturedRow } from "@/components/site/FeaturedRow";
import { Button } from "@/components/ui/button";
import { Flame, Leaf, Award, ArrowRight } from "lucide-react";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Temperanzza — Casa de Temperos Artesanais" },
      {
        name: "description",
        content:
          "Misturas curadas para cozinhas de verdade. Páprica, chimi churri, lemon pepper e mais. Embalado fresco, sem aditivos desnecessários.",
      },
      {
        property: "og:title",
        content: "Temperanzza — Casa de Temperos Artesanais",
      },
      {
        property: "og:description",
        content:
          "Misturas curadas para cozinhas de verdade. Páprica, chimi churri, lemon pepper e mais.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["shopify-featured", 3],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: 3,
        query: null,
      });
      return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-foreground/15">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <BrandSeal size="sm" className="h-12 w-12" />
              <span className="divider-stencil w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Desde 2019 — Minas Gerais
              </span>
            </div>
            <h1 className="font-display font-black uppercase leading-[0.92] tracking-tight text-[12vw] sm:text-7xl lg:text-8xl xl:text-[7rem]">
              Tempero
              <br />
              <span className="text-accent">de verdade</span>
              <br />
              pra cozinha
              <br />
              que respeita.
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/80 leading-relaxed">
              Misturas autorais embaladas a cada lote. Sem corantes, sem
              gordura hidrogenada, sem atalhos. Só especiarias selecionadas e
              o tempo certo na mão de quem cozinha.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-none h-14 px-8 bg-foreground text-background hover:bg-accent font-display uppercase tracking-widest"
              >
                <Link to="/produtos">
                  Ver o Catálogo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none h-14 px-8 border-foreground/30 bg-transparent hover:bg-foreground hover:text-background font-display uppercase tracking-widest"
              >
                <Link to="/sobre">A Casa</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-square relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <BrandSeal
                  size="full"
                  embossed
                  eager
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="absolute top-4 left-4 right-4 flex justify-between text-foreground/40 text-[10px] font-display uppercase tracking-widest z-10">
                <span>45g</span>
                <span className="invisible">—</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-foreground/40 text-[10px] font-display uppercase tracking-widest z-10">
                <span>Artesanal</span>
                <span>Sem aditivos</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-4 py-2 font-display uppercase tracking-widest text-xs">
              19 referências
            </div>
          </div>

        </div>
      </section>


      {/* MANIFESTO STRIP */}
      <section className="border-b border-foreground/15 bg-brand-ink text-brand-paper py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[11px] font-display uppercase tracking-[0.3em]">
          <span>Embalado a cada lote</span>
          <span className="text-accent">●</span>
          <span>Especiarias selecionadas</span>
          <span className="text-accent">●</span>
          <span>Receitas autorais</span>
          <span className="text-accent">●</span>
          <span>Made in Minas</span>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
            {[
              {
                icon: Flame,
                title: "Sabor que assina",
                body: "Cada mistura tem proporção testada à exaustão. Você abre o pote e reconhece de longe.",
              },
              {
                icon: Leaf,
                title: "Origem rastreada",
                body: "Páprica defumada da Espanha, cúrcuma indiana, ervas brasileiras. Cada ingrediente onde nasce melhor.",
              },
              {
                icon: Award,
                title: "Sem atalho",
                body: "Sem corantes artificiais, sem realçador, sem gordura trans. Só o que precisa estar lá.",
              },
            ].map((p) => (
              <div key={p.title} className="bg-background p-8 lg:p-10">
                <p.icon className="h-7 w-7 text-accent mb-5" strokeWidth={1.5} />
                <h3 className="font-display uppercase text-xl tracking-wide mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROW — padrão Kinder's "Featured Products" */}
      {featured && featured.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FeaturedRow products={featured} label="Em destaque" />
          </div>
        </section>
      )}



      {/* PRODUCT GRID */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                A Coleção
              </span>
              <h2 className="font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl mt-2 tracking-tight">
                Os Temperos da Casa
              </h2>
            </div>
            <Link
              to="/produtos"
              className="text-sm font-semibold uppercase tracking-wider hover:text-accent border-b border-foreground/40 hover:border-accent pb-0.5"
            >
              Ver tudo →
            </Link>
          </div>
          <ProductGrid first={8} />
        </div>
      </section>

      {/* SELO DA CASA */}
      <section className="bg-brand-cream relative overflow-hidden border-y border-foreground/15">
        <div className="absolute inset-0 bg-paper-grain opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <div className="flex items-center justify-center gap-6">
            <span className="divider-stencil w-16 sm:w-24" />
            <BrandSeal size="xl" className="h-40 w-40 sm:h-56 sm:w-56" />
            <span className="divider-stencil w-16 sm:w-24" />
          </div>
          <p className="mt-8 font-serif italic text-2xl sm:text-3xl text-foreground/90 leading-snug">
            Casa de temperos. Minas Gerais. Desde 2019.
          </p>
          <p className="mt-4 text-xs font-display uppercase tracking-[0.4em] text-muted-foreground">
            Selo da Casa · Receita autoral · Lote a lote
          </p>
        </div>
      </section>

      {/* EDITORIAL QUOTE */}
      <section className="bg-brand-ink text-brand-paper py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl leading-relaxed">
            “Tempero bom não é o que esconde o ingrediente.
            <br />
            É o que faz ele aparecer.”
          </p>
          <div className="mt-8 inline-flex items-center gap-3">
            <span className="divider-stencil w-8" />
            <span className="text-xs font-display uppercase tracking-[0.4em] text-brand-paper/60">
              A Casa Temperanzza
            </span>
            <span className="divider-stencil w-8" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
