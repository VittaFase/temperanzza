/**
 * Compatibilidade dietética por condimento Temperanzza.
 */

import type { DietKey } from "./diets";

export type DietVerdict = "ok" | "moderate" | "no";

export interface DietVerdictEntry {
  verdict: DietVerdict;
  note: string;
}

export interface ProductDiet {
  key: string;
  verdicts: Record<DietKey, DietVerdictEntry>;
  /** perfil sensorial — agrupa receitas na Cozinha */
  profile: "defumado" | "ervas" | "casa" | "puras" | "citrico-picante";
}

const PROFILES = {
  defumado: "defumado" as const,
  ervas: "ervas" as const,
  casa: "casa" as const,
  puras: "puras" as const,
  citrico: "citrico-picante" as const,
};

const vOk = (note: string): DietVerdictEntry => ({ verdict: "ok", note });
const vModerate = (note: string): DietVerdictEntry => ({ verdict: "moderate", note });
const vNo = (note: string): DietVerdictEntry => ({ verdict: "no", note });

const vVegOk = vOk("Condimento 100% vegetal. Ideal para dietas vegetarianas e plant-based.");

export const PRODUCT_DIETS: ProductDiet[] = [
  {
    key: "temperaflix-bacon",
    profile: PROFILES.defumado,
    verdicts: {
      keto: vModerate("Contém amido de milho na base. Use pitadas pequenas."),
      lowcarb: vOk("Teor de carboidratos baixo por porção."),
      "carnivora-flex": vNo("Contém ingredientes vegetais que não se alinham com a carnívora."),
      selva: vNo("Base processada. Incompatível com a Dieta da Selva."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "ana-maria",
    profile: PROFILES.casa,
    verdicts: {
      keto: vNo("Contém açúcar e amido na formulação."),
      lowcarb: vOk("Cabe no low carb em pequenas quantidades."),
      "carnivora-flex": vNo("Contém óleo de soja e ingredientes vegetais processados."),
      selva: vNo("Contém açúcar e aditivos industriais."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "lemon-pepper",
    profile: PROFILES.citrico,
    verdicts: {
      keto: vOk("Contém traços mínimos de óleo. Não impacta a cetose."),
      lowcarb: vOk("Perfeito para ovos, peixes e frango."),
      "carnivora-flex": vOk("Permitido no protocolo flexível."),
      selva: vOk("Temperança mineira: cítrico e picante naturais."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "paprica-doce",
    profile: PROFILES.defumado,
    verdicts: {
      keto: vOk("Especiaria pura, zero carboidratos líquidos."),
      lowcarb: vOk("Uso livre — colore e adoça naturalmente."),
      "carnivora-flex": vOk("Excelente para carnes brancas e vermelhas."),
      selva: vOk("Especiaria pura da terra. Essência preservada."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "paprica-picante",
    profile: PROFILES.citrico,
    verdicts: {
      keto: vOk("Pura, sem aditivos — encaixa em qualquer refeição."),
      lowcarb: vOk("Toque de calor sem carboidratos."),
      "carnivora-flex": vOk("Permitida — pó de pimentão desidratado."),
      selva: vOk("Pureza picante da terra."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "paprica-defumada",
    profile: PROFILES.defumado,
    verdicts: {
      keto: vOk("Especiaria pura defumada. Zero carga glicêmica."),
      lowcarb: vOk("Traz o gosto de churrasco sem carboidratos."),
      "carnivora-flex": vOk("Ideal para carnes bovinas e suínas."),
      selva: vOk("O sabor do fogo sem artifícios químicos."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "chimi-churri-sem-pimenta",
    profile: PROFILES.ervas,
    verdicts: {
      keto: vOk("Base vegetal. Impacto glicêmico irrelevante."),
      lowcarb: vOk("Rico em polifenóis e ervas."),
      "carnivora-flex": vOk("Aceito no protocolo flexível como pasta de ervas."),
      selva: vOk("Mix herbal sem aditivos."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "chimi-churri-picante",
    profile: PROFILES.citrico,
    verdicts: {
      keto: vOk("Ervas e pimenta — dentro do escopo cetogênico."),
      lowcarb: vOk("Ideal para carnes grelhadas."),
      "carnivora-flex": vOk("Permitido no protocolo flexível."),
      selva: vOk("O vigor das ervas e pimentas naturais."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "salsa-cebola-e-alho",
    profile: PROFILES.ervas,
    verdicts: {
      keto: vOk("Ervas e vegetais desidratados puros. Uso livre."),
      lowcarb: vOk("Coringa para refogados, peixes e ovos."),
      "carnivora-flex": vOk("Aceito como concentrado de sabor."),
      selva: vOk("Trindade da cozinha limpa: salsa, cebola e alho."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "ervas-finas",
    profile: PROFILES.ervas,
    verdicts: {
      keto: vOk("Mix puro de ervas — zero carboidratos líquidos."),
      lowcarb: vOk("Traz frescor a ovos, queijos e carnes brancas."),
      "carnivora-flex": vOk("Permitido no protocolo flexível."),
      selva: vOk("Herança herbal pura para pratos limpos."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "tempero-mineiro",
    profile: PROFILES.casa,
    verdicts: {
      keto: vOk("Base de sal e especiarias — sem açúcares ou amidos."),
      lowcarb: vOk("Gosto de comida caseira sem carga glicêmica."),
      "carnivora-flex": vOk("Permitido — mix sem óleos processados."),
      selva: vOk("A essência mineira em sua forma mais pura."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "tempero-do-edu",
    profile: PROFILES.casa,
    verdicts: {
      keto: vOk("Mix vegetal — dentro do escopo cetogênico."),
      lowcarb: vOk("Ótimo em patês, ovos e carnes."),
      "carnivora-flex": vOk("Permitido no protocolo flexível."),
      selva: vOk("Equilíbrio vegetal para paladares ancestrais."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "curcuma",
    profile: PROFILES.puras,
    verdicts: {
      keto: vOk("Raiz desidratada pura, anti-inflamatório natural."),
      lowcarb: vOk("Colore e perfuma sem impacto glicêmico."),
      "carnivora-flex": vOk("Especiaria pura no protocolo flexível."),
      selva: vOk("Raiz ancestral direto da natureza."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "temperaflix-tradicional",
    profile: PROFILES.casa,
    verdicts: {
      keto: vModerate("Linha para snacks: possui amidos. Use pouco."),
      lowcarb: vOk("Cabe no low carb — feito para snacks."),
      "carnivora-flex": vNo("Base para aderência inclui vegetais processados."),
      selva: vNo("Contém aditivos de aderência."),
      vegetariana: vVegOk,
    },
  },
  {
    key: "temperaflix-ervas-finas",
    profile: PROFILES.ervas,
    verdicts: {
      keto: vModerate("Linha para snacks: possui amidos. Use pouco."),
      lowcarb: vOk("Cabe no low carb — feito para snacks."),
      "carnivora-flex": vNo("Base para aderência inclui vegetais processados."),
      selva: vNo("Contém aditivos de aderência."),
      vegetariana: vVegOk,
    },
  },
];

/** Aliases handle Shopify → key canônico deste módulo. */
const HANDLE_ALIASES: Record<string, string> = {
  "bacon-em-po": "temperaflix-bacon",
  "temperaflix-bacon": "temperaflix-bacon",
  "ana-maria": "ana-maria",
  "lemon-pepper": "lemon-pepper",
  "paprica-doce": "paprica-doce",
  "paprica-picante": "paprica-picante",
  "paprica-defumada": "paprica-defumada",
  "chimi-churri-sem-pimenta": "chimi-churri-sem-pimenta",
  "chimichurri-sem-pimenta": "chimi-churri-sem-pimenta",
  "chimi-churri-picante": "chimi-churri-picante",
  "chimichurri-picante": "chimi-churri-picante",
  "salsa-cebola-e-alho": "salsa-cebola-e-alho",
  "ervas-finas": "ervas-finas",
  "tempero-mineiro": "tempero-mineiro",
  "tempero-do-edu": "tempero-do-edu",
  "edu-guedes": "tempero-do-edu",
  curcuma: "curcuma",
  "temperaflix-ervas-finas": "temperaflix-ervas-finas",
  "temperaflix-tradicional": "temperaflix-tradicional",
};

const BY_KEY = new Map(PRODUCT_DIETS.map((p) => [p.key, p]));

export function getProductDiet(handle: string): ProductDiet | null {
  const direct = HANDLE_ALIASES[handle];
  if (direct) return BY_KEY.get(direct) ?? null;
  for (const [alias, key] of Object.entries(HANDLE_ALIASES)) {
    if (handle.includes(alias) || alias.includes(handle)) return BY_KEY.get(key) ?? null;
  }
  return null;
}
