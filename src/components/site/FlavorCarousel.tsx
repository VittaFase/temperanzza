import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
import { isRebrandExcludedHandle } from "@/lib/rebrandCatalog";
import type { ShopifyProduct } from "@/lib/shopify";

const AUTOPLAY_MS = 3000;
const SLIDE_MS = 550;

/** Fallback de nome quando a Shopify ainda não respondeu. */
function prettify(handle: string) {
  return handle
    .split("-")
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

interface Slide {
  handle: string;
  title: string;
  src: string;
}

/**
 * Carrossel "Stories" de sabores da casa: um pote por vez, autoplay de 3s,
 * barra de progresso por sabor, setas manuais que reiniciam a contagem.
 * Dados reais do catálogo (handles + títulos da Shopify), sem mocks.
 */
export function FlavorCarousel({
  handles,
  products,
  countLabel,
}: {
  handles: string[];
  products: Map<string, ShopifyProduct> | null;
  countLabel?: string;
}) {
  const slides: Slide[] = handles
    .filter((handle) => !isRebrandExcludedHandle(handle))
    .map((handle) => {
      const node = products?.get(handle)?.node;
      const src = getProductImage(handle, node?.images.edges[0]?.node.url);
      if (!src) return null;
      return { handle, title: node?.title ?? prettify(handle), src };
    })
    .filter((s): s is Slide => Boolean(s));

  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
      setTick((t) => t + 1);
    },
    [total],
  );

  useEffect(() => {
    if (total < 2) return;

    timer.current = setTimeout(() => {
      go(index + 1);
    }, AUTOPLAY_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, tick, total, go]);

  if (total === 0) return null;

  const current = slides[index];

  return (
    <div className="relative h-56 overflow-hidden border-b border-foreground/10 bg-brand-cream bg-paper-grain sm:h-64">
      {/* progresso estilo stories */}
      <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
        {slides.map((s, i) => (
          <span key={s.handle} className="h-[3px] flex-1 overflow-hidden bg-foreground/20">
            <span
              key={`${tick}-${i}`}
              className={`block h-full origin-left bg-foreground ${i === index ? "animate-[flavor-progress_3000ms_linear_forwards]" : ""}`}
              style={{
                width: i < index ? "100%" : i === index ? "0%" : "0%",
                transform: i < index ? "scaleX(1)" : undefined,
              }}
            />
          </span>
        ))}
      </div>

      {countLabel && (
        <span className="absolute right-3 top-7 z-20 font-display text-[10px] uppercase tracking-widest text-muted-foreground">
          {countLabel}
        </span>
      )}

      {/*
       * Palco: slides inativos permanecem dentro do card. O deslocamento é feito
       * na imagem, que está contida por este viewport, evitando que transforms
       * de elementos absolute inset-0 aumentem o scrollWidth do documento.
       */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((s, i) => {
          const isCurrent = i === index;
          const relativeOffset = i < index ? -1 : 1;
          return (
            <div
              key={s.handle}
              aria-hidden={!isCurrent}
              className="absolute inset-0 flex items-end justify-center overflow-hidden pb-14 sm:pb-16"
              style={{
                opacity: isCurrent ? 1 : 0,
                transition: reduced ? undefined : `opacity ${SLIDE_MS}ms ease`,
                zIndex: isCurrent ? 3 : 1,
                pointerEvents: isCurrent ? "auto" : "none",
              }}
            >
              <img
                src={s.src}
                alt={isCurrent ? s.title : ""}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-[74%] w-auto max-w-[68%] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.22)]"
                style={{
                  transform: `translateX(${isCurrent ? 0 : relativeOffset * 38}%)`,
                  transition: reduced ? undefined : `transform ${SLIDE_MS}ms cubic-bezier(.65,0,.35,1)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* legenda */}
      <div className="absolute inset-x-3 bottom-2 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <span className="block font-display text-[10px] uppercase tracking-widest text-muted-foreground">
            Sabor {String(index + 1).padStart(2, "0")}
          </span>
          <strong className="block truncate font-display text-sm uppercase leading-tight">{current.title}</strong>
        </div>
        <span className="shrink-0 font-display text-[10px] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      {/* navegação manual */}
      {total > 1 && (
        <>
          <NavButton side="left" label="Sabor anterior" onClick={() => go(index - 1)} />
          <NavButton side="right" label="Próximo sabor" onClick={() => go(index + 1)} />
        </>
      )}
    </div>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-foreground/25 bg-brand-cream/75 text-foreground transition hover:bg-brand-cream active:scale-95 ${side === "left" ? "left-2" : "right-2"}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
