import { X, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT } from "@/lib/blendPricing";

interface Props {
  open: boolean;
  /** Nome do blend / caixa que foi montada. */
  blendName: string;
  /** URL final de checkout (com cupom). null enquanto está sendo preparado. */
  checkoutUrl: string | null;
  loading?: boolean;
  onClose: () => void;
}

/**
 * Modal de felicitações exibido quando o cliente fecha um blend
 * (curado ou builder) e está pronto para o checkout.
 */
export function BlendCelebration({
  open,
  blendName,
  checkoutUrl,
  loading,
  onClose,
}: Props) {
  if (!open) return null;

  function goCheckout() {
    if (!checkoutUrl) return;
    window.open(checkoutUrl, "_blank");
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blend-celebration-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-foreground/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-brand-cream border border-foreground/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-1 text-foreground/60 hover:text-accent"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 sm:p-10 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
            <Sparkles className="w-3 h-3" /> Bem-vindo(a) à Casa
          </span>

          <h2
            id="blend-celebration-title"
            className="mt-5 font-display font-black uppercase text-3xl sm:text-4xl leading-[0.95] tracking-tight"
          >
            Você agora faz parte da{" "}
            <span className="text-accent">Casa Temperanzza</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-foreground/75 leading-relaxed">
            Que escolha de Chefe! Sua caixa{" "}
            <strong className="text-foreground">{blendName}</strong> está pronta
            e o desconto de{" "}
            <strong className="text-accent">{BLEND_DISCOUNT_PCT}%</strong> com o
            código{" "}
            <code className="font-display tracking-[0.2em] text-foreground">
              {BLEND_DISCOUNT_CODE}
            </code>{" "}
            já vai aplicado no checkout.
          </p>

          <p className="mt-4 font-serif italic text-foreground/65">
            Obrigado por temperar a mesa com a gente.
          </p>

          <Button
            onClick={goCheckout}
            disabled={!checkoutUrl || loading}
            className="mt-7 w-full rounded-none h-12 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider disabled:bg-foreground/20 disabled:text-foreground/40"
          >
            {loading || !checkoutUrl ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparando sua caixa…
              </>
            ) : (
              <>
                Ir para o checkout
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
          >
            Continuar navegando
          </button>
        </div>
      </div>
    </div>
  );
}
