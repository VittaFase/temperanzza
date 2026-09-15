import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RECIPES } from "@/lib/recipes";

/**
 * Home culinary showcase.
 * Recipe photography is the hero asset. Never overlay a second product jar on imagery
 * that already carries the official product in-scene.
 */
export function RecipeShowcase() {
  const preferred = [
    "pao-carnivoro-tradicional",
    "frango-assado-paprica-defumada",
    "hamburguer-bacon-em-po",
  ];
  const featuredRecipes = preferred
    .map((slug) => RECIPES.find((recipe) => recipe.slug === slug))
    .filter((recipe): recipe is (typeof RECIPES)[number] => Boolean(recipe));

  if (!featuredRecipes.length) return null;

  const lead = featuredRecipes[0];
  const secondary = featuredRecipes.slice(1);

  return (
    <section className="section-space overflow-hidden bg-brand-cream/45">
      <div className="page-shell">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Da Temperanzza para a mesa</span>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-[.92] text-brand-ink sm:text-6xl">Veja o sabor acontecer.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Receitas reais, produto na cena e inspiração para levar o sabor da Casa à sua cozinha.</p>
          </div>
          <Link to="/cozinha" search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="inline-flex min-h-11 items-center gap-2 self-start border-b border-brand-ink/35 pb-1 text-sm font-semibold text-brand-ink transition hover:border-brand-ink md:self-auto">Todas as receitas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <Link to="/cozinha/$slug" params={{ slug: lead.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="group relative min-h-[580px] overflow-hidden bg-brand-ink sm:min-h-[660px]">
            {lead.dish && <img src={lead.dish.src} alt={lead.dish.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Receita Temperanzza</span>
              <h3 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[.95] sm:text-5xl">{lead.title}</h3>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Fazer esta receita <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </div>
          </Link>

          <div className="grid gap-5">
            {secondary.map((recipe) => (
              <Link key={recipe.slug} to="/cozinha/$slug" params={{ slug: recipe.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="group relative min-h-[285px] overflow-hidden bg-brand-ink">
                {recipe.dish && <img src={recipe.dish.src} alt={recipe.dish.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Receita Temperanzza</span>
                  <h3 className="mt-2 max-w-md font-display text-3xl font-semibold leading-[.95]">{recipe.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold">Ver receita <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
