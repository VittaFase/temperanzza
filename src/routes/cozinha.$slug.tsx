import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { getRecipeBySlug, MOMENTS, RECIPES, getRecipeProtein, type Recipe } from "@/lib/recipes";
import { getProductImage } from "@/lib/productImages";
import { RecipeAddToCart } from "@/components/site/RecipeAddToCart";
import { RecipeShareBar } from "@/components/site/RecipeShareBar";
import { RecipeHeroMedia } from "@/components/site/RecipeHeroMedia";
import { HarmonizeAddButton } from "@/components/site/HarmonizeAddButton";
import { getProductDiet } from "@/lib/dietCompatibility";
import { DietBadge } from "@/components/site/DietBadge";
import {
  X,
  Clock,
  Users,
  Flame,
  Utensils,
  ChefHat,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
// ROTA — head() com SEO editorial completo + Recipe JSON-LD + BreadcrumbList
// ═══════════════════════════════════════════════════════════════════

export const Route = createFileRoute("/cozinha/$slug")({
  head: ({ params }) => {
    const r = RECIPES.find((x) => x.slug === params.slug);
    if (!r) {
      return {
        meta: [
          { title: "Receita não encontrada — Biblioteca Gastronômica Temperanzza" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `https://temperanzza.com.br/cozinha/${r.slug}`;
    const desc = r.subtitle ?? r.intro;
    const potePath = getProductImage(r.featuredHandle);
    const dishImg = r.dish?.src;
    const ogImage = dishImg || potePath;
    const imageAbs = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `https://temperanzza.com.br${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
      : undefined;
    return {
      meta: [
        { title: `${r.title} — Biblioteca Gastronômica Temperanzza` },
        { name: "description", content: desc + " | Explore esta receita exclusiva da Biblioteca Gastronômica Temperanzza, feita com nossos temperos artesanais de Minas Gerais." },
        { property: "og:title", content: r.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(imageAbs
          ? [
              { property: "og:image", content: imageAbs },
              { name: "twitter:image", content: imageAbs },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: r.title,
            description: desc,
            ...(imageAbs ? { image: imageAbs } : {}),
            author: { "@type": "Organization", name: "Temperanzza" },
            recipeCategory:
              r.category === "tradicional" ? "Cozinha Tradicional" : "Cozinha de Performance",
            recipeCuisine: "Brasileira",
            recipeIngredient: r.ingredients,
            recipeInstructions: r.steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              text: s,
            })),
            suitableForDiet: r.compatibleDiets.map((d) => {
              const map: Record<string, string> = {
                keto: "https://schema.org/LowCalorieDiet",
                lowcarb: "https://schema.org/LowCalorieDiet",
                "carnivora-flex": "https://schema.org/LowLactoseDiet",
              };
              return map[d] ?? "https://schema.org/LowCalorieDiet";
            }),
            ...(getRecipeProtein(r) === 'paes' ? { recipeCategory: "Pães e Massas Proteicas" } : {}),
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Biblioteca Gastronômica",
                item: "https://temperanzza.com.br/cozinha",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: r.title,
                item: url,
              },
            ],
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const r = getRecipeBySlug(params.slug);
    
    // Fallback manual para redirects via slug se a rota for acessada diretamente
    const redirects: Record<string, string> = {
      "frango-grelhado-cebola-em-po": "frango-grelhado-ana-maria",
      "sopa-legumes-cebola-em-po": "sopa-legumes-salsa-cebola-alho",
      "figado-acebolado-cebola-po": "figado-acebolado-salsa-cebola-alho",
      "omelete-ervas-finas-tradicional": "omelete-temperaflix-ervas-finas",
      "frango-chimi-churri-tradicional": "frango-chimi-churri-picante",
      "feijao-tropeiro-ana-maria": "feijao-tropeiro-tempero-mineiro",
    };

    if (redirects[params.slug]) {
      const target = `/cozinha/${redirects[params.slug]}`;
      // Em TanStack Start v1, para 301 real em tempo de execução SSR:
      return { redirect: target };
    }

    if (!r) throw notFound();
    return r;
  },
  component: RecipeDrawer,
  notFoundComponent: RecipeNotFoundDrawer,
});

// ═══════════════════════════════════════════════════════════════════
// DRAWER — Overlay full-screen editorial. Fecha para /cozinha preservando estado.
// ═══════════════════════════════════════════════════════════════════

function RecipeDrawer() {
  const recipe = Route.useLoaderData() as Recipe;
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => navigate({ to: "/cozinha", search: { refeicao: "", proteina: "" } });

  // ESC fecha; body scroll lock enquanto drawer está montado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    // Ao trocar de receita (via "Continue a leitura"), rola o painel ao topo
    // para que a nova receita apareça a partir do hero, sem exigir scroll manual.
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.slug]);

  const productImg = getProductImage(recipe.featuredHandle);
  const diet = getProductDiet(recipe.featuredHandle);

  const harmonization = useMemo(() => {
    const handles = recipe.harmonization ?? deriveHarmonization(recipe);
    return handles
      .map((h) => ({ handle: h, img: getProductImage(h), name: humanHandle(h) }))
      .filter((p) => p.img);
  }, [recipe]);

  const related = useMemo(() => {
    if (recipe.relatedSlugs && recipe.relatedSlugs.length > 0) {
      return recipe.relatedSlugs
        .map((slug) => getRecipeBySlug(slug))
        .filter((r): r is Recipe => !!r);
    }
    return RECIPES.filter(
      (r) => r.profile === recipe.profile && r.slug !== recipe.slug,
    ).slice(0, 4);
  }, [recipe]);

  const subtitle = recipe.subtitle ?? recipe.intro;
  const chefWord = recipe.chefWord ?? recipe.whyItWorks;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-drawer-title"
      className="fixed inset-0 z-[100] animate-in fade-in duration-300"
    >
      {/* Backdrop — cor de tinta profunda, opacidade generosa */}
      <div
        aria-hidden
        onClick={close}
        className="absolute inset-0 bg-brand-ink/85 backdrop-blur-md"
      />

      {/* Painel — 96vh, top:2vh, slide up */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 top-[2vh] bg-brand-paper shadow-2xl overflow-y-auto outline-none animate-in slide-in-from-bottom duration-500"
      >
        {/* Barra superior sticky — breadcrumb + close */}
        <header className="sticky top-0 z-10 bg-brand-paper/95 backdrop-blur border-b border-brand-ink/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center gap-2 text-[11px] font-display uppercase tracking-[0.25em] text-brand-ink/60">
                <li className="hidden sm:inline">
                  <Link to="/" className="hover:text-accent">Início</Link>
                </li>
                <li aria-hidden className="hidden sm:inline text-brand-ink/30">/</li>
                <li>
                  <Link to="/cozinha" search={{ refeicao: "", proteina: "" }} className="hover:text-accent">
                    Biblioteca
                  </Link>
                </li>
                <li aria-hidden className="text-brand-ink/30">/</li>
                <li className="text-brand-ink truncate">{recipe.title}</li>
              </ol>
            </nav>
            <button
              onClick={close}
              aria-label="Fechar receita"
              className="shrink-0 inline-flex items-center gap-2 border border-brand-ink/25 hover:border-accent hover:bg-brand-ink hover:text-brand-paper px-3 py-2 text-[11px] font-display uppercase tracking-widest transition"
            >
              <span className="hidden sm:inline">Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* HERO editorial */}
        <section
          className="relative overflow-hidden bg-brand-ink text-brand-paper"
          aria-labelledby="recipe-drawer-title"
        >
          {/* Gradiente invertido: escuro à esquerda (leitura), quente/iluminado à direita (pote) */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 85% 50%, ${recipe.hero.color} 0%, transparent 55%), radial-gradient(ellipse at 78% 50%, oklch(0.72 0.16 75 / 0.35) 0%, transparent 40%), linear-gradient(90deg, oklch(0.10 0.02 30) 0%, oklch(0.14 0.03 40) 50%, oklch(0.18 0.06 45) 100%)`,
            }}
          />
          {/* Spotlight radial suave por trás do pote */}
          <div
            aria-hidden
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[120%] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 60% 50%, oklch(0.78 0.13 65 / 0.28) 0%, transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,240,220,0.35) 0px, transparent 2px)",
              backgroundSize: "220px 220px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 py-14 sm:py-20 grid lg:grid-cols-12 gap-10 items-center overflow-visible">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {/* Chips uniformizados — ambos outline, apenas tags semânticas */}
                <span className="inline-block px-3 py-1 border border-brand-mustard/70 text-brand-mustard font-display font-black uppercase tracking-widest text-[10px]">
                  {MOMENTS[recipe.moment]}
                </span>
                <span className="inline-block px-3 py-1 border border-brand-paper/30 text-brand-paper/80 font-display font-black uppercase tracking-widest text-[10px]">
                  {recipe.category === "tradicional"
                    ? "Mesa de Todos"
                    : "Estilo de Vida"}
                </span>
              </div>
              <h1
                id="recipe-drawer-title"
                className="font-display font-black uppercase leading-[0.9] tracking-tight text-4xl sm:text-6xl lg:text-7xl"
              >
                {recipe.title}
              </h1>
              <p className="mt-6 font-serif italic text-lg sm:text-2xl text-brand-paper/85 leading-snug max-w-xl">
                {subtitle}
              </p>

              {/* Ficha técnica visual — régua horizontal, respiro editorial */}
              <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-brand-paper/20 pt-8 max-w-xl">
                <FichaItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Tempo"
                  value={recipe.time ?? "20 min"}
                />
                <FichaItem
                  icon={<Users className="h-4 w-4" />}
                  label="Rende"
                  value={recipe.serves ?? "2 pessoas"}
                />
                <FichaItem
                  icon={<Flame className="h-4 w-4" />}
                  label="Dificuldade"
                  value={recipe.difficulty ?? "Fácil"}
                />
                <FichaItem
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Perfil"
                  value={perfilLabel(recipe.profile)}
                />
              </dl>

              {/* Compartilhar + imprimir */}
              <RecipeShareBar
                slug={recipe.slug}
                title={recipe.title}
                tagline={subtitle}
              />
            </div>

            {/* Pote real — vídeo em loop quando existir, com fallback para a imagem */}
            {productImg && (
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <RecipeHeroMedia
                  slug={recipe.slug}
                  poster={productImg}
                  dish={recipe.dish}
                  alt={`Pote de ${humanHandle(recipe.featuredHandle)} Temperanzza`}
                />
              </div>
            )}
          </div>
        </section>

        {/* PALAVRA DO CHEF — bloco editorial em itálico */}
        <section className="mx-auto max-w-4xl px-4 sm:px-8 py-14 sm:py-20 text-center border-b border-brand-ink/10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span aria-hidden className="block h-px w-8 bg-accent" />
            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-accent">
              A Palavra do Chef
            </span>
            <span aria-hidden className="block h-px w-8 bg-accent" />
          </div>
          <blockquote className="font-serif italic text-xl sm:text-3xl text-brand-ink/90 leading-relaxed">
            {chefWord}
          </blockquote>
        </section>

        {/* CORPO — ingredientes + modo de preparo */}
        <div className="mx-auto max-w-6xl px-4 sm:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Utensils className="h-4 w-4 text-accent" />
                  <h2 className="font-display font-black uppercase tracking-[0.25em] text-sm">
                    Ingredientes
                  </h2>
                </div>
                <ul className="space-y-4">
                  {recipe.ingredients.map((ing, i) => {
                    const isFeatured = ing.toLowerCase().includes("temperanzza");
                    return (
                      <li
                        key={i}
                        className={`flex gap-3 text-[15px] leading-snug pb-4 border-b border-brand-ink/10 last:border-0 ${
                          isFeatured ? "text-accent font-medium" : ""
                        }`}
                      >
                        <span
                          className={`shrink-0 h-4 w-4 border mt-1 ${
                            isFeatured
                              ? "border-accent bg-accent/10"
                              : "border-brand-ink/40"
                          }`}
                        />
                        <span>{ing}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-8">
                <ChefHat className="h-4 w-4 text-accent" />
                <h2 className="font-display font-black uppercase tracking-[0.25em] text-sm">
                  Modo de Preparo
                </h2>
              </div>
              <ol className="space-y-8">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-6">
                    <span className="shrink-0 font-display font-black text-6xl leading-none text-brand-ink/15 tabular-nums w-16">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg leading-relaxed pt-2 text-brand-ink/90">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Dica */}
              <div className="mt-16 border-l-4 border-brand-mustard bg-brand-cream/50 px-6 py-6">
                <p className="text-[10px] font-display uppercase tracking-[0.3em] text-brand-ink/60 mb-2">
                  {recipe.category === "tradicional"
                    ? "Dica de Variação"
                    : "Dica de Substituição"}
                </p>
                <p className="text-base leading-relaxed text-brand-ink/85">
                  {recipe.substitution}
                </p>
              </div>

              {/* Compatibilidade dietética (só para dieta) */}
              {recipe.category !== "tradicional" &&
                recipe.compatibleDiets.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {recipe.compatibleDiets.map((d) => (
                      <DietBadge key={d} diet={d} verdict="ok" variant="chip" />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* PRODUTO UTILIZADO — assinatura */}
        <section className="bg-brand-ink text-brand-paper py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-mustard">
                Assinatura desta receita
              </span>
              <h2 className="mt-4 font-display font-black uppercase leading-[0.95] tracking-tight text-4xl sm:text-5xl">
                {humanHandle(recipe.featuredHandle)}
              </h2>
              {diet && (
                <p className="mt-4 font-serif italic text-brand-paper/70 text-lg leading-relaxed max-w-md">
                  Perfil sensorial <span className="text-brand-mustard">{perfilLabel(diet.profile)}</span> — desenvolvido pela casa Temperanzza para elevar receitas do dia a dia à altura de uma mesa autoral.
                </p>
              )}

              <RecipeAddToCart
                handle={recipe.featuredHandle}
                label={humanHandle(recipe.featuredHandle)}
              />
            </div>
            {productImg && (
              <div className="flex justify-center md:justify-end">
                <img decoding="async" loading="lazy"
                  src={productImg}
                  alt={humanHandle(recipe.featuredHandle)}
                  className="h-72 sm:h-96 w-auto object-contain drop-shadow-2xl"
                />
              </div>
            )}
          </div>
        </section>

        {/* HARMONIZAÇÃO */}
        {harmonization.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-20 border-b border-brand-ink/10">
            <div className="flex items-center gap-3 mb-10">
              <span aria-hidden className="block h-px w-8 bg-accent" />
              <h2 className="text-[10px] font-display uppercase tracking-[0.4em] text-accent">
                Harmoniza também com
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {harmonization.slice(0, 3).map((p) => (
                <div
                  key={p.handle}
                  className="group flex flex-col items-center text-center border border-brand-ink/15 bg-brand-cream/40 hover:border-accent p-6 transition"
                >
                  <Link
                    to="/product/$handle"
                    params={{ handle: p.handle }}
                    className="flex flex-col items-center"
                  >
                    <img decoding="async" loading="lazy"
                      src={p.img!}
                      alt={p.name}
                      className="h-32 w-auto object-contain mb-4 group-hover:scale-105 transition-transform"
                    />
                    <p className="font-display font-bold uppercase text-sm tracking-tight leading-tight">
                      {p.name}
                    </p>
                  </Link>
                  <HarmonizeAddButton handle={p.handle} name={p.name} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECEITAS RELACIONADAS */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-20">
            <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-display uppercase tracking-[0.4em] text-accent">
                  Do mesmo perfil de sabor
                </span>
                <h2 className="mt-3 font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
                  Continue a leitura
                </h2>
              </div>
              <button
                onClick={() => navigate({ to: "/cozinha", search: { refeicao: "", proteina: "" } })}
                className="inline-flex items-center gap-3 bg-brand-ink text-brand-paper hover:bg-accent px-6 py-3 font-display uppercase tracking-widest text-xs sm:text-sm transition-colors border border-brand-ink hover:border-accent shadow-md"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Voltar às receitas
              </button>
            </div>
            <ul className="divide-y divide-brand-ink/15 border-y border-brand-ink/15">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/cozinha/$slug"
                    params={{ slug: r.slug }}
                    search={{ refeicao: "", proteina: "" }}
                    className="group flex items-baseline gap-6 py-5 hover:bg-brand-ink/[0.03] transition -mx-2 px-2"
                  >
                    <span className="shrink-0 font-display italic text-brand-ink/40 text-sm">
                      {MOMENTS[r.moment]}
                    </span>
                    <span className="flex-1 min-w-0 font-display font-black uppercase tracking-tight text-xl sm:text-2xl leading-tight group-hover:text-accent transition-colors">
                      {r.title}
                    </span>
                    <ArrowRight className="shrink-0 h-4 w-4 text-brand-ink/40 group-hover:text-accent group-hover:translate-x-1 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Rodapé do drawer — CTA de retorno + assinatura da casa */}
        <footer className="border-t border-brand-ink/10 py-12 text-center flex flex-col items-center gap-6">
          <button
            onClick={() => navigate({ to: "/cozinha", search: { refeicao: "", proteina: "" } })}
            className="inline-flex items-center gap-3 bg-brand-ink text-brand-paper hover:bg-accent px-8 py-4 font-display uppercase tracking-widest text-sm transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar à biblioteca
          </button>
          <p className="font-serif italic text-brand-ink/50 text-sm">
            Biblioteca Gastronômica · Casa Temperanzza · Minas Gerais
          </p>
        </footer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════

function FichaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.25em] text-brand-paper/50 mb-1.5">
        {icon}
        {label}
      </dt>
      <dd className="font-display font-black text-lg sm:text-xl leading-none">
        {value}
      </dd>
    </div>
  );
}

function humanHandle(h: string) {
  return h
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function perfilLabel(p: Recipe["profile"]) {
  const map: Record<Recipe["profile"], string> = {
    defumado: "Defumado",
    ervas: "Ervas Frescas",
    casa: "Sabor de Casa",
    puras: "Especiaria Pura",
    "citrico-picante": "Cítrico",
  };
  return map[p] ?? "Autoral";
}

/** Deriva 2-3 handles de harmonização a partir do perfil da receita. */
function deriveHarmonization(recipe: Recipe): string[] {
  const pool = RECIPES.filter(
    (r) => r.profile === recipe.profile && r.featuredHandle !== recipe.featuredHandle,
  ).map((r) => r.featuredHandle);
  return Array.from(new Set(pool)).slice(0, 3);
}

function RecipeNotFoundDrawer() {
  const navigate = useNavigate();
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/85 backdrop-blur"
    >
      <div className="bg-brand-paper max-w-md w-full mx-4 p-10 text-center">
        <h1 className="font-display font-black uppercase text-3xl mb-4">
          Receita não encontrada
        </h1>
        <p className="text-brand-ink/70 mb-8">
          Ela pode ter sido arquivada ou a URL está incorreta.
        </p>
        <button
          onClick={() => navigate({ to: "/cozinha", search: { refeicao: "", proteina: "" } })}
          className="inline-flex items-center gap-2 bg-brand-ink text-brand-paper px-6 py-3 font-display uppercase tracking-widest text-sm hover:bg-accent transition"
        >
          Voltar à biblioteca
        </button>
      </div>
    </div>
  );
}
