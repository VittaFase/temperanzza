/**
 * Asset Lock editorial do rebrand Temperanzza.
 *
 * Este registro NÃO substitui Shopify nem define se um produto pode ser vendido.
 * Ele controla somente quais handles podem ser promovidos automaticamente nas
 * superfícies editoriais da nova experiência (hero, destaques e storytelling).
 *
 * Regra: produto comercial/legado pode continuar existindo no backend sem se
 * tornar, por isso, uma referência visual autorizada do rebrand.
 */
export const REBRAND_EDITORIAL_HANDLES = [
  "chimi-churri-picante",
  "chimichurri-picante",
  "chimi-churri-sem-pimenta",
  "chimichurri-sem-pimenta",
  "curcuma",
  "ervas-finas",
  "lemon-pepper",
  "paprica-defumada",
  "paprica-doce",
  "paprica-picante",
  "salsa-cebola-e-alho",
  "temperaflix-bacon",
  "temperaflix-ervas-finas",
  "temperaflix-tradicional",
  "tempero-mineiro",
] as const;

const REBRAND_EDITORIAL_SET = new Set<string>(REBRAND_EDITORIAL_HANDLES);

/** Handles que permanecem fora da seleção editorial automática. */
export const REBRAND_EDITORIAL_BLOCKED_HANDLES = [
  "ana-maria",
  "cebola-em-po",
  "du-chefe-com-paprica",
  "tempero-chefe",
  "tempero-do-edu",
  "edu-guedes",
] as const;

export function isRebrandEditorialHandle(handle: string): boolean {
  return REBRAND_EDITORIAL_SET.has(handle);
}
