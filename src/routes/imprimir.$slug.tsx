import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { getRecipeBySlug, MOMENTS, type Recipe } from "@/lib/recipes";
import { getProductImage } from "@/lib/productImages";

export const Route = createFileRoute("/imprimir/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Imprimir receita — Temperanzza` },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: `Versão para impressão da receita ${params.slug}.` },
    ],
  }),
  loader: ({ params }) => {
    const r = getRecipeBySlug(params.slug);
    if (!r) throw notFound();
    return r;
  },
  component: PrintRecipe,
  notFoundComponent: () => (
    <main className="p-10 font-display uppercase">Receita não encontrada.</main>
  ),
});

const PRINT_CSS = `
  @page { margin: 16mm; }
  @media print {
    html, body { background: #fff !important; }
    .no-print { display: none !important; }
    .print-avoid-break { break-inside: avoid; }
  }
`;

function PrintRecipe() {
  const r = Route.useLoaderData() as Recipe;
  const img = getProductImage(r.featuredHandle);
  const subtitle = r.subtitle ?? r.intro;

  useEffect(() => {
    const t = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <style>{PRINT_CSS}</style>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="no-print mb-8 flex items-center justify-between gap-4 border-b border-black/20 pb-4">
          <p className="text-xs uppercase tracking-[0.3em]">
            Versão para impressão
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-black px-4 py-2 font-display uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-colors"
          >
            Imprimir
          </button>
        </div>

        <header className="print-avoid-break">
          <p className="font-display uppercase tracking-[0.4em] text-[10px]">
            Casa Temperanzza · Biblioteca Gastronômica
          </p>
          <h1 className="mt-4 font-display font-black uppercase leading-[0.95] text-3xl">
            {r.title}
          </h1>
          <p className="mt-3 font-serif italic text-base">{subtitle}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-black/25 py-4 text-sm">
            <Meta label="Tempo" value={r.time ?? "20 min"} />
            <Meta label="Rende" value={r.serves ?? "2 pessoas"} />
            <Meta label="Dificuldade" value={r.difficulty ?? "Fácil"} />
            <Meta label="Refeição" value={MOMENTS[r.moment]} />
          </dl>
        </header>

        {img && (
          <div className="mt-6 print-avoid-break">
            <img
              src={img}
              alt={r.featuredHandle}
              className="h-28 w-auto object-contain"
            />
            <p className="mt-2 text-xs uppercase tracking-[0.2em]">
              Tempero utilizado
            </p>
          </div>
        )}

        <section className="mt-8 print-avoid-break">
          <h2 className="font-display font-black uppercase tracking-[0.25em] text-sm border-b border-black/25 pb-2">
            Ingredientes
          </h2>
          <ul className="mt-4 space-y-2 text-[15px] leading-snug">
            {r.ingredients.map((i, idx) => (
              <li key={idx} className="flex gap-3">
                <span aria-hidden>□</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-display font-black uppercase tracking-[0.25em] text-sm border-b border-black/25 pb-2">
            Modo de preparo
          </h2>
          <ol className="mt-4 space-y-4 text-[15px] leading-relaxed">
            {r.steps.map((s, idx) => (
              <li key={idx} className="flex gap-4 print-avoid-break">
                <span className="font-display font-black tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-10 border-t border-black/25 pt-4 text-xs uppercase tracking-[0.25em]">
          temperanzza.com.br · Minas Gerais
        </footer>
      </div>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.25em]">{label}</dt>
      <dd className="font-display font-black">{value}</dd>
    </div>
  );
}
