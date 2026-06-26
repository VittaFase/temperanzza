import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Box, Sparkles, Tag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { BLENDS } from "@/lib/blends";
import { useShopifyPrices } from "@/hooks/useShopifyPrices";
import {
  computeBlendTotal,
  BLEND_DISCOUNT_CODE,
  BLEND_DISCOUNT_PCT,
} from "@/lib/blendPricing";
import { formatBRL } from "@/lib/shopify";

export const Route = createFileRoute("/blends/")({
  head: () => ({
    meta: [
      { title: "Blends Temperanzza — Caixas display de 12 potes | Temperanzza" },
      {
        name: "description",
        content:
          "Conheça os 6 Blends Temperanzza: Brasil, Churrasco, Essenza, Gourmet, Supremo e Temperaflix. Caixas display com 12 potes selecionados — e a opção Chefe Temperanzza, sua caixa com sua receita.",
      },
      { property: "og:title", content: "Blends Temperanzza — Caixas display de 12 potes" },
      {
        property: "og:description",
        content:
          "Seis blends curados + a caixa Chefe Temperanzza para você montar a sua. 12 potes por caixa, em uma única apresentação.",
      },
    ],
  }),
  component: BlendsIndex,
});

function BlendsIndex() {
  const curated = BLENDS.filter((b) => !b.isBuilder);
  const builder = BLENDS.find((b) => b.isBuilder)!;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, oklch(0.7 0.16 70 / 0.55), transparent 55%), radial-gradient(circle at 85% 75%, oklch(0.52 0.21 28 / 0.55), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-background/70 border-l-2 border-accent pl-3">
            <Box className="w-3.5 h-3.5" /> Caixas display · 12 potes
          </span>
          <h1 className="mt-6 font-display font-black uppercase text-6xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tight max-w-5xl">
            Blends <span className="text-accent">Temperanzza</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/75 leading-relaxed">
            Seis caixas curadas pela casa, cada uma com 12 potes para uma
            ocasião. E uma sétima caixa — em branco — para você assinar.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#curados">
              <Button className="rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                Ver os 6 blends
              </Button>
            </a>
            <Link to="/blends/$slug" params={{ slug: "chefe" }}>
              <Button
                variant="outline"
                className="rounded-none h-12 px-6 border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground font-display uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Montar minha caixa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* GRID DE CURADOS */}
      <section id="curados" className="py-20 sm:py-24 border-b border-foreground/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Seis caixas, seis ocasiões
              </span>
              <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl tracking-tight">
                Blends curados pela casa
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Cada caixa reúne 12 potes selecionados para um tipo de cozinha,
              prato ou momento. Pronta para a estante e para a mesa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curated.map((blend) => (
              <Link
                key={blend.slug}
                to="/blends/$slug"
                params={{ slug: blend.slug }}
                className="group flex flex-col border border-foreground/15 bg-background overflow-hidden hover:border-accent transition-colors"
              >
                <div className="relative aspect-square bg-foreground overflow-hidden">
                  <img
                    src={blend.image}
                    alt={`${blend.name} — caixa display Temperanzza`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-display uppercase tracking-[0.25em] text-background"
                    style={{ backgroundColor: blend.accent }}
                  >
                    {blend.display}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-display font-black uppercase text-2xl leading-[0.95] tracking-tight">
                    {blend.name}
                  </h3>
                  <p className="font-serif italic text-foreground/70 leading-snug">
                    {blend.tagline}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-foreground/10">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      12 potes selecionados
                    </span>
                    <ArrowRight className="w-4 h-4 text-foreground/60 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BUILDER CHEFE */}
      <section className="py-20 sm:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square bg-foreground overflow-hidden">
            <img
              src={builder.image}
              alt="Caixa Chefe Temperanzza — monte seu próprio blend"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
              <Sparkles className="w-3.5 h-3.5" /> Caixa autoral
            </span>
            <h2 className="mt-4 font-display font-black uppercase text-5xl sm:text-6xl tracking-tight leading-[0.9]">
              Chefe <span className="text-accent">Temperanzza</span>
            </h2>
            <p className="mt-6 font-serif italic text-2xl text-foreground/80 leading-snug">
              {builder.tagline}.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
              {builder.description}
            </p>
            <div className="mt-8">
              <Link to="/blends/$slug" params={{ slug: "chefe" }}>
                <Button className="rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Montar minha caixa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
