import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Film, ArrowRight, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  formatBRL,
  type ShopifyProduct,
} from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { useCartStore } from "@/stores/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { FilmGate } from "./FilmGate";
import studioBg from "@/assets/estudio_cinema_final.png.asset.json";
import studioVideo from "@/assets/Novo_filme_temperaflix.mp4.asset.json";
function StudioLightRig({ accent, opacity = 1 }: { accent: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ opacity }}
    >
      {/* Top Studio Light — Soft overhead illumination */}
      <div 
        className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay" 
      />
      
      {/* Main Spotlight — Central focus that follows the scene */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 50% 45%, ${accent}22 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      />

      {/* Rim Lights — Directional studio lighting to define shape */}
      <div className="absolute inset-0 flex justify-between px-[10%] pt-[5%]">
        <div className="w-[1px] h-[60%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[40px] rotate-[15deg] transform-origin-top" />
        <div className="w-[1px] h-[60%] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-[40px] rotate-[-15deg] transform-origin-top" />
      </div>

      {/* Atmospheric Fog/Volume — Subtle cinematic depth */}
      <div className="absolute inset-0 bg-brand-ink/10 mix-blend-multiply" />
      <div 
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function FilmTexture() {
  return (
    <div 
      className="absolute inset-[-5%] z-[15] pointer-events-none overflow-hidden mix-blend-screen opacity-15"
      aria-hidden="true"
    >
      <div 
        className="absolute inset-0 w-[110%] h-[110%] animate-film-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)'/%3E%3C/svg%3E")`,
          backgroundSize: '250px 250px'
        }}
      />
      <div 
        className="absolute inset-0 w-[110%] h-[110%] animate-film-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='scratches'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='2' seed='5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3CfeThreshold target='0.99'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23scratches)'/%3E%3C/svg%3E")`,
          backgroundSize: '800px 800px',
          opacity: 0.1
        }}
      />
    </div>
  );
}



/** Per-flavor color halo tokens (oklch, tied to brand palette). */
const FLAVOR = {
  tradicional: {
    code: "S01·E01",
    label: "Tradicional",
    tagline: "O sabor que combina com tudo.",
    halo: "oklch(0.82 0.16 90)", // metallic yellow gold — matches label
    accent: "#E8B93C",
  },
  ervas: {
    code: "S01·E02",
    label: "Ervas Finas",
    tagline: "Sofisticação e aroma em cada cena.",
    halo: "oklch(0.62 0.14 145)", // moss green
    accent: "#7BB661",
  },
  bacon: {
    code: "S01·E03",
    label: "Bacon",
    tagline: "Defumado, intenso, blockbuster.",
    halo: "oklch(0.38 0.10 45)", // smoked brown — matches label
    accent: "#8B5A3C",
  },
} as const;

type FlavorKey = keyof typeof FLAVOR;

function classify(title: string): FlavorKey {
  const t = title.toLowerCase();
  if (t.includes("bacon")) return "bacon";
  if (t.includes("ervas")) return "ervas";
  return "tradicional";
}

const ORDER: FlavorKey[] = ["tradicional", "ervas", "bacon"];

export function TemperaflixShowcase() {
  const isMobile = useIsMobile();
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const { data, isLoading } = useQuery({
    queryKey: ["shopify-featured", "temperaflix-3"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: 10,
        query: "tag:temperaflix",
      });
      const edges = (res?.data?.products?.edges ?? []) as ShopifyProduct[];
      const rank = (t: string) => {
        const s = t.toLowerCase();
        if (s.includes("tradicional")) return 0;
        if (s.includes("ervas")) return 1;
        if (s.includes("bacon")) return 2;
        return 99;
      };
      return edges
        .slice()
        .sort((a, b) => rank(a.node.title) - rank(b.node.title))
        .slice(0, 3);
    },
  });

  const handleAddOne = async (p: ShopifyProduct | undefined) => {
    if (!p) return;
    const v = p.node.variants.edges[0]?.node;
    if (!v) return;
    await addItem({
      product: p,
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions || [],
    });
    toast.success(`${p.node.title} entrou na sacola`);
  };


  const byFlavor = useMemo(() => {
    const map: Partial<Record<FlavorKey, ShopifyProduct>> = {};
    (data ?? []).forEach((p) => {
      map[classify(p.node.title)] = p;
    });
    return map;
  }, [data]);

  // Auto-cycle spotlight every 4.5s
  const [active, setActive] = useState<FlavorKey>("tradicional");
  useEffect(() => {
    const id = setInterval(() => {
      setActive((cur) => ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const activeMeta = FLAVOR[active];

  return (
    <section className="relative overflow-hidden bg-brand-ink text-brand-paper border-y border-foreground/20">
      <FilmGate>
        {/* atmosphere: studio background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video 
            src={studioVideo.url} 
            poster={studioBg.url}
            className="w-full h-full object-cover opacity-100 brightness-100"
            autoPlay 
            muted 
            loop 
            playsInline
          />
          <div className="absolute inset-0 bg-brand-ink/20" />

          {/* 1. SCENE WRAPPER (Centro Óptico do Palco Home) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            
            {/* TELA DE CINEMA 16:9 — Centrada na scene */}
            <div 
              className="relative w-[85%] sm:w-[75%] lg:w-[72%] aspect-[16/9] overflow-hidden"
            >
              {/* Projeção de luz na tela sem o quadro preto */}
              <motion.div
                animate={{
                  background: `radial-gradient(circle at 50% 50%, ${activeMeta.accent}22 0%, transparent 70%)`,
                }}
                className="absolute inset-0 z-10"
              />
            </div>

            {/* HALO / KEY LIGHT — Centrado atrás do trio, na mesma posição da tela */}
            <motion.div
              aria-hidden
              className="absolute blur-[100px] sm:blur-[160px] rounded-full z-20 pointer-events-none w-[90%] sm:w-[70%] h-[60%]"
              animate={{
                background: activeMeta.halo,
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="absolute inset-0 bg-brand-ink/5" />
        </div>
        
        {/* Studio Lighting Rig replaces Bokeh */}
        <StudioLightRig accent={activeMeta.accent} opacity={0.6} />
        
        {/* Textura de filme em movimento entre o fundo e o conteúdo */}
        <FilmTexture />
      </FilmGate>


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        {/* HEADER — player bar */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5 font-mono text-xs tracking-[0.25em] text-brand-paper/70">
              <span className="inline-flex items-center gap-2">
                <span className="relative inline-block h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-70" />
                  <span className="absolute inset-0 rounded-full bg-red-500" />
                </span>
                REC
              </span>
              <span className="text-brand-paper/30">·</span>
              <Film className="h-3.5 w-3.5" />
              <span>TEMPERAFLIX</span>
              <span className="text-brand-paper/30">·</span>
              <span>S01 · 3 EPISÓDIOS</span>
            </div>
            <h2 className="font-display font-black uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-3xl">
              A linha que <span style={{ color: activeMeta.accent }}>entra em cena</span>.
            </h2>
            <p className="mt-6 max-w-xl text-brand-paper/70 leading-relaxed">
              Três snakers exclusivos para seus momentos de tela. Pipoca,
              batata, amendoim — do clássico de domingo à maratona de madrugada.
            </p>
          </div>
          <Button
            asChild
            className="rounded-none h-12 px-6 bg-brand-paper text-brand-ink hover:bg-brand-paper/90 font-display uppercase tracking-widest self-start lg:self-end"
          >
            <Link to="/temperaflix">
              Entrar no canal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* STAGE — 3 shakers in staggered composition */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-brand-paper/50" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[550px] overflow-visible max-w-5xl mx-auto px-4">
            {/* PISO / SOMBRA BASE */}
            <div
              aria-hidden
              className="absolute inset-x-[-20%] bottom-0 pointer-events-none"
              style={{
                height: "15%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }}
            />
            {/* linha de luz no horizonte — sincroniza com accent do sabor ativo */}
            <motion.div
              aria-hidden
              className="absolute inset-x-[10%] pointer-events-none"
              animate={{ background: `linear-gradient(90deg, transparent, ${activeMeta.accent}88, transparent)` }}
              transition={{ duration: 1.2 }}
              style={{ height: "1px", bottom: "38%", opacity: 0.6, filter: "blur(0.5px)" }}
            />
            {ORDER.map((key) => {
              const product = byFlavor[key];
              const meta = FLAVOR[key];
              const isActive = active === key;
              const image = product
                ? getProductImage(
                    product.node.handle,
                    product.node.images.edges[0]?.node.url,
                  )
                : null;
              const price = product?.node.priceRange.minVariantPrice;
              const canOpen = !!product && (!isMobile || isActive);

              return (
                <div
                  key={key}
                  className={`relative flex flex-col items-center justify-center transition-all duration-700 ${
                    isActive ? "w-[45%] z-30 scale-110" : "w-[25%] z-10 opacity-40 grayscale-[0.5] blur-[2px]"
                  }`}
                  style={{ perspective: 1200 }}
                  onMouseEnter={() => setActive(key)}
                  onFocus={() => setActive(key)}
                >
                  <Link
                    to="/product/$handle"
                    params={{ handle: product?.node.handle ?? "" }}
                    preload={canOpen ? "intent" : false}
                    onClick={(e) => {
                      if (!canOpen) {
                        e.preventDefault();
                        setActive(key);
                      }
                    }}
                    className="contents cursor-pointer"
                  >
                    {/* ORIGEM / SOMBRA NO BAÚ */}
                    <motion.div
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
                      animate={{
                        opacity: isActive ? 0.3 : 0.5,
                        width: isActive ? "60%" : "50%",
                        y: isActive ? 180 : 0
                      }}
                      style={{
                        bottom: "0px",
                        height: "10px",
                        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 80%)",
                        filter: "blur(5px)",
                      }}
                    />

                    {/* pot */}
                    <motion.div
                      className="relative w-full z-10 flex justify-center"
                      layoutId={`pote-${key}`}
                      animate={{
                        y: isActive ? -60 : 0, 
                        scale: isActive ? 1.2 : 0.9,
                        filter: isActive ? "drop-shadow(0 20px 40px rgba(0,0,0,0.6))" : "none",
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 80, 
                        damping: 20
                      }}
                      style={{ transformOrigin: "bottom center" }}
                    >
                      {image ? (
                        <img decoding="async"
                          src={image}
                          alt={product?.node.title ?? meta.label}
                          className="w-full h-auto object-contain max-h-[250px] sm:max-h-[380px]"
                          loading="lazy"
                        />

                    ) : (
                      <div className="w-full aspect-[3/4] bg-brand-paper/5" />
                    )}

                    {/* SCAN FRAME — mira na tela de cinema para o pote ativo */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="crosshair"
                          aria-hidden
                          initial={{ opacity: 0, scale: 1.2 }}
                          animate={{ opacity: 0.8, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className="absolute -inset-[15%] pointer-events-none"
                        >
                          <div className="absolute inset-0 border border-white/10 rounded-lg blur-[1px]" />
                          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos, i) => (
                            <span
                              key={i}
                              className={`absolute w-4 h-4 sm:w-5 sm:h-5 ${pos}`}
                              style={{ borderColor: meta.accent }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* scanline sweep on active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="scan"
                          aria-hidden
                          initial={{ y: "-20%", opacity: 0 }}
                          animate={{ y: "110%", opacity: [0, 0.9, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.4, ease: "easeInOut" }}
                          className="absolute left-0 right-0 h-[2px] mx-auto w-[70%]"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                            boxShadow: `0 0 12px ${meta.accent}`,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>


                  {/* meta strip */}
                  <div className="relative mt-4 sm:mt-6 text-center w-full">
                    <div
                      className="font-mono text-xs tracking-[0.3em] transition-colors"
                      style={{
                        color: isActive ? meta.accent : "rgba(245,240,232,0.5)",
                      }}
                    >
                      &gt; {meta.code}
                    </div>
                    <div className="mt-1 font-display font-black uppercase text-lg sm:text-2xl tracking-tight leading-none">
                      {meta.label}
                    </div>
                    <div className="mt-1 hidden sm:block text-xs text-brand-paper/50 italic font-serif">
                      {meta.tagline}
                    </div>
                    {price && (
                      <div
                        className="mt-2 font-display font-black text-sm sm:text-lg"
                        style={{
                          color: isActive ? meta.accent : "rgba(245,240,232,0.75)",
                        }}
                      >
                        {formatBRL(price.amount, price.currencyCode)}
                      </div>
                    )}
                    <div
                      className="mt-2 font-mono text-xs tracking-[0.28em] uppercase transition-opacity duration-300"
                      style={{
                        color: meta.accent,
                        opacity: isActive ? 0.9 : 0,
                      }}
                      aria-hidden={!isActive}
                    >
                      &gt; Ver ficha
                    </div>
                  </div>
                  </Link>

                  {/* ADD TO CART CTA — abaixo do preço, fora do alcance das sombras */}
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddOne(product);
                    }}
                    disabled={!product || isAdding}
                    className="relative z-20 mt-8 sm:mt-10 w-full rounded-none h-11 px-3 bg-brand-paper text-brand-ink hover:bg-brand-paper/90 font-display uppercase tracking-widest text-xs"
                    aria-label={`Adicionar ${meta.label} à sacola`}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Sacola
                  </Button>
                </div>

              );
            })}
          </div>
        )}

        {/* FOOTER — HUD strip */}
        <div className="mt-14 pt-6 border-t border-brand-paper/15 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.3em] text-brand-paper/50 uppercase">
          <span>// linha exclusiva · temperanzza</span>
          <span>3 SABORES · SNAKERS · PRONTO PARA USO</span>
          <Link
            to="/temperaflix"
            className="inline-flex min-h-11 items-center hover:text-brand-paper transition-colors"
          >
            ver todos os episódios →
          </Link>
        </div>
      </div>
    </section>
  );
}
