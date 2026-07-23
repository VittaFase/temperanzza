import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MapPin } from "lucide-react";

const LOJAS_URL = "https://temperanzza.com.br/lojas";

export const Route = createFileRoute("/lojas")({
  head: () => ({
    meta: [
      { title: "Onde encontrar — Pontos de venda Temperanzza" },
      {
        name: "description",
        content:
          "Pontos de venda físicos da Temperanzza e canais de compra online — entrega para todo o Brasil.",
      },
      { property: "og:title", content: "Onde encontrar — Temperanzza" },
      {
        property: "og:description",
        content: "Pontos de venda físicos da Temperanzza.",
      },
      { property: "og:url", content: LOJAS_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: LOJAS_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Temperanzza",
          url: "https://temperanzza.com.br",
          areaServed: "BR",
          sameAs: [],
        }),
      },
    ],
  }),
  component: LojasPage,
});

function LojasPage() {
  return (
    <SiteLayout>
      <section className="border-b border-foreground/15 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Onde encontrar
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight">
            Pontos de Venda
          </h1>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-dashed border-foreground/15 p-10 text-center">
            <MapPin className="h-8 w-8 text-accent mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-display text-xl uppercase tracking-wide">
              Em breve a lista de revendedores
            </p>
            <p className="mt-3 text-muted-foreground">
              Por enquanto, encontre toda a linha aqui na loja online com
              entrega para todo o Brasil.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
