import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandSeal } from "@/components/site/BrandSeal";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "A Casa — Temperanzza" },
      {
        name: "description",
        content:
          "A história da Temperanzza: uma casa de temperos nascida em Minas Gerais, dedicada a misturas autorais sem atalhos.",
      },
      { property: "og:title", content: "A Casa — Temperanzza" },
      {
        property: "og:description",
        content:
          "A história da Temperanzza: uma casa de temperos nascida em Minas Gerais.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <section className="border-b border-foreground/15 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BrandSeal size="lg" className="mb-6" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Quem somos
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight leading-[0.95]">
            A Casa <br />
            Temperanzza
          </h1>
        </div>
      </section>
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose-lg space-y-6 text-foreground/85 leading-relaxed">
          <p className="text-xl font-serif italic text-foreground">
            A Temperanzza nasceu em Minas Gerais com uma missão simples: transformar refeições comuns em experiências memoráveis.
          </p>
          <p>
            Desenvolvemos blends autorais que unem especiarias selecionadas, praticidade e muito sabor para acompanhar todos os momentos — do churrasco de domingo à pipoca do filme em família.
          </p>
          <p>
            Cada produto é criado buscando o equilíbrio perfeito entre qualidade, conveniência e resultado. Das pápricas e ervas especiais aos blends gourmet e à linha Temperaflix, nosso compromisso é entregar sabor verdadeiro em cada pote.
          </p>
          <p>
            Temperanzza é mais do que temperar alimentos.
          </p>
          <p className="border-l-4 border-accent pl-6 font-serif italic text-2xl text-foreground">
            Temperanzza da sabor a seus momentos a mesa 
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
