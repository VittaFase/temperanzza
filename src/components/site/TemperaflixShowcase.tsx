import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Film, ArrowRight, Loader2 } from "lucide-react";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  formatBRL,
  type ShopifyProduct,
} from "@/lib/shopify";
import { getProductImage } from "@/lib/productImages";
import { Button } from "@/components/ui/button";
import bokehVideo from "@/assets/hero-bokeh.mp4.asset.json";
import bokehPoster from "@/assets/hero-bokeh-poster.jpg";

function BokehBackdrop({ opacity = 0.3 }: { opacity?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enableVideo, setEnableVideo] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setEnableVideo(true);
  }, []);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <img
        src={bokehPoster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen", opacity }}
      />
      {enableVideo && (
        <video
          ref={videoRef}
          src={bokehVideo.url}
          poster={bokehPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ mixBlendMode: "screen", opacity }}
        />
      )}
    </div>
  );
}

/** Per-flavor color halo tokens (oklch, tied to brand palette). */
const FLAVOR = {
  tradicional: {
    code: "S01·E01",
    label: "Tradicional",
    tagline: "O sabor que combina com tudo.",
    halo: "oklch(0.48 0.22 28)", // deep brick red — matches label
    accent: "#C7452C",
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
      {/* atmosphere: radial halo tied to active flavor + paper grain */}
      <div className="absolute inset-0 bg-paper-grain opacity-[0.08]" />
      <BokehBackdrop opacity={0.3} />
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(60% 55% at 50% 45%, ${activeMeta.halo}55 0%, transparent 60%), radial-gradient(30% 25% at 15% 90%, ${activeMeta.halo}30 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* faint vertical scanlines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 3px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        {/* HEADER — player bar */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5 font-mono text-[11px] tracking-[0.25em] text-brand-paper/70">
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
            <h2 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-3xl">
              A linha que <span style={{ color: activeMeta.accent }}>entra em cena</span>.
            </h2>
            <p className="mt-6 max-w-xl text-brand-paper/70 leading-relaxed">
              Três shakers exclusivos para seus momentos de tela. Pipoca,
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
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end min-h-[360px] sm:min-h-[480px]">
            {ORDER.map((key) => {
              const product = byFlavor[key];
              const meta = FLAVOR[key];
              const isActive = active === key;
              const isCenter = key === "ervas";
              const image = product
                ? getProductImage(
                    product.node.handle,
                    product.node.images.edges[0]?.node.url,
                  )
                : null;
              const price = product?.node.priceRange.minVariantPrice;

              return (
                <button
                  key={key}
                  type="button"
                  onMouseEnter={() => setActive(key)}
                  onFocus={() => setActive(key)}
                  className="group relative flex flex-col items-center justify-end outline-none"
                  style={{ perspective: 1200 }}
                >
                  {/* halo bloom */}
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none blur-2xl"
                    animate={{
                      opacity: isActive ? 0.7 : 0.18,
                      scale: isActive ? 1.15 : 0.9,
                    }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    style={{
                      background: meta.halo,
                      width: isCenter ? "85%" : "70%",
                      height: isCenter ? "85%" : "70%",
                      bottom: "12%",
                    }}
                  />

                  {/* pedestal — sombra de contato + disco de luz refletida */}
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    animate={{
                      opacity: isActive ? 1 : 0.55,
                      scale: isActive ? 1.1 : 0.9,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      width: "75%",
                      height: "42px",
                      bottom: "2%",
                      background: `radial-gradient(ellipse 50% 55% at 50% 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, transparent 75%)`,
                      filter: "blur(6px)",
                    }}
                  />
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    animate={{ opacity: isActive ? 0.55 : 0.2 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      width: "55%",
                      height: "10px",
                      bottom: "6%",
                      background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${meta.halo} 0%, transparent 70%)`,
                      filter: "blur(4px)",
                      mixBlendMode: "screen",
                    }}
                  />

                  {/* pot */}
                  <motion.div
                    className="relative w-full"
                    animate={{
                      y: isActive ? -14 : isCenter ? -6 : 0,
                      rotateY: isActive ? 6 : 0,
                      scale: isActive ? 1.05 : isCenter ? 1 : 0.9,
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product?.node.title ?? meta.label}
                        className="w-full h-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)] max-h-[380px] mx-auto"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-brand-paper/5" />
                    )}

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
                      className="font-mono text-[10px] tracking-[0.3em] transition-colors"
                      style={{
                        color: isActive ? meta.accent : "rgba(245,240,232,0.5)",
                      }}
                    >
                      &gt; {meta.code}
                    </div>
                    <div className="mt-1 font-display font-black uppercase text-lg sm:text-2xl tracking-tight leading-none">
                      {meta.label}
                    </div>
                    <div className="mt-1 hidden sm:block text-[11px] text-brand-paper/50 italic font-serif">
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
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* FOOTER — HUD strip */}
        <div className="mt-14 pt-6 border-t border-brand-paper/15 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.3em] text-brand-paper/50 uppercase">
          <span>// linha exclusiva · temperanzza</span>
          <span>3 sabores · shakers 60g · pronto para uso</span>
          <Link
            to="/temperaflix"
            className="hover:text-brand-paper transition-colors"
          >
            ver todos os episódios →
          </Link>
        </div>
      </div>
    </section>
  );
}
