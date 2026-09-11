import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CHEF_BOX } from "@/lib/blends";
import { BlendBuilder } from "@/components/site/BlendBuilder";
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT } from "@/lib/blendPricing";

const URL = "https://temperanzza.com.br/sua-caixa/chefe";
const TITLE = "Blend do Chefe — Sua caixa autoral com 12 potes | Temperanzza";

export const Route = createFileRoute("/sua-caixa/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug !== "chefe") throw notFound();
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: CHEF_BOX.description },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: CHEF_BOX.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <h1 className="font-display text-5xl uppercase">Página não encontrada</h1>
      <p className="mt-4 text-muted-foreground">
        Agora a casa tem uma única caixa: a sua.
      </p>
      <div className="mt-8">
        <Link to="/sua-caixa">
          <Button className="rounded-none h-11 px-6 bg-accent text-background font-display uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Monte sua caixa
          </Button>
        </Link>
      </div>
    </div>
  ),
  component: ChefBox,
});

function ChefBox() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-foreground text-background overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.7 0.16 70 / 0.45), transparent 55%), radial-gradient(circle at 80% 80%, oklch(0.52 0.21 28 / 0.5), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/sua-caixa"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-background/60 hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sua caixa
          </Link>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-20 lg:pb-24">
          <div className="relative aspect-square bg-black/30 overflow-hidden">
            <img
              decoding="async"
              loading="lazy"
              src={CHEF_BOX.image}
              alt="Blend do Chefe — caixa autoral Temperanzza"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
              <Sparkles className="w-3.5 h-3.5" /> Sua caixa autoral · 12 potes
            </span>
            <h1 className="mt-5 font-display font-black uppercase text-5xl sm:text-7xl leading-[0.9] tracking-tight">
              Blend <span className="text-accent">do Chefe</span>
            </h1>
            <p className="mt-5 font-serif italic text-2xl text-background/80 leading-snug">
              {CHEF_BOX.tagline}.
            </p>
            <p className="mt-5 text-background/70 leading-relaxed max-w-xl">
              {CHEF_BOX.description}
            </p>
            <p className="mt-4 text-sm text-background/65 leading-relaxed max-w-xl">
              Complete sua caixa com 12 potes e ganhe {BLEND_DISCOUNT_PCT}% de
              desconto no fechamento da compra com o cupom {BLEND_DISCOUNT_CODE}.
            </p>
          </div>
        </div>
      </section>

      <BlendBuilder />
    </div>
  );
}
