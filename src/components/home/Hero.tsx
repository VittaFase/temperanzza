import { Link } from "@tanstack/react-router";
import { useVideoBackdrop } from "@/lib/useVideoBackdrop";
import smokeVideo from "@/assets/hero-smoke.mp4.asset.json";
import smokePoster from "@/assets/hero-smoke-poster.jpg";

export function Hero() {
  const { containerRef, enableVideo } = useVideoBackdrop();

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-ink text-brand-paper">
      <div ref={containerRef} className="absolute inset-0 z-0">
        <img src={smokePoster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        {enableVideo && (
          <video
            src={smokeVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-brand-ink/60" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block text-brand-mustard font-display uppercase tracking-[0.3em] text-sm mb-6">
            Casa Temperanzza · Minas Gerais
          </span>
          <h1 className="font-display text-[12vw] sm:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tight mb-8">
            Cozinha de<br />
            <span className="text-brand-mustard">Performance</span>
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-brand-paper/80 max-w-2xl mb-12">
            Temperos artesanais mineiros sem conservantes, focados em densidade nutricional e sabor real para seu lifestyle.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link 
              to="/produtos" 
              className="bg-brand-mustard text-brand-ink px-10 py-4 font-display uppercase tracking-widest text-sm hover:bg-brand-paper transition-colors"
            >
              Explorar Catálogo
            </Link>
            <Link 
              to="/cozinha" 
              className="border border-brand-paper/30 text-brand-paper px-10 py-4 font-display uppercase tracking-widest text-sm hover:bg-brand-paper hover:text-brand-ink transition-all"
            >
              Biblioteca Gastronômica
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
