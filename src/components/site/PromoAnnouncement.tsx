import { useEffect, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT, BLEND_DISCOUNT_MIN_ITEMS } from "@/lib/blendPricing";

const MODAL_SESSION_KEY = "tz_promo_seen";

export function PromoAnnouncement() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(MODAL_SESSION_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(MODAL_SESSION_KEY, "1");
    }, 900);
    return () => clearTimeout(timer);
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
      <div className="w-full border-b border-brand-ink/8 bg-brand-cream text-brand-ink">
        <div className="page-shell flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 py-1.5 text-center text-[10px] font-semibold sm:text-xs">
          <span>{BLEND_DISCOUNT_PCT}% off na caixa com {BLEND_DISCOUNT_MIN_ITEMS} potes</span>
          <span className="text-brand-ink/35">·</span>
          <button onClick={copy} className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 font-semibold underline decoration-brand-ink/25 underline-offset-4 hover:decoration-brand-ink" aria-label={`Copiar código ${BLEND_DISCOUNT_CODE}`}>
            {BLEND_DISCOUNT_CODE}
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="promo-title" className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-brand-ink/45 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-brand-paper shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setOpen(false)} aria-label="Fechar" className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-brand-ink/60 hover:text-brand-ink">
              <X className="h-4 w-4" />
            </button>
            <div className="p-8 text-center sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Boas-vindas da Casa</span>
              <h2 id="promo-title" className="mt-4 font-display text-4xl font-semibold leading-[.95] text-brand-ink sm:text-5xl">
                Monte sua caixa e descubra novos sabores.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Escolha {BLEND_DISCOUNT_MIN_ITEMS} potes e ganhe {BLEND_DISCOUNT_PCT}% de desconto usando o código abaixo no checkout.
              </p>
              <button onClick={copy} className="mt-7 flex min-h-14 w-full items-center justify-between rounded-full border border-brand-ink/12 bg-brand-cream px-6 text-brand-ink">
                <code className="font-sans text-base font-semibold tracking-[0.18em]">{BLEND_DISCOUNT_CODE}</code>
                <span className="inline-flex items-center gap-2 text-xs font-semibold">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copiado" : "Copiar"}</span>
              </button>
              <Link to="/sua-caixa" onClick={() => setOpen(false)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-ink px-6 text-sm font-semibold text-brand-paper transition hover:opacity-90">
                Montar minha caixa
              </Link>
              <button onClick={() => setOpen(false)} className="mt-4 text-xs font-semibold text-muted-foreground hover:text-brand-ink">Continuar navegando</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
