import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Sparkles, Tag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { BLEND_BY_SLUG, BLENDS, type BlendSlug } from "@/lib/blends";
import { getProductImage } from "@/lib/productImages";
import { BlendBuilder } from "@/components/site/BlendBuilder";
import { useShopifyPrices } from "@/hooks/useShopifyPrices";
import {
  computeBlendTotal,
  BLEND_DISCOUNT_CODE,
  BLEND_DISCOUNT_PCT,
} from "@/lib/blendPricing";
import { formatBRL } from "@/lib/shopify";

export const Route = createFileRoute("/blends/$slug")({
  beforeLoad: ({ params }) => {
    if (!(params.slug in BLEND_BY_SLUG)) throw notFound();
  },
  head: ({ params }) => {
    const blend = BLEND_BY_SLUG[params.slug as BlendSlug];
    if (!blend) return { meta: [{ title: "Blend não encontrado" }] };
    return {
      meta: [
        { title: `${blend.name} — Blends Temperanzza` },
        { name: "description", content: blend.description },
        { property: "og:title", content: blend.name },
        { property: "og:description", content: blend.description },
        { property: "og:image", content: blend.image },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-5xl uppercase">Blend não encontrado</h1>
        <p className="mt-4 text-muted-foreground">
          Talvez tenha sido renomeado. Volte para a vitrine de Blends.
        </p>
        <div className="mt-8">
          <Link to="/blends">
            <Button className="rounded-none h-11 px-6 bg-accent text-background font-display uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todos os blends
            </Button>
          </Link>
        </div>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl uppercase">
          Algo travou ao carregar este blend
        </h1>
      </div>
    </SiteLayout>
  ),
  component: BlendDetail,
});

function BlendDetail() {
  const { slug } = Route.useParams();
  const blend = BLEND_BY_SLUG[slug as BlendSlug];
  if (!blend) return null;

  if (blend.isBuilder) {
    return <BuilderView />;
  }
  return <CuratedView />;
}

/* -------------------- CURATED -------------------- */

function CuratedView() {
  const { slug } = Route.useParams();
  const blend = BLEND_BY_SLUG[slug as BlendSlug];

  const subject = encodeURIComponent(
    `Reserva — ${blend.name} (Caixa display 12 potes)`,
  );
  const body = encodeURIComponent(
    `Olá Temperanzza,\n\nGostaria de reservar a caixa "${blend.name}".\n\nMeu nome: \nCidade/UF: \nQuantas caixas: \n\nObrigado!`,
  );
  const mailto = `mailto:contatotemperanzza@gmail.com?subject=${subject}&body=${body}`;

  const others = BLENDS.filter((b) => b.slug !== blend.slug && !b.isBuilder).slice(0, 3);

  return (
    <SiteLayout>
      <section className="relative bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/blends"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-background/60 hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Todos os blends
          </Link>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-20 lg:pb-28">
          <div className="relative aspect-square bg-black/30 overflow-hidden">
            <img
              src={blend.image}
              alt={blend.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <span
              className="inline-block px-3 py-1 text-[10px] font-display uppercase tracking-[0.3em] text-background"
              style={{ backgroundColor: blend.accent }}
            >
              {blend.display}
            </span>
            <h1 className="mt-5 font-display font-black uppercase text-6xl sm:text-7xl leading-[0.9] tracking-tight">
              {blend.name}
            </h1>
            <p className="mt-5 font-serif italic text-2xl text-background/80 leading-snug">
              {blend.tagline}.
            </p>
            <p className="mt-5 text-background/70 leading-relaxed max-w-xl">
              {blend.description}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-background/60">
              Combina com: <span className="text-background/85">{blend.pairing}</span>
            </p>
            <div className="mt-8 border border-background/20 bg-background/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-background/60">
                Investimento
              </p>
              <p className="mt-1 font-display text-3xl text-accent">A definir</p>
              <p className="mt-2 text-sm text-background/65">
                Reserve por e-mail enquanto a tabela final é fechada. Sem
                compromisso de compra.
              </p>
              <a href={mailto}>
                <Button className="mt-5 rounded-none h-12 px-6 bg-accent hover:bg-accent/90 text-background font-display uppercase tracking-wider">
                  <Mail className="w-4 h-4 mr-2" />
                  Reservar esta caixa
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COMPOSIÇÃO */}
      <section className="py-20 sm:py-24 border-b border-foreground/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Os 12 potes desta caixa
          </span>
          <h2 className="mt-3 font-display font-black uppercase text-4xl sm:text-5xl tracking-tight">
            O que vai dentro
          </h2>
          <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {blend.spiceHandles.map((handle, i) => {
              const img = getProductImage(handle);
              return (
                <Link
                  key={`${handle}-${i}`}
                  to="/product/$handle"
                  params={{ handle }}
                  className="group flex flex-col items-center gap-2 p-3 border border-foreground/10 bg-brand-cream hover:border-accent transition-colors"
                >
                  <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={handle}
                        className="max-h-full max-w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)] group-hover:-translate-y-1 transition-transform"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-foreground/5" />
                    )}
                  </div>
                  <p className="text-[10px] font-display uppercase tracking-[0.15em] text-center leading-tight text-foreground/80">
                    {handle.replace(/-/g, " ")}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* OUTROS BLENDS */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
            Outras caixas
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map((b) => (
              <Link
                key={b.slug}
                to="/blends/$slug"
                params={{ slug: b.slug }}
                className="group flex flex-col border border-foreground/15 bg-background overflow-hidden hover:border-accent transition-colors"
              >
                <div className="relative aspect-square bg-foreground overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-black uppercase text-xl leading-tight">
                    {b.name}
                  </h3>
                  <p className="mt-1 font-serif italic text-foreground/70 text-sm">
                    {b.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/* -------------------- BUILDER -------------------- */

function BuilderView() {
  const blend = BLEND_BY_SLUG.chefe;

  return (
    <SiteLayout>
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
            to="/blends"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-background/60 hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Todos os blends
          </Link>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-20 lg:pb-24">
          <div className="relative aspect-square bg-black/30 overflow-hidden">
            <img
              src={blend.image}
              alt="Caixa Chefe Temperanzza"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.35em] text-accent border-l-2 border-accent pl-3">
              <Sparkles className="w-3.5 h-3.5" /> Caixa autoral · 12 potes
            </span>
            <h1 className="mt-5 font-display font-black uppercase text-6xl sm:text-7xl leading-[0.9] tracking-tight">
              Chefe <span className="text-accent">Temperanzza</span>
            </h1>
            <p className="mt-5 font-serif italic text-2xl text-background/80 leading-snug">
              {blend.tagline}.
            </p>
            <p className="mt-5 text-background/70 leading-relaxed max-w-xl">
              {blend.description}
            </p>
          </div>
        </div>
      </section>

      <BlendBuilder />
    </SiteLayout>
  );
}
