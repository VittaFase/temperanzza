/**
 * Receitas curadas da Cozinha Temperanzza.
 * Cada receita destaca um condimento e é rotulada com as dietas compatíveis.
 */

import type { DietKey } from "./diets";
import type { ProductDiet } from "./dietCompatibility";

export type Moment = "cafe" | "almoco" | "jantar" | "lanche";
export type RecipeCategory = "dieta" | "tradicional";

export interface Recipe {
  slug: string;
  title: string;
  /** condimento protagonista (usa alias de handle Shopify) */
  featuredHandle: string;
  compatibleDiets: DietKey[];
  moment: Moment;
  profile: ProductDiet["profile"];
  /** "dieta" (Estilo de Vida e Performance) ou "tradicional" (Mesa de Todos). Default: "dieta" */
  category?: RecipeCategory;
  intro: string;
  ingredients: string[];
  steps: string[];
  /** rótulo depende da categoria: "Por que funciona…" vs "O Toque Temperanzza" */
  whyItWorks: string;
  /** rótulo depende da categoria: "Dica de substituição" vs "Dica de variação" */
  substitution: string;
  /** metáfora visual quando não há foto ainda */
  hero: { color: string };
  // ── Camada editorial (opcional — a Biblioteca Gastronômica usa quando presente) ──
  /** Linha editorial curta (uma frase, tipo Saveur). Fallback: intro. */
  subtitle?: string;
  /** "Palavra do Chef" — texto italico, até 80 palavras. Fallback: whyItWorks. */
  chefWord?: string;
  /** Tempo total (ex: "25 min") */
  time?: string;
  /** Rendimento (ex: "2 pessoas") */
  serves?: string;
  /** Dificuldade: "Fácil" | "Médio" | "Avançado" */
  difficulty?: "Fácil" | "Médio" | "Avançado";
  /** Handles de temperos que harmonizam (2-3 sugestões). */
  harmonization?: string[];
  /** Proteína dominante do prato (filtro complementar). Fallback: RECIPE_PROTEIN. */
  proteinaPrincipal?: Protein;
  /** Foto do prato pronto (adição v2) */
  dish?: { src: string; alt: string };
  /** Sugestões específicas para "Continue a leitura" */
  relatedSlugs?: string[];
}


export const MOMENTS: Record<Moment, string> = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  jantar: "Jantar",
  lanche: "Lanche",
};

export const CATEGORIES: Record<RecipeCategory, { label: string; short: string }> = {
  dieta: { label: "Estilo de Vida & Performance", short: "Dieta" },
  tradicional: { label: "Mesa de Todos — Tradicional", short: "Tradicional" },
};

export const RECIPES: Recipe[] = [
  // ... [44 recipes will be here]
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export function getRecipesByHandle(handle: string): Recipe[] {
  return RECIPES.filter((r) => r.featuredHandle === handle);
}

export type Protein =
  | "frango"
  | "bovina"
  | "suino"
  | "pescados"
  | "ovo"
  | "vegetariano";

export const PROTEINS: Record<Protein, string> = {
  frango: "Frango",
  bovina: "Carne bovina",
  suino: "Suíno",
  pescados: "Peixe & Frutos do Mar",
  ovo: "Ovo",
  vegetariano: "Vegetariano",
};

export const PROTEIN_ORDER: Protein[] = [
  "frango",
  "bovina",
  "suino",
  "pescados",
  "ovo",
  "vegetariano",
];

/**
 * Classificação da proteína dominante de cada receita.
 */
export const RECIPE_PROTEIN: Record<string, Protein> = {
  "omelete-bacon-em-po": "ovo",
  "frango-assado-paprica-defumada": "frango",
  "hamburguer-bacon-em-po": "bovina",
  "ovos-mexidos-ervas-finas": "ovo",
  "peixe-grelhado-salsa-cebola-alho": "pescados",
  "bife-manteiga-chimi-churri": "bovina",
  "ovos-cozidos-tempero-edu": "ovo",
  "carne-moida-tempero-mineiro": "bovina",
  "ovos-dourados-curcuma": "ovo",
  "frango-grelhado-ana-maria": "frango",
  "sopa-legumes-salsa-cebola-alho": "vegetariano",
  "ovo-frito-lemon-pepper": "ovo",
  "porco-assado-paprica-picante": "suino",
  "camarao-chimi-churri-picante": "pescados",
  "frango-dourado-paprica-doce": "frango",
  "cafe-ritual-canela": "vegetariano",
  "mix-castanhas-temperaflix-ervas": "vegetariano",
  "salmao-crosta-ervas-finas": "pescados",
  "abacate-recheado-frango-chimi-churri": "frango",
  "couve-flor-gratinada-curcuma": "vegetariano",
  "sardinha-grelhada-lemon-pepper": "pescados",
  "panqueca-proteica-tempero-edu": "ovo",
  "costela-bovina-pimenta-reino": "bovina",
  "figado-acebolado-salsa-cebola-alho": "bovina",
  "camarao-manteiga-salsa-cebola-alho": "pescados",
  "frango-panela-ana-maria": "frango",
  "berinjela-assada-tempero-mineiro": "vegetariano",
  "pao-de-queijo-tempero-mineiro": "vegetariano",
  "arroz-soltinho-cebola-em-po": "vegetariano",
  "frango-quiabo-ana-maria": "frango",
  "ovos-fritos-bacon-tradicional": "ovo",
  "bife-acebolado-lemon-pepper": "bovina",
  "costelinha-paprica-defumada-tradicional": "suino",
  "omelete-temperaflix-ervas-finas": "ovo",
  "frango-chimi-churri-picante": "frango",
  "legumes-assados-curcuma-tradicional": "vegetariano",
  "costela-porco-du-chefe": "suino",
  "bife-cavalo-pimenta-reino": "bovina",
  "maca-assada-canela": "vegetariano",
  "pipoca-caseira-temperaflix-tradicional": "vegetariano",
  "carne-panela-batatas-tempero-mineiro": "bovina",
  "peixe-assado-legumes-salsa-cebola-alho": "pescados",
  "feijao-tropeiro-tempero-mineiro": "vegetariano",
  "sopa-legumes-ervas-finas": "vegetariano",
};

/** Proteína dominante da receita (campo explícito tem prioridade sobre o mapa). */
export function getRecipeProtein(r: Recipe): Protein | undefined {
  return r.proteinaPrincipal ?? RECIPE_PROTEIN[r.slug];
}

