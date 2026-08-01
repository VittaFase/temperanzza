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
  to?: "/blends";
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
    contains: "3 shakers: Tradicional, Ervas Finas e Bacon",
    kind: "kit",
    handles: [
      "temperaflix-tradicional",
      "temperaflix-ervas-finas",
      "temperaflix-bacon",
    ],
    cta: "Assinar o combo",
    accentClass: "text-brand-gold",
    note: "Frete único para os três · embalado lote a lote",
  },
  {
    slug: "duo-premium-black",
    tag: "Linha Premium Black",
    title: "Duo Premium Black",
    promise: "Pimenta e canela na moagem mais fina da casa, lado a lado.",
    contains: "2 potes de 30g: Pimenta do Reino e Canela",
    kind: "kit",
    handles: [
      "pimenta-do-reino-premium-black-30g",
      "canela-premium-black-30g",
    ],
    cta: "Levar o duo",
    accentClass: "text-brand-silver",
    note: "Moagem fina · pote a pote da linha Premium Black",
  },
  {
    slug: "caixa-do-chefe",
    tag: `Cupom ${BLEND_DISCOUNT_CODE}`,
    title: "Caixa do Chefe · 12 potes",
    promise: `Você escolhe 12 potes entre os ${BUILDER_HANDLES.length} sabores da casa — o cupom tira ${BLEND_DISCOUNT_PCT}% no fechamento.`,
    contains: `${BUILDER_HANDLES.length} sabores disponíveis na Casa Temperanzza · repita os favoritos quantas vezes quiser`,
    kind: "link",
    handles: [],
    sceneHandles: BUILDER_HANDLES,
    to: "/blends",
    cta: "Montar meu blend",
    accentClass: "text-accent",
    note: `Desconto de ${BLEND_DISCOUNT_PCT}% válido a partir de 12 potes`,
  },
];
