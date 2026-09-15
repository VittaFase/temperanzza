import { Link } from "@tanstack/react-router";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { RECIPES } from "@/lib/recipes";

const HERO_SLUGS = [
  "hamburguer-bacon-em-po",
  "frango-assado-paprica-defumada",
  "carne-panela-batatas-tempero-mineiro",
  "omelete-temperaflix-ervas-finas",
];

export function SiteHero() {
  const slides = HERO_SLUGS.map((slug) => RECIPES.find((r) => r.slug === slug)).filter(
    (r): r is (typeof RECIPES)[number] => Boolean(r?.dish),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactViewport, setCompactViewport] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      setReducedMotion(motion.matches);
      setCompactViewport(compact.matches);
      if (motion.matches) setPlaying(false);
    };
    sync();
    motion.addEventListener?.("change", sync);
    compact.addEventListener?.("change", sync);
    return () => {
      motion.removeEventListener?.("change", sync);
      compact.removeEventListener?.("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion || compactViewport || slides.length < 2) return;
    const id = window.setInterval(
      () => setSelectedIndex((index) => (index + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(id);
  }, [playing, reducedMotion, compactViewport, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="relative isolate w-full max-w-full min-w-0 overflow-hidden bg-brand-ink text-white"
      aria-label="Receitas em destaque"
    >
      <div className="relative w-full max-w-full min-w-0 overflow-hidden min-h-[70svh] sm:min-h-[76svh] lg:min-h-[calc(100svh-112px)]">
        {slides.map((recipe, index) => {
          const active = selectedIndex === index;
          return (
            <article
              key={recipe.slug}
              aria-hidden={!active}
              className={`absolute inset-0 w-full max-w-full min-w-0 overflow-hidden transition-opacity duration-700 motion-reduce:transition-none ${active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}
            >
              <img
                src={recipe.dish!.src}
                alt={recipe.dish!.alt}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 block h-full w-full max-w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20" />
              <div className="page-shell relative z-10 flex min-h-[70svh] items-end justify-center pb-20 pt-24 text-center sm:min-h-[76svh] sm:pb-24 lg:min-h-[calc(100svh-112px)]">
                <div className="max-w-5xl">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
                    Cozinha Temperanzza
                  </span>
                  {index === 0 ? (
                    <h1 className="mt-4 font-display text-[clamp(2.65rem,7vw,6.8rem)] font-medium leading-[.92] tracking-[-0.025em]">
                      {recipe.title}
                    </h1>
                  ) : (
                    <h2 className="mt-4 font-display text-[clamp(2.65rem,7vw,6.8rem)] font-medium leading-[.92] tracking-[-0.025em]">
                      {recipe.title}
                    </h2>
                  )}
                  <p className="mx-auto mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-white/88 sm:mt-5 sm:text-lg sm:leading-7">
                    {recipe.subtitle || recipe.intro}
                  </p>
                  <Link
                    to="/cozinha/$slug"
                    params={{ slug: recipe.slug }}
                    search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
                    tabIndex={active ? 0 : -1}
                    className="mt-6 inline-flex min-h-12 items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-brand-ink transition motion-safe:hover:-translate-y-0.5 sm:px-7"
                  >
                    Ver receita <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3">
        {!reducedMotion && !compactViewport && (
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm"
            aria-label={playing ? "Pausar apresentação" : "Reproduzir apresentação"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        )}
        <div className="flex items-center gap-2" aria-label="Paginação das receitas">
          {slides.map((recipe, index) => (
            <button
              key={recipe.slug}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`min-h-11 min-w-7 rounded-full p-2 before:block before:h-1.5 before:rounded-full before:transition-all ${selectedIndex === index ? "before:w-7 before:bg-white" : "before:w-1.5 before:bg-white/50"}`}
              aria-label={`Ir para ${recipe.title}`}
              aria-current={selectedIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
