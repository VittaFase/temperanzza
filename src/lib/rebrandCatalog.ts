/**
 * Identidade canônica dos produtos usada pela experiência do rebrand.
 *
 * Shopify continua sendo a fonte comercial. Este arquivo resolve apenas aliases
 * técnicos de handles e a curadoria da Home; ele não classifica SKUs como
 * descontinuados, bloqueados ou inelegíveis para venda.
 */
export const PRODUCT_HANDLE_ALIASES: Record<string, string> = {
  "canela-premium-black-30g": "canela-moida",
  "chimi-churri-picante": "chimichurri-picante",
  "chimi-churri-sem-pimenta": "chimichurri-sem-pimenta",
  "tempero-chefe": "du-chefe-com-paprica",
  "pimenta-do-reino-premium-black-30g": "pimenta-do-reino",
  "edu-guedes": "tempero-do-edu",
};

export const HOME_FEATURED_HANDLES = [
  "salsa-cebola-e-alho",
  "lemon-pepper",
  "paprica-defumada",
  "chimichurri-sem-pimenta",
  "cebola-em-po",
  "du-chefe-com-paprica",
  "tempero-do-edu",
  "ana-maria",
] as const;

const HOME_FEATURED_RANK = new Map<string, number>(
  HOME_FEATURED_HANDLES.map((handle, index) => [handle, index]),
);

export function canonicalProductHandle(handle: string): string {
  return PRODUCT_HANDLE_ALIASES[handle] ?? handle;
}

export function getHomeFeaturedRank(handle: string): number | null {
  return HOME_FEATURED_RANK.get(canonicalProductHandle(handle)) ?? null;
}

export function isHomeFeaturedHandle(handle: string): boolean {
  return getHomeFeaturedRank(handle) !== null;
}
