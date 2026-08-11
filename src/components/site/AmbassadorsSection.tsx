import { Link } from "@tanstack/react-router";

/**
 * AmbassadorsSection — Convite para o programa de embaixadores.
 */
export function AmbassadorsSection() {
  return (
    <section className="bg-brand-ink text-brand-paper py-20 sm:py-28 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mustard/10 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="font-display uppercase tracking-[0.4em] text-[10px] text-brand-mustard">Programa de Parceria</span>
        <h2 className="mt-4 font-display font-black uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
          Cozinhe com a <br />
          <span className="text-brand-mustard">Temperanzza</span>
        </h2>
        
        <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-brand-paper/70 font-serif italic leading-relaxed">
          Buscamos chefs, criadores e apaixonados pela boa mesa para levar a essência mineira a mais cozinhas.
        </p>
        
        <div className="mt-10">
          <Link
            to="/embaixadores"
            className="inline-flex min-h-[56px] items-center bg-brand-mustard text-brand-ink px-10 py-3 font-display uppercase tracking-widest text-sm hover:bg-brand-paper transition-colors"
          >
            Quero Cozinhar com a Casa

          </Link>
        </div>
      </div>
    </section>
  );
}
