import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";
import { BrandSeal } from "@/components/site/BrandSeal";
import { TemperaflixShowcase } from "@/components/site/TemperaflixShowcase";
import { Button } from "@/components/ui/button";
import { Flame, Leaf, Award, ArrowRight, Salad } from "lucide-react";
import { RECIPES, MOMENTS } from "@/lib/recipes";
import { DietBadge } from "@/components/site/DietBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Temperanzza — Casa de Temperos Artesanais de Minas Gerais" },
      {
        name: "description",
        content:
          "Temperanzza: casa de temperos artesanais de Minas Gerais. Páprica, chimichurri, lemon pepper, linha Temperaflix e mais — embalado fresco, sem aditivos desnecessários.",
      },
      {
        property: "og:title",
        content: "Temperanzza — Casa de Temperos Artesanais",
      },
      {
        property: "og:description",
        content:
          "Casa de temperos artesanais de Minas Gerais. Misturas curadas para cozinhas de verdade.",
      },
      { property: "og:url", content: "https://temperanzza.com.br/" },
    ],
    links: [{ rel: "canonical", href: "https://temperanzza.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Temperanzza",
          alternateName: "Casa Temperanzza",
          url: "https://temperanzza.com.br",
          logo: "https://temperanzza.com.br/favicon.ico",
          description:
            "Casa de temperos artesanais de Minas Gerais. Misturas curadas para cozinhas de verdade.",
          areaServed: "BR",
          slogan: "Sabor que assina cada prato",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Temperanzza",
          url: "https://temperanzza.com.br",
          inLanguage: "pt-BR",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://temperanzza.com.br/produtos?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
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
                DESDE 2023 — MINAS GERAIS
              </span>
            </div>
            <h1 className="font-display font-black uppercase leading-[0.92] tracking-tight text-[12vw] sm:text-7xl lg:text-8xl xl:text-[7rem]">
              Temperanzza
              <br />
              <span className="text-accent">NOVOS SABORES</span>
              <br />
              PARA O SEU&nbsp;LIFESTYLE.
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/80 leading-relaxed">
              Especiarias selecionadas para dar a seus pratos a explosão de sabor
              que eles merecem.
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
            </div>
          </div>

        </div>
      </section>


      {/* MANIFESTO STRIP */}
      <section className="border-b border-foreground/15 bg-brand-ink text-brand-paper py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[11px] font-display uppercase tracking-[0.3em]">
          <span>Embalado a cada lote</span>
          <span>Especiarias selecionadas</span>
          <span>Made in Minas</span>
        </div>
      </section>


      {/* TEMPERAFLIX — vitrine cinematográfica da linha exclusiva */}
      <TemperaflixShowcase />



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
          <ProductGrid
            first={8}
            excludeHandles={[
              "temperaflix-tradicional",
              "temperaflix-ervas-finas",
              "temperaflix-bacon",
            ]}
            prependHandles={[
              "salsa-cebola-e-alho",
              "lemon-pepper",
              "curcuma",
            ]}
          />
        </div>
      </section>

      {/* COZINHA CONSCIENTE — dietas */}
      <section className="border-y border-foreground/15 bg-brand-cream/60 bg-paper-grain py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <Salad className="h-5 w-5 text-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Cozinha Consciente
                </span>
              </div>
              <h2 className="font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95]">
                TEMPERO QUE
                <br />
                CONVERSA COM SEU&nbsp;DLIFE ETA.
                <br />
                <span className="text-accent tracking-tighter">LIFESTYLE</span>
              </h2>
              <p className="mt-6 font-serif italic text-lg sm:text-xl text-foreground/80 max-w-2xl leading-snug">
                Guia didático de compatibilidade e receitas curadas para quem
                segue cetogênica, low carb ou carnívora — sem abrir mão do
                prazer da mesa.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/cozinha"
                className="inline-flex items-center gap-2 border-b-2 border-foreground/30 hover:border-accent hover:text-accent pb-1 text-sm font-display font-black uppercase tracking-widest"
              >
                Explorar a Cozinha
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECIPES.slice(0, 3).map((r, idx) => (
              <Link
                key={r.slug}
                to="/cozinha/$slug"
                params={{ slug: r.slug }}
                className="group block border border-foreground/15 bg-background hover:border-accent transition"
              >
                <div
                  className="relative aspect-[5/3] overflow-hidden"
                  style={{ background: r.hero.color }}
                >
                  <div aria-hidden className="absolute inset-0 bg-paper-grain opacity-20" />
                  <span className="absolute top-3 left-3 label-tag">
                    {MOMENTS[r.moment]}
                  </span>
                  <span
                    aria-hidden
                    className="absolute right-4 bottom-1 font-display font-black text-brand-paper/25 leading-none tracking-tighter text-[7rem] select-none transition-transform duration-500 group-hover:-translate-y-1"
                  >
                    Nº{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-black uppercase text-xl leading-tight tracking-tight">
                    {r.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.compatibleDiets.map((d) => (
                      <DietBadge key={d} diet={d} verdict="ok" variant="chip" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS — manifesto de marca (fechamento conceitual) */}
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
                body: "Cada ingrediente escolhido com o cuidado que você merece.",
              },
              {
                icon: Award,
                title: "Sem atalho",
                body: "Qualidade em cada processo até chegar na sua mesa.",
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
            Casa de temperos. Minas Gerais. DESDE 2023.
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
