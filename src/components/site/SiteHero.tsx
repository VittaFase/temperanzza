import { Link } from "@tanstack/react-router";
import { ArrowRight, Pause, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { RECIPES } from "@/lib/recipes";

const HERO_SLUGS = [
  "hamburguer-bacon-em-po",
  "frango-assado-paprica-defumada",
  "carne-panela-batatas-tempero-mineiro",
  "omelete-temperaflix-ervas-finas",
];

export function SiteHero() {
  const slides = HERO_SLUGS.map((slug) => RECIPES.find((recipe) => recipe.slug === slug)).filter((recipe): recipe is (typeof RECIPES)[number] => Boolean(recipe?.dish));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1, duration: 28 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const syncSelection = useCallback(() => { if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap()); }, [emblaApi]);

  useEffect(() => { if (!emblaApi) return; syncSelection(); emblaApi.on("select", syncSelection); return () => { emblaApi.off("select", syncSelection); }; }, [emblaApi, syncSelection]);
  useEffect(() => { if (!emblaApi || !playing || slides.length < 2) return; const id = window.setInterval(() => emblaApi.scrollNext(), 6500); return () => window.clearInterval(id); }, [emblaApi, playing, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative overflow-hidden bg-brand-ink text-white" aria-label="Receitas em destaque">
      <div ref={emblaRef} className="overflow-hidden touch-pan-y">
        <div className="flex">
          {slides.map((recipe, index) => (
            <article key={recipe.slug} className="relative min-w-0 flex-[0_0_100%] min-h-[72svh] sm:min-h-[76svh] lg:min-h-[calc(100svh-112px)]">
              <img src={recipe.dish!.src} alt={recipe.dish!.alt} fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/15" />
              <div className="page-shell relative z-10 flex min-h-[72svh] items-end justify-center pb-20 pt-28 text-center sm:min-h-[76svh] sm:pb-24 lg:min-h-[calc(100svh-112px)]">
                <div className="max-w-5xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-white/75">Cozinha Temperanzza</span>
                  <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[.92] tracking-[-0.025em] text-white">{recipe.title}</h1>
                  <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/88 sm:text-lg">{recipe.subtitle || recipe.intro}</p>
                  <Link to="/cozinha/$slug" params={{ slug: recipe.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:bg-brand-paper">Ver receita <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3">
        <button type="button" onClick={() => setPlaying((value) => !value)} className="grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm transition hover:bg-black/30" aria-label={playing ? "Pausar apresentação" : "Reproduzir apresentação"}>{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button>
        <div className="flex items-center gap-2" aria-label="Paginação das receitas">{slides.map((recipe, index) => <button key={recipe.slug} type="button" onClick={() => emblaApi?.scrollTo(index)} className={`h-1.5 rounded-full transition-all duration-300 ${selectedIndex === index ? "w-9 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`} aria-label={`Ir para ${recipe.title}`} aria-current={selectedIndex === index ? "true" : undefined} />)}</div>
      </div>
    </section>
  );
}
