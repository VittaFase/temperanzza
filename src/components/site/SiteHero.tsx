import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { BrandSeal } from "./BrandSeal";

/**
 * SiteHero — light, culinary and product-first.
 * Kinder's is used only as UX/motion reference; visual identity remains Temperanzza.
 */
export function SiteHero() {
  return (
    <section className="relative overflow-hidden bg-brand-paper">
      <div className="page-shell grid min-h-[78svh] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:text-sm">
            Casa Temperanzza · Minas Gerais
          </span>

          <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.88] text-brand-ink">
            Sabor que transforma a sua cozinha.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Condimentos e blends feitos para trazer mais sabor aos seus momentos à mesa — do cotidiano às receitas que merecem ficar na memória.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/produtos"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-paper transition duration-300 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Conheça os sabores
            </Link>
            <Link
              to="/cozinha"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-brand-ink/15 bg-white px-6 py-3 text-sm font-semibold text-brand-ink transition duration-300 hover:-translate-y-0.5 hover:border-brand-ink/30"
            >
              Explore receitas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]" aria-label="Casa Temperanzza">
          <div className="product-stage absolute inset-0 bg-brand-cream" />
          <div className="absolute -right-[8%] top-[8%] h-[48%] w-[48%] rounded-full bg-brand-mustard/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-[8%] -left-[5%] h-[42%] w-[42%] rounded-full bg-brand-emerald/15 blur-3xl" aria-hidden="true" />

          <div className="relative flex h-full min-h-[420px] items-center justify-center px-8 py-12 sm:min-h-[520px] lg:min-h-[620px]">
            <div className="animate-product-enter flex flex-col items-center text-center">
              <BrandSeal size="xl" eager className="mb-7" />
              <p className="max-w-sm font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
                Casa Temperanzza
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                O palco está preparado para receber os potes oficiais do novo rebrand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
