import { useEffect, useState } from "react";
import { Copy, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT, BLEND_DISCOUNT_MIN_ITEMS } from "@/lib/blendPricing";

const MODAL_SESSION_KEY = "tz_promo_seen";

/**
 * Barra fina no topo (sempre visível) + modal de boas-vindas
 * uma vez por sessão, comunicando o cupom BLENDS10.
 */
export function PromoAnnouncement() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(MODAL_SESSION_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(MODAL_SESSION_KEY, "1");
    }, 800);
    return () => clearTimeout(t);
  }, []);

  function copy() {
    navigator.clipboard.writeText(BLEND_DISCOUNT_CODE).then(() => {
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <>
      {/* Top bar */}
      <div className="w-full bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-[11px] sm:text-xs font-display uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3 text-accent shrink-0" />
          <span className="text-center">
            <span className="text-accent">{BLEND_DISCOUNT_PCT}% off</span> na caixa a partir de {BLEND_DISCOUNT_MIN_ITEMS} potes — use
          </span>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 border border-background/40 px-2 py-0.5 hover:bg-accent hover:border-accent transition-colors"
            aria-label="Copiar código BLENDS10"
          >
            <span className="tracking-[0.25em]">{BLEND_DISCOUNT_CODE}</span>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-brand-cream border border-foreground/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 p-1 text-foreground/60 hover:text-accent"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 sm:p-10 text-center">
              <span className="inline-flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
                <Sparkles className="w-3 h-3" /> Boas-vindas da casa
              </span>
              <h2
                id="promo-title"
                className="mt-5 font-display font-black uppercase text-3xl sm:text-4xl leading-[0.95] tracking-tight"
              >
                {BLEND_DISCOUNT_PCT}% off na sua{" "}
                <span className="text-accent">caixa blend</span>
              </h2>
              <p className="mt-4 text-sm text-foreground/75 leading-relaxed">
                Monte uma caixa com {BLEND_DISCOUNT_MIN_ITEMS} potes ou mais e
                ganhe {BLEND_DISCOUNT_PCT}% de desconto no fechamento. Use o
                código abaixo no checkout.
              </p>

              <div className="mt-6 flex items-center gap-0 border border-foreground/20 bg-background">
                <code className="flex-1 px-4 py-3 font-display text-2xl tracking-[0.3em] text-foreground">
                  {BLEND_DISCOUNT_CODE}
                </code>
                <button
                  onClick={copy}
                  className="px-4 py-3 bg-foreground text-background hover:bg-accent transition-colors inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>

              <Button
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-none h-11 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider"
              >
                Quero conhecer os blends
              </Button>
              <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Válido em pedidos com {BLEND_DISCOUNT_MIN_ITEMS}+ potes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
