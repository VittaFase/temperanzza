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
          A Essência do <br />
          <span className="text-brand-mustard">Tempero Mineiro</span>
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
      
      {/* Detalhe industrial: borda de papel cortada */}
      <div className="absolute -bottom-1 left-0 right-0 h-8 bg-paper-grain bg-brand-paper border-t border-foreground/10" 
           style={{ clipPath: "polygon(0 100%, 0 0, 1% 40%, 2% 0, 3% 40%, 4% 0, 5% 40%, 6% 0, 7% 40%, 8% 0, 9% 40%, 10% 0, 11% 40%, 12% 0, 13% 40%, 14% 0, 15% 40%, 16% 0, 17% 40%, 18% 0, 19% 40%, 20% 0, 21% 40%, 22% 0, 23% 40%, 24% 0, 25% 40%, 26% 0, 27% 40%, 28% 0, 29% 40%, 30% 0, 31% 40%, 32% 0, 33% 40%, 34% 0, 35% 40%, 36% 0, 37% 40%, 38% 0, 39% 40%, 40% 0, 41% 40%, 42% 0, 43% 40%, 44% 0, 45% 40%, 46% 0, 47% 40%, 48% 0, 49% 40%, 50% 0, 51% 40%, 52% 0, 53% 40%, 54% 0, 55% 40%, 56% 0, 57% 40%, 58% 0, 59% 40%, 60% 0, 61% 40%, 62% 0, 63% 40%, 64% 0, 65% 40%, 66% 0, 67% 40%, 68% 0, 69% 40%, 70% 0, 71% 40%, 72% 0, 73% 40%, 74% 0, 75% 40%, 76% 0, 77% 40%, 78% 0, 79% 40%, 80% 0, 81% 40%, 82% 0, 83% 40%, 84% 0, 85% 40%, 86% 0, 87% 40%, 88% 0, 89% 40%, 90% 0, 91% 40%, 92% 0, 93% 40%, 94% 0, 95% 40%, 96% 0, 97% 40%, 98% 0, 99% 40%, 100% 0, 100% 100%)" }} />
    </section>
  );
}
