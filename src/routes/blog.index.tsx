import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  BLOG_POSTS,
  BLOG_CATEGORY_LABEL,
  type BlogCategory,
} from "@/lib/blog";
import { getProductImage } from "@/lib/productImages";
import { useState } from "react";

const BLOG_URL = "https://temperanzza.com.br/blog";
const TITLE = "Blog Temperanzza — O Conhecimento por Trás de Cada Tempero e Especiaria";
const DESCRIPTION =
  "Técnica, ingrediente e dieta explicados por quem faz tempero artesanal em Minas Gerais. Respostas diretas para as dúvidas reais de quem cozinha.";

const FILTERS: Array<{ key: "todos" | BlogCategory; label: string }> = [
  { key: "todos", label: "Tudo" },
  { key: "tecnica", label: BLOG_CATEGORY_LABEL.tecnica },
  { key: "ingrediente", label: BLOG_CATEGORY_LABEL.ingrediente },
  { key: "dieta", label: BLOG_CATEGORY_LABEL.dieta },
  { key: "casa", label: BLOG_CATEGORY_LABEL.casa },
];

const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: BLOG_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BLOG_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog Temperanzza",
          url: BLOG_URL,
          description: DESCRIPTION,
          publisher: {
            "@type": "Organization",
            name: "Temperanzza",
            url: "https://temperanzza.com.br",
          },
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${BLOG_URL}/${p.slug}`,
            datePublished: p.publishedAt,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: "https://temperanzza.com.br/",
            },
            { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
          ],
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [filter, setFilter] = useState<"todos" | BlogCategory>("todos");
  const posts =
    filter === "todos"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === filter);

  const [lead, ...rest] = posts;

  return (
    <SiteLayout>
      <nav aria-label="Você está aqui" className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Início
          </Link>
          <span className="mx-2 text-foreground/30">/</span>
          <span className="text-foreground">Blog</span>
        </div>
      </nav>

      <section className="border-b border-foreground/15 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Blog Temperanzza
          </span>
          <h1 className="font-display font-black uppercase text-4xl sm:text-6xl lg:text-7xl mt-3 tracking-tight leading-[0.92]">
            O conhecimento
            <br />
            por trás de
            <br />
            <span className="text-accent">cada tempero.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Sem rodeio e sem receita de revista. Cada artigo nasce de uma
            pergunta real de quem cozinha, responde direto na primeira linha e
            aprofunda depois — com o pote da casa que resolve o assunto ao lado.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap gap-2 mb-10"
            role="group"
            aria-label="Filtrar artigos por assunto"
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={`min-h-11 rounded-none border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-foreground/20 text-foreground/70 hover:border-accent hover:text-accent"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {lead ? (
            <Link
              to="/blog/$slug"
              params={{ slug: lead.slug }}
              className="group block border border-foreground/15 mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="grid md:grid-cols-[1.4fr_1fr]">
                <div className="p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                      Em foco · {BLOG_CATEGORY_LABEL[lead.category]}
                    </span>
                    <h2 className="font-display font-black uppercase text-2xl sm:text-4xl mt-3 leading-tight group-hover:text-accent transition-colors">
                      {lead.title}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                      {lead.directAnswer}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 group-hover:text-accent">
                    Ler artigo · {lead.readTime} min
                  </span>
                </div>
                <div
                  className="relative flex items-center justify-center min-h-[220px] p-8"
                  style={{
                    background: `linear-gradient(160deg, ${lead.tone} 0%, oklch(0.22 0.02 60) 100%)`,
                  }}
                >
                  <PotImage
                    handle={lead.productHandle}
                    name={lead.productName}
                    className="h-40 sm:h-56"
                  />
                </div>
              </div>
            </Link>
          ) : null}

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex h-full flex-col border border-foreground/15 hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div
                    className="relative flex items-center justify-center h-44 p-6"
                    style={{
                      background: `linear-gradient(160deg, ${post.tone} 0%, oklch(0.22 0.02 60) 100%)`,
                    }}
                  >
                    <span className="absolute left-4 top-3 font-display text-2xl text-brand-paper/40">
                      {ROMAN[i + 1] ?? i + 2}
                    </span>
                    <PotImage
                      handle={post.productHandle}
                      name={post.productName}
                      className="h-32"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      {BLOG_CATEGORY_LABEL[post.category]}
                    </span>
                    <h3 className="font-display font-black uppercase text-lg mt-2 leading-tight group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.question}
                    </p>
                    <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                      {post.readTime} min de leitura
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}

function PotImage({
  handle,
  name,
  className,
}: {
  handle: string;
  name: string;
  className?: string;
}) {
  const src = getProductImage(handle);
  if (!src) return null;
  return (
    <img decoding="async"
      src={src}
      alt={`Pote de ${name} Temperanzza`}
      loading="lazy"
      className={`w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105 ${className ?? ""}`}
    />
  );
}
