/**
 * Mapa de cores por sabor — cada produto vive sobre um bloco de cor
 * saturado próprio do tempero, no espírito Kinder's.
 *
 * Match por keywords no handle ou no título (case-insensitive).
 * Fallback: vermelho-tijolo da marca.
 */

export interface FlavorTone {
  /** cor de fundo do tile (CSS color) */
  bg: string;
  /** cor da "poeira" / partículas sobrepostas */
  particle: string;
  /** se o fundo é escuro (texto branco vs ink) */
  dark: boolean;
}

const TONES: Record<string, FlavorTone> = {
  // Pápricas
  "paprica-doce": { bg: "oklch(0.68 0.17 55)", particle: "oklch(0.55 0.18 45)", dark: false },
  "paprica-picante": { bg: "oklch(0.55 0.22 30)", particle: "oklch(0.42 0.22 28)", dark: true },
  paprica: { bg: "oklch(0.62 0.2 40)", particle: "oklch(0.48 0.2 35)", dark: true },

  // Pimentas
  pimenta: { bg: "oklch(0.42 0.18 25)", particle: "oklch(0.32 0.15 22)", dark: true },
  "pimenta-do-reino": { bg: "oklch(0.28 0.02 50)", particle: "oklch(0.18 0.015 50)", dark: true },
  "pimenta-preta": { bg: "oklch(0.22 0.015 50)", particle: "oklch(0.12 0.01 50)", dark: true },

  // Doces / sobremesa
  canela: { bg: "oklch(0.5 0.13 50)", particle: "oklch(0.38 0.12 45)", dark: true },
  "canela-premium": { bg: "oklch(0.32 0.06 40)", particle: "oklch(0.22 0.04 40)", dark: true },
  cravo: { bg: "oklch(0.38 0.08 45)", particle: "oklch(0.26 0.06 40)", dark: true },
  "noz-moscada": { bg: "oklch(0.55 0.09 55)", particle: "oklch(0.42 0.09 50)", dark: true },

  // Amarelos / ouro
  acafrao: { bg: "oklch(0.75 0.16 80)", particle: "oklch(0.62 0.16 75)", dark: false },
  curry: { bg: "oklch(0.72 0.17 75)", particle: "oklch(0.58 0.17 70)", dark: false },
  cominho: { bg: "oklch(0.62 0.13 70)", particle: "oklch(0.48 0.12 65)", dark: true },
  gengibre: { bg: "oklch(0.78 0.13 85)", particle: "oklch(0.65 0.13 80)", dark: false },
  mostarda: { bg: "oklch(0.72 0.16 90)", particle: "oklch(0.58 0.16 85)", dark: false },

  // Verdes / ervas
  alecrim: { bg: "oklch(0.42 0.09 145)", particle: "oklch(0.3 0.08 145)", dark: true },
  oregano: { bg: "oklch(0.48 0.11 140)", particle: "oklch(0.35 0.1 140)", dark: true },
  manjericao: { bg: "oklch(0.52 0.13 145)", particle: "oklch(0.38 0.12 145)", dark: true },
  tomilho: { bg: "oklch(0.46 0.08 135)", particle: "oklch(0.33 0.07 135)", dark: true },
  louro: { bg: "oklch(0.5 0.09 130)", particle: "oklch(0.36 0.08 130)", dark: true },
  salsinha: { bg: "oklch(0.55 0.14 145)", particle: "oklch(0.4 0.13 145)", dark: true },

  // Aliáceos / brancos
  alho: { bg: "oklch(0.86 0.02 90)", particle: "oklch(0.72 0.03 85)", dark: false },
  cebola: { bg: "oklch(0.78 0.04 75)", particle: "oklch(0.62 0.05 70)", dark: false },
  sal: { bg: "oklch(0.88 0.01 80)", particle: "oklch(0.72 0.015 75)", dark: false },

  // Premium Black
  "premium-black": { bg: "oklch(0.15 0.01 50)", particle: "oklch(0.08 0.005 50)", dark: true },
  black: { bg: "oklch(0.18 0.015 50)", particle: "oklch(0.1 0.01 50)", dark: true },

  // Temperaflix / shakers
  shaker: { bg: "oklch(0.45 0.15 35)", particle: "oklch(0.32 0.14 30)", dark: true },
  temperaflix: { bg: "oklch(0.5 0.18 28)", particle: "oklch(0.36 0.18 28)", dark: true },

  // Outros comuns
  churrasco: { bg: "oklch(0.38 0.12 30)", particle: "oklch(0.26 0.1 28)", dark: true },
  defumado: { bg: "oklch(0.32 0.06 45)", particle: "oklch(0.22 0.05 40)", dark: true },
  chimichurri: { bg: "oklch(0.45 0.12 140)", particle: "oklch(0.32 0.11 140)", dark: true },
};

const DEFAULT_TONE: FlavorTone = {
  bg: "oklch(0.52 0.21 28)",
  particle: "oklch(0.38 0.2 28)",
  dark: true,
};

export function getFlavorTone(handle: string, title?: string): FlavorTone {
  const haystack = `${handle} ${title ?? ""}`.toLowerCase();
  // longest key first to prefer specific matches
  const keys = Object.keys(TONES).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (haystack.includes(key)) return TONES[key];
  }
  return DEFAULT_TONE;
}

export function getBadge(handle: string, title?: string): string | null {
  const h = `${handle} ${title ?? ""}`.toLowerCase();
  if (h.includes("premium") || h.includes("black")) return "PREMIUM";
  if (h.includes("novo") || h.includes("lancamento") || h.includes("new")) return "NOVO";
  if (h.includes("limitad") || h.includes("edicao")) return "EDIÇÃO LIMITADA";
  if (h.includes("temperaflix") || h.includes("shaker")) return "SHAKER";
  return null;
}
