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
import blendChefe from "@/assets/blend-do-chefe.png.asset.json";

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
      "tempero-mineiro","tempero-mineiro","tempero-mineiro","tempero-mineiro",
      "curcuma","curcuma","curcuma","curcuma",
      "tempero-chefe","tempero-chefe","tempero-chefe","tempero-chefe",
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
      "chimichurri-picante","chimichurri-picante","chimichurri-picante","chimichurri-picante",
      "paprica-picante","paprica-picante","paprica-picante","paprica-picante",
      "salsa-cebola-e-alho","salsa-cebola-e-alho","salsa-cebola-e-alho","salsa-cebola-e-alho",
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
      "edu-guedes","edu-guedes","edu-guedes","edu-guedes",
      "chimichurri-sem-pimenta","chimichurri-sem-pimenta","chimichurri-sem-pimenta","chimichurri-sem-pimenta",
      "ervas-finas","ervas-finas","ervas-finas","ervas-finas",
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
      "lemon-pepper","lemon-pepper","lemon-pepper","lemon-pepper",
      "ervas-finas","ervas-finas","ervas-finas","ervas-finas",
      "paprica-doce","paprica-doce","paprica-doce","paprica-doce",
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
      "paprica-defumada","paprica-defumada","paprica-defumada","paprica-defumada",
      "cebola-em-po","cebola-em-po","cebola-em-po","cebola-em-po",
      "ana-maria","ana-maria","ana-maria","ana-maria",
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
      "temperaflix-tradicional","temperaflix-tradicional","temperaflix-tradicional","temperaflix-tradicional",
      "temperaflix-ervas-finas","temperaflix-ervas-finas","temperaflix-ervas-finas","temperaflix-ervas-finas",
      "temperaflix-bacon","temperaflix-bacon","temperaflix-bacon","temperaflix-bacon",
    ],
  },
  {
    slug: "chefe",
    name: "Chefe Temperanzza",
    display: "MEU BLEND",
    tagline: "A sua caixa, o seu Blend, o seu gosto",
    description:
      "Monte seu proprio blend para chamar de seu com 12 potes à sua escolha entre os sabores da casa.",
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

/** Handles que entram no builder Chefe Temperanzza (Core, exceto Temperaflix, Canela e Pimenta-do-reino — que ficam só no catálogo). */
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
];

export const BUILDER_TARGET = 12;
