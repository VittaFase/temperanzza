import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { RECIPES } from "@/lib/recipes";

/**
 * Showcase de Receitas para a Home.
 * Implementa a estética "Biblioteca Gastronômica" com foco em imagens de pratos + produtos.
 */
export function RecipeShowcase() {
  // Selecionamos 3 receitas estratégicas para o destaque (ex: as primeiras com foto real)
  const featuredRecipes = RECIPES.filter(r => r.dish && (
    r.slug === "omelete-bacon-em-po" || 
    r.slug === "frango-assado-paprica-defumada" || 
    r.slug === "hamburguer-bacon-em-po"
  )).slice(0, 3);

  if (featuredRecipes.length === 0) return null;

  return (
    <section className="bg-brand-ink py-20 sm:py-28 text-brand-paper overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="block h-px w-12 bg-brand-mustard" />
              <span className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-mustard">
                Inspirar & Transformar
              </span>
            </div>
            <h2 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
              Biblioteca
              <br />
              Gastronômica
            </h2>
          </div>
          
          <Link 
            to="/cozinha"
            className="group inline-flex items-center gap-2 border-b border-brand-mustard/30 pb-1 text-[10px] font-display uppercase tracking-[0.3em] text-brand-mustard hover:text-brand-paper hover:border-brand-paper transition-all"
          >
            Ver todas as {RECIPES.length} receitas
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featuredRecipes.map((recipe) => (
            <Link
              key={recipe.slug}
              to="/cozinha/$slug"
              params={{ slug: recipe.slug }}
              className="group block relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-paper/5">
                {recipe.dish && (
                  <img 
                    src={recipe.dish.src} 
                    alt={recipe.dish.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {/* Overlay de vinheta */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
              
              <div className="mt-6">
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-brand-mustard mb-2 block">
                  {recipe.featuredHandle.replace(/-/g, ' ')}
                </span>
                <h3 className="font-display font-black uppercase text-xl sm:text-2xl leading-tight tracking-tight group-hover:text-brand-mustard transition-colors">
                  {recipe.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
