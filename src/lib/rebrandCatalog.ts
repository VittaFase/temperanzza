/**
 * Identidade canônica dos produtos usada pela experiência do rebrand.
 *
 * Shopify continua sendo a fonte comercial. Este arquivo resolve aliases
 * técnicos, curadoria e elegibilidade editorial. A elegibilidade abaixo afirma
 * apenas que existe uma fonte visual do NOVO REBRAND fornecida/aprovada; ela não
 * afirma que o asset histórico em src/assets já seja essa fonte.
 */
export const PRODUCT_HANDLE_ALIASES: Record<string, string> = {
  "canela-premium-black-30g": "canela-moida",
  "chimi-churri-picante": "chimichurri-picante",
  "chimi-churri-sem-pimenta": "chimichurri-sem-pimenta",
  "pimenta-do-reino-premium-black-30g": "pimenta-do-reino",
  "edu-guedes": "tempero-do-edu",
};

/**
 * SKUs com fonte visual do novo rebrand confirmada pelo proprietário.
 * Ver docs/PRODUCT-ASSET-LOCK.md. Não adicionar aqui por inferência.
 */
export const REBRAND_CONFIRMED_SOURCE_HANDLES = [
  "ana-maria",
  "temperaflix-ervas-finas",
  "temperaflix-tradicional",
  "temperaflix-bacon",
  "paprica-picante",
  "salsa-cebola-e-alho",
  "curcuma",
  "tempero-do-edu",
  "ervas-finas",
  "lemon-pepper",
  "paprica-defumada",
  "paprica-doce",
  "chimichurri-sem-pimenta",
  "chimichurri-picante",
] as const;

const REBRAND_CONFIRMED_SOURCE_SET = new Set<string>(REBRAND_CONFIRMED_SOURCE_HANDLES);

export const HOME_FEATURED_HANDLES = [
  "salsa-cebola-e-alho",
  "paprica-defumada",
  "chimichurri-sem-pimenta",
  "tempero-do-edu",
  "tempero-mineiro",
  "curcuma",
  "ervas-finas",
] as const;

const HOME_FEATURED_RANK = new Map<string, number>(
  HOME_FEATURED_HANDLES.map((handle, index) => [handle, index]),
);

export function canonicalProductHandle(handle: string): string {
  return PRODUCT_HANDLE_ALIASES[handle] ?? handle;
}

/**
 * Predicado positivo e canônico para qualquer superfície do novo rebrand.
 * Componentes editoriais e comerciais devem consultar esta função antes de
 * expor, resolver no Shopify ou encaminhar um handle para checkout.
 */
export function isRebrandEligibleHandle(handle: string): boolean {
  return REBRAND_CONFIRMED_SOURCE_SET.has(canonicalProductHandle(handle));
}

export function hasConfirmedRebrandSource(handle: string): boolean {
  const canonicalHandle = canonicalProductHandle(handle);
  return isRebrandEligibleHandle(canonicalHandle) && REBRAND_CONFIRMED_SOURCE_SET.has(canonicalHandle);
}

export function getHomeFeaturedRank(handle: string): number | null {
  const canonicalHandle = canonicalProductHandle(handle);
  if (!hasConfirmedRebrandSource(canonicalHandle)) return null;
  return HOME_FEATURED_RANK.get(canonicalHandle) ?? null;
}

export function isHomeFeaturedHandle(handle: string): boolean {
  return getHomeFeaturedRank(handle) !== null;
}
