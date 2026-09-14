import { createFileRoute, Link } from "@tanstack/react-router";

import { CatalogGrid } from "@/components/site/CatalogGrid";
import { HouseOffers } from "@/components/site/HouseOffers";
import { REBRAND_EXCLUDED_HANDLES } from "@/lib/rebrandCatalog";

const PRODUTOS_URL = "https://temperanzza.com.br/produtos";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Catálogo Temperanzza — Temperos, Blends e Especiarias de Minas Gerais" },
      {
        name: "description",
        content: "Explore os sabores da Casa Temperanzza: blends, condimentos, especiarias e a linha Temperaflix para diferentes momentos da cozinha.",
      },
      { property: "og:title", content: "Catálogo — Sabores da Casa Temperanzza" },
      { property: "og:description", content: "Conheça os condimentos, blends e especiarias da Casa Temperanzza." },
      { property: "og:url", content: PRODUTOS_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: PRODUTOS_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Catálogo Temperanzza",
        url: PRODUTOS_URL,
        isPartOf: { "@type": "WebSite", name: "Temperanzza", url: "https://temperanzza.com.br" },
        about: "Temperos, blends e especiarias",
      }),
    }],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  return (
    <main className="min-h-screen bg-brand-paper text-brand-ink">
      <section className="border-b border-brand-ink/10 py-14 sm:py-20 lg:py-24">
        <div className="page-shell">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Casa Temperanzza · Sabores</span>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-tight">Encontre o sabor para a sua cozinha.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-brand-ink/70 sm:text-lg sm:leading-8">Explore os condimentos, blends, especiarias e sabores Temperaflix disponíveis na Casa. Escolha pelo produto ou comece por uma receita.</p>
          <p className="mt-5 text-sm text-brand-ink/65">Primeira compra? <Link to="/cozinha" search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="font-semibold underline underline-offset-4">Comece pela receita</Link>. Levando vários? <Link to="/sua-caixa" className="font-semibold underline underline-offset-4">Monte sua caixa</Link>.</p>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell min-w-0 overflow-hidden">
          <CatalogGrid excludeHandles={[...REBRAND_EXCLUDED_HANDLES]} />
        </div>
      </section>

      <HouseOffers />
    </main>
  );
}
