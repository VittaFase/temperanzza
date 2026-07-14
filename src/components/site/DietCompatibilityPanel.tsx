import { Check, AlertTriangle, X } from "lucide-react";
import { DIETS } from "@/lib/diets";
import type { ProductDiet, DietVerdict } from "@/lib/dietCompatibility";

const ICONS: Record<DietVerdict, { Icon: typeof Check; bg: string; fg: string; label: string }> = {
  ok: { Icon: Check, bg: "bg-brand-emerald", fg: "text-white", label: "Compatível" },
  moderate: {
    Icon: AlertTriangle,
    bg: "bg-brand-mustard",
    fg: "text-brand-ink",
    label: "Com moderação",
  },
  no: { Icon: X, bg: "bg-brand-red", fg: "text-white", label: "Não indicado" },
};

export function DietCompatibilityPanel({ diet }: { diet: ProductDiet }) {
  return (
    <section
      aria-labelledby="diet-panel-title"
      className="border border-foreground/15 bg-brand-cream/60 bg-paper-grain"
    >
      <header className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-foreground/15 bg-brand-ink text-brand-paper">
        <span className="divider-stencil w-8" />
        <h2
          id="diet-panel-title"
          className="font-display font-black uppercase tracking-widest text-sm sm:text-base"
        >
          Como este tempero conversa com sua dieta
        </h2>
      </header>
      <ul className="divide-y divide-foreground/10">
        {DIETS.map((d) => {
          const entry = diet.verdicts[d.key];
          const cfg = ICONS[entry.verdict];
          return (
            <li key={d.key} className="flex gap-4 px-5 sm:px-6 py-5">
              <span
                role="img"
                aria-label={`${d.name}: ${cfg.label}`}
                className={`shrink-0 inline-flex h-10 w-10 items-center justify-center ${cfg.bg} ${cfg.fg}`}
              >
                <cfg.Icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display font-black uppercase tracking-wide text-lg leading-none">
                    {d.name}
                  </h3>
                  <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground">
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-2 font-serif italic text-[15px] leading-relaxed text-foreground/85">
                  {entry.note}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <footer className="px-5 sm:px-6 py-3 border-t border-foreground/15 text-[11px] uppercase tracking-[0.2em] font-display text-muted-foreground bg-background">
        Guia informativo — não substitui orientação de nutricionista.
      </footer>
    </section>
  );
}
