import linhaCompleta from "@/assets/rebrand-products/linha-completa.jpg";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

export const CHEF_BOX = {
  name: "Blend do Chefe",
  image: linhaCompleta,
  tagline: "A sua caixa, o seu blend, o seu gosto",
  description:
    "Aqui você é o chefe da casa. Monte sua própria caixa com 12 potes à sua escolha entre os sabores da casa.",
};

/**
 * Handles candidatos ao builder Chefe Temperanzza.
 * Os 15 sabores MASTER-MAX + Canela Moída e Pimenta do Reino (Premium Black) podem compor a caixa.
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
  "tempero-mineiro",
  "temperaflix-bacon",
  "temperaflix-ervas-finas",
  "temperaflix-tradicional",
  "canela-moida",
  "pimenta-do-reino",
];

export const BUILDER_HANDLES: string[] = BUILDER_CANDIDATE_HANDLES.filter((handle) =>
  isRebrandEligibleHandle(handle),
);

export const BUILDER_TARGET = 12;
