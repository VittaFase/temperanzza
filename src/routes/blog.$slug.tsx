import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BLOG_CATEGORY_LABEL, BLOG_POSTS, getPost } from "@/lib/blog";
import { getProductImage } from "@/lib/productImages";
import { RECIPES } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BASE = "https://temperanzza.com.br";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Artigo indisponível — Blog Temperanzza" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = `${BASE}/blog/${post.slug}`;
    const title = `${post.question} | Blog Temperanzza`;
    return {
      meta: [
        { title },
        { name: "description", content: post.directAnswer.slice(0, 155) },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.directAnswer.slice(0, 200) },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.directAnswer,
            datePublished: post.publishedAt,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "Temperanzza" },
            publisher: {
              "@type": "Organization",
              name: "Temperanzza",
              url: BASE,
            },
            articleSection: BLOG_CATEGORY_LABEL[post.category],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: post.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: post.directAnswer,
                },
              },
              ...post.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            ],
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
                item: `${BASE}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${BASE}/blog`,
              },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  errorComponent: PostError,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <SiteLayout>
      <section className="py-24 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h1 className="font-display font-black uppercase text-4xl">
            Artigo não encontrado
          </h1>
          <p className="mt-4 text-muted-foreground">
            Esse endereço não corresponde a nenhum artigo do Blog Temperanzza.
          </p>
          <Button asChild className="mt-8 h-11 rounded-none uppercase tracking-[0.2em]">
            <Link to="/blog">Voltar ao blog</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function PostError() {
  return (
    <SiteLayout>
      <section className="py-24 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h1 className="font-display font-black uppercase text-3xl">
            Não foi possível abrir o artigo
          </h1>
          <Button asChild className="mt-8 h-11 rounded-none uppercase tracking-[0.2em]">
            <Link to="/blog">Voltar ao blog</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const potSrc = getProductImage(post.productHandle);
  const recipes = post.relatedRecipes
    .map((slug) => RECIPES.find((r) => r.slug === slug))
    .filter((r): r is (typeof RECIPES)[number] => Boolean(r));
  const related = post.relatedPosts
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof BLOG_POSTS)[number] => Boolean(p));

  return (
    <SiteLayout>
      <nav aria-label="Você está aqui" className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Início
          </Link>
          <span className="mx-2 text-foreground/30">/</span>
          <Link to="/blog" className="hover:text-accent">
            Blog
          </Link>
          <span className="mx-2 text-foreground/30">/</span>
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </div>
      </nav>

      {/* Hero editorial */}
      <section
        className="border-b border-foreground/15"
        style={{
          background: `linear-gradient(150deg, ${post.tone} 0%, oklch(0.2 0.02 60) 78%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid gap-8 md:grid-cols-[1.5fr_1fr] items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-paper/70">
              {BLOG_CATEGORY_LABEL[post.category]} · {post.readTime} min
            </span>
            <h1 className="font-display font-black uppercase text-3xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95] text-brand-paper">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-brand-paper/80 leading-relaxed">
              {post.standfirst}
            </p>
          </div>
          {potSrc ? (
            <div className="flex justify-center md:justify-end">
              <img
                src={potSrc}
                alt={`Pote de ${post.productName} Temperanzza`}
                className="h-52 sm:h-72 w-auto object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.5)]"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          {/* Resposta direta (AEO) */}
          <div className="border-l-4 border-accent bg-foreground/[0.04] p-5 sm:p-6">
            <h2 className="font-display uppercase text-sm tracking-[0.25em] text-accent">
              Resposta direta
            </h2>
            <p className="mt-2 font-display text-lg sm:text-xl uppercase tracking-tight leading-snug">
              {post.question}
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">
              {post.directAnswer}
            </p>
          </div>

          {post.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display font-black uppercase text-xl sm:text-2xl tracking-tight">
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mt-4 text-base leading-relaxed text-foreground/80"
                >
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-5 space-y-2">
                  {section.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm sm:text-base text-foreground/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {/* FAQ */}
          <section className="mt-14 border-t border-foreground/15 pt-10">
            <h2 className="font-display font-black uppercase text-xl sm:text-2xl tracking-tight">
              Perguntas frequentes
            </h2>
            <dl className="mt-6 space-y-6">
              {post.faq.map((f) => (
                <div key={f.question} className="border-b border-foreground/10 pb-6">
                  <dt className="font-display uppercase text-base tracking-wide">
                    {f.question}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-foreground/80">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-12">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none uppercase tracking-[0.2em] text-xs"
            >
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Todos os artigos
              </Link>
            </Button>
          </div>
        </article>

        {/* Aside */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-foreground/15">
            <div
              className="flex items-center justify-center p-6"
              style={{
                background: `linear-gradient(160deg, ${post.tone} 0%, oklch(0.22 0.02 60) 100%)`,
              }}
            >
              {potSrc ? (
                <img
                  src={potSrc}
                  alt={`Pote de ${post.productName}`}
                  loading="lazy"
                  className="h-40 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
                />
              ) : null}
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                O pote deste artigo
              </span>
              <p className="font-display font-black uppercase text-xl mt-2 leading-tight">
                {post.productName}
              </p>
              <Button
                asChild
                className="mt-4 w-full h-11 rounded-none uppercase tracking-[0.2em] text-xs"
              >
                <Link to="/product/$handle" params={{ handle: post.productHandle }}>
                  Ver ficha do produto
                </Link>
              </Button>
            </div>
          </div>

          {recipes.length ? (
            <div className="border border-foreground/15 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Na Cozinha
              </span>
              <ul className="mt-3 space-y-1">
                {recipes.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/cozinha/$slug"
                      params={{ slug: r.slug }}
                      className="flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-accent"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {related.length ? (
            <div className="border border-foreground/15 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Saiba mais
              </span>
              <ul className="mt-3 space-y-1">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-accent"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </SiteLayout>
  );
}
