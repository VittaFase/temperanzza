import { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

/**
 * Mídia do hero da receita.
 * Tenta um vídeo em loop mudo em /videos/[slug].mp4 e, se o arquivo ainda não
 * existir (ou o navegador falhar), cai exatamente no visual atual do pote.
 */
export function RecipeHeroMedia({
  slug,
  poster,
  alt,
}: {
  slug: string;
  poster: string;
  alt: string;
}) {
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
  }, []);

  const goFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    el.requestFullscreen?.();
    el.play?.().catch(() => {});
  };

  return (
    <div className="relative group">
      {/* Halo âmbar */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.16 75 / 0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Sombra de chão elíptica */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[70%] h-4 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)",
          filter: "blur(8px)",
        }}
      />

      {videoOk && !reduced ? (
        <>
          <video
            ref={videoRef}
            src={`/videos/${slug}.mp4`}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
            aria-label={alt}
            className="relative h-80 sm:h-[26rem] lg:h-[30rem] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)]"
          />
          <button
            type="button"
            onClick={goFullscreen}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex min-h-[36px] items-center gap-2 border border-brand-paper/30 bg-brand-ink/60 backdrop-blur px-3 py-2 font-display uppercase tracking-[0.2em] text-[10px] text-brand-paper/80 hover:border-brand-mustard hover:text-brand-mustard opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Assistir em tela cheia
          </button>
        </>
      ) : (
        <img
          decoding="async"
          loading="eager"
          fetchPriority="high"
          src={poster}
          alt={alt}
          className="relative h-80 sm:h-[26rem] lg:h-[30rem] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] animate-pote-float"
        />
      )}
    </div>
  );
}
