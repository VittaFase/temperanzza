import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DIETS, type DietKey } from "@/lib/diets";
import {
  RECIPES,
  MOMENTS,
  CATEGORIES,
  type Moment,
  type Recipe,
  type RecipeCategory,
} from "@/lib/recipes";
import { getProductDiet } from "@/lib/dietCompatibility";
import { DietBadge } from "@/components/site/DietBadge";
import { Search, Filter, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cozinha")({
  head: () => ({
    meta: [
      { title: "Cozinha Temperanzza — Receitas Low Carb, Keto e Carnívora" },
      {
        name: "description",
        content:
          "Receitas didáticas para quem come com consciência: cetogênica, low carb e carnívora flexível. Descubra como cada tempero Temperanzza serve sua dieta.",
      },
      {
        property: "og:title",
        content: "Cozinha Temperanzza — Receitas para seu Estilo de Vida",
      },
      {
        property: "og:description",
        content:
          "Compatibilidade dietética e receitas curadas para cetogênica, low carb, carnívora flexível e estrita.",
      },
    ],
  }),
  component: CozinhaPage,
});

/** Todos os condimentos únicos referenciados nas receitas (para o filtro). */
const CONDIMENT_OPTIONS = Array.from(
  new Set(RECIPES.map((r) => r.featuredHandle)),
).sort();

function humanHandle(h: string) {
  return h
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function CozinhaPage() {
  const [dieta, setDieta] = useState<DietKey | "all">("all");
  const [condimento, setCondimento] = useState<string>("all");
  const [momento, setMomento] = useState<Moment | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (dieta !== "all" && !r.compatibleDiets.includes(dieta)) return false;
      if (condimento !== "all" && r.featuredHandle !== condimento) return false;
      if (momento !== "all" && r.moment !== momento) return false;
      if (term && !`${r.title} ${r.intro}`.toLowerCase().includes(term))
        return false;
      return true;
    });
  }, [dieta, condimento, momento, q]);

  return (
    <SiteLayout>
      {/* HERO editorial */}
      <section className="relative border-b border-foreground/15 overflow-hidden">
        <div className="absolute inset-0 bg-paper-grain opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="divider-stencil w-8" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Cozinha Temperanzza
            </span>
          </div>
          <h1 className="font-display font-black uppercase leading-[0.92] tracking-tight text-[13vw] sm:text-7xl lg:text-8xl">
            Sabor e saúde
            <br />
            para quem come
            <br />
            com <span className="text-accent">consciência</span>.
          </h1>
          <p className="mt-8 max-w-2xl font-serif italic text-xl sm:text-2xl text-foreground/80 leading-snug">
            Um guia didático de compatibilidade dietética e receitas do dia a
            dia — pensadas para cetogênica, low carb e carnívora, sem abrir mão
            do prazer da mesa.
          </p>
        </div>
      </section>

      {/* Entendendo as dietas */}
      <section
        aria-labelledby="dietas-title"
        className="border-b border-foreground/15 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Fundamentos
              </span>
              <h2
                id="dietas-title"
                className="font-display font-black uppercase text-4xl sm:text-5xl mt-2 tracking-tight"
              >
                Entendendo as dietas
              </h2>
            </div>
          </div>
          <div className="grid gap-px bg-foreground/10 border border-foreground/10 md:grid-cols-2 lg:grid-cols-4">
            {DIETS.map((d) => (
              <article key={d.key} className="bg-background p-6 lg:p-8 flex flex-col">
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-10 bg-${d.token} mb-5`}
                />
                <h3 className="font-display font-black uppercase text-2xl tracking-tight mb-3">
                  {d.name}
                </h3>
                <p className="text-sm text-foreground/75 leading-relaxed flex-1">
                  {d.definition}
                </p>
                <button
                  onClick={() => setDieta(d.key)}
                  className="mt-6 text-xs font-display font-black uppercase tracking-widest text-accent hover:underline underline-offset-4 self-start"
                >
                  Ver receitas →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros + Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-background/95 backdrop-blur border-y border-foreground/15 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-foreground/70">
                <Filter className="h-4 w-4" />
                Filtrar
              </div>

              <SelectPill
                label="Dieta"
                value={dieta}
                onChange={(v) => setDieta(v as DietKey | "all")}
                options={[
                  { value: "all", label: "Todas as dietas" },
                  ...DIETS.map((d) => ({ value: d.key, label: d.name })),
                ]}
              />

              <SelectPill
                label="Condimento"
                value={condimento}
                onChange={setCondimento}
                options={[
                  { value: "all", label: "Todos os condimentos" },
                  ...CONDIMENT_OPTIONS.map((h) => ({
                    value: h,
                    label: humanHandle(h),
                  })),
                ]}
              />

              <SelectPill
                label="Momento"
                value={momento}
                onChange={(v) => setMomento(v as Moment | "all")}
                options={[
                  { value: "all", label: "Qualquer hora" },
                  { value: "cafe", label: "Café da manhã" },
                  { value: "almoco", label: "Almoço" },
                  { value: "jantar", label: "Jantar" },
                ]}
              />

              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar receita…"
                  className="w-full pl-9 pr-3 h-10 border border-foreground/20 bg-background text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border-2 border-dashed border-foreground/15 py-20 text-center">
              <p className="font-display uppercase text-2xl">
                Nenhuma receita encontrada
              </p>
              <p className="mt-3 text-muted-foreground">
                Ajuste os filtros para explorar outras combinações.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <RecipeCard key={r.slug} recipe={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function SelectPill({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="inline-flex items-center border border-foreground/20 bg-background h-10 pl-3 pr-2 gap-2">
      <span className="text-[10px] font-display uppercase tracking-widest text-foreground/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium focus:outline-none pr-1"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const diet = getProductDiet(recipe.featuredHandle);
  return (
    <Link
      to="/cozinha/$slug"
      params={{ slug: recipe.slug }}
      className="group block border border-foreground/15 bg-background hover:border-accent transition-colors"
    >
      <div
        className="relative aspect-[5/3] overflow-hidden"
        style={{ background: recipe.hero.color }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.25) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.2) 0, transparent 50%)",
          }}
        />
        <span className="absolute top-3 left-3 label-tag">
          {MOMENTS[recipe.moment]}
        </span>
        <span
          className="absolute right-4 bottom-3 text-5xl sm:text-6xl select-none opacity-90 transition-transform duration-500 group-hover:scale-110"
          aria-hidden
        >
          {recipe.hero.emoji}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-display font-black uppercase tracking-tight text-xl leading-[0.95]">
          {recipe.title}
        </h3>
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
          {recipe.intro}
        </p>
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-foreground/10">
          <div className="flex flex-wrap gap-1.5">
            {recipe.compatibleDiets.map((d) => (
              <DietBadge key={d} diet={d} verdict="ok" variant="chip" />
            ))}
          </div>
          <ArrowRight className="h-4 w-4 text-foreground/50 group-hover:text-accent transition" />
        </div>
        <p className="text-[11px] font-display uppercase tracking-widest text-muted-foreground">
          com {humanHandle(recipe.featuredHandle)}
          {diet ? "" : ""}
        </p>
      </div>
    </Link>
  );
}
