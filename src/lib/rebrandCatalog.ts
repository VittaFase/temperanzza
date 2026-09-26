export interface Pote {
  id: string;
  nome: string;
  categoria: string;
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
  { id: "ana-maria", nome: "Ana Maria", categoria: "Clássicos", descricao: "Tempero clássico mineiro com alho e cebola", preco: 24.9, peso: "100g", sku: "TZ-ANA-100", rating: 4.8, reviews_count: 45, imagem_url: "src/assets/rebrand-products/ana-maria.png", origem: "Belo Horizonte, MG", estoque: 150, ativo: true },
  { id: "chimichurri-picante", nome: "Chimi Churri Picante", categoria: "Argentinos", descricao: "Clássico argentino com pimenta malagueta", preco: 28.9, peso: "100g", sku: "TZ-CHIP-100", rating: 4.7, reviews_count: 38, imagem_url: "src/assets/rebrand-products/chimi-churri-picante.png", origem: "Buenos Aires, AR", estoque: 120, ativo: true },
  { id: "chimichurri-sem-pimenta", nome: "Chimi Churri Sem Pimenta", categoria: "Argentinos", descricao: "Versão suave do clássico argentino", preco: 28.9, peso: "100g", sku: "TZ-CHIS-100", rating: 4.6, reviews_count: 32, imagem_url: "src/assets/rebrand-products/chimi-churri-sem-pimenta.png", origem: "Buenos Aires, AR", estoque: 110, ativo: true },
  { id: "curcuma", nome: "Cúrcuma", categoria: "Especiarias", descricao: "Cúrcuma pura", preco: 32.9, peso: "80g", sku: "TZ-CUR-80", rating: 4.9, reviews_count: 52, imagem_url: "src/assets/rebrand-products/curcuma.png", origem: "Kerala, Índia", estoque: 95, ativo: true },
  { id: "tempero-do-edu", nome: "Edu Guedes", categoria: "Clássicos", descricao: "Tempero versátil inspirado no chef Edu Guedes", preco: 26.9, peso: "100g", sku: "TZ-EDU-100", rating: 4.7, reviews_count: 41, imagem_url: "src/assets/rebrand-products/edu-guedes.png", origem: "São Paulo, SP", estoque: 130, ativo: true },
  { id: "ervas-finas", nome: "Ervas Finas", categoria: "Herbáceos", descricao: "Mix de ervas desidratadas premium", preco: 29.9, peso: "90g", sku: "TZ-ERB-90", rating: 4.8, reviews_count: 47, imagem_url: "src/assets/rebrand-products/ervas-finas.png", origem: "Minas Gerais, MG", estoque: 125, ativo: true },
  { id: "lemon-pepper", nome: "Lemon Pepper", categoria: "Internacionais", descricao: "Pimenta preta com limão siciliano", preco: 27.9, peso: "100g", sku: "TZ-LEM-100", rating: 4.9, reviews_count: 55, imagem_url: "src/assets/rebrand-products/lemon-pepper.png", origem: "Itália", estoque: 140, ativo: true },
  { id: "paprica-defumada", nome: "Páprica Defumada", categoria: "Especiarias", descricao: "Páprica com sabor defumado", preco: 25.9, peso: "100g", sku: "TZ-PAD-100", rating: 4.8, reviews_count: 43, imagem_url: "src/assets/rebrand-products/paprica-defumada.png", origem: "Hungria", estoque: 115, ativo: true },
  { id: "paprica-doce", nome: "Páprica Doce", categoria: "Especiarias", descricao: "Páprica suave e adocicada", preco: 24.9, peso: "100g", sku: "TZ-PAO-100", rating: 4.7, reviews_count: 39, imagem_url: "src/assets/rebrand-products/paprica-doce.png", origem: "Hungria", estoque: 125, ativo: true },
  { id: "paprica-picante", nome: "Páprica Picante", categoria: "Especiarias", descricao: "Páprica vermelha com toque de ardência", preco: 26.9, peso: "100g", sku: "TZ-PAP-100", rating: 4.8, reviews_count: 46, imagem_url: "src/assets/rebrand-products/paprica-picante.png", origem: "Hungria", estoque: 120, ativo: true },
  { id: "salsa-cebola-e-alho", nome: "Salsa, Cebola e Alho", categoria: "Clássicos", descricao: "Combinação clássica de salsa, cebola e alho", preco: 27.9, peso: "100g", sku: "TZ-SAL-100", rating: 4.9, reviews_count: 51, imagem_url: "src/assets/rebrand-products/salsa-cebola-e-alho.png", origem: "Minas Gerais, MG", estoque: 135, ativo: true },
  { id: "temperaflix-bacon", nome: "Temperaflix Bacon", categoria: "Premium", descricao: "Edição especial com aroma de bacon crocante", preco: 31.9, peso: "100g", sku: "TZ-BAC-100", rating: 4.9, reviews_count: 48, imagem_url: "src/assets/rebrand-products/temperaflix-bacon.png", origem: "Belo Horizonte, MG", estoque: 100, ativo: true },
  { id: "temperaflix-ervas-finas", nome: "Temperaflix Ervas Finas", categoria: "Premium", descricao: "Blend premium de ervas selecionadas", preco: 30.9, peso: "100g", sku: "TZ-TEF-100", rating: 4.8, reviews_count: 44, imagem_url: "src/assets/rebrand-products/temperaflix-ervas-finas.png", origem: "Belo Horizonte, MG", estoque: 105, ativo: true },
  { id: "temperaflix-tradicional", nome: "Temperaflix Tradicional", categoria: "Premium", descricao: "Tempero tradicional mineiro com toque gourmet", preco: 29.9, peso: "100g", sku: "TZ-TET-100", rating: 4.9, reviews_count: 53, imagem_url: "src/assets/rebrand-products/temperaflix-tradicional.png", origem: "Belo Horizonte, MG", estoque: 145, ativo: true },
  { id: "tempero-mineiro", nome: "Tempero Mineiro", categoria: "Clássicos", descricao: "Clássico mineiro autêntico", preco: 23.9, peso: "100g", sku: "TZ-TEM-100", rating: 4.8, reviews_count: 49, imagem_url: "src/assets/rebrand-products/tempero-mineiro.png", origem: "Minas Gerais, MG", estoque: 160, ativo: true },
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
  "chimi-churri-picante": "chimichurri-picante",
  "chimi-churri-sem-pimenta": "chimichurri-sem-pimenta",
  "edu-guedes": "tempero-do-edu",
  "salsa-cebola-alho": "salsa-cebola-e-alho",
  "canela-premium-black-30g": "canela-moida",
  "pimenta-do-reino-premium-black-30g": "pimenta-do-reino",
};

/** SKUs comerciais deliberadamente fora das superfícies do novo rebrand. */
export const REBRAND_EXCLUDED_HANDLES = ["cebola-em-po", "du-chefe-com-paprica", "tempero-chefe"] as const;

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
  "chimichurri-sem-pimenta",
  "chimichurri-picante",
  "canela-moida",
  "pimenta-do-reino",
] as const;

const REBRAND_CONFIRMED_SOURCE_SET = new Set<string>(REBRAND_CONFIRMED_SOURCE_HANDLES);

export const HOME_FEATURED_HANDLES = [
  "salsa-cebola-e-alho",
  "paprica-defumada",
  "chimichurri-sem-pimenta",
  "temperaflix-bacon",
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
  const canonicalHandle = canonicalProductHandle(handle);
  return !REBRAND_EXCLUDED_HANDLE_SET.has(canonicalHandle) && REBRAND_CONFIRMED_SOURCE_SET.has(canonicalHandle);
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
