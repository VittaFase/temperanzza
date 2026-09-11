import { createFileRoute, Link } from "@tanstack/react-router";

import { CatalogGrid } from "@/components/site/CatalogGrid";
import { HouseOffers } from "@/components/site/HouseOffers";

const PRODUTOS_URL = "https://temperanzza.com.br/produtos";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Catálogo Temperanzza — Temperos Artesanais, Blends e Especiarias de Minas Gerais" },
      {
        name: "description",
        content:
          "Explore o catálogo completo de temperos artesanais Temperanzza. Blends autorais, linha Temperaflix e especiarias puras embaladas em Minas Gerais para transformar sua cozinha."
      },
      { property: "og:title", content: "Catálogo — Temperos Artesanais Temperanzza" },
      {
        property: "og:description",
        content: "Todas as misturas e especiarias da casa Temperanzza.",
      },
      { property: "og:url", content: PRODUTOS_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: PRODUTOS_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Catálogo Temperanzza",
          url: PRODUTOS_URL,
          isPartOf: {
            "@type": "WebSite",
            name: "Temperanzza",
            url: "https://temperanzza.com.br",
          },
          about: "Temperos e especiarias artesanais",
        }),
      },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="border-b border-foreground/15 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            O CATÁLOGO&nbsp;
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight">
            &nbsp;OS TEMPEROS
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-foreground/75 leading-relaxed">
            Os 19 sabores da casa, em três sublinhas: Core para o dia a dia,
            Premium Black para o toque final e Temperaflix para os momentos de
            tela. Escolha pelo prato que você quer fazer — cada pote traz a
            proporção já testada.
          </p>
          <p className="mt-5 text-sm text-foreground/70">
            Primeira compra?{" "}
            <Link
              to="/cozinha"
              search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
              className="font-display uppercase tracking-wider text-accent border-b border-accent/40 hover:border-accent"
            >
              Comece pela receita
            </Link>{" "}
            e volte com o tempero certo na mão. Levando vários?{" "}
            <Link
              to="/sua-caixa"
              className="font-display uppercase tracking-wider text-accent border-b border-accent/40 hover:border-accent"
            >
              Monte a caixa de 12 potes
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CatalogGrid />
        </div>
      </section>

      {/* Ofertas da Casa — combos prontos para quem não quer escolher pote a pote */}
      <HouseOffers />
    </div>

  );
}
