import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { type DietKey } from "@/lib/diets";
import { RECIPES, CATEGORIES, type Recipe } from "@/lib/recipes";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/cozinha")({
  head: () => ({
    meta: [
      { title: "Biblioteca Gastronômica Temperanzza" },
      {
        name: "description",
        content:
          "Receitas autorais desenvolvidas para transformar ingredientes simples em experiências memoráveis. Cozinha editorial da casa Temperanzza.",
      },
      { property: "og:title", content: "Biblioteca Gastronômica Temperanzza" },
      {
        property: "og:description",
        content:
          "Uma biblioteca de receitas autorais Temperanzza — cetogênica, low carb, carnívora, tradicional. Editorial, sem pressa, para quem cozinha com autoria.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://temperanzza.com.br/cozinha",
      },
    ],
    links: [
      { rel: "canonical", href: "https://temperanzza.com.br/cozinha" },
    ],
  }),
  component: CozinhaLayout,
});

/**
 * Layout da Biblioteca Gastronômica.
 * - Renderiza SEMPRE a listagem (hero + índice em accordion tipo menu degustação).
 * - Renderiza <Outlet /> ao final: em /cozinha nada (index null); em /cozinha/$slug o drawer editorial.
 * - Estado (categoria expandida, scroll) permanece intacto ao abrir/fechar o drawer — layout não desmonta.
 */
function CozinhaLayout() {
  return (
    <SiteLayout>
      <BibliotecaHero />
      <BibliotecaIndice />
      <Outlet />
    </SiteLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HERO — 100vh, cinematográfico, sem prato, tipografia protagonista
// ═══════════════════════════════════════════════════════════════════

function BibliotecaHero() {
  return (
    <section
      aria-labelledby="biblioteca-hero-title"
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-brand-ink"
    >
      {/* Fundo editorial industrial — camadas de luz lateral, madeira escura, fumaça sutil */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 30%, oklch(0.32 0.06 40) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, oklch(0.24 0.05 30) 0%, transparent 60%), linear-gradient(180deg, oklch(0.14 0.015 45) 0%, oklch(0.10 0.02 30) 100%)",
        }}
      />
      {/* Textura grão de papel invertido — dá organicidade */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,240,220,0.3) 0px, transparent 2px), radial-gradient(circle at 60% 70%, rgba(255,220,180,0.2) 0px, transparent 2px), radial-gradient(circle at 80% 40%, rgba(255,230,200,0.25) 0px, transparent 2px)",
          backgroundSize: "180px 180px, 240px 240px, 300px 300px",
        }}
      />
      {/* Fumaça extremamente sutil */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/3 h-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 240, 220, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="flex items-center gap-3 mb-8">
          <span
            aria-hidden
            className="block h-px w-16 bg-brand-paper/40"
          />
          <span className="text-[10px] sm:text-xs font-display uppercase tracking-[0.4em] text-brand-paper/60">
            Casa Temperanzza · Cozinha Autoral
          </span>
        </div>

        <h1
          id="biblioteca-hero-title"
          className="font-display font-black uppercase text-brand-paper leading-[0.88] tracking-tight text-[15vw] sm:text-8xl lg:text-[9.5rem]"
        >
          Biblioteca
          <br />
          <span className="text-brand-mustard">Gastronômica</span>
          <br />
          Temperanzza
        </h1>

        <p className="mt-10 max-w-2xl font-serif italic text-xl sm:text-2xl lg:text-3xl text-brand-paper/80 leading-snug">
          Receitas autorais desenvolvidas para transformar ingredientes simples
          em experiências memoráveis.
        </p>

        <div className="mt-14 flex items-center gap-6 flex-wrap">
          <a
            href="#indice"
            className="group inline-flex items-center gap-4 border border-brand-paper/40 hover:border-brand-mustard px-8 py-4 font-display uppercase tracking-[0.25em] text-sm text-brand-paper transition-colors"
          >
            Explorar Receitas
            <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <span className="text-[11px] font-display uppercase tracking-[0.3em] text-brand-paper/50">
            {RECIPES.length} receitas · 5 estilos
          </span>
        </div>
      </div>

      {/* Marca de rodapé do hero */}
      <div className="absolute bottom-8 right-6 sm:right-10 text-right">
        <p className="font-serif italic text-brand-paper/40 text-sm leading-tight max-w-[220px]">
          "Tempero bom não é o que esconde o ingrediente."
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ÍNDICE — categorias em accordion, receitas como menu degustação
// ═══════════════════════════════════════════════════════════════════

type CategoriaKey = DietKey | "tradicional";

interface CategoriaDef {
  key: CategoriaKey;
  name: string;
  romano: string; // I, II, III, IV, V
  descricao: string;
  filter: (r: Recipe) => boolean;
}

const CATEGORIAS: CategoriaDef[] = [
  {
    key: "keto",
    name: "Cetogênicas",
    romano: "I",
    descricao:
      "Alta gordura, proteínas moderadas, carboidratos silenciados. Sabor sem concessão.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("keto"),
  },
  {
    key: "lowcarb",
    name: "Low Carb",
    romano: "II",
    descricao:
      "Menos carboidrato, mais textura. A cozinha que sustenta sem pesar.",
    filter: (r) => (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("lowcarb"),
  },
  {
    key: "carnivora-flex",
    name: "Carnívora Flexível",
    romano: "III",
    descricao:
      "Proteína animal no centro, temperos vegetais como pontuação.",
    filter: (r) =>
      (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("carnivora-flex"),
  },
  {
    key: "carnivora-estrita",
    name: "Carnívora Estrita",
    romano: "IV",
    descricao:
      "Somente proteína animal, sal e água. Um convite à essência do sabor.",
    filter: (r) =>
      (r.category ?? "dieta") === "dieta" && r.compatibleDiets.includes("carnivora-estrita"),
  },
  {
    key: "tradicional",
    name: "Tradicionais",
    romano: "V",
    descricao:
      "A mesa de todos os dias, elevada por temperos com autoria mineira.",
    filter: (r) => r.category === "tradicional",
  },
];

function BibliotecaIndice() {
  const [aberta, setAberta] = useState<CategoriaKey | null>("keto");

  return (
    <section id="indice" aria-labelledby="indice-title" className="bg-brand-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho editorial */}
        <div className="mb-16 sm:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span aria-hidden className="block h-px w-12 bg-accent" />
            <span className="text-[10px] font-display uppercase tracking-[0.4em] text-accent">
              Índice
            </span>
          </div>
          <h2
            id="indice-title"
            className="font-display font-black uppercase text-brand-ink leading-[0.9] tracking-tight text-5xl sm:text-6xl lg:text-7xl"
          >
            O Menu da Casa
          </h2>
          <p className="mt-6 font-serif italic text-lg sm:text-xl text-brand-ink/70 leading-relaxed">
            Cinco estilos de cozinhar. Uma única obsessão: o sabor que
            respeita quem come.
          </p>
        </div>

        {/* Accordion — Michelin menu style */}
        <div>
          {CATEGORIAS.map((cat) => (

            <CategoriaAccordion
              key={cat.key}
              cat={cat}
              open={aberta === cat.key}
              onToggle={() => setAberta(aberta === cat.key ? null : cat.key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriaAccordion({
  cat,
  open,
  onToggle,
}: {
  cat: CategoriaDef;
  open: boolean;
  onToggle: () => void;
}) {
  const receitas = useMemo(() => RECIPES.filter(cat.filter), [cat]);

  return (
    <article className="border-t border-brand-ink/20 last:border-b">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group w-full flex items-baseline gap-6 sm:gap-10 py-10 sm:py-14 text-left hover:bg-brand-ink/[0.02] transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6"
      >
        <span className="shrink-0 font-display font-black text-brand-ink/25 text-2xl sm:text-3xl tabular-nums w-10 sm:w-14 leading-none group-hover:text-accent transition-colors">
          {cat.romano}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-black uppercase text-brand-ink leading-[0.9] tracking-tight text-3xl sm:text-5xl lg:text-6xl">
            {cat.name}
          </h3>
          <p className="mt-3 font-serif italic text-brand-ink/60 text-base sm:text-lg max-w-2xl leading-snug">
            {cat.descricao}
          </p>
        </div>
        <span className="shrink-0 flex items-center gap-4 text-brand-ink/50 self-center">
          <span className="text-[11px] font-display uppercase tracking-[0.25em] tabular-nums hidden sm:inline">
            {receitas.length.toString().padStart(2, "0")}
          </span>
          <ChevronDown
            className={`h-6 w-6 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Lista de receitas — só nomes, muito espaço, hover editorial */}
      <div
        className={`grid transition-[grid-template-rows] duration-700 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {receitas.length === 0 ? (
            <div className="pb-14 pl-16 sm:pl-24 max-w-2xl">
              <p className="font-serif italic text-brand-ink/50 text-base">
                Ainda estamos desenvolvendo receitas exclusivas para este
                estilo. Aguarde os próximos capítulos da biblioteca.
              </p>
            </div>
          ) : (
            <ul className="pb-14 sm:pb-20">
              {receitas.map((r, i) => (
                <li key={r.slug}>
                  <Link
                    to="/cozinha/$slug"
                    params={{ slug: r.slug }}
                    className="group/item flex items-baseline gap-6 sm:gap-10 py-5 sm:py-6 pl-16 sm:pl-24 pr-4 hover:bg-brand-ink hover:text-brand-paper transition-colors -mx-4 sm:-mx-6 sm:pr-6"
                  >
                    <span className="shrink-0 font-display text-brand-ink/30 text-xs tabular-nums group-hover/item:text-brand-mustard w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 min-w-0 font-display font-bold uppercase tracking-tight text-xl sm:text-2xl lg:text-3xl leading-[1.05] group-hover/item:translate-x-2 transition-transform">
                      {r.title}
                    </span>
                    <span className="shrink-0 hidden md:inline font-serif italic text-sm text-brand-ink/40 group-hover/item:text-brand-paper/70 max-w-xs text-right leading-tight">
                      {r.subtitle ?? r.intro}
                    </span>
                    <ArrowUpRight className="shrink-0 h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
