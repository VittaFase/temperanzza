import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RECIPES } from "@/lib/recipes";
import { getProductImage } from "@/lib/productImages";
import { getFlavorTone } from "@/lib/flavorPalette";

/**
 * Home culinary showcase: dish -> seasoning -> recipe -> product.
 * Uses only recipe imagery and official product assets already registered in the project.
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
  const leadTone = getFlavorTone(lead.featuredHandle, lead.title);
  const leadProduct = getProductImage(lead.featuredHandle);

  return (
    <section className="section-space overflow-hidden bg-brand-cream/55">
      <div className="page-shell">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Da Temperanzza para a mesa
            </span>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-[.92] text-brand-ink sm:text-6xl">
              Veja o sabor acontecer.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Descubra o condimento, veja como ele entra no prato e leve a receita completa para a sua cozinha.
            </p>
          </div>
          <Link
            to="/cozinha"
            search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-brand-ink/15 bg-white px-5 py-2 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:border-brand-ink/30 md:self-auto"
          >
            Todas as receitas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <Link
            to="/cozinha/$slug"
            params={{ slug: lead.slug }}
            search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
            className="group relative min-h-[580px] overflow-hidden rounded-[2.5rem] bg-white sm:min-h-[660px]"
          >
            {lead.dish && (
              <img
                src={lead.dish.src}
                alt={lead.dish.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {leadProduct && (
              <div
                className="absolute right-5 top-5 grid h-40 w-32 place-items-center rounded-[2rem] p-3 shadow-lg sm:right-8 sm:top-8 sm:h-48 sm:w-40"
                style={{ backgroundColor: leadTone.bg }}
              >
                <img
                  src={leadProduct}
                  alt={`Tempero ${lead.featuredHandle.replace(/-/g, " ")}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,.2)] transition-transform duration-500 group-hover:-translate-y-1"
                />
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Com {lead.featuredHandle.replace(/-/g, " ")}
              </span>
              <h3 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[.95] sm:text-5xl">
                {lead.title}
              </h3>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Fazer esta receita <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          <div className="grid gap-5">
            {secondary.map((recipe) => {
              const tone = getFlavorTone(recipe.featuredHandle, recipe.title);
              const productImage = getProductImage(recipe.featuredHandle);
              return (
                <Link
                  key={recipe.slug}
                  to="/cozinha/$slug"
                  params={{ slug: recipe.slug }}
                  search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
                  className="group grid min-h-[285px] grid-cols-[1fr_112px] overflow-hidden rounded-[2rem] bg-white sm:grid-cols-[1fr_145px]"
                >
                  <div className="relative overflow-hidden">
                    {recipe.dish && (
                      <img
                        src={recipe.dish.src}
                        alt={recipe.dish.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                        Receita Temperanzza
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-semibold leading-[.95]">
                        {recipe.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: tone.bg }}>
                    {productImage && (
                      <img
                        src={productImage}
                        alt={`Tempero ${recipe.featuredHandle.replace(/-/g, " ")}`}
                        loading="lazy"
                        decoding="async"
                        className="h-32 w-full object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,.18)] transition-transform duration-500 group-hover:-translate-y-1 sm:h-40"
                      />
                    )}
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-ink/70">
                      {recipe.featuredHandle.replace(/-/g, " ")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
