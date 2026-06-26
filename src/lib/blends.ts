/**
 * Configuração estática dos Blends Temperanzza.
 * Preços e SKUs na Shopify serão adicionados depois — por enquanto
 * cada blend tem `shopifyHandle: null` e o CTA cai no fluxo "Reservar".
 *
 * Cada blend é uma "caixa display" com 12 potes pré-selecionados.
 * O blend "chefe" é o builder customizado (12 sabores à escolha + receita).
 */
import blendBrasil from "@/assets/blend-brasil.jpg.asset.json";
import blendChurrasco from "@/assets/blend-churrasco.jpg.asset.json";
import blendEssenza from "@/assets/blend-essenza.jpg.asset.json";
import blendGourmet from "@/assets/blend-gourmet.jpg.asset.json";
import blendSupremo from "@/assets/blend-supremo.jpg.asset.json";
import blendTemperaflix from "@/assets/blend-temperaflix.jpg.asset.json";
import blendChefe from "@/assets/blend-chefe-temperanzza.jpg.asset.json";

export type BlendSlug =
  | "brasil"
  | "churrasco"
  | "essenza"
  | "gourmet"
  | "supremo"
  | "temperaflix"
  | "chefe";

export interface Blend {
  slug: BlendSlug;
  name: string;
  display: string; // como aparece no rótulo da caixa
  tagline: string;
  description: string;
  pairing: string;
  /** Cor de etiqueta da caixa display (referência visual). */
  accent: string; // hex
  /** Foto oficial do blend / caixa. */
  image: string;
  /** Handles Shopify (12) que compõem o display. Vazio para o builder. */
  spiceHandles: string[];
  /** Handle Shopify deste blend como produto único — preenchido depois. */
  shopifyHandle: string | null;
  /** True para o builder Chefe Temperanzza. */
  isBuilder?: boolean;
}

export const BLENDS: Blend[] = [
  {
    slug: "brasil",
    name: "Blend Brasil",
    display: "BRASIL",
    tagline: "O sabor do nosso quintal",
    description:
      "Um recorte do tempero brasileiro: tradição mineira, perfume de roça e o calor das nossas cozinhas. 12 potes selecionados para quem cozinha como em casa.",
    pairing:
      "Arroz, feijão, frango caipira, carne de panela, ovos mexidos e o tempero de cada dia.",
    accent: "#F4C430",
    image: blendBrasil.url,
    shopifyHandle: null,
    spiceHandles: [
      "tempero-mineiro",
      "edu-guedes",
      "ana-maria",
      "tempero-chefe",
      "salsa-cebola-e-alho",
      "cebola-em-po",
      "ervas-finas",
      "curcuma",
      "paprica-doce",
      "paprica-defumada",
      "lemon-pepper",
      "pimenta-do-reino-premium-black-30g",
    ],
  },
  {
    slug: "churrasco",
    name: "Blend Churrasco",
    display: "CHURRASCO",
    tagline: "Para quem manda na brasa",
    description:
      "Tudo o que a churrasqueira pede em uma caixa só. Defumados, picantes e ervas que entendem de carne, fogo e cerveja gelada.",
    pairing:
      "Picanha, costela, linguiça, frango assado, legumes na brasa e vinagrete.",
    accent: "#E63946",
    image: blendChurrasco.url,
    shopifyHandle: null,
    spiceHandles: [
      "chimichurri-picante",
      "chimichurri-sem-pimenta",
      "paprica-defumada",
      "paprica-picante",
      "paprica-doce",
      "salsa-cebola-e-alho",
      "tempero-chefe",
      "tempero-mineiro",
      "cebola-em-po",
      "ervas-finas",
      "pimenta-do-reino-premium-black-30g",
      "lemon-pepper",
    ],
  },
  {
    slug: "essenza",
    name: "Blend Essenza",
    display: "ESSENZA",
    tagline: "A alma verde da Temperanzza",
    description:
      "Curadoria das ervas e folhas frescas da casa. Aromático, herbal, leve — para pratos que falam por si.",
    pairing:
      "Massas, peixes, saladas, molhos, vegetais grelhados e omeletes.",
    accent: "#1E90FF",
    image: blendEssenza.url,
    shopifyHandle: null,
    spiceHandles: [
      "ervas-finas",
      "chimichurri-sem-pimenta",
      "salsa-cebola-e-alho",
      "tempero-mineiro",
      "tempero-chefe",
      "edu-guedes",
      "lemon-pepper",
      "cebola-em-po",
      "curcuma",
      "paprica-doce",
      "ana-maria",
      "pimenta-do-reino-premium-black-30g",
    ],
  },
  {
    slug: "gourmet",
    name: "Blend Gourmet",
    display: "GOURMET",
    tagline: "Pratos autorais a cada gesto",
    description:
      "A seleção para quem cozinha por prazer. Combinações sofisticadas, equilíbrio entre cítrico, ervas e defumado.",
    pairing:
      "Risotos, peixes nobres, carnes especiais, finger food e harmonização com vinho.",
    accent: "#2ECC71",
    image: blendGourmet.url,
    shopifyHandle: null,
    spiceHandles: [
      "lemon-pepper",
      "ervas-finas",
      "paprica-doce",
      "paprica-defumada",
      "chimichurri-sem-pimenta",
      "tempero-chefe",
      "curcuma",
      "salsa-cebola-e-alho",
      "ana-maria",
      "edu-guedes",
      "pimenta-do-reino-premium-black-30g",
      "canela-premium-black-30g",
    ],
  },
  {
    slug: "supremo",
    name: "Blend Supremo",
    display: "SUPREMO",
    tagline: "A caixa máxima da casa",
    description:
      "Nossa seleção mais completa: o melhor de Core e Premium Black em uma única caixa. Para quem quer ter tudo à mão.",
    pairing:
      "Toda cozinha — do dia a dia ao prato de domingo, do churrasco à pâtisserie.",
    accent: "#C71585",
    image: blendSupremo.url,
    shopifyHandle: null,
    spiceHandles: [
      "ana-maria",
      "tempero-mineiro",
      "edu-guedes",
      "tempero-chefe",
      "ervas-finas",
      "chimichurri-picante",
      "salsa-cebola-e-alho",
      "cebola-em-po",
      "paprica-defumada",
      "paprica-doce",
      "pimenta-do-reino-premium-black-30g",
      "canela-premium-black-30g",
    ],
  },
  {
    slug: "temperaflix",
    name: "Blend Temperaflix",
    display: "TEMPERAFLIX",
    tagline: "O sabor oficial dos momentos de tela",
    description:
      "A linha Temperaflix em caixa display. Tradicional, Ervas Finas e Bacon multiplicados em uma caixa pronta para a hora do sofá, do cinema em casa e da maratona com a família.",
    pairing:
      "Pipoca, batata, amendoim, snacks, torresmo e tudo o que pede shaker em punho.",
    accent: "#FFD23F",
    image: blendTemperaflix.url,
    shopifyHandle: null,
    spiceHandles: [
      "temperaflix-tradicional",
      "temperaflix-tradicional",
      "temperaflix-tradicional",
      "temperaflix-tradicional",
      "temperaflix-ervas-finas",
      "temperaflix-ervas-finas",
      "temperaflix-ervas-finas",
      "temperaflix-ervas-finas",
      "temperaflix-bacon",
      "temperaflix-bacon",
      "temperaflix-bacon",
      "temperaflix-bacon",
    ],
  },
  {
    slug: "chefe",
    name: "Chefe Temperanzza",
    display: "MEU BLEND",
    tagline: "A sua caixa, com a sua receita, com o seu nome",
    description:
      "Monte sua própria caixa Temperanzza com 12 potes à escolha entre os sabores da casa. Dê um nome à sua criação, escreva a receita que ela inspira e receba o blend personalizado para chamar de seu.",
    pairing:
      "O que sua cozinha pedir. A caixa Chefe é tão única quanto quem a monta.",
    accent: "#111111",
    image: blendChefe.url,
    shopifyHandle: null,
    isBuilder: true,
    spiceHandles: [],
  },
];

export const BLEND_BY_SLUG: Record<BlendSlug, Blend> = BLENDS.reduce(
  (acc, b) => {
    acc[b.slug] = b;
    return acc;
  },
  {} as Record<BlendSlug, Blend>,
);

/** Handles que entram no builder Chefe Temperanzza (todos os Core + Premium Black, exceto Temperaflix). */
export const BUILDER_HANDLES: string[] = [
  "ana-maria",
  "cebola-em-po",
  "chimichurri-picante",
  "chimichurri-sem-pimenta",
  "curcuma",
  "edu-guedes",
  "ervas-finas",
  "lemon-pepper",
  "paprica-defumada",
  "paprica-doce",
  "paprica-picante",
  "salsa-cebola-e-alho",
  "tempero-chefe",
  "tempero-mineiro",
  "pimenta-do-reino-premium-black-30g",
  "canela-premium-black-30g",
];

export const BUILDER_TARGET = 12;
