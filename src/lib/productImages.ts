/**
 * Registro comercial de handle canônico → imagem local do produto.
 *
 * Os PNGs confirmados do rebrand em `assets/rebrand-products` têm prioridade.
 * Shopify continua sendo a fonte comercial e os assets legados permanecem como
 * fallback para SKUs que ainda não possuem um PNG do rebrand identificado.
 * Aliases técnicos são normalizados antes da consulta para impedir
 * correspondências acidentais por substring.
 */
import rebrandAnaMaria from "@/assets/rebrand-products/ANA MARIA - 1.png";
import rebrandChimiPicante from "@/assets/rebrand-products/CHIMI CHURRI PICANTE - 1.png";
import rebrandChimiSemPimenta from "@/assets/rebrand-products/CHIMI CHURRI SEM PIMENTA - 1.png";
import rebrandCurcuma from "@/assets/rebrand-products/CÚRCUMA - 1.png";
import rebrandDuChefe from "@/assets/rebrand-products/DU CHEFE COM PÁPRICA - 1.png";
import rebrandEdu from "@/assets/rebrand-products/EDU GUEDES - TEMPERO DO EDU - 1.png";
import rebrandErvasFinas from "@/assets/rebrand-products/ERVAS FINAS - 1.png";
import rebrandLemonPepper from "@/assets/rebrand-products/LEMON PEPPER - 1.png";
import rebrandPapricaDefumada from "@/assets/rebrand-products/PÁPRICA DEFUMADA - 1.png";
import rebrandPapricaDoce from "@/assets/rebrand-products/PÁPRICA DOCE - 1.png";
import rebrandPapricaPicante from "@/assets/rebrand-products/PÁPRICA PICANTE - 1.png";
import rebrandSalsaCebolaAlho from "@/assets/rebrand-products/SALSA, CEBOLA E ALHO - 1.png";
import rebrandFlixBacon from "@/assets/rebrand-products/TEMPERAFLIX BACON - 1.png";
import rebrandFlixTradicional from "@/assets/rebrand-products/Untitled design - 1.png";

import canela from "@/assets/canela-moida.png.asset.json";
import pimenta from "@/assets/pimenta-do-reino.png.asset.json";
import flixErvas from "@/assets/temperaflix-ervas-finas.png.asset.json";
import mineiro from "@/assets/tempero-mineiro.png.asset.json";
import { canonicalProductHandle } from "@/lib/rebrandCatalog";

/**
 * PRODUCT ASSET LOCK — correspondência exata entre handle e PNG confirmado.
 * Não usar inferência por nome, substring ou posição de arquivo.
 */
const REBRAND_IMAGE_MAP: Record<string, string> = {
  "ana-maria": rebrandAnaMaria,
  "chimichurri-picante": rebrandChimiPicante,
  "chimichurri-sem-pimenta": rebrandChimiSemPimenta,
  curcuma: rebrandCurcuma,
  "du-chefe-com-paprica": rebrandDuChefe,
  "ervas-finas": rebrandErvasFinas,
  "lemon-pepper": rebrandLemonPepper,
  "paprica-defumada": rebrandPapricaDefumada,
  "paprica-doce": rebrandPapricaDoce,
  "paprica-picante": rebrandPapricaPicante,
  "salsa-cebola-e-alho": rebrandSalsaCebolaAlho,
  "temperaflix-bacon": rebrandFlixBacon,
  "temperaflix-tradicional": rebrandFlixTradicional,
  "tempero-do-edu": rebrandEdu,
};

/** Assets legados mantidos somente para SKUs ainda sem rebrand identificado. */
const LEGACY_IMAGE_MAP: Record<string, string> = {
  "canela-moida": canela.url,
  "pimenta-do-reino": pimenta.url,
  "temperaflix-ervas-finas": flixErvas.url,
  "tempero-mineiro": mineiro.url,
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

  const legacy = LEGACY_IMAGE_MAP[canonicalHandle];
  if (legacy) return { url: legacy, source: "legacy" };

  if (fallback) return { url: fallback, source: "shopify" };
  return { url: null, source: "missing" };
}

/**
 * Compatibilidade para consumidores que precisam apenas da URL.
 */
export function getProductImage(handle: string, fallback?: string | null): string | null {
  return resolveProductImage(handle, fallback).url;
}
