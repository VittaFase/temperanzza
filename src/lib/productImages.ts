/**
 * Registro comercial de handle canônico → imagem local do produto.
 *
 * Somente as 17 imagens oficiais em `assets/rebrand-products` são usadas:
 * 15 potes do rebrand MASTER-MAX + Canela Moída e Pimenta do Reino (Premium Black).
 * Fotos legadas de potes foram removidas do projeto e não há fallback de imagem.
 * Aliases técnicos são normalizados antes da consulta para impedir
 * correspondências acidentais por substring.
 */
import imgAnaMaria from "@/assets/rebrand-products/ana-maria.png";
import imgChimiPicante from "@/assets/rebrand-products/chimi-churri-picante.png";
import imgChimiSemPimenta from "@/assets/rebrand-products/chimi-churri-sem-pimenta.png";
import imgCurcuma from "@/assets/rebrand-products/curcuma.png";
import imgEduGuedes from "@/assets/rebrand-products/edu-guedes.png";
import imgErvasFinas from "@/assets/rebrand-products/ervas-finas.png";
import imgLemonPepper from "@/assets/rebrand-products/lemon-pepper.png";
import imgPapricaDefumada from "@/assets/rebrand-products/paprica-defumada.png";
import imgPapricaDoce from "@/assets/rebrand-products/paprica-doce.png";
import imgPapricaPicante from "@/assets/rebrand-products/paprica-picante.png";
import imgSalsaCebolaAlho from "@/assets/rebrand-products/salsa-cebola-e-alho.png";
import imgFlixBacon from "@/assets/rebrand-products/temperaflix-bacon.png";
import imgFlixErvas from "@/assets/rebrand-products/temperaflix-ervas-finas.png";
import imgFlixTradicional from "@/assets/rebrand-products/temperaflix-tradicional.png";
import imgTemperoMineiro from "@/assets/rebrand-products/tempero-mineiro.png";
import imgCanelaPremiumBlack from "@/assets/rebrand-products/canela-moida-premium-black.png";
import imgPimentaPremiumBlack from "@/assets/rebrand-products/pimenta-do-reino-premium-black.png";

import { canonicalProductHandle } from "@/lib/rebrandCatalog";

/**
 * PRODUCT ASSET LOCK — correspondência exata entre handle e PNG confirmado.
 * Não usar inferência por nome, substring ou posição de arquivo.
 */
const REBRAND_IMAGE_MAP: Record<string, string> = {
  "ana-maria": imgAnaMaria,
  "chimichurri-picante": imgChimiPicante,
  "chimichurri-sem-pimenta": imgChimiSemPimenta,
  curcuma: imgCurcuma,
  "tempero-do-edu": imgEduGuedes,
  "ervas-finas": imgErvasFinas,
  "lemon-pepper": imgLemonPepper,
  "paprica-defumada": imgPapricaDefumada,
  "paprica-doce": imgPapricaDoce,
  "paprica-picante": imgPapricaPicante,
  "salsa-cebola-e-alho": imgSalsaCebolaAlho,
  "temperaflix-bacon": imgFlixBacon,
  "temperaflix-ervas-finas": imgFlixErvas,
  "temperaflix-tradicional": imgFlixTradicional,
  "tempero-mineiro": imgTemperoMineiro,
  "canela-moida": imgCanelaPremiumBlack,
  "pimenta-do-reino": imgPimentaPremiumBlack,
};

export type ProductImageSource = "rebrand" | "legacy" | "shopify" | "missing";

export interface ProductImageResolution {
  url: string | null;
  source: ProductImageSource;
}

/**
 * Resolve a imagem e expõe sua procedência. A procedência é usada pela camada
 * visual para distinguir um PNG oficial do novo rebrand de fallbacks históricos
 * sem alterar preço, estoque, carrinho ou dados recebidos da Shopify.
 */
export function resolveProductImage(handle: string, fallback?: string | null): ProductImageResolution {
  const canonicalHandle = canonicalProductHandle(handle);
  const rebrand = REBRAND_IMAGE_MAP[canonicalHandle];
  if (rebrand) return { url: rebrand, source: "rebrand" };

  // Somente imagens oficiais do rebrand são exibidas. Sem PNG do rebrand = sem imagem
  // (nenhuma foto legada ou da Shopify é usada como substituta).
  void fallback;
  return { url: null, source: "missing" };
}

/**
 * Compatibilidade para consumidores que precisam apenas da URL.
 */
export function getProductImage(handle: string, fallback?: string | null): string | null {
  return resolveProductImage(handle, fallback).url;
}
