/**
 * Ofertas estruturadas da casa.
 * Cada oferta é montada só com handles reais do catálogo Shopify.
 * Nenhum produto fictício: se o handle não existir na Shopify, a oferta
 * simplesmente não é exibida.
 */
import { BLEND_DISCOUNT_CODE, BLEND_DISCOUNT_PCT } from "@/lib/blendPricing";
import { BUILDER_HANDLES } from "@/lib/blends";

export type OfferKind = "kit" | "link";

export interface HouseOffer {
  slug: string;
  /** Selo curto acima do título. */
  tag: string;
  title: string;
  /** Uma linha de promessa concreta. */
  promise: string;
  /** O que entra na caixa/sacola. */
  contains: string;
  kind: OfferKind;
  /** Handles reais somados no preço e adicionados à sacola (kind: "kit"). */
  handles: string[];
  /** Potes exibidos na cena do card (usado quando kind: "link"). */
  sceneHandles?: string[];
  /** Selo de contagem exibido no canto do carrossel. */
  sceneLabel?: string;
  /** Rota de destino para ofertas do tipo "link". */
  to?: "/sua-caixa";
  cta: string;
  /** Cor de acento do bloco (token da marca). */
  accentClass: string;
  /** Nota de reasseguramento no pé do card. */
  note?: string;
}

export const HOUSE_OFFERS: HouseOffer[] = [
  {
    slug: "season-pass-temperaflix",
    tag: "Edição limitada",
    title: "Season Pass Temperaflix",
    promise: "Os três episódios no mesmo sofá — sem escolher favorito.",
    contains: "3 snakers: Tradicional, Ervas Finas e Bacon",
    kind: "kit",
    handles: [
      "temperaflix-tradicional",
      "temperaflix-ervas-finas",
      "temperaflix-bacon",
    ],
    cta: "Assinar o combo",
    sceneLabel: "3 episódios da temporada",
    accentClass: "text-brand-gold",
    note: "Frete único para os três · embalado lote a lote",
  },
  {
    slug: "caixa-do-chefe",
    tag: `Cupom ${BLEND_DISCOUNT_CODE}`,
    title: "Blend do Chefe · Sua caixa",
    promise: "Monte a caixa com 12 potes e receba o desconto de chefe da casa de 10%",
    contains: `${BUILDER_HANDLES.length} sabores disponíveis na Casa Temperanzza · repita os favoritos quantas vezes quiser`,
    kind: "link",
    handles: [],
    sceneHandles: BUILDER_HANDLES,
    to: "/sua-caixa",
    cta: "Montar sua caixa",
    sceneLabel: `${BUILDER_HANDLES.length} sabores da casa`,
    accentClass: "text-accent",
    note: `Desconto de ${BLEND_DISCOUNT_PCT}% válido a partir de 12 potes`,
  },
];
