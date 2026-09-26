import { canonicalProductHandle } from "@/lib/rebrandCatalog";

/** Nome de exibição de cada pote (15 rebrand + 2 Premium Black). */
const POT_LABELS: Record<string, string> = {
  "ana-maria": "Ana Maria",
  "chimichurri-picante": "Chimi Churri Picante",
  "chimichurri-sem-pimenta": "Chimi Churri Sem Pimenta",
  curcuma: "Cúrcuma",
  "tempero-do-edu": "Edu Guedes",
  "ervas-finas": "Ervas Finas",
  "lemon-pepper": "Lemon Pepper",
  "paprica-defumada": "Páprica Defumada",
  "paprica-doce": "Páprica Doce",
  "paprica-picante": "Páprica Picante",
  "salsa-cebola-e-alho": "Salsa, Cebola e Alho",
  "tempero-mineiro": "Tempero Mineiro",
  "temperaflix-bacon": "Temperaflix Sabor Bacon",
  "temperaflix-ervas-finas": "Temperaflix Ervas Finas",
  "temperaflix-tradicional": "Temperaflix Tradicional",
  "canela-moida": "Canela Moída Premium Black",
  "pimenta-do-reino": "Pimenta do Reino Premium Black",
};

export function potLabel(handle: string): string {
  return POT_LABELS[canonicalProductHandle(handle)] ?? handle;
}
