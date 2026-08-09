/**
 * Compatibilidade dietética por condimento Temperanzza.
 *
 * Fonte: guia técnico da casa. Cada entrada explica o "porquê" — a linguagem
 * é sempre didática, nunca prescritiva. As entradas são indexadas por um
 * "key" canônico; a resolução por handle Shopify é tolerante (aliases,
 * substring), porque o mesmo tempero aparece com nomes diferentes na loja.
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


export const PRODUCT_DIETS: ProductDiet[] = [
  {
    key: "temperaflix-bacon",
    profile: PROFILES.defumado,
    verdicts: {
      keto: {
        verdict: "moderate",
        note: "Contém amido de milho na base. Em porções pequenas para saborizar (uma pitada) mantém-se dentro da cetose; evite polvilhar em quantidade.",
      },
      lowcarb: {
        verdict: "ok",
        note: "O teor de carboidratos por porção é baixo. Ideal para dar profundidade defumada a ovos, carnes e patês.",
      },
      "carnivora-flex": {
        verdict: "no",
        note: "Contém amido, urucum e dióxido de silício — ingredientes vegetais que não se alinham com a filosofia carnívora, mesmo na versão flexível.",
      },
      selva: {
        verdict: "no",
        note: "Base de snacker processada. Incompatível com a Dieta da Selva, que prioriza o estado bruto da natureza.",
      },
    },
  },
  {
    key: "ana-maria",
    profile: PROFILES.casa,
    verdicts: {
      keto: {
        verdict: "no",
        note: "Contém açúcar e amido de milho na formulação — incompatível com a cetose sustentada.",
      },
      lowcarb: {
        verdict: "ok",
        note: "Em pequenas quantidades por porção cabe no low carb. Bom para caldos, sopas e cozidos de frango.",
      },
      "carnivora-flex": {
        verdict: "no",
        note: "Contém óleo de soja e ingredientes vegetais processados — fora do escopo carnívoro flexível.",
      },
      selva: {
        verdict: "no",
        note: "Contém açúcar e aditivos industriais, violando a regra de pureza da Dieta da Selva.",
      },
    },
  },
  {
    key: "lemon-pepper",
    profile: PROFILES.citrico,
    verdicts: {
      keto: { verdict: "ok", note: "Contém traços de óleo de soja em quantidade mínima. Uso normal não impacta a cetose." },
      lowcarb: { verdict: "ok", note: "Perfeito para ovos, peixes e frango — cítrico e picante em dose controlada." },
      "carnivora-flex": { verdict: "ok", note: "Permitido no protocolo flexível pelo teor mínimo de óleo vegetal." },
      selva: { verdict: "ok", note: "Temperança mineira: cítrico e picante naturais." },
    },
  },
  {
    key: "paprica-doce",
    profile: PROFILES.defumado,
    verdicts: {
      keto: { verdict: "ok", note: "Especiaria pura, praticamente zero carboidratos líquidos por porção." },
      lowcarb: { verdict: "ok", note: "Uso livre — colore e adoça naturalmente sem carga glicêmica relevante." },
      "carnivora-flex": { verdict: "ok", note: "Excelente para carnes brancas e vermelhas no protocolo flexível." },
      selva: { verdict: "ok", note: "Especiaria pura da terra. Essência preservada." },
    },
  },
  {
    key: "paprica-picante",
    profile: PROFILES.citrico,
    verdicts: {
      keto: { verdict: "ok", note: "Pura, sem aditivos — encaixa em qualquer refeição cetogênica." },
      lowcarb: { verdict: "ok", note: "Toque de calor sem carboidratos. Ótima em carnes assadas e ovos." },
      "carnivora-flex": { verdict: "ok", note: "Permitida — pó de pimentão desidratado, sem óleos ou açúcares." },
      selva: { verdict: "ok", note: "Pureza picante da terra." },
    },
  },
  {
    key: "paprica-defumada",
    profile: PROFILES.defumado,
    verdicts: {
      keto: { verdict: "ok", note: "Especiaria pura defumada. Sabor complexo, zero carga glicêmica." },
      lowcarb: { verdict: "ok", note: "Traz o gosto de churrasco sem carboidratos — coringa da despensa low carb." },
      "carnivora-flex": { verdict: "ok", note: "Ideal para carnes bovinas e suínas no protocolo flexível." },
      selva: { verdict: "ok", note: "O sabor do fogo sem artifícios químicos. Ancestral." },
    },
  },
  {
    key: "du-chefe-com-paprica",
    profile: PROFILES.casa,
    verdicts: {
      keto: { verdict: "ok", note: "Mix de ervas e especiarias sem aditivos restritivos." },
      lowcarb: { verdict: "ok", note: "Uso livre em carnes, aves e legumes de baixo carboidrato." },
      "carnivora-flex": { verdict: "ok", note: "Sem amidos ou açúcares — permitido no protocolo flexível." },
      selva: { verdict: "ok", note: "Curadoria do chef com ingredientes limpos." },
    },
  },
  {
    key: "chimi-churri-sem-pimenta",
    profile: PROFILES.ervas,
    verdicts: {
      keto: { verdict: "ok", note: "Base vegetal com pouco óleo de soja. Impacto glicêmico irrelevante." },
      lowcarb: { verdict: "ok", note: "Rico em polifenóis e ervas — combina com qualquer corte." },
      "carnivora-flex": { verdict: "ok", note: "Aceito no protocolo flexível como pasta de ervas." },
      selva: { verdict: "ok", note: "Mix herbal sem aditivos." },
    },
  },
  {
    key: "chimi-churri-picante",
    profile: PROFILES.citrico,
    verdicts: {
      keto: { verdict: "ok", note: "Ervas e pimenta com traços de óleo vegetal — dentro do escopo cetogênico." },
      lowcarb: { verdict: "ok", note: "Ideal para carnes grelhadas — dá calor e frescor ao mesmo tempo." },
      "carnivora-flex": { verdict: "ok", note: "Permitido no protocolo flexível pela composição herbal." },
      selva: { verdict: "ok", note: "O vigor das ervas e pimentas naturais." },
    },
  },
  {
    key: "salsa-cebola-e-alho",
    profile: PROFILES.ervas,
    verdicts: {
      keto: { verdict: "ok", note: "Ervas e vegetais desidratados puros. Uso livre." },
      lowcarb: { verdict: "ok", note: "Coringa para refogados, peixes e ovos." },
      "carnivora-flex": { verdict: "ok", note: "Aceito como concentrado de sabor no protocolo flexível." },
      selva: { verdict: "ok", note: "Trindade da cozinha limpa: salsa, cebola e alho." },
    },
  },
  {
    key: "ervas-finas",
    profile: PROFILES.ervas,
    verdicts: {
      keto: { verdict: "ok", note: "Mix puro de ervas — zero carboidratos líquidos significativos." },
      lowcarb: { verdict: "ok", note: "Traz frescor a ovos, queijos e carnes brancas." },
      "carnivora-flex": { verdict: "ok", note: "Permitido no protocolo flexível como aromático." },
      selva: { verdict: "ok", note: "Herança herbal pura para pratos limpos." },
    },
  },
  {
    key: "tempero-mineiro",
    profile: PROFILES.casa,
    verdicts: {
      keto: { verdict: "ok", note: "Base de sal e especiarias tradicionais — sem açúcares nem amidos." },
      lowcarb: { verdict: "ok", note: "Gosto de comida caseira sem carga glicêmica." },
      "carnivora-flex": { verdict: "ok", note: "Permitido — mix de especiarias sem óleos processados." },
      selva: { verdict: "ok", note: "A essência mineira em sua forma mais pura." },
    },
  },
  {
    key: "cebola-em-po",
    profile: PROFILES.puras,
    verdicts: {
      keto: {
        verdict: "moderate",
        note: "Cebola concentra carboidratos naturais ao desidratar. Uma pitada é segura; evite colheres cheias.",
      },
      lowcarb: { verdict: "ok", note: "Uso normal cabe no low carb sem stress." },
      "carnivora-flex": { verdict: "ok", note: "Vegetal desidratado — aceito no protocolo flexível." },
      selva: { verdict: "ok", note: "Apenas cebola. O que a terra deu, o sol secou." },
    },
  },
  {
    key: "tempero-do-edu",
    profile: PROFILES.casa,
    verdicts: {
      keto: { verdict: "ok", note: "Mix vegetal com traços de óleo de soja — dentro do escopo cetogênico." },
      lowcarb: { verdict: "ok", note: "Ótimo em patês, ovos e carnes do dia a dia." },
      "carnivora-flex": { verdict: "ok", note: "Permitido no protocolo flexível." },
      selva: { verdict: "ok", note: "Equilíbrio vegetal para paladares ancestrais." },
    },
  },
  {
    key: "curcuma",
    profile: PROFILES.puras,
    verdicts: {
      keto: { verdict: "ok", note: "Raiz desidratada pura, anti-inflamatório natural. Uso livre." },
      lowcarb: { verdict: "ok", note: "Colore e perfuma sem impacto glicêmico." },
      "carnivora-flex": { verdict: "ok", note: "Aceita como especiaria pura no protocolo flexível." },
      selva: { verdict: "ok", note: "Raiz ancestral. Cor e saúde direto da natureza." },
    },
  },
  {
    key: "pimenta-do-reino",
    profile: PROFILES.puras,
    verdicts: {
      keto: { verdict: "ok", note: "Especiaria pura — uso livre." },
      lowcarb: { verdict: "ok", note: "Coringa em qualquer prato low carb." },
      "carnivora-flex": { verdict: "ok", note: "Permitida no protocolo flexível." },
      selva: { verdict: "ok", note: "O tempero mais antigo do mundo. Obrigatório." },
    },
  },
  {
    key: "canela-moida",
    profile: PROFILES.puras,
    verdicts: {
      keto: { verdict: "ok", note: "Especiaria pura, praticamente zero carboidratos por porção." },
      lowcarb: { verdict: "ok", note: "Sobremesas low carb, cafés e iogurtes integrais." },
      "carnivora-flex": {
        verdict: "moderate",
        note: "Especiaria vegetal — cabe apenas em interpretações mais amplas da carnívora flexível.",
      },
      selva: { verdict: "moderate", note: "Especiaria vegetal aromática." },
    },
  },
  {
    key: "temperaflix",
    profile: PROFILES.casa,
    verdicts: {
      keto: {
        verdict: "moderate",
        note: "Linha para snacks: possui amidos ou bases para aderência. Em pipoca de coco/keto snacks use pitadas pequenas.",
      },
      lowcarb: { verdict: "ok", note: "Cabe no low carb — feito para saborizar snacks e petiscos." },
      "carnivora-flex": {
        verdict: "no",
        note: "Base para aderência inclui componentes vegetais que fogem do escopo carnívoro.",
      },
      selva: { verdict: "no", note: "Contém aditivos de aderência, fora do escopo da Dieta da Selva." },
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
  "du-chefe-com-paprica": "du-chefe-com-paprica",
  "tempero-chefe": "du-chefe-com-paprica",
  "chimi-churri-sem-pimenta": "chimi-churri-sem-pimenta",
  "chimichurri-sem-pimenta": "chimi-churri-sem-pimenta",
  "chimi-churri-picante": "chimi-churri-picante",
  "chimichurri-picante": "chimi-churri-picante",
  "salsa-cebola-e-alho": "salsa-cebola-e-alho",
  "ervas-finas": "ervas-finas",
  "tempero-mineiro": "tempero-mineiro",
  "cebola-em-po": "cebola-em-po",
  "tempero-do-edu": "tempero-do-edu",
  "edu-guedes": "tempero-do-edu",
  curcuma: "curcuma",
  "pimenta-do-reino": "pimenta-do-reino",
  "pimenta-do-reino-premium-black-30g": "pimenta-do-reino",
  "canela-moida": "canela-moida",
  "canela-premium-black-30g": "canela-moida",
  
  "temperaflix-ervas-finas": "temperaflix",
  "temperaflix-tradicional": "temperaflix",
};

const BY_KEY = new Map(PRODUCT_DIETS.map((p) => [p.key, p]));

export function getProductDiet(handle: string): ProductDiet | null {
  const direct = HANDLE_ALIASES[handle];
  if (direct && BY_KEY.has(direct)) return BY_KEY.get(direct)!;
  // fallback tolerante: procura substring
  for (const [alias, key] of Object.entries(HANDLE_ALIASES)) {
    if (handle.includes(alias) || alias.includes(handle)) return BY_KEY.get(key)!;
  }
  return null;
}
