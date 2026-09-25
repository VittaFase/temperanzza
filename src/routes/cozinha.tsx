import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { type DietKey } from "@/lib/diets";
import { RECIPES, MOMENTS, PROTEINS, PROTEIN_ORDER, getRecipeProtein, type Recipe, type Moment } from "@/lib/recipes";
import { ChevronDown, ArrowUpRight, X } from "lucide-react";
import { CountUp } from "@/components/site/CountUp";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

const COZINHA_URL = "https://temperanzza.com.br/cozinha";
const REBRAND_RECIPES = RECIPES.filter((recipe) => isRebrandEligibleHandle(recipe.featuredHandle));

export const Route = createFileRoute("/cozinha")({
  head: () => ({
    meta: [
      { title: "Cozinha Temperanzza — Receitas, Sabores e Temperos de Minas Gerais" },
      { name: "description", content: "Descubra receitas Temperanzza e veja como cada condimento transforma pratos do cotidiano, da cozinha tradicional às opções low carb, cetogênicas e vegetarianas." },
      { property: "og:title", content: "Cozinha Temperanzza — Receitas para colocar mais sabor à mesa" },
      { property: "og:description", content: "Receitas Temperanzza conectadas aos condimentos usados em cada preparo." },
      { property: "og:type", content: "website" }, { property: "og:url", content: COZINHA_URL },
    ],
    links: [{ rel: "canonical", href: COZINHA_URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Cozinha Temperanzza", url: COZINHA_URL, inLanguage: "pt-BR", isPartOf: { "@type": "WebSite", name: "Temperanzza", url: "https://temperanzza.com.br" }, about: "Receitas e formas de usar condimentos Temperanzza na cozinha" }) }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({ refeicao: typeof search.refeicao === "string" ? search.refeicao : "", proteina: typeof search.proteina === "string" ? search.proteina : "", lifestyle: typeof search.lifestyle === "string" ? search.lifestyle : "", autor: typeof search.autor === "string" ? search.autor : "" }),
  component: CozinhaLayout,
});

function CozinhaLayout() { return <main className="min-w-0 bg-brand-paper text-brand-ink"><BibliotecaHero /><BibliotecaIndice /><Outlet /></main>; }

function BibliotecaHero() {
  const lead = REBRAND_RECIPES.find((recipe) => Boolean(recipe.dish)) ?? REBRAND_RECIPES[0];
  return <section aria-labelledby="biblioteca-hero-title" className="relative min-h-[76svh] overflow-hidden bg-brand-ink text-white sm:min-h-[82svh]">
    {lead?.dish && <img src={lead.dish.src} alt={lead.dish.alt} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
    <div className="absolute inset-0 bg-black/30" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
    <div className="page-shell relative z-10 flex min-h-[76svh] items-end pb-14 pt-24 sm:min-h-[82svh] sm:pb-20">
      <div className="max-w-4xl"><span className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">Casa Temperanzza · Cozinha</span><h1 id="biblioteca-hero-title" className="mt-4 font-display text-[clamp(3.8rem,8vw,7.6rem)] font-semibold leading-[.86]">Cozinhe com mais sabor.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Receitas reais, produto integrado à cena e inspiração para descobrir novas formas de usar os sabores da Casa.</p><div className="mt-8 flex flex-wrap items-center gap-5"><a href="#indice" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5">Explorar receitas <ChevronDown className="h-4 w-4" /></a><span className="text-sm text-white/70"><CountUp to={REBRAND_RECIPES.length} from={Math.max(0, REBRAND_RECIPES.length - 3)} duration={1200} /> receitas na cozinha</span></div>{lead && <Link to="/cozinha/$slug" params={{ slug: lead.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="mt-10 inline-flex items-center gap-2 border-b border-white/45 pb-1 text-sm font-semibold">Receita em destaque: {lead.title} <ArrowUpRight className="h-4 w-4" /></Link>}</div>
    </div>
  </section>;
}

type CategoriaKey = DietKey | "tradicional";
interface CategoriaDef { key: CategoriaKey; name: string; romano: string; descricao: string; filter: (r: Recipe) => boolean; }
const CATEGORIAS: CategoriaDef[] = [
  { key: "lowcarb", name: "Low Carb", romano: "I", descricao: "Menos carboidrato, mais textura. A cozinha que sustenta sem pesar.", filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("lowcarb") },
  { key: "keto", name: "Cetogênicas", romano: "II", descricao: "Alta gordura, proteínas moderadas, carboidratos silenciados. Sabor sem concessão.", filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("keto") },
  { key: "carnivora-flex", name: "Carnívora Flexível", romano: "III", descricao: "Proteína animal no centro, temperos vegetais como pontuação.", filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("carnivora-flex") },
  { key: "selva", name: "Dieta da Selva", romano: "IV", descricao: "Carne, ovo e o que a natureza oferece sem industrialização. Tempero que valoriza o ingrediente, não disfarça.", filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("selva") },
  { key: "vegetariana", name: "Vegetariana", romano: "V", descricao: "Sabor e ética no mesmo prato. O protagonismo dos vegetais elevado pela autoria mineira.", filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("vegetariana") },
  { key: "tradicional", name: "Cozinha Tradicional", romano: "VI", descricao: "A mesa de todos os dias, elevada por temperos com autoria mineira.", filter: (r) => r.category === "tradicional" },
];
const MOMENT_ORDER: Moment[] = ["cafe", "almoco", "jantar", "lanche"];

function BibliotecaIndice() {
  const [aberta, setAberta] = useState<CategoriaKey | null>("tradicional"); const { refeicao, proteina, lifestyle, autor } = Route.useSearch(); const navigate = useNavigate({ from: "/cozinha" });
  const setFilter = (key: "refeicao" | "proteina" | "lifestyle" | "autor", value: string) => navigate({ search: (prev: { refeicao: string; proteina: string; lifestyle: string; autor: string }) => ({ ...prev, [key]: prev[key] === value ? "" : value }), resetScroll: false });
  const clearFilters = () => navigate({ search: { refeicao: "", proteina: "", lifestyle: "", autor: "" }, resetScroll: false });
  const extraFilter = useMemo(() => (r: Recipe) => { if (refeicao && r.moment !== refeicao) return false; if (proteina && getRecipeProtein(r) !== proteina) return false; return true; }, [refeicao, proteina]);
  const total = useMemo(() => REBRAND_RECIPES.filter(extraFilter).length, [extraFilter]); const ativo = Boolean(refeicao || proteina || lifestyle || autor);
  return <section id="indice" aria-labelledby="indice-title" className="section-space bg-brand-paper"><div className="page-shell max-w-7xl"><div className="mb-12 max-w-3xl sm:mb-16"><span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Encontre sua receita</span><h2 id="indice-title" className="mt-3 font-display text-5xl font-semibold leading-[.92] sm:text-6xl">O que vamos cozinhar hoje?</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Filtre pelo momento, pela proteína ou explore os estilos da Casa Temperanzza.</p></div>
    <div className="mb-12 grid gap-7 border-y border-brand-ink/10 py-7 sm:grid-cols-2"><fieldset><legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Refeição</legend><div className="flex flex-wrap gap-2">{MOMENT_ORDER.map((m) => <FilterChip key={m} label={MOMENTS[m]} active={refeicao === m} onClick={() => setFilter("refeicao", m)} />)}</div></fieldset><fieldset><legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Proteína principal</legend><div className="flex flex-wrap gap-2">{PROTEIN_ORDER.map((p) => <FilterChip key={p} label={PROTEINS[p]} active={proteina === p} onClick={() => setFilter("proteina", p)} />)}</div></fieldset><div className="flex flex-wrap items-center gap-4 sm:col-span-2"><span className="text-sm text-muted-foreground tabular-nums">{total} {total === 1 ? "receita" : "receitas"}</span>{ativo && <button type="button" onClick={clearFilters} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-ink/15 px-4 py-2 text-xs font-semibold"><X className="h-3.5 w-3.5" /> Limpar filtros</button>}</div></div>
    <div>{CATEGORIAS.map((cat) => <CategoriaAccordion key={cat.key} cat={cat} extraFilter={extraFilter} open={aberta === cat.key} onToggle={() => setAberta(aberta === cat.key ? null : cat.key)} />)}</div></div></section>;
}
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} aria-pressed={active} className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-xs font-semibold transition ${active ? "border-brand-ink bg-brand-ink text-brand-paper" : "border-brand-ink/15 bg-white text-brand-ink/75 hover:border-brand-ink/30"}`}>{label}</button>; }
function CategoriaAccordion({ cat, extraFilter, open, onToggle }: { cat: CategoriaDef; extraFilter: (r: Recipe) => boolean; open: boolean; onToggle: () => void }) { const receitas = useMemo(() => REBRAND_RECIPES.filter((r) => cat.filter(r) && extraFilter(r)), [cat, extraFilter]); return <article className="border-t border-brand-ink/12 last:border-b"><button onClick={onToggle} aria-expanded={open} className="group flex w-full items-center gap-5 py-8 text-left sm:gap-8 sm:py-10"><span className="w-10 shrink-0 text-sm font-semibold text-brand-ink/35">{cat.romano}</span><div className="min-w-0 flex-1"><h3 className="font-display text-3xl font-semibold leading-none sm:text-4xl">{cat.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{cat.descricao}</p></div><span className="text-sm tabular-nums text-muted-foreground">{receitas.length}</span><ChevronDown className={`h-5 w-5 text-brand-ink/55 transition-transform ${open ? "rotate-180" : ""}`} /></button>{open && <div className="grid gap-x-7 gap-y-12 pb-12 sm:grid-cols-2 lg:grid-cols-3">{receitas.length ? receitas.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />) : <p className="col-span-full py-8 text-sm text-muted-foreground">Nenhuma receita encontrada com estes filtros.</p>}</div>}</article>; }
function RecipeCard({ recipe }: { recipe: Recipe }) { return <Link to="/cozinha/$slug" params={{ slug: recipe.slug }} search={{ refeicao: "", proteina: "", lifestyle: "", autor: "" }} className="group block"><div className="relative aspect-[4/3] overflow-hidden bg-brand-cream">{recipe.dish ? <img src={recipe.dish.src} alt={recipe.dish.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 bg-brand-cream" />}</div><div className="pt-5"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{MOMENTS[recipe.moment]}</span><h4 className="mt-2 font-display text-3xl font-semibold leading-[1]">{recipe.title}</h4><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.subtitle ?? recipe.intro}</p><span className="mt-4 inline-flex items-center gap-2 border-b border-brand-ink/25 pb-1 text-xs font-semibold">Ver receita <ArrowUpRight className="h-3.5 w-3.5" /></span></div></Link>; }
