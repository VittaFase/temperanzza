import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function CollaborationCTA() {
  return (
    <section className="section-space bg-brand-paper">
      <div className="page-shell">
        <div className="relative overflow-hidden rounded-[2.75rem] bg-brand-cream px-6 py-14 sm:px-10 sm:py-18 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-brand-ink/8" />
          <div className="pointer-events-none absolute -right-5 -top-10 h-48 w-48 rounded-full border border-brand-ink/8" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Convite da Casa
            </span>
            <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[.88] tracking-[-0.045em] text-brand-ink">
              Sua receita também pode morar aqui.
            </h2>
          </div>

          <div className="relative z-10 mt-10 max-w-xl lg:mt-0 lg:pb-2">
            <p className="text-base leading-7 text-brand-ink/68 sm:text-lg sm:leading-8">
              Compartilhe uma receita feita com Temperanzza. Nossa curadoria acompanha o preparo e, quando selecionada, sua criação passa a fazer parte da Cozinha Temperanzza com a sua assinatura.
            </p>
            <Link
              to="/colaborar"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-ink px-7 text-sm font-semibold text-brand-paper transition hover:-translate-y-0.5 hover:bg-brand-ink/88"
            >
              Enviar minha receita
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
