import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Film, Popcorn, Flame, Play, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  formatBRL,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { getProductImage } from "@/lib/productImages";
import { toast } from "sonner";
import bokehVideo from "@/assets/hero-bokeh.mp4.asset.json";
import bokehPoster from "@/assets/hero-bokeh-poster.jpg";

/**
 * BokehBackdrop — vídeo em loop de bokeh dourado cinematográfico.
 * Espelha a atmosfera das artes dos potes Temperaflix: fundo preto profundo,
 * orbs âmbar/dourado desfocados e halo quente central.
 * blend-mode "screen" apaga o preto do vídeo/poster sobre o ink, mantendo só a luz.
 */
function BokehBackdrop({ opacity = 0.55 }: { opacity?: number }) {
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

export const Route = createFileRoute("/temperaflix")({
  head: () => ({
    meta: [
      { title: "Temperaflix — O tempero que entra em cena | Temperanzza" },
      {
        name: "description",
        content:
          "Linha exclusiva Temperaflix: 3 shakers — Tradicional, Ervas Finas e Bacon. O sabor oficial dos seus momentos de tela.",
      },
      { property: "og:title", content: "Temperaflix — O tempero que entra em cena" },
      {
        property: "og:description",
        content:
          "Três shakers exclusivos para temperar seus momentos de tela. Uma linha Temperanzza.",
      },
    ],
  }),
  component: TemperaflixPage,
});

/* ─────────────────────────────────────────────────────────────
   FLAVOR META — códigos de episódio, halos, tags
   ───────────────────────────────────────────────────────────── */

const FLAVOR = {
  tradicional: {
    code: "S01·E01",
    ep: "01",
    genre: "O Clássico",
    tagline: "Atemporal. Vai bem com qualquer trama.",
    pairing: "Pipoca de cinema · batata rústica · amendoim torrado",
    duration: "blend 04:20",
    halo: "oklch(0.48 0.22 28)",
    accent: "#C7452C",
    Icon: Popcorn,
  },
  ervas: {
    code: "S01·E02",
    ep: "02",
    genre: "O Drama Sofisticado",
    tagline: "Aromático, elegante, para cenas memoráveis.",
    pairing: "Pipoca gourmet · castanhas · snacks premium",
    duration: "blend 05:12",
    halo: "oklch(0.62 0.14 145)",
    accent: "#7BB661",
    Icon: Film,
  },
  bacon: {
    code: "S01·E03",
    ep: "03",
    genre: "O Blockbuster",
    tagline: "Defumado, intenso, indulgente.",
    pairing: "Batata frita · torresmo · pipoca de bacon",
    duration: "blend 06:45",
    halo: "oklch(0.38 0.10 45)",
    accent: "#8B5A3C",
    Icon: Flame,
  },
} as const;

type FlavorKey = keyof typeof FLAVOR;
const ORDER: FlavorKey[] = ["tradicional", "ervas", "bacon"];

function classify(title: string): FlavorKey {
  const t = title.toLowerCase();
  if (t.includes("bacon")) return "bacon";
  if (t.includes("ervas")) return "ervas";
  return "tradicional";
}

/* ─────────────────────────────────────────────────────────────
   KIT — TerminalTag + ScanLine
   ───────────────────────────────────────────────────────────── */

function TerminalTag({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase ${className}`}
      style={{ color: color ?? "rgba(245,240,232,0.6)" }}
    >
      &gt; {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

function useTemperaflix() {
  return useQuery({
    queryKey: ["shopify-temperaflix"],
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
      return edges.slice().sort((a, b) => rank(a.node.title) - rank(b.node.title));
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */

function TemperaflixPage() {
  const { data, isLoading, error } = useTemperaflix();
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const byFlavor = useMemo(() => {
    const map: Partial<Record<FlavorKey, ShopifyProduct>> = {};
    (data ?? []).forEach((p) => {
      map[classify(p.node.title)] = p;
    });
    return map;
  }, [data]);

  const [active, setActive] = useState<FlavorKey>("tradicional");
  const activeMeta = FLAVOR[active];
  const activeProduct = byFlavor[active];

  // hero auto-cycle (only if user hasn't interacted)
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (locked) return;
    const id = setInterval(() => {
      setActive((cur) => ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]);
    }, 5000);
    return () => clearInterval(id);
  }, [locked]);

  const handleSelect = (k: FlavorKey) => {
    setLocked(true);
    setActive(k);
  };

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

  const handleCombo = async () => {
    if (!data || data.length === 0) return;
    for (const p of data) {
      const v = p.node.variants.edges[0]?.node;
      if (!v) continue;
      await addItem({
        product: p,
        variantId: v.id,
        variantTitle: v.title,
        price: v.price,
        quantity: 1,
        selectedOptions: v.selectedOptions || [],
      });
    }
    toast.success("Season Pass adicionado à sacola");
  };

  const total =
    data?.reduce(
      (sum, p) =>
        sum + parseFloat(p.node.priceRange.minVariantPrice.amount || "0"),
      0,
    ) ?? 0;

  return (
    <SiteLayout>
      {/* ═══════════════ HERO CINEMATOGRÁFICO ═══════════════ */}
      <section className="relative overflow-hidden bg-brand-ink text-brand-paper">
        {/* atmosphere layers */}
        <div className="absolute inset-0 bg-paper-grain opacity-[0.08]" />
        <BokehBackdrop opacity={0.35} />
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(55% 55% at 30% 45%, ${activeMeta.halo}66 0%, transparent 60%), radial-gradient(45% 45% at 80% 65%, ${activeMeta.halo}33 0%, transparent 65%)`,
          }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {/* scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 3px)",
          }}
        />

        {/* player bar */}
        <div className="relative border-b border-brand-paper/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-brand-paper/70">
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <span>NOW PLAYING</span>
              <span style={{ color: activeMeta.accent }}>
                {activeMeta.code} · {activeMeta.genre}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <TerminalTag color={activeMeta.accent}>
              Uma produção Temperanzza · MG
            </TerminalTag>
            <h1 className="mt-6 font-display font-black uppercase text-5xl sm:text-6xl lg:text-8xl leading-[0.88] tracking-tight max-w-4xl">
              O tempero que{" "}
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ color: activeMeta.accent }}
                className="inline-block"
              >
                entra em cena
              </motion.span>
              .
            </h1>
            <p className="mt-8 max-w-xl text-lg text-brand-paper/75 leading-relaxed">
              Três shakers prontos para a hora do sofá. Pipoca, batata,
              amendoim — o sabor oficial dos seus momentos de tela, do clássico
              de domingo à maratona de madrugada.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#episodios">
                <Button className="rounded-none h-12 px-6 bg-brand-paper text-brand-ink hover:bg-brand-paper/90 font-display uppercase tracking-widest">
                  <Play className="mr-2 w-4 h-4 fill-current" />
                  Ver os 3 sabores
                </Button>
              </a>
              <a href="#season-pass">
                <Button
                  variant="outline"
                  className="rounded-none h-12 px-6 border-brand-paper/40 bg-transparent text-brand-paper hover:bg-brand-paper hover:text-brand-ink font-display uppercase tracking-widest"
                >
                  Levar o combo
                </Button>
              </a>
            </div>
          </div>

          {/* floating shaker preview */}
          <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
            <motion.div
              aria-hidden
              className="absolute inset-0 blur-3xl rounded-full mx-auto"
              animate={{ background: `${activeMeta.halo}` }}
              transition={{ duration: 1.4 }}
              style={{ opacity: 0.5, width: "80%", height: "80%", top: "10%", left: "10%" }}
            />
            {/* pedestal — sombra de contato no piso */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: "55%",
                height: "38px",
                bottom: "8%",
                background: `radial-gradient(ellipse 50% 55% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 45%, transparent 75%)`,
                filter: "blur(6px)",
              }}
            />
            <motion.div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              animate={{ background: activeMeta.halo }}
              transition={{ duration: 1.2 }}
              style={{
                width: "40%",
                height: "8px",
                bottom: "11%",
                opacity: 0.5,
                filter: "blur(4px)",
                mixBlendMode: "screen",
                borderRadius: "50%",
              }}
            />
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.img
                  key={active}
                  src={
                    getProductImage(
                      activeProduct.node.handle,
                      activeProduct.node.images.edges[0]?.node.url,
                    ) ?? ""
                  }
                  alt={activeProduct.node.title}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  exit={{ opacity: 0, y: -30, rotateY: 15 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative max-h-[440px] w-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]"
                  loading="eager"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ EPISÓDIOS — player + playlist ═══════════════ */}
      <section
        id="episodios"
        className="relative overflow-hidden bg-brand-ink text-brand-paper border-t border-brand-paper/15 py-20 sm:py-24"
      >
        <div className="absolute inset-0 bg-paper-grain opacity-[0.06]" />
        <BokehBackdrop opacity={0.25} />
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(50% 60% at 20% 50%, ${activeMeta.halo}44 0%, transparent 60%)`,
          }}
          transition={{ duration: 1.2 }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <TerminalTag color={activeMeta.accent}>Episódios</TerminalTag>
              <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                Escolha sua sessão
              </h2>
            </div>
            <p className="max-w-md text-brand-paper/60 leading-relaxed">
              Cada blend é um episódio. Toque para trocar, adicione à sacola,
              colecione os três.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-brand-paper/50" />
            </div>
          ) : error || !data || data.length === 0 ? (
            <div className="border-2 border-dashed border-brand-paper/20 py-20 px-6 text-center">
              <p className="font-display text-2xl uppercase tracking-wide">
                Shakers a caminho
              </p>
              <p className="mt-3 text-brand-paper/60 max-w-md mx-auto">
                A linha Temperaflix está sendo finalizada no estoque.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* LEFT — big shaker stage */}
              <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[520px] flex items-center justify-center">
                <motion.div
                  aria-hidden
                  className="absolute inset-0 blur-3xl rounded-full mx-auto"
                  animate={{ background: activeMeta.halo }}
                  transition={{ duration: 1.2 }}
                  style={{ opacity: 0.55, width: "75%", height: "75%", top: "12%", left: "12%" }}
                />
                <AnimatePresence mode="wait">
                  {activeProduct && (
                    <motion.div
                      key={`stage-${active}`}
                      initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="relative"
                      style={{ perspective: 1200 }}
                    >
                      <img
                        src={
                          getProductImage(
                            activeProduct.node.handle,
                            activeProduct.node.images.edges[0]?.node.url,
                          ) ?? ""
                        }
                        alt={activeProduct.node.title}
                        className="max-h-[500px] w-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.65)]"
                        loading="lazy"
                      />
                      {/* scanline sweep */}
                      <motion.div
                        aria-hidden
                        key={`scan-${active}`}
                        initial={{ y: "-10%", opacity: 0 }}
                        animate={{ y: "110%", opacity: [0, 1, 0] }}
                        transition={{ duration: 1.6, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-[2px] mx-auto w-[80%]"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${activeMeta.accent}, transparent)`,
                          boxShadow: `0 0 16px ${activeMeta.accent}`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ep tag */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                  <motion.div
                    key={`code-${active}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-[10px] tracking-[0.35em] uppercase"
                    style={{ color: activeMeta.accent }}
                  >
                    &gt; NOW PLAYING · {activeMeta.code}
                  </motion.div>
                </div>
              </div>

              {/* RIGHT — playlist */}
              <div className="lg:col-span-5 flex flex-col divide-y divide-brand-paper/15 border-y border-brand-paper/15">
                {ORDER.map((k) => {
                  const meta = FLAVOR[k];
                  const p = byFlavor[k];
                  const isActive = active === k;
                  const price = p?.node.priceRange.minVariantPrice;
                  const Icon = meta.Icon;

                  return (
                    <button
                      key={k}
                      type="button"
                      onMouseEnter={() => handleSelect(k)}
                      onClick={() => handleSelect(k)}
                      className="relative text-left py-5 px-4 sm:px-6 flex items-center gap-4 group transition-colors outline-none"
                      style={{
                        background: isActive
                          ? "rgba(245,240,232,0.04)"
                          : "transparent",
                      }}
                    >
                      {/* left rail */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all"
                        style={{
                          background: isActive ? meta.accent : "transparent",
                        }}
                      />
                      {/* ep number */}
                      <div
                        className="font-display font-black text-4xl sm:text-5xl leading-none w-14 tabular-nums transition-colors"
                        style={{
                          color: isActive
                            ? meta.accent
                            : "rgba(245,240,232,0.35)",
                        }}
                      >
                        {meta.ep}
                      </div>
                      {/* body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: meta.accent }}
                          />
                          <span
                            className="font-mono text-[10px] tracking-[0.28em] uppercase"
                            style={{
                              color: isActive
                                ? meta.accent
                                : "rgba(245,240,232,0.5)",
                            }}
                          >
                            {meta.genre} · {meta.duration}
                          </span>
                        </div>
                        <div className="font-display font-black uppercase text-xl sm:text-2xl tracking-tight leading-none truncate">
                          {p?.node.title ?? `Temperaflix ${meta.genre}`}
                        </div>
                        <div className="mt-1 font-serif italic text-sm text-brand-paper/60 truncate">
                          {meta.tagline}
                        </div>
                      </div>
                      {/* price + play */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {price && (
                          <span
                            className="font-display font-black text-lg"
                            style={{
                              color: isActive
                                ? meta.accent
                                : "rgba(245,240,232,0.85)",
                            }}
                          >
                            {formatBRL(price.amount, price.currencyCode)}
                          </span>
                        )}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddOne(p);
                          }}
                          className="inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
                          style={{
                            borderColor: isActive
                              ? meta.accent
                              : "rgba(245,240,232,0.3)",
                            color: isActive
                              ? meta.accent
                              : "rgba(245,240,232,0.7)",
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Sacola
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BASTIDORES — timeline horizontal ═══════════════ */}
      <section className="relative bg-brand-cream text-foreground border-t border-foreground/15 py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-paper-grain opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <TerminalTag color="var(--accent)" className="!text-accent">
              Bastidores
            </TerminalTag>
            <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight max-w-3xl">
              Como temperar sua maratona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* horizontal connector */}
            <div
              aria-hidden
              className="hidden md:block absolute top-8 left-0 right-0 h-[1px] bg-foreground/20"
            />
            {[
              {
                scene: "01",
                title: "Domingo de filme em família",
                body: "Tigela de pipoca no centro, Tradicional na mão. O sabor que todo mundo aprova sem discussão.",
                accent: FLAVOR.tradicional.accent,
              },
              {
                scene: "02",
                title: "Noite de série, luz baixa",
                body: "Ervas Finas em castanhas e pipoca gourmet. Aroma que pede uma segunda taça.",
                accent: FLAVOR.ervas.accent,
              },
              {
                scene: "03",
                title: "Game night, jogo decisivo",
                body: "Bacon defumado em batata frita e petiscos. Intensidade à altura da rodada.",
                accent: FLAVOR.bacon.accent,
              },
            ].map((s) => (
              <div key={s.scene} className="relative pt-16">
                {/* node */}
                <div
                  className="absolute top-6 left-0 flex items-center gap-3"
                >
                  <span
                    className="h-4 w-4 rounded-full border-2 bg-brand-cream"
                    style={{ borderColor: s.accent }}
                  />
                  <span
                    className="font-mono text-[11px] tracking-[0.3em] uppercase"
                    style={{ color: s.accent }}
                  >
                    &gt; SCENE {s.scene}
                  </span>
                </div>
                <h3 className="font-serif italic text-2xl leading-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SEASON PASS ═══════════════ */}
      <section
        id="season-pass"
        className="relative overflow-hidden bg-brand-ink text-brand-paper py-20 sm:py-28 border-t border-brand-paper/15"
      >
        <div className="absolute inset-0 bg-paper-grain opacity-[0.08]" />
        {/* triple halo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(30% 40% at 25% 50%, ${FLAVOR.tradicional.halo}55 0%, transparent 60%), radial-gradient(30% 40% at 50% 50%, ${FLAVOR.ervas.halo}55 0%, transparent 60%), radial-gradient(30% 40% at 75% 50%, ${FLAVOR.bacon.halo}55 0%, transparent 60%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 3px)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          {/* 3 pots floating */}
          <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[400px]">
            {data && data.length === 3 && (
              <div className="relative h-full flex items-end justify-center gap-2">
                {ORDER.map((k, idx) => {
                  const p = byFlavor[k];
                  if (!p) return null;
                  const image = getProductImage(
                    p.node.handle,
                    p.node.images.edges[0]?.node.url,
                  );
                  return (
                    <motion.img
                      key={k}
                      src={image ?? ""}
                      alt={p.node.title}
                      className="w-1/3 object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.6,
                      }}
                      style={{
                        transform: `translateY(${idx === 1 ? "-12px" : "0"})`,
                        zIndex: idx === 1 ? 2 : 1,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* copy */}
          <div className="lg:col-span-6">
            <TerminalTag color="#D8B04A">Edição limitada</TerminalTag>
            <h2 className="mt-4 font-display font-black uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.9]">
              Season Pass{" "}
              <span style={{ color: "#D8B04A" }}>Temperaflix</span>
            </h2>
            <p className="mt-6 text-brand-paper/70 leading-relaxed max-w-lg">
              Os três episódios no mesmo sofá. Tradicional, Ervas Finas e Bacon —
              pronto para qualquer gênero que a noite pedir.
            </p>

            {data && data.length > 0 && (
              <div className="mt-8 flex items-baseline gap-4">
                <span
                  className="font-display font-black text-5xl"
                  style={{ color: "#D8B04A" }}
                >
                  {formatBRL(total, "BRL")}
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-brand-paper/50">
                  pelos 3 shakers · frete único
                </span>
              </div>
            )}

            <div className="mt-8">
              <Button
                onClick={handleCombo}
                disabled={isAdding || !data || data.length === 0}
                className="rounded-none h-12 px-6 bg-brand-paper text-brand-ink hover:bg-brand-paper/90 font-display uppercase tracking-widest"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-2 w-4 h-4" />
                    Assinar o combo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CRÉDITOS FINAIS ═══════════════ */}
      <section className="bg-brand-ink text-brand-paper border-t border-brand-paper/15 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6 font-mono text-[10px] tracking-[0.28em] uppercase text-brand-paper/50">
          <div>
            <div className="text-brand-paper/30 mb-2">&gt; produção</div>
            <div className="text-brand-paper/80">Temperanzza · Minas Gerais</div>
          </div>
          <div>
            <div className="text-brand-paper/30 mb-2">&gt; temporada</div>
            <div className="text-brand-paper/80">S01 · 3 episódios · desde 2023</div>
          </div>
          <div>
            <div className="text-brand-paper/30 mb-2">&gt; direção</div>
            <div className="text-brand-paper/80">Casa de temperos artesanais</div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-brand-paper/10 flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif italic text-lg text-brand-paper/70">
            Explore o catálogo completo — 19 temperos da casa.
          </p>
          <Link to="/produtos">
            <Button
              variant="outline"
              className="rounded-none h-11 px-6 border-brand-paper/40 bg-transparent text-brand-paper hover:bg-brand-paper hover:text-brand-ink font-display uppercase tracking-widest"
            >
              Ver catálogo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
