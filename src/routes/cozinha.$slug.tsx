import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getRecipeBySlug, MOMENTS, RECIPES, type Recipe } from "@/lib/recipes";
import { getProductImage } from "@/lib/productImages";
import { getFlavorTone } from "@/lib/flavorPalette";
import { RecipeAddToCart } from "@/components/site/RecipeAddToCart";
import { RecipeShareBar } from "@/components/site/RecipeShareBar";
import { HarmonizeAddButton } from "@/components/site/HarmonizeAddButton";
import { DietBadge } from "@/components/site/DietBadge";
import { X, Clock, Users, Flame, Utensils, ChefHat, ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/cozinha/$slug")({
  head: ({ params }) => {
    const r = RECIPES.find((x) => x.slug === params.slug);
    if (!r) return { meta: [{ title: "Receita não encontrada — Cozinha Temperanzza" }, { name: "robots", content: "noindex" }] };

    const url = `https://temperanzza.com.br/cozinha/${r.slug}`;
    const desc = r.subtitle ?? r.intro;
    const imagePath = r.dish?.src ?? getProductImage(r.featuredHandle);
    const imageAbs = imagePath
      ? imagePath.startsWith("http") ? imagePath : `https://temperanzza.com.br${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
      : undefined;

    return {
      meta: [
        { title: `${r.title} — Cozinha Temperanzza` },
        { name: "description", content: `${desc} | Veja ingredientes, preparo e o condimento Temperanzza usado nesta receita.` },
        { property: "og:title", content: r.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(imageAbs ? [{ property: "og:image", content: imageAbs }, { name: "twitter:image", content: imageAbs }, { name: "twitter:card", content: "summary_large_image" }] : []),
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
            recipeCategory: r.category === "tradicional" ? "Cozinha Tradicional" : "Cozinha de Estilo de Vida",
            recipeCuisine: "Brasileira",
            recipeIngredient: r.ingredients,
            recipeInstructions: r.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, text: step })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://temperanzza.com.br/" },
              { "@type": "ListItem", position: 2, name: "Cozinha", item: "https://temperanzza.com.br/cozinha" },
              { "@type": "ListItem", position: 3, name: r.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const redirects: Record<string, string> = {
      "frango-grelhado-cebola-em-po": "frango-grelhado-ana-maria",
      "sopa-legumes-cebola-em-po": "sopa-legumes-salsa-cebola-alho",
      "figado-acebolado-cebola-po": "figado-acebolado-salsa-cebola-alho",
      "omelete-ervas-finas-tradicional": "omelete-temperaflix-ervas-finas",
      "frango-chimi-churri-tradicional": "frango-chimi-churri-picante",
      "feijao-tropeiro-ana-maria": "feijao-tropeiro-tempero-mineiro",
    };
    if (redirects[params.slug]) throw new Response(null, { status: 301, headers: { Location: `/cozinha/${redirects[params.slug]}` } });
    const recipe = getRecipeBySlug(params.slug);
    if (!recipe) throw notFound();
    return recipe;
  },
  component: RecipeDrawer,
  notFoundComponent: RecipeNotFoundDrawer,
});

function RecipeDrawer() {
  const recipe = Route.useLoaderData() as Recipe;
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(
    () => navigate({ to: "/cozinha", search: { refeicao: "", proteina: "", lifestyle: "", autor: "" } }),
    [navigate],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [close, recipe.slug]);

  const productImg = getProductImage(recipe.featuredHandle);
  const tone = getFlavorTone(recipe.featuredHandle, recipe.title);
  const subtitle = recipe.subtitle ?? recipe.intro;
  const chefWord = recipe.chefWord ?? recipe.whyItWorks;
  const harmonization = useMemo(() => {
    const handles = recipe.harmonization ?? deriveHarmonization(recipe);
    return handles.map((handle) => ({ handle, img: getProductImage(handle), name: humanHandle(handle) })).filter((item) => item.img);
  }, [recipe]);
  const related = useMemo(() => {
    if (recipe.relatedSlugs?.length) return recipe.relatedSlugs.map(getRecipeBySlug).filter((item): item is Recipe => Boolean(item));
    return RECIPES.filter((item) => item.profile === recipe.profile && item.slug !== recipe.slug).slice(0, 4);
  }, [recipe]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="recipe-title" className="fixed inset-0 z-[100] animate-in fade-in duration-300">
      <button aria-label="Fechar receita" onClick={close} className="absolute inset-0 h-full w-full cursor-default bg-brand-ink/35 backdrop-blur-sm" />

      <div ref={panelRef} tabIndex={-1} className="absolute inset-x-0 bottom-0 top-[2vh] overflow-y-auto rounded-t-[2rem] bg-brand-paper shadow-2xl outline-none sm:top-[3vh] sm:rounded-t-[2.75rem]">
        <header className="sticky top-0 z-30 border-b border-brand-ink/8 bg-brand-paper/92 backdrop-blur-xl">
          <div className="page-shell flex min-h-16 items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="min-w-0 text-xs text-muted-foreground">
              <Link to="/cozinha" search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="font-semibold hover:text-brand-ink">Cozinha</Link>
              <span className="mx-2">/</span><span className="truncate text-brand-ink">{recipe.title}</span>
            </nav>
            <button onClick={close} aria-label="Fechar receita" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-ink/12 bg-white text-brand-ink transition hover:border-brand-ink/30">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main>
          <section className="page-shell grid gap-8 py-8 sm:py-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-12 lg:py-16">
            <div className="relative min-h-[430px] overflow-hidden rounded-[2.25rem] bg-brand-cream sm:min-h-[610px]">
              {recipe.dish ? (
                <img src={recipe.dish.src} alt={recipe.dish.alt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: tone.bg }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-brand-ink backdrop-blur sm:bottom-8 sm:left-8">
                {MOMENTS[recipe.moment]}
              </div>
            </div>

            <div className="flex flex-col justify-center lg:py-6">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Receita Temperanzza</span>
              <h1 id="recipe-title" className="mt-4 font-display text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[.9] text-brand-ink">{recipe.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>

              <dl className="mt-8 grid grid-cols-3 gap-3">
                <FichaItem icon={<Clock className="h-4 w-4" />} label="Tempo" value={recipe.time ?? "20 min"} />
                <FichaItem icon={<Users className="h-4 w-4" />} label="Rende" value={recipe.serves ?? "2 pessoas"} />
                <FichaItem icon={<Flame className="h-4 w-4" />} label="Nível" value={recipe.difficulty ?? "Fácil"} />
              </dl>

              {productImg && (
                <Link to="/product/$handle" params={{ handle: recipe.featuredHandle }} className="group mt-8 grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-[1.75rem] p-3 pr-5 transition hover:-translate-y-0.5" style={{ backgroundColor: tone.bg }}>
                  <img src={productImg} alt={humanHandle(recipe.featuredHandle)} className="h-24 w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,.16)] transition group-hover:-translate-y-1" />
                  <div><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink/55">O tempero desta receita</span><strong className="mt-1 block font-display text-xl leading-none text-brand-ink">{humanHandle(recipe.featuredHandle)}</strong></div>
                  <ArrowUpRight className="h-4 w-4 text-brand-ink/50" />
                </Link>
              )}
              <RecipeShareBar slug={recipe.slug} title={recipe.title} tagline={subtitle} />
            </div>
          </section>

          {chefWord && (
            <section className="page-shell py-10 sm:py-14">
              <div className="mx-auto max-w-3xl text-center"><span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Da nossa cozinha</span><blockquote className="mt-4 font-display text-2xl leading-snug text-brand-ink sm:text-4xl">{chefWord}</blockquote></div>
            </section>
          )}

          <section className="section-space bg-brand-cream/45">
            <div className="page-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <aside>
                <div className="lg:sticky lg:top-24">
                  <div className="mb-6 flex items-center gap-2"><Utensils className="h-4 w-4" /><h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Ingredientes</h2></div>
                  <ul className="overflow-hidden rounded-[1.75rem] bg-white px-6 py-2 sm:px-7">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="border-b border-brand-ink/8 py-4 text-sm leading-6 text-brand-ink/80 last:border-0">{ingredient}</li>
                    ))}
                  </ul>
                </div>
              </aside>

              <div>
                <div className="mb-7 flex items-center gap-2"><ChefHat className="h-4 w-4" /><h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Modo de preparo</h2></div>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="grid grid-cols-[52px_1fr] gap-4 rounded-[1.75rem] bg-white p-5 sm:grid-cols-[68px_1fr] sm:p-7">
                      <span className="font-display text-3xl text-brand-ink/25 sm:text-4xl">{String(index + 1).padStart(2, "0")}</span>
                      <p className="pt-1 text-base leading-7 text-brand-ink/85 sm:text-lg">{step}</p>
                    </li>
                  ))}
                </ol>
                {recipe.substitution && <div className="mt-6 rounded-[1.5rem] border border-brand-ink/10 bg-brand-paper p-6"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Dica</span><p className="mt-2 leading-7 text-brand-ink/80">{recipe.substitution}</p></div>}
                {recipe.category !== "tradicional" && recipe.compatibleDiets.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{recipe.compatibleDiets.map((diet) => <DietBadge key={diet} diet={diet} verdict="ok" variant="chip" />)}</div>}
              </div>
            </div>
          </section>

          <section className="section-space bg-brand-paper">
            <div className="page-shell grid items-center gap-10 rounded-[2.75rem] p-8 sm:p-12 md:grid-cols-[1fr_.8fr]" style={{ backgroundColor: tone.bg }}>
              <div><span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ink/55">Usado nesta receita</span><h2 className="mt-3 font-display text-4xl font-semibold leading-none text-brand-ink sm:text-5xl">{humanHandle(recipe.featuredHandle)}</h2><p className="mt-4 max-w-lg leading-7 text-brand-ink/65">Leve para sua cozinha o condimento que dá assinatura a este preparo.</p><RecipeAddToCart handle={recipe.featuredHandle} label={humanHandle(recipe.featuredHandle)} /></div>
              {productImg && <Link to="/product/$handle" params={{ handle: recipe.featuredHandle }} className="flex justify-center"><img src={productImg} alt={humanHandle(recipe.featuredHandle)} loading="lazy" decoding="async" className="h-72 w-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,.18)] transition duration-500 hover:-translate-y-2 sm:h-96" /></Link>}
            </div>
          </section>

          {harmonization.length > 0 && (
            <section className="page-shell pb-16 sm:pb-24"><div className="mb-7"><span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Explore também</span><h2 className="mt-2 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">Outros sabores que combinam</h2></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{harmonization.map((item) => <article key={item.handle} className="rounded-[1.5rem] border border-brand-ink/8 bg-white p-4"><Link to="/product/$handle" params={{ handle: item.handle }} className="block"><div className="grid h-40 place-items-center rounded-[1.1rem] bg-brand-cream/55 p-3"><img src={item.img!} alt={item.name} loading="lazy" decoding="async" className="h-full w-full object-contain" /></div><h3 className="mt-3 font-display text-lg leading-tight text-brand-ink">{item.name}</h3></Link><HarmonizeAddButton handle={item.handle} label={item.name} /></article>)}</div></section>
          )}

          {related.length > 0 && (
            <section className="section-space bg-brand-cream/45"><div className="page-shell"><div className="mb-8 flex items-end justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Continue cozinhando</span><h2 className="mt-2 font-display text-4xl font-semibold text-brand-ink">Receitas relacionadas</h2></div><Link to="/cozinha" search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="hidden items-center gap-2 text-sm font-semibold sm:flex">Ver todas <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <RelatedCard key={item.slug} recipe={item} />)}</div></div></section>
          )}
        </main>
      </div>
    </div>
  );
}

function FichaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-[1.25rem] bg-brand-cream/60 p-4"><dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{icon}{label}</dt><dd className="mt-2 text-sm font-semibold text-brand-ink sm:text-base">{value}</dd></div>;
}

function RelatedCard({ recipe }: { recipe: Recipe }) {
  const img = recipe.dish?.src ?? getProductImage(recipe.featuredHandle);
  return <Link to="/cozinha/$slug" params={{ slug: recipe.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="group block"><div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-white">{img ? <img src={img} alt={recipe.dish?.alt ?? recipe.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : null}</div><h3 className="mt-3 font-display text-xl leading-tight text-brand-ink">{recipe.title}</h3><p className="mt-1 text-xs text-muted-foreground">{MOMENTS[recipe.moment]}</p></Link>;
}

function RecipeNotFoundDrawer() {
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-brand-paper/95 p-6"><div className="max-w-lg text-center"><span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Cozinha Temperanzza</span><h1 className="mt-4 font-display text-5xl font-semibold text-brand-ink">Essa receita não está mais à mesa.</h1><p className="mt-5 leading-7 text-muted-foreground">Explore a cozinha para encontrar outro preparo e o condimento certo para ele.</p><Link to="/cozinha" search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand-ink px-6 text-sm font-semibold text-brand-paper">Voltar para a cozinha</Link></div></div>;
}

function deriveHarmonization(recipe: Recipe): string[] {
  const handles = new Set<string>();
  for (const other of RECIPES) {
    if (other.slug === recipe.slug) continue;
    if (other.profile === recipe.profile || other.moment === recipe.moment) handles.add(other.featuredHandle);
    if (handles.size >= 4) break;
  }
  return [...handles];
}

function humanHandle(handle: string) {
  return handle.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
