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

// ... [PROTEINS and RECIPE_PROTEIN maps]
