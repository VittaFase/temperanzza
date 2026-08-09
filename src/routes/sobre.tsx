import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BrandSeal } from "@/components/site/BrandSeal";
import { CountUp } from "@/components/site/CountUp";

const SOBRE_URL = "https://temperanzza.com.br/sobre";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "A Casa Temperanzza — Temperos Artesanais de Minas Gerais | Nossa História" },
      {
        name: "description",
        content:
          "A história da Temperanzza: casa de temperos nascida em Minas Gerais, dedicada a misturas autorais sem atalhos, sem aditivos desnecessários.",
      },
      { property: "og:title", content: "A Casa Temperanzza — Nossa história" },
      {
        property: "og:description",
        content:
          "A história da Temperanzza: casa de temperos nascida em Minas Gerais.",
      },
      { property: "og:url", content: SOBRE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SOBRE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "A Casa Temperanzza",
          url: SOBRE_URL,
          mainEntity: {
            "@type": "Organization",
            name: "Temperanzza",
            url: "https://temperanzza.com.br",
            foundingLocation: "Minas Gerais, Brasil",
          },
        }),
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen">
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
            A Casa Temperanzza nasceu em Minas Gerais com uma missão simples: transformar refeições comuns em experiências memoráveis.
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

      {/* Números da Casa — count-up editorial */}
      <section
        aria-label="A casa em números"
        className="border-t border-foreground/15 bg-brand-ink text-brand-paper py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <span aria-hidden className="block h-px w-12 bg-brand-mustard" />
            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-paper/60">
              A casa em números
            </span>
          </div>
          <dl className="grid grid-cols-3 gap-6 sm:gap-10">
            {[
              { n: 19, label: "SKUs autorais" },
              { n: 15, label: "receitas autorais" },
              { n: 2023, label: "desde" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-brand-mustard/50 pl-4 sm:pl-6">
                <dt className="text-[10px] font-display uppercase tracking-[0.3em] text-brand-paper/50 order-2">
                  {s.label}
                </dt>
                <dd className="font-display font-black leading-none text-brand-paper text-5xl sm:text-6xl lg:text-7xl mb-2">
                  <CountUp to={s.n} from={s.n} duration={0} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
