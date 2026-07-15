/**
 * Metadados canônicos das dietas suportadas pelo módulo Cozinha Temperanzza.
 * A ordem deste array é a ordem de exibição em todo o site.
 */

export type DietKey = "keto" | "lowcarb" | "carnivora-flex" | "carnivora-estrita";

export interface DietMeta {
  key: DietKey;
  name: string;
  short: string;
  definition: string;
  /** classe utilitária do token de cor da marca (bg-*, text-*) */
  token: string;
}

export const DIETS: DietMeta[] = [
  {
    key: "keto",
    name: "Cetogênica",
    short: "Keto",
    definition:
      "Muito baixo em carboidratos (abaixo de 20–50 g/dia), moderado em proteínas, alto em gorduras. O corpo entra em cetose e queima gordura como energia.",
    token: "brand-mustard",
  },
  {
    key: "lowcarb",
    name: "Low Carb",
    short: "Low Carb",
    definition:
      "Redução de carboidratos com mais flexibilidade que a cetogênica. Foco em proteínas, gorduras boas e vegetais de baixo carboidrato.",
    token: "brand-emerald",
  },
  {
    key: "carnivora-flex",
    name: "Carnívora Flexível",
    short: "Carnívora Flex",
    definition:
      "Base em produtos de origem animal, com espaço para temperos, especiarias e alguns vegetais de baixo carboidrato para sabor.",
    token: "brand-red",
  },
  {
    key: "carnivora-estrita",
    name: "Carnívora Restrita",
    short: "Carnívora",
    definition:
      "Apenas produtos de origem animal, sal e água. Nenhum tempero vegetal ou especiaria é permitido.",
    token: "brand-ink",
  },
];

export function getDiet(key: DietKey): DietMeta {
  return DIETS.find((d) => d.key === key)!;
}
