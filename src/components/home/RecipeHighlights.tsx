import { Link } from "@tanstack/react-router";
import { RECIPES } from "@/lib/recipes";

export function RecipeHighlights() {
  const highlights = RECIPES.slice(0, 3);

  return (
    <section className="py-32 bg-brand-ink text-brand-paper overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-mustard font-display uppercase tracking-[0.3em] text-xs mb-4 block">
              Inspirar & Transformar
            </span>
            <h2 className="font-display text-5xl sm:text-7xl uppercase leading-none">
              Biblioteca<br />Gastronômica
            </h2>
          </div>
          <Link 
            to="/cozinha" 
            className="text-brand-mustard font-display uppercase tracking-widest text-sm border-b border-brand-mustard/30 pb-1 hover:border-brand-mustard transition-colors mb-2"
          >
            Ver todas as 47 receitas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((r, i) => (
            <Link 
              key={i} 
              to="/cozinha/$slug" 
              params={{ slug: r.slug }}
              className="group relative aspect-[4/5] overflow-hidden bg-brand-paper/5"
            >
              {r.dish ? (
                <img 
                  src={r.dish.src} 
                  alt={r.dish.alt} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div 
                  className="absolute inset-0 opacity-20" 
                  style={{ backgroundColor: r.hero.color }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-brand-mustard font-display text-[10px] uppercase tracking-widest mb-2 block">
                  {r.featuredHandle.replace(/-/g, ' ')}
                </span>
                <h3 className="font-display text-2xl uppercase leading-tight group-hover:text-brand-mustard transition-colors">
                  {r.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
