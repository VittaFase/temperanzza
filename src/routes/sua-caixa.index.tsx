import { createFileRoute } from "@tanstack/react-router";
import { Box, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CHEF_BOX, BUILDER_HANDLES } from "@/lib/blends";
import { PotesCarousel } from "@/components/site/PotesCarousel";
import { BlendBuilder } from "@/components/site/BlendBuilder";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT } from "@/lib/blendPricing";

const BOX_URL = "https://temperanzza.com.br/sua-caixa";
const TITLE = "Sua Caixa — Monte sua caixa com 12 potes Temperanzza";
const DESC =
  "Monte sua própria caixa com 12 potes à sua escolha entre os sabores da casa e ganhe 10% de desconto no fechamento da compra com o cupom BLENDS10.";

export const Route = createFileRoute("/sua-caixa/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BOX_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BOX_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Sua Caixa Temperanzza",
          url: BOX_URL,
          description: DESC,
        }),
      },
    ],
  }),
  component: SuaCaixaIndex,
});

function SuaCaixaIndex() {
  return (
    <div className="flex flex-col min-h-screen">
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
            <Box className="w-3.5 h-3.5" /> Sua caixa · 12 potes
          </span>
          <h1 className="mt-6 font-display font-black uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tight max-w-5xl">
            Monte sua <span className="text-accent">caixa</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/75 leading-relaxed">
            {CHEF_BOX.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#montar">
              <Button className="rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                <Sparkles className="w-4 h-4 mr-2" />
                Montar sua caixa
              </Button>
            </a>
          </div>

          <p className="mt-6 text-xs font-display uppercase tracking-[0.25em] text-background/60">
            Complete sua caixa com 12 potes e ganhe {BLEND_DISCOUNT_PCT}% de desconto no fechamento
            da compra com o cupom {BLEND_DISCOUNT_CODE}
          </p>
        </div>
      </section>

      {/* CAIXA AUTORAL */}
      <section className="py-20 sm:py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-14">
          <div
            className="relative bg-foreground overflow-hidden"
            style={{ aspectRatio: "2400 / 1360" }}
          >
            <img
              decoding="async"
              src={CHEF_BOX.image}
              alt="Linha completa de potes Temperanzza e Temperaflix"
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
              <Sparkles className="w-3.5 h-3.5" /> Sua caixa autoral
            </span>
            <h2 className="mt-4 font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9]">
              BLEND&nbsp;
              <br />
              <span className="text-accent">DO CHEFE</span>
            </h2>
            <p className="mt-6 font-serif italic text-2xl text-foreground/80 leading-snug">
              {CHEF_BOX.tagline}.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
              {CHEF_BOX.description} São {BUILDER_HANDLES.length} sabores disponíveis e você pode
              repetir os favoritos quantas vezes quiser.
            </p>
            <p className="mt-4 text-sm text-foreground/70 leading-relaxed max-w-xl">
              Complete sua caixa com 12 potes e ganhe {BLEND_DISCOUNT_PCT}% de desconto no
              fechamento da compra com o cupom {BLEND_DISCOUNT_CODE}.
            </p>
            <div className="mt-8">
              <a href="#montar">
                <Button className="rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Montar sua caixa
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DA LINHA */}
      <PotesCarousel />

      {/* MONTAGEM DA CAIXA: 12 potes, cupom automático */}
      <BlendBuilder />
    </div>
  );
}
