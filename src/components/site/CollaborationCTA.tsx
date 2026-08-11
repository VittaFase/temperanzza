import { Link } from "@tanstack/react-router";

/**
 * CollaborationCTA — Seção de chamada para o programa "Cozinhe com a Temperanzza" na Home.
 * Baseado na referência visual enviada pelo usuário (image-33.png).
 */
export function CollaborationCTA() {
  return (
    <section className="bg-brand-ink py-24 sm:py-32 text-brand-paper relative overflow-hidden">
      {/* Detalhe decorativo no canto superior direito (referência do círculo na imagem) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mustard/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center relative z-10">
        <span className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-mustard mb-8 block">
          CONVITE ABERTO
        </span>
        
        <h2 className="font-display font-black uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.85] tracking-tighter mb-8">
          <span className="text-brand-paper">Cozinhe com a</span>
          <br />
          <span className="text-brand-mustard">Temperanzza</span>
        </h2>
        
        <p className="font-serif italic text-lg sm:text-xl text-brand-paper/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Envie sua receita — nossa curadoria ajusta com você o que for preciso, ela ganha sua assinatura no site e os potes dos condimentos que você usou - Leva de presente da casa.
        </p>
        
        <div className="flex justify-center">
          <Link
            to="/colaborar"
            className="bg-brand-mustard text-brand-ink px-10 py-4 font-display font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-paper transition-colors duration-300"
          >
            QUERO ENVIAR MINHA RECEITA
          </Link>
        </div>
      </div>
    </section>
  );
}
