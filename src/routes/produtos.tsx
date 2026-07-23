import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";

const PRODUTOS_URL = "https://temperanzza.com.br/produtos";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Catálogo — Temperos Artesanais Temperanzza" },
      {
        name: "description",
        content:
          "Todas as misturas e especiarias da casa Temperanzza. Páprica, chimichurri, lemon pepper, tempero mineiro e mais — sem aditivos desnecessários.",
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
    <SiteLayout>
      <section className="border-b border-foreground/15 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            O CATÁLOGO&nbsp;
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight">
            &nbsp;OS TEMPEROS
          </h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGrid first={50} />
        </div>
      </section>
    </SiteLayout>
  );
}
