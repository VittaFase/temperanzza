/**
 * Receitas curadas da Cozinha Temperanzza.
 * Cada receita destaca um condimento e é rotulada com as dietas compatíveis.
 */

import type { DietKey } from "./diets";
import type { ProductDiet } from "./dietCompatibility";

export type Moment = "cafe" | "almoco" | "jantar" | "lanche";
export type RecipeCategory = "dieta" | "tradicional";

export interface Recipe {
  slug: string;
  title: string;
  /** condimento protagonista (usa alias de handle Shopify) */
  featuredHandle: string;
  compatibleDiets: DietKey[];
  moment: Moment;
  profile: ProductDiet["profile"];
  /** "dieta" (Estilo de Vida e Performance) ou "tradicional" (Mesa de Todos). Default: "dieta" */
  category?: RecipeCategory;
  intro: string;
  ingredients: string[];
  steps: string[];
  /** rótulo depende da categoria: "Por que funciona…" vs "O Toque Temperanzza" */
  whyItWorks: string;
  /** rótulo depende da categoria: "Dica de substituição" vs "Dica de variação" */
  substitution: string;
  /** metáfora visual quando não há foto ainda */
  hero: { color: string };
  // ── Camada editorial (opcional — a Biblioteca Gastronômica usa quando presente) ──
  /** Linha editorial curta (uma frase, tipo Saveur). Fallback: intro. */
  subtitle?: string;
  /** "Palavra do Chef" — texto italico, até 80 palavras. Fallback: whyItWorks. */
  chefWord?: string;
  /** Tempo total (ex: "25 min") */
  time?: string;
  /** Rendimento (ex: "2 pessoas") */
  serves?: string;
  /** Dificuldade: "Fácil" | "Médio" | "Avançado" */
  difficulty?: "Fácil" | "Médio" | "Avançado";
  /** Handles de temperos que harmonizam (2-3 sugestões). */
  harmonization?: string[];
  /** Proteína dominante do prato (filtro complementar). Fallback: RECIPE_PROTEIN. */
  proteinaPrincipal?: Protein;
  /** Foto do prato pronto (adição v2) */
  dish?: { src: string; alt: string };
  /** Sugestões específicas para "Continue a leitura" */
  relatedSlugs?: string[];
}


export const MOMENTS: Record<Moment, string> = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  jantar: "Jantar",
  lanche: "Lanche",
};

export const CATEGORIES: Record<RecipeCategory, { label: string; short: string }> = {
  dieta: { label: "Estilo de Vida & Performance", short: "Dieta" },
  tradicional: { label: "Mesa de Todos — Tradicional", short: "Tradicional" },
};

export const RECIPES: Recipe[] = [
  // Nº01
  {
    slug: "omelete-bacon-em-po",
    title: "Omelete simples com Temperaflix Bacon",
    subtitle: "Três ovos e um shaker — o café da manhã que não pede pão.",
    intro: "O gostinho de defumado que transforma três ovos em algo memorável.",
    featuredHandle: "temperaflix-bacon",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "cafe",
    profile: "defumado",
    time: "10 min",
    serves: "1 pessoa",
    difficulty: "Fácil",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga",
      "2 fatias de bacon em tiras",
      "2 pitadas de Temperaflix Bacon",
      "Sal a gosto",
    ],
    steps: [
      "Frite o bacon até dourar e reserve, mantendo a gordura na frigideira.",
      "Bata os ovos com o sal só até o amarelo ficar uniforme.",
      "Despeje na frigideira em fogo médio-baixo e puxe as bordas para o centro até firmar.",
      "Coloque o bacon, polvilhe o Temperaflix Bacon, dobre ao meio e sirva.",
    ],
    chefWord: "Ovo inteiro é proteína completa e gordura boa no mesmo alimento. O shaker de bacon entrega o sabor defumado sem a água que a fatia de bacon solta na frigideira.",
    whyItWorks: "Ovos e queijo são a base de proteína e gordura das dietas cetogênica e low carb. O Temperaflix Bacon entra em porção pequena, mantendo os carboidratos controlados.",
    substitution: "Sem bacon em casa? O shaker sozinho já entrega o defumado — só aumente a manteiga.",
    harmonization: ["temperaflix-ervas-finas", "paprica-defumada"],
    relatedSlugs: ["ovos-fritos-bacon-tradicional", "hamburguer-bacon-em-po", "omelete-temperaflix-ervas-finas", "ovos-mexidos-ervas-finas"],
    dish: { src: "/receitas/omelete-bacon-em-po.jpg", alt: "Omelete simples com Temperaflix Bacon" },
    hero: { color: "oklch(0.35 0.08 40)" },
  },
  // Nº02
  {
    slug: "frango-assado-paprica-defumada",
    title: "Frango assado com Páprica Defumada",
    subtitle: "Pele dourada, aroma de fogo lento — sem sair da cozinha.",
    intro: "Pele dourada, aroma de fogo lento — sem sair da cozinha.",
    featuredHandle: "paprica-defumada",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "defumado",
    time: "20 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "6 coxas ou sobrecoxas de frango",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) cheia de Páprica Defumada Temperanzza",
      "Sal grosso a gosto",
      "1 limão cortado ao meio",
    ],
    steps: [
      "Seque bem os pedaços de frango com papel-toalha.",
      "Massageie com azeite, sal e a Páprica Defumada — cubra toda a superfície.",
      "Espalhe em uma assadeira e leve ao forno pré-aquecido a 200 °C por 40 minutos.",
      "Nos últimos 5 minutos, ligue o grill até a pele ficar dourada. Regue com limão antes de servir.",
    ],
    chefWord: "Frango é fonte magra de proteína; a páprica é especiaria pura, sem carga glicêmica. Uma refeição completa que cabe até no protocolo carnívoro flexível.",
    whyItWorks: "Frango é fonte magra de proteína; a páprica é especiaria pura, sem carga glicêmica. Uma refeição completa que cabe até no protocolo carnívoro flexível.",
    substitution: "Prefere peito? Corte em cubos grandes e reduza o forno para 25 minutos.",
    harmonization: ["temperaflix-bacon", "paprica-doce"],
    relatedSlugs: ["costelinha-paprica-defumada-tradicional", "frango-dourado-paprica-doce", "porco-assado-paprica-picante", "frango-grelhado-ana-maria"],
    dish: { src: "/receitas/frango-assado-paprica-defumada.jpg", alt: "Frango assado com Páprica Defumada" },
    hero: { color: "oklch(0.5 0.18 40)" },
  },
  // Nº03
  {
    slug: "hamburguer-bacon-em-po",
    title: "Hambúrguer caseiro com Temperaflix Bacon",
    subtitle: "O queijo escorre, o shaker assina — hambúrguer de casa com cara de casa.",
    intro: "O queijo escorre, o shaker assina — hambúrguer de casa com cara de casa.",
    featuredHandle: "temperaflix-bacon",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "jantar",
    profile: "defumado",
    time: "20 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "400 g de carne moída com gordura",
      "2 fatias de queijo cheddar",
      "4 fatias de bacon",
      "1 colher (chá) cheia de Temperaflix Bacon",
      "Sal grosso a gosto",
    ],
    steps: [
      "Divida a carne em dois discos sem apertar e faça uma comovinha no centro de cada.",
      "Salgue e polvilhe o Temperaflix Bacon só na superfície, dos dois lados.",
      "Sele na chapa bem quente, 3 minutos de cada lado, e coloque o queijo no fim.",
      "Monte com o bacon crocante por cima e sirva imediatamente.",
    ],
    chefWord: "Carne moída com 20% de gordura é o que segura o hambúrguer suculento. O tempero entra na superfície, nunca misturado à carne — massa temperada por dentro vira almôndega.",
    whyItWorks: "Carne e queijo são pilares do low carb e da cetogênica. O Temperaflix Bacon realça a carne sem carga extra.",
    substitution: "Sem pão, monte sobre folhas de alface — a versão keto não perde nada.",
    harmonization: ["paprica-defumada", "cebola-em-po"],
    relatedSlugs: ["omelete-bacon-em-po", "ovos-fritos-bacon-tradicional", "bife-manteiga-chimi-churri", "carne-moida-tempero-mineiro"],
    dish: { src: "/receitas/hamburguer-bacon-em-po.jpg", alt: "Hambúrguer caseiro com Temperaflix Bacon" },
    hero: { color: "oklch(0.32 0.08 30)" },
  },
  // Nº04
  {
    slug: "ovos-mexidos-ervas-finas",
    title: "Ovos mexidos com Ervas Finas",
    subtitle: "Cremoso por dentro, perfumado por cima — dez minutos de cozinha.",
    intro: "Cremoso por dentro, perfumado por cima — dez minutos de cozinha.",
    featuredHandle: "ervas-finas",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "ervas",
    time: "10 min",
    serves: "1 pessoa",
    difficulty: "Fácil",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga",
      "1 colher (sopa) de creme de leite fresco",
      "1 pitada generosa de Ervas Finas Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Bata os ovos com o sal e o creme de leite.",
      "Derreta a manteiga em fogo baixo e despeje os ovos.",
      "Mexa devagar e sem parar, tirando do fogo quando ainda estiverem brilhantes e úmidos.",
      "Finalize com as Ervas Finas e sirva na hora.",
    ],
    chefWord: "Ovo mexido cremoso é questão de fogo baixo e paciência: ele termina de cozinhar fora da panela. As ervas entram no fim, quando o calor já não queima o aroma.",
    whyItWorks: "Ovos são coringa em dietas de baixo carboidrato. As ervas trazem frescor sem carga glicêmica.",
    substitution: "Sem creme de leite, uma colher de requeijão faz o mesmo trabalho.",
    harmonization: ["salsa-cebola-e-alho", "curcuma"],
    relatedSlugs: ["ovos-dourados-curcuma", "omelete-temperaflix-ervas-finas", "salmao-crosta-ervas-finas", "ovos-cozidos-tempero-edu"],
    dish: { src: "/receitas/ovos-mexidos-ervas-finas.jpg", alt: "Ovos mexidos com Ervas Finas" },
    hero: { color: "oklch(0.5 0.13 145)" },
  },
  // Nº05
  {
    slug: "peixe-grelhado-salsa-cebola-alho",
    title: "Peixe grelhado com Salsa, Cebola e Alho",
    subtitle: "Marca de grelha, azeite e três temperos — o resto é o peixe.",
    intro: "Marca de grelha, azeite e três temperos — o resto é o peixe.",
    featuredHandle: "salsa-cebola-e-alho",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "ervas",
    time: "15 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 filés de peixe branco firme",
      "2 colheres (sopa) de azeite",
      "1 colher (chá) cheia de Salsa, Cebola e Alho Temperanzza",
      "Sal e limão a gosto",
    ],
    steps: [
      "Seque os filés e tempere com azeite, sal e o Salsa, Cebola e Alho.",
      "Aqueça a grelha até soltar fumaça leve.",
      "Grelhe 3 minutos de cada lado, virando uma única vez.",
      "Regue com azeite cru e limão fora do fogo.",
    ],
    chefWord: "Peixe branco é proteína magra que cozinha rápido demais. Grelha quente e um lado de cada vez: passou do ponto, resseca e não volta.",
    whyItWorks: "Peixe é proteína magra; o tempero é desidratado puro. Cabe até no protocolo carnívoro flexível.",
    substitution: "Em filés finos, reduza para 2 minutos por lado.",
    harmonization: ["lemon-pepper", "ervas-finas"],
    relatedSlugs: ["peixe-assado-legumes-salsa-cebola-alho", "sardinha-grelhada-lemon-pepper", "salmao-crosta-ervas-finas", "camarao-manteiga-salsa-cebola-alho"],
    dish: { src: "/receitas/peixe-grelhado-salsa-cebola-alho.jpg", alt: "Peixe grelhado com Salsa, Cebola e Alho" },
    hero: { color: "oklch(0.55 0.12 145)" },
  },
  // Nº06
  {
    slug: "bife-manteiga-chimi-churri",
    title: "Bife grelhado com manteiga de Chimi Churri Picante",
    subtitle: "A manteiga derrete, o chimichurri acorda — e o bife fica pronto.",
    intro: "A manteiga derrete, o chimichurri acorda — e o bife fica pronto.",
    featuredHandle: "chimi-churri-picante",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "jantar",
    profile: "citrico-picante",
    time: "15 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 bifes de contrafilé de 2 cm",
      "2 colheres (sopa) de manteiga em temperatura ambiente",
      "1 colher (chá) cheia de Chimi Churri Picante Temperanzza",
      "Sal grosso a gosto",
    ],
    steps: [
      "Misture a manteiga com o Chimi Churri Picante e reserve fora da geladeira.",
      "Seque os bifes, salgue e sele em frigideira de ferro bem quente, 3 minutos de cada lado.",
      "Desligue o fogo e coloque uma colher da manteiga temperada sobre cada bife.",
      "Deixe descansar 3 minutos antes de cortar — a manteiga derrete e vira molho.",
    ],
    chefWord: "Gordura da manteiga e proteína da carne no mesmo garfo. O chimichurri entra seco, sem açúcar e sem espessante — tempero puro sobre carne pura.",
    whyItWorks: "Carne vermelha é pilar low carb e cetogênica; o Chimi Churri, por ser mix de ervas, é aceito na carnívora flexível.",
    substitution: "Sem picância? O Chimi Churri sem Pimenta faz a mesma manteiga.",
    harmonization: ["paprica-picante", "tempero-do-edu"],
    relatedSlugs: ["frango-chimi-churri-picante", "camarao-chimi-churri-picante", "costela-bovina-pimenta-reino", "bife-acebolado-lemon-pepper"],
    dish: { src: "/receitas/bife-manteiga-chimi-churri.jpg", alt: "Bife grelhado com manteiga de Chimi Churri Picante" },
    hero: { color: "oklch(0.42 0.14 30)" },
  },
  // Nº07
  {
    slug: "ovos-cozidos-tempero-edu",
    title: "Ovos cozidos com Tempero do Edu",
    subtitle: "A proteína mais simples do mundo, com o tempero que a resolve.",
    intro: "A proteína mais simples do mundo, com o tempero que a resolve.",
    featuredHandle: "tempero-do-edu",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "casa",
    time: "12 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "4 ovos",
      "1 colher (chá) de Tempero do Edu Temperanzza",
      "Flor de sal a gosto",
      "Azeite para finalizar",
    ],
    steps: [
      "Cozinhe os ovos em água fervente por 9 minutos.",
      "Passe para água com gelo e descasque ainda mornos.",
      "Corte ao meio e disponha com a gema para cima.",
      "Regue com azeite e polvilhe o Tempero do Edu e a flor de sal.",
    ],
    chefWord: "Nove minutos entrega gema firme mas ainda úmida no centro. Passou disso, aparece o anel esverdeado e a textura seca.",
    whyItWorks: "Proteína pura e prática. O tempero é mix vegetal sem açúcar — encaixa em qualquer refeição de baixo carboidrato.",
    substitution: "Para gema mole, reduza para 6 minutos e sirva com pão.",
    harmonization: ["lemon-pepper", "pimenta-do-reino"],
    relatedSlugs: ["ovo-frito-lemon-pepper", "panqueca-proteica-tempero-edu", "ovos-mexidos-ervas-finas", "ovos-dourados-curcuma"],
    dish: { src: "/receitas/ovos-cozidos-tempero-edu.jpg", alt: "Ovos cozidos com Tempero do Edu" },
    hero: { color: "oklch(0.6 0.1 60)" },
  },
  // Nº08
  {
    slug: "carne-moida-tempero-mineiro",
    title: "Carne moída refogada com Tempero Mineiro",
    subtitle: "A base de metade dos almoços da semana — bem temperada de uma vez.",
    intro: "A base de metade dos almoços da semana — bem temperada de uma vez.",
    featuredHandle: "tempero-mineiro",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "casa",
    time: "20 min",
    serves: "4 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "500 g de carne moída",
      "1 colher (sopa) de azeite",
      "1 colher (sopa) cheia de Tempero Mineiro Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Aqueça bem a panela com o azeite e espalhe a carne sem mexer por 2 minutos.",
      "Solte a carne e cozinhe até toda a água evaporar.",
      "Junte o Tempero Mineiro e o sal e refogue por mais 5 minutos, mexendo.",
      "Sirva pura ou como base de recheio.",
    ],
    chefWord: "Carne moída solta água antes de dourar. Espere a água evaporar por completo e só então tempere — é aí que a carne pega cor de verdade.",
    whyItWorks: "Carne moída é econômica e rica em proteína. O tempero é mix de especiarias sem amido ou açúcar.",
    substitution: "A mesma base vira ragu com uma lata de tomate e 20 minutos a mais.",
    harmonization: ["ana-maria", "du-chefe-com-paprica"],
    relatedSlugs: ["carne-panela-batatas-tempero-mineiro", "berinjela-assada-tempero-mineiro", "feijao-tropeiro-tempero-mineiro", "hamburguer-bacon-em-po"],
    dish: { src: "/receitas/carne-moida-tempero-mineiro.jpg", alt: "Carne moída refogada com Tempero Mineiro" },
    hero: { color: "oklch(0.42 0.1 30)" },
  },
  // Nº09
  {
    slug: "ovos-dourados-curcuma",
    title: "Ovos mexidos dourados com Cúrcuma",
    subtitle: "O amarelo que não vem do ovo — vem da raiz.",
    intro: "O amarelo que não vem do ovo — vem da raiz.",
    featuredHandle: "curcuma",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "puras",
    time: "10 min",
    serves: "1 pessoa",
    difficulty: "Fácil",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga",
      "1/2 colher (chá) de Cúrcuma Temperanzza",
      "Sal e pimenta-do-reino a gosto",
    ],
    steps: [
      "Bata os ovos com o sal e a Cúrcuma até a cor ficar uniforme.",
      "Derreta a manteiga em fogo baixo.",
      "Despeje os ovos e mexa devagar até firmarem sem secar.",
      "Finalize com pimenta-do-reino moída na hora.",
    ],
    chefWord: "A curcumina é lipossolúvel: ela precisa de gordura para ser absorvida. Ovo com manteiga é o veículo perfeito para ela.",
    whyItWorks: "Cúrcuma é especiaria pura com curcumina anti-inflamatória. Ovos entregam proteína e gordura.",
    substitution: "Uma pitada de pimenta-do-reino multiplica a absorção da cúrcuma — não pule.",
    harmonization: ["pimenta-do-reino", "ervas-finas"],
    relatedSlugs: ["couve-flor-gratinada-curcuma", "legumes-assados-curcuma-tradicional", "ovos-mexidos-ervas-finas", "ovos-cozidos-tempero-edu"],
    dish: { src: "/receitas/ovos-dourados-curcuma.jpg", alt: "Ovos mexidos dourados com Cúrcuma" },
    hero: { color: "oklch(0.75 0.16 80)" },
  },
  // Nº10
  {
    slug: "frango-grelhado-ana-maria",
    title: "Frango grelhado com Ana Maria",
    subtitle: "O blend da casa que faz o frango simples parecer domingo.",
    intro: "O blend da casa que faz o frango simples parecer domingo.",
    featuredHandle: "ana-maria",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "casa",
    time: "15 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 filés de peito de frango",
      "1 colher (sopa) de azeite",
      "1 colher (chá) cheia de Ana Maria Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Abra os filés na espessura de 1,5 cm para grelharem por igual.",
      "Regue com azeite e cubra os dois lados com o Ana Maria e o sal.",
      "Grelhe em chapa bem quente, 4 minutos de cada lado, sem mexer.",
      "Deixe descansar 3 minutos antes de servir.",
    ],
    chefWord: "Peito de frango é proteína magra quase pura. O Ana Maria traz ervas e tomate seco desidratados — sabor de refogado sem uma gota de óleo a mais.",
    whyItWorks: "Frango é proteína versátil. O Ana Maria contém pequena porção de amido — cabe no low carb com moderação.",
    substitution: "Funciona igual em sobrecoxa desossada; aumente para 6 minutos por lado.",
    harmonization: ["ervas-finas", "salsa-cebola-e-alho"],
    relatedSlugs: ["frango-panela-ana-maria", "frango-quiabo-ana-maria", "frango-dourado-paprica-doce", "frango-chimi-churri-picante"],
    dish: { src: "/receitas/frango-grelhado-ana-maria.jpg", alt: "Frango grelhado com Ana Maria" },
    hero: { color: "oklch(0.55 0.12 50)" },
  },

];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export function getRecipesByHandle(handle: string): Recipe[] {
  return RECIPES.filter((r) => r.featuredHandle === handle);
}

export type Protein =
  | "frango"
  | "bovina"
  | "suino"
  | "pescados"
  | "ovo"
  | "vegetariano";

export const PROTEINS: Record<Protein, string> = {
  frango: "Frango",
  bovina: "Carne bovina",
  suino: "Suíno",
  pescados: "Peixe & Frutos do Mar",
  ovo: "Ovo",
  vegetariano: "Vegetariano",
};

export const PROTEIN_ORDER: Protein[] = [
  "frango",
  "bovina",
  "suino",
  "pescados",
  "ovo",
  "vegetariano",
];

/**
 * Classificação da proteína dominante de cada receita.
 */
export const RECIPE_PROTEIN: Record<string, Protein> = {
  "omelete-bacon-em-po": "ovo",
  "frango-assado-paprica-defumada": "frango",
  "hamburguer-bacon-em-po": "bovina",
  "ovos-mexidos-ervas-finas": "ovo",
  "peixe-grelhado-salsa-cebola-alho": "pescados",
  "bife-manteiga-chimi-churri": "bovina",
  "ovos-cozidos-tempero-edu": "ovo",
  "carne-moida-tempero-mineiro": "bovina",
  "ovos-dourados-curcuma": "ovo",
  "frango-grelhado-ana-maria": "frango",
  "sopa-legumes-salsa-cebola-alho": "vegetariano",
  "ovo-frito-lemon-pepper": "ovo",
  "porco-assado-paprica-picante": "suino",
  "camarao-chimi-churri-picante": "pescados",
  "frango-dourado-paprica-doce": "frango",
  "cafe-ritual-canela": "vegetariano",
  "mix-castanhas-temperaflix-ervas": "vegetariano",
  "salmao-crosta-ervas-finas": "pescados",
  "abacate-recheado-frango-chimi-churri": "frango",
  "couve-flor-gratinada-curcuma": "vegetariano",
  "sardinha-grelhada-lemon-pepper": "pescados",
  "panqueca-proteica-tempero-edu": "ovo",
  "costela-bovina-pimenta-reino": "bovina",
  "figado-acebolado-salsa-cebola-alho": "bovina",
  "camarao-manteiga-salsa-cebola-alho": "pescados",
  "frango-panela-ana-maria": "frango",
  "berinjela-assada-tempero-mineiro": "vegetariano",
  "pao-de-queijo-tempero-mineiro": "vegetariano",
  "arroz-soltinho-cebola-em-po": "vegetariano",
  "frango-quiabo-ana-maria": "frango",
  "ovos-fritos-bacon-tradicional": "ovo",
  "bife-acebolado-lemon-pepper": "bovina",
  "costelinha-paprica-defumada-tradicional": "suino",
  "omelete-temperaflix-ervas-finas": "ovo",
  "frango-chimi-churri-picante": "frango",
  "legumes-assados-curcuma-tradicional": "vegetariano",
  "costela-porco-du-chefe": "suino",
  "bife-cavalo-pimenta-reino": "bovina",
  "maca-assada-canela": "vegetariano",
  "pipoca-caseira-temperaflix-tradicional": "vegetariano",
  "carne-panela-batatas-tempero-mineiro": "bovina",
  "peixe-assado-legumes-salsa-cebola-alho": "pescados",
  "feijao-tropeiro-tempero-mineiro": "vegetariano",
  "sopa-legumes-ervas-finas": "vegetariano",
};

/** Proteína dominante da receita (campo explícito tem prioridade sobre o mapa). */
export function getRecipeProtein(r: Recipe): Protein | undefined {
  return r.proteinaPrincipal ?? RECIPE_PROTEIN[r.slug];
}

