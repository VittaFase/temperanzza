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
import bokehVideo from "@/assets/hero-bokeh.mp4.asset.json";
import bokehPoster from "@/assets/hero-bokeh-poster.jpg";
import { useVideoBackdrop } from "@/lib/useVideoBackdrop";
import studioBg from "@/assets/FUNDO_TEMPERAFLIX-2.png.asset.json";


function BokehBackdrop({ opacity = 0.3 }: { opacity?: number }) {
  const { containerRef, enableVideo } = useVideoBackdrop();
  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <img
        src={bokehPoster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ mixBlendMode: "screen", opacity }}
      />
      {enableVideo && (
        <video
          src={bokehVideo.url}
          poster={bokehPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
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
      {/* atmosphere: studio background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={studioBg.url} 
          alt="" 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-brand-ink/40" />
      </div>
      <div className="absolute inset-0 bg-paper-grain opacity-[0.08]" />
      <BokehBackdrop opacity={0.12} />
      {/* ambient neutral vignette — substitui o halo colorido global */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(50% 40% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
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
            <h2 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-3xl">
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
          <div className="relative grid grid-cols-3 gap-2 sm:gap-6 items-end min-h-[300px] sm:min-h-[560px]">
            {/* PISO — gradiente neutro (sem tint colorido) */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "38%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.2) 55%, transparent 100%)",
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
              const isCenter = key === "ervas";
              const image = product
                ? getProductImage(
                    product.node.handle,
                    product.node.images.edges[0]?.node.url,
                  )
                : null;
              const price = product?.node.priceRange.minVariantPrice;
              // Desktop: clique navega direto (hover já ativou o spotlight).
              // Mobile: 1º toque ativa o pote, 2º toque abre a ficha do produto.
              const canOpen = !!product && (!isMobile || isActive);



              return (
                <div
                  key={key}
                  className="group relative flex flex-col items-center justify-end outline-none"
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
                    aria-label={
                      canOpen
                        ? `Ver ficha de ${meta.label}`
                        : `Selecionar ${meta.label}`
                    }
                    className="contents cursor-pointer"
                  >


                  {/* TECH RING — anel de scan neutro girando atrás do pote ativo */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key="tech-ring"
                        aria-hidden
                        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 0.55, scale: 1, rotate: 360 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{
                          opacity: { duration: 0.6 },
                          scale: { duration: 0.6 },
                          rotate: { duration: 18, ease: "linear", repeat: Infinity },
                        }}
                        style={{
                          width: "82%",
                          aspectRatio: "1 / 1",
                          bottom: "18%",
                          border: `1px dashed ${meta.accent}55`,
                          boxShadow: `inset 0 0 24px ${meta.accent}22, 0 0 24px ${meta.accent}22`,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* AMBIENT GLOW — halo bem sutil, neutro/branco (não colorido) */}
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none blur-2xl"
                    animate={{
                      opacity: isActive ? 0.28 : 0.08,
                      scale: isActive ? 1.15 : 0.9,
                    }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      width: isCenter ? "80%" : "65%",
                      height: isCenter ? "80%" : "65%",
                      bottom: "14%",
                    }}
                  />

                  {/* PEDESTAL & SOMBRA — "Apple Box" de estúdio para base física */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[85%] h-12 pointer-events-none z-10">
                    {/* Sombra de oclusão (mais escura perto do pé do pote) */}
                    <motion.div
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
                      animate={{
                        opacity: isActive ? 0.9 : 0.4,
                        scale: isActive ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: "70%",
                        height: "12px",
                        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.9) 0%, transparent 80%)",
                        filter: "blur(4px)",
                      }}
                    />
                    
                    {/* Estrutura física do pedestal (Apple Box) */}
                    <motion.div
                      className="absolute inset-0 bg-neutral-900 border-x border-t border-white/10"
                      animate={{
                        height: isActive ? "24px" : "16px",
                        y: isActive ? "0px" : "8px",
                      }}
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.8)`,
                      }}
                    >
                      {/* Brilho na quina da caixa */}
                      <motion.div 
                        className="absolute top-0 inset-x-0 h-[1px]"
                        animate={{ background: isActive ? `linear-gradient(90deg, transparent, ${meta.accent}aa, transparent)` : "rgba(255,255,255,0.05)" }}
                      />
                    </motion.div>

                    {/* Sombra projetada no chão da caixa */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-8 bg-black/60 blur-md rounded-full -z-10"
                      animate={{ opacity: isActive ? 0.7 : 0.3 }}
                    />
                  </div>

                  {/* pot */}
                  <motion.div
                    className="relative w-full"
                    animate={{
                      y: isActive ? -24 : isCenter ? -6 : 0,
                      rotateY: isActive ? 6 : 0,
                      scale: isActive ? 1.12 : isCenter ? 1 : 0.85,
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {image ? (
                      <img decoding="async"
                        src={image}
                        alt={product?.node.title ?? meta.label}
                        className="w-full h-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] max-h-[460px] mx-auto"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-brand-paper/5" />
                    )}

                    {/* CROSSHAIR — colchetes de mira nos 4 cantos do pote ativo */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="crosshair"
                          aria-hidden
                          initial={{ opacity: 0, scale: 1.15 }}
                          animate={{ opacity: 0.7, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.15 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-[6%] pointer-events-none"
                        >
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
