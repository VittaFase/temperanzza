import { Link } from "@tanstack/react-router";
import { PackageCheck, MapPin, BookOpen, Leaf } from "lucide-react";
import { getRecipesByHandle } from "@/lib/recipes";
import { getProductDiet } from "@/lib/dietCompatibility";
import { ProductReviews } from "@/components/site/ProductReviews";

/**
 * Prova social da casa no PDP.
 * Regra: nenhuma avaliação, nota ou depoimento é gerado.
 * Só entram sinais verificáveis da própria estrutura do projeto.
 */
export function ProductTrust({ handle, title }: { handle: string; title: string }) {
  const recipes = getRecipesByHandle(handle);
  const diet = getProductDiet(handle);
  const dietCount = diet ? Object.keys(diet.verdicts ?? {}).length : 0;

  const signals = [
    {
      icon: PackageCheck,
      title: "Embalado lote a lote",
      body: "Cada pote é fechado por lote — sem estoque parado, sem mistura de safra.",
    },
    {
      icon: MapPin,
      title: "Feito em Minas Gerais",
      body: "Casa de temperos artesanais, moagem e envase na própria cozinha da marca.",
    },
    {
      icon: BookOpen,
      title:
        recipes.length > 0
          ? `${recipes.length} receita${recipes.length > 1 ? "s" : ""} testada${recipes.length > 1 ? "s" : ""} na casa`
          : "Receitas da casa",
      body:
        recipes.length > 0
          ? "Este tempero aparece no modo de fazer da nossa Cozinha, com o pote em cena."
          : "A Cozinha Temperanzza mostra o preparo com o pote em cena.",
      to: "/cozinha" as const,
      search: { refeicao: "", proteina: "", lifestyle: "", autor: "" },
      cta: "Ver a Cozinha",
    },
    ...(dietCount > 0
      ? [
          {
            icon: Leaf,
            title: "Compatibilidade dietética publicada",
            body: `Avaliado abertamente em ${dietCount} estilo${dietCount > 1 ? "s" : ""} alimentar${dietCount > 1 ? "es" : ""} — o que serve e o que não serve.`,
          },
        ]
      : []),
  ];

  return (
    <section className="mt-16 lg:mt-24">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-foreground pb-3">
        <h2 className="font-display font-black uppercase text-2xl sm:text-3xl leading-none">
          Por que confiar neste pote
        </h2>
        <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
          A casa responde
        </span>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {signals.map((s) => (
          <div
            key={s.title}
            className="border border-foreground/15 bg-brand-cream/60 bg-paper-grain p-5 flex flex-col"
          >
            <s.icon className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="mt-3 font-display font-black uppercase text-base leading-[1.05]">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/75 leading-snug flex-1">{s.body}</p>
            {"to" in s && s.to ? (
              <Link
                to={s.to}
                search={s.search}
                className="mt-4 inline-flex min-h-[44px] items-center text-xs font-display font-black uppercase tracking-widest text-accent hover:underline underline-offset-4"

              >
                {s.cta} →
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <ProductReviews handle={handle} title={title} />

    </section>
  );
}
