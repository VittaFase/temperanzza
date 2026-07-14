import { Check, AlertTriangle, X } from "lucide-react";
import type { DietVerdict } from "@/lib/dietCompatibility";
import type { DietKey } from "@/lib/diets";
import { getDiet } from "@/lib/diets";
import { cn } from "@/lib/utils";

const CFG: Record<
  DietVerdict,
  { bg: string; fg: string; Icon: typeof Check; label: string }
> = {
  ok: {
    bg: "bg-brand-emerald",
    fg: "text-white",
    Icon: Check,
    label: "Compatível",
  },
  moderate: {
    bg: "bg-brand-mustard",
    fg: "text-brand-ink",
    Icon: AlertTriangle,
    label: "Com moderação",
  },
  no: {
    bg: "bg-brand-red",
    fg: "text-white",
    Icon: X,
    label: "Não indicado",
  },
};

interface DietBadgeProps {
  diet: DietKey;
  verdict: DietVerdict;
  variant?: "compact" | "chip" | "full";
  className?: string;
}

export function DietBadge({
  diet,
  verdict,
  variant = "chip",
  className,
}: DietBadgeProps) {
  const meta = getDiet(diet);
  const c = CFG[verdict];
  const ariaLabel = `${meta.name}: ${c.label}`;

  if (variant === "compact") {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(
          "inline-flex h-3.5 w-3.5 items-center justify-center",
          c.bg,
          c.fg,
          className,
        )}
      >
        <c.Icon className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
    );
  }

  if (variant === "full") {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 border border-foreground/15 bg-background",
          className,
        )}
      >
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center shrink-0",
            c.bg,
            c.fg,
          )}
        >
          <c.Icon className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span className="font-display font-black uppercase tracking-wider text-xs">
          {meta.name}
        </span>
      </span>
    );
  }

  // chip
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1",
        c.bg,
        c.fg,
        className,
      )}
    >
      <c.Icon className="h-3 w-3" strokeWidth={3} />
      <span className="font-display font-black uppercase tracking-wider text-[10px]">
        {meta.short}
      </span>
    </span>
  );
}

/** Tira de 4 dots (uma dieta por dot) para uso em ProductCard. */
export function DietDotStrip({
  verdicts,
  diets,
  className,
}: {
  verdicts: Record<DietKey, { verdict: DietVerdict }>;
  diets: DietKey[];
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label="Compatibilidade dietética"
    >
      {diets.map((d) => (
        <DietBadge key={d} diet={d} verdict={verdicts[d].verdict} variant="compact" />
      ))}
    </div>
  );
}
