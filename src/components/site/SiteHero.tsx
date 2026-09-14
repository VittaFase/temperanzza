import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getProductImage } from "@/lib/productImages";

/**
 * SiteHero — light, culinary and product-first.
 * Kinder's is used only as UX/motion reference; visual identity remains Temperanzza.
 */
export function SiteHero() {
  const salsaImage = getProductImage("salsa-cebola-e-alho");

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

        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]" aria-label="Salsa, Cebola e Alho Temperanzza">
          <div className="product-stage absolute inset-0 bg-brand-cream" />
          <div className="absolute -right-[8%] top-[8%] h-[48%] w-[48%] rounded-full bg-brand-mustard/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-[8%] -left-[5%] h-[42%] w-[42%] rounded-full bg-brand-emerald/15 blur-3xl" aria-hidden="true" />

          <div className="relative flex h-full min-h-[420px] items-center justify-center px-8 py-10 sm:min-h-[520px] lg:min-h-[620px]">
            <div className="animate-product-enter relative flex h-full w-full max-w-xl items-center justify-center">
              <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Da Casa</span>
                <span className="mt-2 block max-w-[9rem] font-display text-2xl font-semibold leading-none text-brand-ink">Salsa · Cebola · Alho</span>
              </div>

              {salsaImage ? (
                <Link
                  to="/product/$handle"
                  params={{ handle: "salsa-cebola-e-alho" }}
                  className="group relative z-10 flex h-[330px] w-[230px] items-center justify-center sm:h-[430px] sm:w-[290px] lg:h-[500px] lg:w-[330px]"
                  aria-label="Conhecer Salsa, Cebola e Alho Temperanzza"
                >
                  <div className="absolute bottom-[7%] h-[8%] w-[58%] rounded-full bg-brand-ink/12 blur-xl transition duration-500 group-hover:scale-110" aria-hidden="true" />
                  <img
                    src={salsaImage}
                    alt="Pote Salsa, Cebola e Alho Temperanzza"
                    fetchPriority="high"
                    decoding="async"
                    className="relative h-full w-full object-contain drop-shadow-[0_24px_24px_rgba(34,31,27,.18)] transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.015]"
                  />
                </Link>
              ) : (
                <div className="rounded-full border border-brand-ink/12 bg-white/60 px-5 py-3 text-sm text-muted-foreground">
                  Conheça os sabores da Casa Temperanzza
                </div>
              )}

              <div className="absolute bottom-0 right-0 hidden text-right sm:block">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Descubra</span>
                <Link to="/produtos" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:underline">
                  Toda a linha <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
