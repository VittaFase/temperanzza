export interface Pote {
  id: string;
  nome: string;
  categoria: 'Clássicos' | 'Premium' | 'Artesanais';
  descricao: string;
  preco: number;
  peso: string;
  sku: string;
  rating: number;
  reviews_count: number;
  imagem_url: string;
  origem: string;
  estoque: number;
  ativo: boolean;
}

export const POTES_MASTER_MAX: Pote[] = [
  { id: 'ana-maria', nome: 'Ana Maria', categoria: 'Clássicos', descricao: 'Tempero clássico mineiro', preco: 24.90, peso: '100g', sku: 'TZ-ANA-100', rating: 4.8, reviews_count: 45, imagem_url: '/potes/ana-maria-master-max.jpg', origem: 'Belo Horizonte, MG', estoque: 150, ativo: true },
  { id: 'temperaflix-tradicional', nome: 'Temperaflix Tradicional', categoria: 'Clássicos', descricao: 'Tempero versátil clássico', preco: 28.90, peso: '110g', sku: 'TZ-TEX-TRAD-110', rating: 4.8, reviews_count: 71, imagem_url: '/potes/temperaflix-tradicional-master-max.jpg', origem: 'Belo Horizonte, MG', estoque: 145, ativo: true }
];

export const getTotalPotes = (): number => {
  return POTES_MASTER_MAX.length;
};

/**
 * Identidade canônica dos produtos usada pela experiência do rebrand.
 * Shopify continua sendo a fonte comercial; estes aliases apenas consolidam
 * nomes técnicos que representam o mesmo SKU.
 */
export const PRODUCT_HANDLE_ALIASES: Record<string, string> = {
  "canela-premium-black-30g": "canela-moida",
  "chimi-churri-picante": "chimichurri-picante",
  "chimi-churri-sem-pimenta": "chimichurri-sem-pimenta",
  "tempero-chefe": "du-chefe-com-paprica",
  "pimenta-do-reino-premium-black-30g": "pimenta-do-reino",
  "edu-guedes": "tempero-do-edu",
};

/** SKUs comerciais deliberadamente fora das superfícies do novo rebrand. */
export const REBRAND_EXCLUDED_HANDLES = ["cebola-em-po"] as const;

const REBRAND_EXCLUDED_HANDLE_SET = new Set<string>(REBRAND_EXCLUDED_HANDLES);

export const REBRAND_CONFIRMED_SOURCE_HANDLES = [
  "ana-maria",
  "temperaflix-ervas-finas",
  "temperaflix-tradicional",
  "tempero-mineiro",
  "temperaflix-bacon",
  "paprica-picante",
  "salsa-cebola-e-alho",
  "curcuma",
  "tempero-do-edu",
  "ervas-finas",
  "lemon-pepper",
  "paprica-defumada",
  "paprica-doce",
  "du-chefe-com-paprica",
  "chimichurri-sem-pimenta",
  "chimichurri-picante",
] as const;

const REBRAND_CONFIRMED_SOURCE_SET = new Set<string>(REBRAND_CONFIRMED_SOURCE_HANDLES);

export const HOME_FEATURED_HANDLES = [
  "salsa-cebola-e-alho",
  "paprica-defumada",
  "chimichurri-sem-pimenta",
  "du-chefe-com-paprica",
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

export function isRebrandExcludedHandle(handle: string): boolean {
  return REBRAND_EXCLUDED_HANDLE_SET.has(canonicalProductHandle(handle));
}

export function isRebrandEligibleHandle(handle: string): boolean {
  return !isRebrandExcludedHandle(handle);
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
