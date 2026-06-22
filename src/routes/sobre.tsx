import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

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
            A Temperanzza nasceu em Minas, na cozinha de quem entende que um
            tempero bem feito muda tudo.
          </p>
          <p>
            Começamos pequenos, montando misturas para amigos churrasqueiros e
            cozinheiros de finais de semana. A demanda virou ofício. O ofício
            virou casa. Hoje somos 19 referências entre páprica defumada,
            chimi churri autoral, blends para carnes, ervas finas e a linha
            Temperaflix — pensada para quem cozinha e quem só quer caprichar
            na pipoca.
          </p>
          <p>
            Não usamos corantes. Não usamos realçador de sabor. Não usamos
            gordura hidrogenada. O que está no pote é o que está no rótulo:
            especiarias selecionadas, na proporção certa, embaladas a cada
            lote para chegar fresco na sua mão.
          </p>
          <p className="border-l-4 border-accent pl-6 font-serif italic text-2xl text-foreground">
            Tempero é matéria-prima de quem cozinha. A gente entrega ela
            inteira.
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
