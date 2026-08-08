import sealAsset from "@/assets/temperanzza-seal.png.asset.json";
import heroSmoke from "@/assets/hero-smoke.mp4.asset.json";
import { BrandSeal } from "./BrandSeal";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * SiteHero — O impacto inicial da marca.
 * Estética industrial, vídeo de fumaça/especiarias e tipografia Stencil.
 */
export function SiteHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden bg-brand-ink text-brand-paper py-20 md:py-32">
      {/* Vídeo de fundo com overlay */}
      {!reduced && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src={heroSmoke.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-40 mix-blend-screen"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent to-brand-ink" />
        </div>
      )}

      {/* Conteúdo central */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pb-12">
        <BrandSeal size="xl" embossed eager className="mb-8 sm:mb-12 animate-pote-float" />
        
        <span className="font-display uppercase tracking-[0.4em] text-xs sm:text-sm text-brand-mustard mb-4 block">
          Casa de Temperos Artesanais
        </span>
        
        <h1 className="font-display font-black uppercase text-6xl sm:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight mb-8">
          A ESSÊNCIA DA <br />
          <span className="text-brand-mustard">CASA TEMPERANZZA</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-brand-paper/80 font-serif italic mb-10 leading-relaxed">
          Blends autorais nascidos em Minas Gerais, criados para quem não aceita atalhos na cozinha nem aditivos no pote.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/produtos"
            className="inline-flex min-h-[56px] items-center gap-3 bg-brand-paper text-brand-ink px-8 py-3 font-display uppercase tracking-widest text-sm hover:bg-brand-mustard hover:text-brand-ink transition-colors group"
          >
            <ShoppingBag className="h-4 w-4" />
            Ver Catálogo
          </Link>
          <Link
            to="/sobre"
            className="inline-flex min-h-[56px] items-center gap-3 border-2 border-brand-paper/30 text-brand-paper px-8 py-3 font-display uppercase tracking-widest text-sm hover:border-brand-paper transition-colors"
          >
            Nossa História
          </Link>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <ArrowDown className="h-6 w-6" />
        </div>
      </div>
      
      {/* Detalhe industrial: acabamento reto e liso */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-paper" />
    </section>
  );
}
