import { useMemo, useState } from "react";
import { Check, Minus, Plus, Sparkles, Tag, X, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BUILDER_HANDLES, BUILDER_TARGET } from "@/lib/blends";
import { getProductImage } from "@/lib/productImages";
import { useShopifyPrices, useShopifyProducts } from "@/hooks/useShopifyPrices";
import {
  computePicksTotal,
  BLEND_DISCOUNT_CODE,
  BLEND_DISCOUNT_PCT,
} from "@/lib/blendPricing";
import { formatBRL } from "@/lib/shopify";
import { addPicksToCart } from "@/lib/blendCheckout";
import { BlendCelebration } from "./BlendCelebration";

/** Etiqueta legível a partir do handle Shopify. */
function labelFor(handle: string): string {
  const map: Record<string, string> = {
    "ana-maria": "Ana Maria",
    "chimichurri-picante": "Chimi Churri Picante",
    "chimichurri-sem-pimenta": "Chimi Churri sem Pimenta",
    curcuma: "Cúrcuma",
    "edu-guedes": "Edu Guedes",
    "ervas-finas": "Ervas Finas",
    "lemon-pepper": "Lemon Pepper",
    "paprica-defumada": "Páprica Defumada",
    "paprica-doce": "Páprica Doce",
    "paprica-picante": "Páprica Picante",
    "salsa-cebola-e-alho": "Salsa, Cebola e Alho",
    "tempero-mineiro": "Tempero Mineiro",
    "temperaflix-bacon": "Temperaflix Bacon",
    "temperaflix-ervas-finas": "Temperaflix Ervas Finas",
    "temperaflix-tradicional": "Temperaflix Tradicional",
  };
  return map[handle] ?? handle;
}

export function BlendBuilder() {
  // mapa handle → quantidade
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { prices } = useShopifyPrices();
  const { products } = useShopifyProducts();
  const priceInfo = useMemo(() => computePicksTotal(picks, prices), [picks, prices]);

  const total = useMemo(
    () => Object.values(picks).reduce((s, n) => s + n, 0),
    [picks],
  );
  const remaining = BUILDER_TARGET - total;
  const isFull = total === BUILDER_TARGET;

  function inc(handle: string) {
    if (isFull) return;
    setPicks((p) => Object.values(p).reduce((sum, qty) => sum + qty, 0) >= BUILDER_TARGET ? p : ({ ...p, [handle]: (p[handle] ?? 0) + 1 }));
  }
  function dec(handle: string) {
    setPicks((p) => {
      const cur = p[handle] ?? 0;
      if (cur <= 1) {
        const { [handle]: _omit, ...rest } = p;
        return rest;
      }
      return { ...p, [handle]: cur - 1 };
    });
  }
  function clear() {
    setPicks({});
  }

  async function handleCheckout() {
    if (!isFull) {
      toast.error(`Faltam ${remaining} potes para fechar sua caixa de 12.`);
      return;
    }
    if (!products) {
      toast.error("Catálogo ainda carregando, tente novamente em instantes.");
      return;
    }
    setSubmitting(true);
    setCheckoutUrl(null);
    setCelebrationOpen(true);
    try {
      const url = await addPicksToCart(picks, products);
      if (!url) {
        toast.error("Não conseguimos preparar seu checkout. Tente novamente.");
        setCelebrationOpen(false);
        return;
      }
      setCheckoutUrl(url);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Catálogo de escolha */}
        <div>
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
              Escolha 12 potes
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
            >
              Limpar
            </button>
          </div>
          <p className="text-muted-foreground mb-8">
            Combine livremente entre os {BUILDER_HANDLES.length} sabores da
            casa. Pode repetir o mesmo pote quantas vezes quiser.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {BUILDER_HANDLES.map((handle) => {
              const qty = picks[handle] ?? 0;
              const img = getProductImage(handle);
              const disabled = isFull && qty === 0;
              return (
                <div
                  key={handle}
                  className={`relative flex flex-col border bg-brand-cream transition-all ${
                    qty > 0
                      ? "border-accent ring-1 ring-accent"
                      : "border-foreground/10"
                  } ${disabled ? "opacity-50" : ""}`}
                >
                  {qty > 0 && (
                    <span className="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-background text-xs font-bold">
                      {qty}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => inc(handle)}
                    disabled={disabled}
                    className="relative w-full aspect-[3/4] flex items-center justify-center px-2 disabled:cursor-not-allowed"
                    aria-label={`Adicionar ${labelFor(handle)}`}
                  >
                    {img ? (
                      <img decoding="async"
                        src={img}
                        alt={labelFor(handle)}
                        className="max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-foreground/5" />
                    )}
                  </button>
                  <div className="px-2 pb-2 pt-1">
                    <p className="text-[10px] font-display uppercase tracking-[0.15em] text-center leading-tight text-foreground/85 min-h-[28px]">
                      {labelFor(handle)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => dec(handle)}
                        disabled={qty === 0}
                        className="h-7 w-7 inline-flex items-center justify-center border border-foreground/20 hover:border-accent disabled:opacity-30"
                        aria-label="Remover um"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => inc(handle)}
                        disabled={disabled}
                        className="h-7 w-7 inline-flex items-center justify-center bg-foreground text-background hover:bg-accent disabled:opacity-30"
                        aria-label="Adicionar um"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo lateral */}
        <aside className="lg:sticky lg:top-24 self-start border border-foreground/15 bg-background">
          <div className="p-5 border-b border-foreground/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Sua caixa
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-display text-5xl leading-none">
                {total}
                <span className="text-foreground/30 text-3xl">/{BUILDER_TARGET}</span>
              </p>
              {isFull ? (
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-accent">
                  <Check className="w-3.5 h-3.5" /> Caixa fechada
                </span>
              ) : (
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Faltam {remaining}
                </span>
              )}
            </div>
            <div className="mt-3 h-1.5 bg-foreground/10">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${(total / BUILDER_TARGET) * 100}%` }}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-5 space-y-2">
            {total === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Comece a tocar nos potes ao lado para preencher sua caixa.
              </p>
            ) : (
              Object.entries(picks).map(([h, q]) => (
                <div
                  key={h}
                  className="flex items-center justify-between text-sm gap-2"
                >
                  <span className="truncate">{labelFor(h)}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-foreground/60">×{q}</span>
                    <button
                      type="button"
                      onClick={() => dec(h)}
                      className="text-muted-foreground hover:text-accent"
                      aria-label={`Remover ${labelFor(h)}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-foreground/10 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Investimento
              </p>
              {!priceInfo || priceInfo.full === 0 ? (
                <p className="mt-1 font-display text-2xl text-foreground/40">—</p>
              ) : isFull ? (
                <>
                  <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                    <p className="font-display text-2xl text-accent leading-none">
                      {formatBRL(priceInfo.discounted, priceInfo.currencyCode)}
                    </p>
                    <p className="font-display text-sm text-foreground/40 line-through leading-none">
                      {formatBRL(priceInfo.full, priceInfo.currencyCode)}
                    </p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 border border-accent/60 bg-accent/10 px-2 py-1">
                    <Tag className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-display uppercase tracking-[0.2em] text-accent">
                      {BLEND_DISCOUNT_PCT}% off · {BLEND_DISCOUNT_CODE}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 font-display text-2xl text-foreground">
                    {formatBRL(priceInfo.full, priceInfo.currencyCode)}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    Feche 12 potes para desbloquear {BLEND_DISCOUNT_PCT}% off
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!isFull || submitting}
              className="w-full rounded-none h-12 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider disabled:bg-foreground/20 disabled:text-foreground/40"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparando…
                </>
              ) : isFull ? (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Finalizar minha caixa
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Escolha {remaining} pote{remaining === 1 ? "" : "s"}
                </>
              )}
            </Button>
          </div>
        </aside>
      </div>

      <BlendCelebration
        open={celebrationOpen}
        blendName="Blend do Chefe"
        checkoutUrl={checkoutUrl}
        loading={submitting}
        onClose={() => setCelebrationOpen(false)}
      />
    </section>
  );
}
