import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { type DietKey } from "@/lib/diets";
import {
  RECIPES,
  MOMENTS,
  PROTEINS,
  PROTEIN_ORDER,
  getRecipeProtein,
  type Recipe,
  type Moment,
} from "@/lib/recipes";
import { ChevronDown, ArrowUpRight, X } from "lucide-react";
import { CountUp } from "@/components/site/CountUp";
import { getProductImage } from "@/lib/productImages";
import { getFlavorTone } from "@/lib/flavorPalette";

const COZINHA_URL = "https://temperanzza.com.br/cozinha";

export const Route = createFileRoute("/cozinha")({
  head: () => ({
    meta: [
      { title: "Cozinha Temperanzza — Receitas, Sabores e Temperos de Minas Gerais" },
      {
        name: "description",
        content:
          "Descubra receitas Temperanzza e veja como cada condimento transforma pratos do cotidiano, da cozinha tradicional às opções low carb, cetogênicas e vegetarianas.",
      },
      { property: "og:title", content: "Cozinha Temperanzza — Receitas para colocar mais sabor à mesa" },
      {
        property: "og:description",
        content: "Receitas Temperanzza conectadas aos condimentos usados em cada preparo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: COZINHA_URL },
    ],
    links: [{ rel: "canonical", href: COZINHA_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Cozinha Temperanzza",
          url: COZINHA_URL,
          inLanguage: "pt-BR",
          isPartOf: {
            "@type": "WebSite",
            name: "Temperanzza",
            url: "https://temperanzza.com.br",
          },
          about: "Receitas e formas de usar condimentos Temperanzza na cozinha",
        }),
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    refeicao: typeof search.refeicao === "string" ? search.refeicao : "",
    proteina: typeof search.proteina === "string" ? search.proteina : "",
    lifestyle: typeof search.lifestyle === "string" ? search.lifestyle : "",
    autor: typeof search.autor === "string" ? search.autor : "",
  }),
  component: CozinhaLayout,
});

function CozinhaLayout() {
  return (
    <>
      <BibliotecaHero />
      <BibliotecaIndice />
      <Outlet />
    </>
  );
}

function BibliotecaHero() {
  const lead = RECIPES.find((recipe) => Boolean(recipe.dish)) ?? RECIPES[0];
  const productImage = lead ? getProductImage(lead.featuredHandle) : null;
  const tone = lead ? getFlavorTone(lead.featuredHandle, lead.title) : null;

  return (
    <section aria-labelledby="biblioteca-hero-title" className="overflow-hidden bg-brand-paper">
      <div className="page-shell grid min-h-[78svh] items-center gap-10 py-14 sm:py-20 lg:grid-cols-[.82fr_1.18fr] lg:gap-16 lg:py-24">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Casa Temperanzza · Cozinha
          </span>
          <h1
            id="biblioteca-hero-title"
            className="mt-5 font-display text-[clamp(3.8rem,8vw,7.5rem)] font-semibold leading-[.86] text-brand-ink"
          >
            Cozinhe com mais sabor.
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Receitas para descobrir novas formas de usar seus condimentos Temperanzza — com o produto certo ao lado de cada prato.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#indice"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-paper transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Explorar receitas
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-sm text-muted-foreground">
              <CountUp to={RECIPES.length} from={Math.max(0, RECIPES.length - 3)} duration={1200} /> receitas na cozinha
            </span>
          </div>
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-[2.75rem] bg-brand-cream sm:min-h-[620px]">
          {lead?.dish && (
            <img
              src={lead.dish.src}
              alt={lead.dish.alt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {lead && productImage && tone && (
            <Link
              to="/product/$handle"
              params={{ handle: lead.featuredHandle }}
              className="absolute right-5 top-5 grid h-44 w-36 place-items-center rounded-[2rem] p-4 shadow-xl transition duration-500 hover:-translate-y-1 sm:right-8 sm:top-8 sm:h-52 sm:w-44"
              style={{ backgroundColor: tone.bg }}
              aria-label={`Conhecer o tempero ${lead.featuredHandle.replace(/-/g, " ")}`}
            >
              <img
                src={productImage}
                alt={`Tempero ${lead.featuredHandle.replace(/-/g, " ")}`}
                className="h-full w-full object-contain drop-shadow-[0_16px_16px_rgba(0,0,0,.2)]"
              />
            </Link>
          )}

          {lead && (
            <Link
              to="/cozinha/$slug"
              params={{ slug: lead.slug }}
              search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }}
              className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Receita em destaque
              </span>
              <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold leading-[.95] sm:text-4xl">
                {lead.title}
              </h2>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                Ver receita <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

type CategoriaKey = DietKey | "tradicional";

interface CategoriaDef {
  key: CategoriaKey;
  name: string;
  romano: string;
  descricao: string;
  filter: (r: Recipe) => boolean;
}

const CATEGORIAS: CategoriaDef[] = [
  {
    key: "lowcarb",
    name: "Low Carb",
    romano: "I",
    descricao: "Menos carboidrato, mais textura. A cozinha que sustenta sem pesar.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("lowcarb"),
  },
  {
    key: "keto",
    name: "Cetogênicas",
    romano: "II",
    descricao: "Alta gordura, proteínas moderadas, carboidratos silenciados. Sabor sem concessão.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("keto"),
  },
  {
    key: "carnivora-flex",
    name: "Carnívora Flexível",
    romano: "III",
    descricao: "Proteína animal no centro, temperos vegetais como pontuação.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("carnivora-flex"),
  },
  {
    key: "selva",
    name: "Dieta da Selva",
    romano: "IV",
    descricao: "Carne, ovo e o que a natureza oferece sem industrialização. Tempero que valoriza o ingrediente, não disfarça.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("selva"),
  },
  {
    key: "vegetariana",
    name: "Vegetariana",
    romano: "V",
    descricao: "Sabor e ética no mesmo prato. O protagonismo dos vegetais elevado pela autoria mineira.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("vegetariana"),
  },
  {
    key: "tradicional",
    name: "Cozinha Tradicional",
    romano: "VI",
    descricao: "A mesa de todos os dias, elevada por temperos com autoria mineira.",
    filter: (r) => r.category === "tradicional",
  },
];

const MOMENT_ORDER: Moment[] = ["cafe", "almoco", "jantar", "lanche", "sobremesa"];

function BibliotecaIndice() {
  const [aberta, setAberta] = useState<CategoriaKey | null>(null);
  const { refeicao, proteina, lifestyle, autor } = Route.useSearch();
  const navigate = useNavigate({ from: "/cozinha" });

  const setFilter = (key: "refeicao" | "proteina" | "lifestyle" | "autor", value: string) =>
    navigate({
      search: (prev: { refeicao: string; proteina: string; lifestyle: string; autor: string }) => ({
        ...prev,
        [key]: prev[key] === value ? "" : value,
      }),
      resetScroll: false,
    });

  const clearFilters = () =>
    navigate({ search: { refeicao: "", proteina: "", lifestyle: "", autor: "" }, resetScroll: false });

  const extraFilter = useMemo(() => {
    return (r: Recipe) => {
      if (refeicao && r.moment !== refeicao) return false;
      if (proteina && getRecipeProtein(r) !== proteina) return false;
      return true;
    };
  }, [refeicao, proteina]);

  const total = useMemo(() => RECIPES.filter(extraFilter).length, [extraFilter]);
  const ativo = Boolean(refeicao || proteina || lifestyle || autor);

  return (
    <section id="indice" aria-labelledby="indice-title" className="section-space bg-brand-cream/45">
      <div className="page-shell max-w-6xl">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Encontre sua receita</span>
          <h2 id="indice-title" className="mt-3 font-display text-5xl font-semibold leading-[.92] text-brand-ink sm:text-6xl">
            O que vamos cozinhar hoje?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Filtre pelo momento, pela proteína ou explore os estilos da Casa Temperanzza.
          </p>
        </div>

        <div className="mb-12 grid gap-7 rounded-[2rem] bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Refeição</legend>
            <div className="flex flex-wrap gap-2">
              {MOMENT_ORDER.map((m) => (
                <FilterChip key={m} label={MOMENTS[m]} active={refeicao === m} onClick={() => setFilter("refeicao", m)} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Proteína principal</legend>
            <div className="flex flex-wrap gap-2">
              {PROTEIN_ORDER.map((p) => (
                <FilterChip key={p} label={PROTEINS[p]} active={proteina === p} onClick={() => setFilter("proteina", p)} />
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <span className="text-sm text-muted-foreground tabular-nums">{total} {total === 1 ? "receita" : "receitas"}</span>
            {ativo && (
              <button type="button" onClick={clearFilters} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 px-4 py-2 text-xs font-semibold text-brand-ink transition hover:border-brand-ink/30">
                <X className="h-3.5 w-3.5" /> Limpar filtros
              </button>
            )}
          </div>
        </div>

        <div>
          {CATEGORIAS.map((cat) => (
            <CategoriaAccordion key={cat.key} cat={cat} extraFilter={extraFilter} open={aberta === cat.key} onToggle={() => setAberta(aberta === cat.key ? null : cat.key)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-xs font-semibold transition ${active ? "border-brand-ink bg-brand-ink text-brand-paper" : "border-brand-ink/15 bg-brand-paper text-brand-ink/75 hover:border-brand-ink/30"}`}
    >
      {label}
    </button>
  );
}

function CategoriaAccordion({ cat, extraFilter, open, onToggle }: { cat: CategoriaDef; extraFilter: (r: Recipe) => boolean; open: boolean; onToggle: () => void }) {
  const receitas = useMemo(() => RECIPES.filter((r) => cat.filter(r) && extraFilter(r)), [cat, extraFilter]);

  return (
    <article className="border-t border-brand-ink/12 last:border-b">
      <button onClick={onToggle} aria-expanded={open} className="group -mx-2 flex w-[calc(100%+1rem)] items-center gap-5 rounded-2xl px-2 py-8 text-left transition hover:bg-white/60 sm:gap-8 sm:py-10">
        <span className="w-10 shrink-0 text-sm font-semibold text-brand-ink/35 sm:w-12">{cat.romano}</span>
        <div className="min-w-0 flex-1"><h3 className="font-display text-3xl font-semibold leading-none text-brand-ink sm:text-4xl">{cat.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{cat.descricao}</p></div>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{receitas.length}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-brand-ink/55 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="grid gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {receitas.length > 0 ? receitas.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />) : <p className="col-span-full rounded-[1.5rem] bg-white p-6 text-sm text-muted-foreground">Nenhuma receita encontrada com estes filtros.</p>}
        </div>
      )}
    </article>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const productImg = getProductImage(recipe.featuredHandle);
  const tone = getFlavorTone(recipe.featuredHandle, recipe.title);

  return (
    <Link to="/cozinha/$slug" params={{ slug: recipe.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="group block overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream">
        {recipe.dish ? <img src={recipe.dish.src} alt={recipe.dish.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : <div className="absolute inset-0" style={{ backgroundColor: tone.bg }} />}
        {productImg && <div className="absolute bottom-3 right-3 grid h-24 w-20 place-items-center rounded-[1.25rem] p-2 shadow-lg" style={{ backgroundColor: tone.bg }}><img src={productImg} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" /></div>}
      </div>
      <div className="p-5"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{MOMENTS[recipe.moment]}</span><h4 className="mt-2 font-display text-2xl font-semibold leading-[1.02] text-brand-ink">{recipe.title}</h4><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.subtitle ?? recipe.intro}</p></div>
    </Link>
  );
}
