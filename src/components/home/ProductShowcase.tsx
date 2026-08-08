import { Link } from "@tanstack/react-router";

export function ProductShowcase() {
  return (
    <section className="py-32 bg-brand-paper">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
          <div>
            <span className="text-accent font-display uppercase tracking-[0.4em] text-xs mb-4 block">
              Nosso Catálogo
            </span>
            <h2 className="font-display text-5xl sm:text-7xl uppercase text-brand-ink leading-none">
              Condimentos<br />de Elite
            </h2>
          </div>
          <Link 
            to="/produtos" 
            className="bg-brand-ink text-brand-paper px-10 py-4 font-display uppercase tracking-widest text-sm hover:bg-accent transition-colors"
          >
            Ver Catálogo Completo
          </Link>
        </div>
        
        <div className="relative group aspect-[16/9] bg-brand-cream overflow-hidden border border-brand-ink/5">
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h3 className="font-display text-3xl uppercase mb-6 text-brand-ink">Coleção Core & Premium</h3>
              <p className="font-serif italic text-brand-ink/60 mb-8">
                De blends clássicos mineiros a especiarias premium internacionais, curadas para performance.
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-brand-ink/5 pointer-events-none group-hover:bg-transparent transition-colors" />
        </div>
      </div>
    </section>
  );
}
