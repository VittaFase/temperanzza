import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getRecipeBySlug, MOMENTS, RECIPES, type Recipe } from "@/lib/recipes";
import { getProductDiet } from "@/lib/dietCompatibility";
import type { DietKey } from "@/lib/diets";
import { DietBadge } from "@/components/site/DietBadge";
import { DietCompatibilityPanel } from "@/components/site/DietCompatibilityPanel";
import { ArrowLeft, ArrowRight, Utensils, ChefHat } from "lucide-react";

export const Route = createFileRoute("/cozinha/$slug")({
  head: ({ params }) => {
    const r = RECIPES.find((x) => x.slug === params.slug);
    if (!r) {
      return {
        meta: [
          { title: "Receita não encontrada — Cozinha Temperanzza" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const desc = r.intro;
    return {
      meta: [
        { title: `${r.title} — Cozinha Temperanzza` },
        { name: "description", content: desc },
        { property: "og:title", content: r.title },
        { property: "og:description", content: desc },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: r.title,
            description: r.intro,
            recipeIngredient: r.ingredients,
            recipeInstructions: r.steps.map((s) => ({
              "@type": "HowToStep",
              text: s,
            })),
            suitableForDiet: r.compatibleDiets.map((d) => {
              const map: Record<string, string> = {
                keto: "https://schema.org/LowCalorieDiet",
                lowcarb: "https://schema.org/LowCalorieDiet",
                "carnivora-flex": "https://schema.org/LowLactoseDiet",
                "carnivora-estrita": "https://schema.org/LowLactoseDiet",
              };
              return map[d] ?? "https://schema.org/LowCalorieDiet";
            }),
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const r = getRecipeBySlug(params.slug);
    if (!r) throw notFound();
    return r;
  },
  component: RecipePage,
  notFoundComponent: RecipeNotFound,
});

function RecipeNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl py-24 px-6 text-center">
        <h1 className="font-display uppercase text-4xl">Receita não encontrada</h1>
        <Link
          to="/cozinha"
          className="inline-block mt-6 underline underline-offset-4"
        >
          Voltar à Cozinha Temperanzza
        </Link>
      </div>
    </SiteLayout>
  );
}

function RecipePage() {
  const recipe = Route.useLoaderData();
  const diet = getProductDiet(recipe.featuredHandle);

  const related = RECIPES.filter(
    (r) => r.profile === recipe.profile && r.slug !== recipe.slug,
  ).slice(0, 3);

  return (
    <SiteLayout>
      {/* HERO */}
      <section
        className="relative border-b border-foreground/15 overflow-hidden"
        style={{ background: recipe.hero.color }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(0,0,0,0.35) 0, transparent 45%), radial-gradient(circle at 85% 75%, rgba(0,0,0,0.28) 0, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-white">
          <Link
            to="/cozinha"
            className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-display font-bold text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cozinha Temperanzza
          </Link>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <span className="inline-block px-3 py-1 bg-brand-ink text-brand-paper font-display font-black uppercase tracking-widest text-[10px]">
                {MOMENTS[recipe.moment]}
              </span>
              <h1 className="mt-5 font-display font-black uppercase leading-[0.92] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
                {recipe.title}
              </h1>
              <p className="mt-6 font-serif italic text-xl sm:text-2xl text-white/90 leading-snug max-w-2xl">
                {recipe.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {recipe.compatibleDiets.map((d) => (
                  <DietBadge key={d} diet={d} verdict="ok" variant="chip" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <div
                className="text-[10rem] sm:text-[12rem] leading-none select-none drop-shadow-2xl"
                aria-hidden
              >
                {recipe.hero.emoji}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Ingredientes */}
          <aside className="lg:col-span-4">
            <div className="border border-foreground/15 bg-brand-cream/60 p-6 lg:p-7 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Utensils className="h-4 w-4 text-accent" />
                <h2 className="font-display font-black uppercase tracking-widest text-sm">
                  Ingredientes
                </h2>
              </div>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[15px] leading-snug border-b border-foreground/10 pb-3 last:border-0"
                  >
                    <span className="shrink-0 h-4 w-4 border border-foreground/40 mt-1" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Preparo */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <ChefHat className="h-4 w-4 text-accent" />
              <h2 className="font-display font-black uppercase tracking-widest text-sm">
                Modo de preparo
              </h2>
            </div>
            <ol className="space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-5">
                  <span className="shrink-0 font-display font-black text-5xl leading-none text-accent w-14">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>

            {/* Por que funciona */}
            <div className="mt-14 border-l-4 border-brand-emerald bg-brand-cream/70 px-6 py-6">
              <p className="text-[10px] font-display uppercase tracking-widest text-brand-emerald mb-2">
                Por que funciona para sua dieta
              </p>
              <p className="font-serif italic text-lg leading-relaxed">
                {recipe.whyItWorks}
              </p>
            </div>

            {/* Dica */}
            <div className="mt-6 border-l-4 border-brand-mustard bg-brand-cream/70 px-6 py-6">
              <p className="text-[10px] font-display uppercase tracking-widest text-brand-ink/70 mb-2">
                Dica de substituição
              </p>
              <p className="text-base leading-relaxed">{recipe.substitution}</p>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                to="/product/$handle"
                params={{ handle: recipe.featuredHandle }}
                className="inline-flex items-center gap-3 bg-foreground text-background hover:bg-accent px-6 py-4 font-display uppercase tracking-widest text-sm"
              >
                Leve este tempero para sua cozinha
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Painel de dieta do condimento */}
        {diet && (
          <div className="mt-16">
            <DietCompatibilityPanel diet={diet} />
          </div>
        )}

        {/* Relacionadas */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight mb-8">
              Do mesmo perfil de sabor
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/cozinha/$slug"
                  params={{ slug: r.slug }}
                  className="group block border border-foreground/15 bg-background hover:border-accent transition"
                >
                  <div
                    className="relative aspect-[5/3]"
                    style={{ background: r.hero.color }}
                  >
                    <span
                      className="absolute right-4 bottom-3 text-5xl opacity-90"
                      aria-hidden
                    >
                      {r.hero.emoji}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-black uppercase tracking-tight text-lg leading-tight">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
