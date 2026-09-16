/**
 * PRODUCT ASSET LOCK — NOVO REBRAND ONLY.
 *
 * A experiência pública do Rebrand Temperanzza só pode renderizar imagens
 * oficiais do novo rebrand. Assets históricos, imagens legadas e imagens vindas
 * da Shopify não são fallback visual válido nesta camada.
 *
 * Se um handle elegível ainda não possuir PNG oficial integrado, a resolução
 * retorna `missing`. Isso é intencional: ausência de master rebrand deve ser
 * detectada pelo QA, nunca mascarada por arte anterior.
 */
import rebrandAnaMaria from "@/assets/rebrand-products/ana-maria.png";
import rebrandChimiPicante from "@/assets/rebrand-products/chimichurri-picante.png";
import rebrandChimiSemPimenta from "@/assets/rebrand-products/chimichurri-sem-pimenta.png";
import rebrandCurcuma from "@/assets/rebrand-products/curcuma.png";
import rebrandEdu from "@/assets/rebrand-products/tempero-do-edu.png";
import rebrandErvasFinas from "@/assets/rebrand-products/ervas-finas.png";
import rebrandLemonPepper from "@/assets/rebrand-products/lemon-pepper.png";
import rebrandPapricaDefumada from "@/assets/rebrand-products/paprica-defumada.png";
import rebrandPapricaDoce from "@/assets/rebrand-products/paprica-doce.png";
import rebrandPapricaPicante from "@/assets/rebrand-products/paprica-picante.png";
import rebrandSalsaCebolaAlho from "@/assets/rebrand-products/salsa-cebola-e-alho.png";
import rebrandFlixBacon from "@/assets/rebrand-products/temperaflix-bacon.png";
import rebrandFlixTradicional from "@/assets/rebrand-products/temperaflix-tradicional.png";
import rebrandFlixErvasFinas from "@/assets/rebrand-products/temperaflix-ervas-finas.png";
import { canonicalProductHandle } from "@/lib/rebrandCatalog";

/** Correspondência exata handle canônico → PNG oficial já integrado. */
const REBRAND_IMAGE_MAP: Record<string, string> = {
  "ana-maria": rebrandAnaMaria,
  "chimichurri-picante": rebrandChimiPicante,
  "chimichurri-sem-pimenta": rebrandChimiSemPimenta,
  curcuma: rebrandCurcuma,
  "ervas-finas": rebrandErvasFinas,
  "lemon-pepper": rebrandLemonPepper,
  "paprica-defumada": rebrandPapricaDefumada,
  "paprica-doce": rebrandPapricaDoce,
  "paprica-picante": rebrandPapricaPicante,
  "salsa-cebola-e-alho": rebrandSalsaCebolaAlho,
  "temperaflix-bacon": rebrandFlixBacon,
  "temperaflix-ervas-finas": rebrandFlixErvasFinas,
  "temperaflix-tradicional": rebrandFlixTradicional,
  "tempero-do-edu": rebrandEdu,
};

export type ProductImageSource = "rebrand" | "missing";

export interface ProductImageResolution {
  url: string | null;
  source: ProductImageSource;
}

/**
 * Resolve exclusivamente o master do novo rebrand.
 * O segundo argumento é mantido apenas por compatibilidade de assinatura com
 * consumidores existentes; ele é deliberadamente ignorado para impedir retorno
 * acidental a imagens Shopify/legadas.
 */
export function resolveProductImage(handle: string, _fallback?: string | null): ProductImageResolution {
  const canonicalHandle = canonicalProductHandle(handle);
  const rebrand = REBRAND_IMAGE_MAP[canonicalHandle];
  if (rebrand) return { url: rebrand, source: "rebrand" };
  return { url: null, source: "missing" };
}

export function getProductImage(handle: string, fallback?: string | null): string | null {
  return resolveProductImage(handle, fallback).url;
}
