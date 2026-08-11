/**
 * Metadados canônicos das dietas suportadas pelo módulo Cozinha Temperanzza.
 * A ordem deste array é a ordem de exibição em todo o site.
 */

export type DietKey = "keto" | "lowcarb" | "carnivora-flex" | "selva" | "vegetariana";

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
    key: "lowcarb",
    name: "Low Carb",
    short: "Low Carb",
    definition:
      "Redução de carboidratos com mais flexibilidade que a cetogênica. Foco em proteínas, gorduras boas e vegetais de baixo carboidrato.",
    token: "brand-emerald",
  },
  {
    key: "keto",
    name: "Cetogênica",
    short: "Keto",
    definition:
      "Muito baixo em carboidratos (abaixo de 20–50 g/dia), moderado em proteínas, alto em gorduras. O corpo entra em cetose e queima gordura como energia.",
    token: "brand-mustard",
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
    key: "selva",
    name: "Dieta da Selva",
    short: "Selva",
    definition:
      "Carne, ovo e o que a natureza oferece sem industrialização. Um protocolo primitivo focado em ingredientes ancestrais e pureza absoluta.",
    token: "brand-amber",
  },
  {
    key: "vegetariana",
    name: "Vegetariana",
    short: "Veggie",
    definition:
      "Exclusão de carnes (bovina, suína, aves, peixes). Foco em vegetais, grãos, ovos e laticínios para quem busca sabor com ética animal.",
    token: "brand-emerald",
  },
];

export function getDiet(key: DietKey): DietMeta {
  return DIETS.find((d) => d.key === key)!;
}
