import blendChefe from "@/assets/blend-do-chefe.png.asset.json";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

export const CHEF_BOX = {
  name: "Blend do Chefe",
  image: blendChefe.url,
  tagline: "A sua caixa, o seu blend, o seu gosto",
  description: "Aqui você é o chefe da casa. Monte sua própria caixa com 12 potes à sua escolha entre os sabores da casa.",
};

/**
 * Handles candidatos ao builder Chefe Temperanzza.
 * Core: exceto Temperaflix, Canela e Pimenta-do-reino, que ficam só no catálogo.
 * A governança central do rebrand é aplicada aqui para impedir que um SKU excluído
 * reapareça no builder, nas ofertas ou nos carrosséis derivados desta lista.
 */
const BUILDER_CANDIDATE_HANDLES: string[] = [
  "ana-maria",
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

export const BUILDER_HANDLES: string[] = BUILDER_CANDIDATE_HANDLES.filter(
  (handle) => isRebrandEligibleHandle(handle),
);

export const BUILDER_TARGET = 12;
