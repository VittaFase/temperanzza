import blendChefe from "@/assets/blend-do-chefe.png.asset.json";

export const CHEF_BOX = {
  name: "Blend do Chefe",
  image: blendChefe.url,
  tagline: "A sua caixa, o seu blend, o seu gosto",
  description: "Aqui você é o chefe da casa. Monte sua própria caixa com 12 potes à sua escolha entre os sabores da casa.",
};

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
