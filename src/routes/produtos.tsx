import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Catálogo — Temperanzza" },
      {
        name: "description",
        content:
          "Todas as misturas e especiarias da casa Temperanzza. Páprica, chimi churri, lemon pepper, tempero mineiro e mais.",
      },
      { property: "og:title", content: "Catálogo — Temperanzza" },
      {
        property: "og:description",
        content: "Todas as misturas e especiarias da casa Temperanzza.",
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
            O Catálogo Completo
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight">
            Todos os Temperos
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
