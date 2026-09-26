import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BUILDER_HANDLES, BUILDER_TARGET } from "@/lib/blends";
import { getProductImage } from "@/lib/productImages";
import { canonicalProductHandle } from "@/lib/rebrandCatalog";
import { potLabel } from "@/lib/potLabels";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT } from "@/lib/blendPricing";
import { useBoxStore, boxTotal } from "@/stores/boxStore";

/** Cor da cápsula = cor da faixa do rótulo de cada pote. */
const POT_COLORS: Record<string, { bg: string; fg: string; btn: string; btnFg: string }> = {
  "ana-maria": { bg: "#C2127A", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "chimichurri-picante": { bg: "#D9342B", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "chimichurri-sem-pimenta": { bg: "#8E5530", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  curcuma: { bg: "#F2B705", fg: "#1A1A1A", btn: "#1A1A1A", btnFg: "#FFFFFF" },
  "tempero-do-edu": { bg: "#1F6FD1", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "ervas-finas": { bg: "#4E9A33", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "lemon-pepper": { bg: "#EDBE12", fg: "#1A1A1A", btn: "#1A1A1A", btnFg: "#FFFFFF" },
  "paprica-defumada": { bg: "#6E2A85", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "paprica-doce": { bg: "#D8452A", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "paprica-picante": { bg: "#B3161C", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "salsa-cebola-e-alho": { bg: "#2FA894", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "tempero-mineiro": { bg: "#A9481C", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "temperaflix-bacon": { bg: "#D92A25", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "temperaflix-ervas-finas": { bg: "#138F45", fg: "#FFFFFF", btn: "#FFFFFF", btnFg: "#1A1A1A" },
  "temperaflix-tradicional": { bg: "#F5C400", fg: "#1A1A1A", btn: "#1A1A1A", btnFg: "#FFFFFF" },
  "canela-moida": { bg: "#1C1712", fg: "#D8B45A", btn: "#D8B45A", btnFg: "#1A1A1A" },
  "pimenta-do-reino": { bg: "#141414", fg: "#E6E6E6", btn: "#E6E6E6", btnFg: "#1A1A1A" },
};

/** Potes Premium Black têm fundo branco na foto; o "multiply" funde o fundo com a cápsula. */
const WHITE_BACKGROUND = new Set(["canela-moida", "pimenta-do-reino"]);

/**
 * Carrossel no padrão Kinders: cápsulas coloridas com o pote, o nome e o botão
 * "Compre agora". Cada clique coloca 1 pote na caixa; ao chegar em 12 a caixa
 * fecha e o cupom de desconto é aplicado automaticamente no pagamento.
 */
export function PotesCarousel() {
  const add = useBoxStore((s) => s.add);
  const picks = useBoxStore((s) => s.picks);
  const total = boxTotal(picks);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);

  const items = BUILDER_HANDLES.map((handle) => {
    const key = canonicalProductHandle(handle);
    return {
      handle,
      key,
      label: potLabel(handle),
      img: getProductImage(handle),
      color: POT_COLORS[key],
    };
  }).filter((item) => item.img && item.color);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Avança sozinho a cada 4 s; pausa com o mouse em cima ou para quem prefere menos movimento.
  useEffect(() => {
    if (!emblaApi || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 4000);
    return () => window.clearInterval(id);
  }, [emblaApi, paused]);

  function comprarAgora(handle: string, label: string) {
    const newTotal = add(handle);
    if (newTotal === null) {
      toast.info(`Sua caixa já está completa com ${BUILDER_TARGET} potes.`);
      document.getElementById("montar")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (newTotal === BUILDER_TARGET) {
      toast.success(
        `Caixa completa! Cupom ${BLEND_DISCOUNT_CODE} de ${BLEND_DISCOUNT_PCT}% aplicado automaticamente.`,
      );
      document.getElementById("montar")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    toast.success(`${label} na sua caixa · ${newTotal}/${BUILDER_TARGET}`);
  }

  return (
    <section
      className="relative py-16 sm:py-20 bg-background overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
            A linha completa · {items.length} potes
          </span>
          <h2 className="mt-4 font-display font-black uppercase text-4xl sm:text-5xl tracking-tight leading-[0.95]">
            Compre agora e <span className="text-accent">encha sua caixa</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sua caixa:{" "}
            <strong className="text-foreground">
              {total}/{BUILDER_TARGET}
            </strong>{" "}
            potes
            {total >= BUILDER_TARGET ? ` · cupom ${BLEND_DISCOUNT_CODE} ativado` : ""}
          </p>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-foreground/20 hover:border-accent hover:text-accent transition-colors"
            aria-label="Próximo"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden px-4 sm:px-6 lg:px-8" ref={emblaRef}>
        <div className="flex -ml-4">
          {items.map((item) => {
            const c = item.color!;
            const qty = picks[item.handle] ?? 0;
            return (
              <div
                key={item.handle}
                className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-1/2 lg:basis-1/3 pl-4"
              >
                <article
                  className="group relative h-56 sm:h-60 rounded-full flex items-center gap-3 pl-6 pr-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: c.bg, color: c.fg }}
                >
                  {qty > 0 && (
                    <span
                      className="absolute top-5 right-10 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full text-xs font-bold"
                      style={{ backgroundColor: c.btn, color: c.btnFg }}
                    >
                      ×{qty}
                    </span>
                  )}
                  <div className="h-[88%] shrink-0 aspect-[1/2] overflow-hidden">
                    <img
                      src={item.img ?? ""}
                      alt={item.label}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover object-center drop-shadow-[0_12px_14px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 ${
                        WHITE_BACKGROUND.has(item.key) ? "mix-blend-multiply" : ""
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-center">
                    <h3 className="font-display font-black uppercase text-xl sm:text-2xl leading-[1.05] tracking-tight">
                      {item.label}
                    </h3>
                    <button
                      type="button"
                      onClick={() => comprarAgora(item.handle, item.label)}
                      className="mt-4 inline-flex items-center justify-center rounded-md px-5 h-10 text-sm font-semibold shadow-sm transition-transform hover:scale-105"
                      style={{ backgroundColor: c.btn, color: c.btnFg }}
                    >
                      Compre agora
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 flex justify-center gap-2"
        role="tablist"
        aria-label="Navegação do carrossel"
      >
        {snaps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2.5 rounded-full transition-all ${i === selected ? "w-7 bg-foreground" : "w-2.5 bg-foreground/25"}`}
            aria-label={`Ir para o grupo ${i + 1}`}
            aria-selected={i === selected}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}
