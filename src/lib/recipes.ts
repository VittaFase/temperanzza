/**
 * Receitas curadas da Cozinha Temperanzza.
 * Cada receita destaca um condimento e é rotulada com as dietas compatíveis.
 */

import type { DietKey } from "./diets";
import type { ProductDiet } from "./dietCompatibility";

export type Moment = "cafe" | "almoco" | "jantar";
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
}


export const MOMENTS: Record<Moment, string> = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  jantar: "Jantar",
};

export const CATEGORIES: Record<RecipeCategory, { label: string; short: string }> = {
  dieta: { label: "Estilo de Vida & Performance", short: "Dieta" },
  tradicional: { label: "Mesa de Todos — Tradicional", short: "Tradicional" },
};

export const RECIPES: Recipe[] = [
  // Perfil 1 — Defumado e saboroso
  {
    slug: "omelete-bacon-em-po",
    title: "Omelete simples com Temperaflix Bacon",
    featuredHandle: "temperaflix-bacon",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "cafe",
    profile: "defumado",
    intro: "O gostinho de defumado que transforma três ovos em algo memorável.",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga ou azeite",
      "30 g de queijo mussarela ou prato",
      "Temperaflix Bacon a gosto",
      "Sal a gosto",
    ],
    steps: [
      "Bata os ovos com uma pitada de sal.",
      "Aqueça a frigideira antiaderente e derreta a manteiga.",
      "Despeje os ovos, distribua o queijo por cima e cozinhe em fogo baixo até firmar.",
      "Dobre a omelete, transfira para o prato e salpique o Temperaflix Bacon imediatamente.",
    ],
    whyItWorks:
      "Ovos e queijo são a base de proteína e gordura das dietas cetogênica e low carb. O Temperaflix Bacon entra em porção pequena, mantendo os carboidratos controlados.",
    substitution:
      "Sem queijo? Substitua por 1 colher (sopa) de cream cheese misturado aos ovos batidos — a textura fica ainda mais cremosa.",
    hero: { color: "oklch(0.35 0.08 40)" },
  },
  {
    slug: "frango-assado-paprica-defumada",
    title: "Frango assado com Páprica Defumada",
    featuredHandle: "paprica-defumada",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "defumado",
    intro: "Pele dourada, aroma de fogo lento — sem sair da cozinha.",
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
    whyItWorks:
      "Frango é fonte magra de proteína; a páprica é especiaria pura, sem carga glicêmica. Uma refeição completa que cabe até no protocolo carnívoro flexível.",
    substitution:
      "Prefere peito? Corte em cubos grandes e reduza o forno para 25 minutos — a páprica funciona igualmente bem.",
    hero: { color: "oklch(0.5 0.18 40)" },
  },
  {
    slug: "hamburguer-bacon-em-po",
    title: "Hambúrguer caseiro com Temperaflix Bacon",
    featuredHandle: "temperaflix-bacon",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "jantar",
    profile: "defumado",
    intro: "Sem pão, sem desculpa. Suculência e defumado em cada mordida.",
    ingredients: [
      "500 g de carne moída (patinho ou acém 20% gordura)",
      "2 colheres (chá) de Temperaflix Bacon",
      "1 colher (chá) de sal",
      "Pimenta-do-Reino Temperanzza a gosto",
      "4 fatias de queijo cheddar ou prato",
      "Folhas verdes para acompanhar",
    ],
    steps: [
      "Misture a carne com o Temperaflix Bacon, sal e pimenta sem sovar demais.",
      "Modele 4 discos de 2 cm de altura.",
      "Grelhe em frigideira bem quente por 3 minutos de cada lado.",
      "Coloque o queijo no topo, abafe até derreter e sirva sobre as folhas.",
    ],
    whyItWorks:
      "Carne e queijo são pilares do low carb e da cetogênica. O Temperaflix Bacon realça a carne sem carga extra.",
    substitution:
      "Sem queijo? Finalize com um ovo frito por cima — proteína e gordura mantidas.",
    hero: { color: "oklch(0.32 0.08 30)" },
  },

  // Perfil 2 — Ervas frescas e leves
  {
    slug: "ovos-mexidos-ervas-finas",
    title: "Ovos mexidos com Ervas Finas",
    featuredHandle: "ervas-finas",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "ervas",
    intro: "O verde discreto que acorda o ovo.",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga",
      "1 pitada generosa de Ervas Finas Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Bata os ovos levemente com sal.",
      "Derreta a manteiga em fogo baixo e adicione os ovos.",
      "Mexa devagar com espátula até formarem creme.",
      "Retire do fogo antes de secar e finalize com as Ervas Finas.",
    ],
    whyItWorks:
      "Ovos são coringa em dietas de baixo carboidrato. As ervas trazem frescor sem carga glicêmica.",
    substitution:
      "Use as Ervas Finas em ricota ou cottage para um patê rápido — perfeito para lanches low carb.",
    hero: { color: "oklch(0.5 0.13 145)" },
  },
  {
    slug: "peixe-grelhado-salsa-cebola-alho",
    title: "Peixe grelhado com Salsa, Cebola e Alho",
    featuredHandle: "salsa-cebola-e-alho",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "ervas",
    intro: "Um filé leve, três ervas, dez minutos.",
    ingredients: [
      "2 filés de tilápia, merluza ou salmão",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) de Salsa, Cebola e Alho Temperanzza",
      "Sal e limão a gosto",
      "1 porção de brócolis cozido no vapor",
    ],
    steps: [
      "Seque os filés e tempere com sal, azeite e o mix Salsa, Cebola e Alho.",
      "Aqueça a frigideira em fogo médio-alto.",
      "Grelhe 3 minutos de cada lado.",
      "Sirva com brócolis no vapor e um esguicho de limão.",
    ],
    whyItWorks:
      "Peixe é proteína magra; o tempero é desidratado puro. Cabe até no protocolo carnívoro flexível.",
    substitution:
      "Sem peixe? Use o mesmo tempero em filés de frango grelhado — funciona igualmente bem.",
    hero: { color: "oklch(0.55 0.12 145)" },
  },
  {
    slug: "bife-manteiga-chimi-churri",
    title: "Bife grelhado com manteiga de Chimi Churri",
    featuredHandle: "chimi-churri-sem-pimenta",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "jantar",
    profile: "ervas",
    intro: "A manteiga derretendo e as ervas explodindo sobre a carne quente.",
    ingredients: [
      "1 bife de contrafilé, alcatra ou picanha (200 g)",
      "Sal grosso a gosto",
      "1 colher (sopa) de manteiga sem sal",
      "1 colher (chá) de Chimi Churri Sem Pimenta Temperanzza",
    ],
    steps: [
      "Retire o bife da geladeira 20 minutos antes.",
      "Sele em frigideira de ferro bem quente, 3 minutos de cada lado.",
      "Deixe descansar por 4 minutos.",
      "Misture a manteiga com o Chimi Churri e coloque uma noz sobre o bife quente.",
    ],
    whyItWorks:
      "Carne vermelha é pilar low carb e cetogênica; o Chimi Churri, por ser mix de ervas, é aceito na carnívora flexível.",
    substitution:
      "Sem manteiga? Misture o Chimi Churri com azeite e regue o bife na hora de servir.",
    hero: { color: "oklch(0.42 0.14 30)" },
  },

  // Perfil 3 — Prático e sabor de casa
  {
    slug: "ovos-cozidos-tempero-edu",
    title: "Ovos cozidos com Tempero do Edu",
    featuredHandle: "tempero-do-edu",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "casa",
    intro: "Rápido, portátil, resolve a manhã.",
    ingredients: [
      "4 ovos",
      "1 colher (chá) de Tempero do Edu Temperanzza",
      "Azeite a gosto",
    ],
    steps: [
      "Cozinhe os ovos em água fervente por 8 minutos.",
      "Passe pela água gelada e descasque.",
      "Corte ao meio, regue com azeite e salpique o Tempero do Edu.",
    ],
    whyItWorks:
      "Proteína pura e prática. O tempero é mix vegetal sem açúcar — encaixa em qualquer refeição de baixo carboidrato.",
    substitution:
      "Use o mesmo tempero em patê de frango ou atum e leve em folhas de alface para um lanche low carb.",
    hero: { color: "oklch(0.6 0.1 60)" },
  },
  {
    slug: "carne-moida-tempero-mineiro",
    title: "Carne moída refogada com Tempero Mineiro",
    featuredHandle: "tempero-mineiro",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "casa",
    intro: "Gosto de comida de vó, ajustado à sua rotina.",
    ingredients: [
      "500 g de carne moída (patinho ou acém)",
      "1 colher (sopa) de manteiga ou banha",
      "1 colher (sopa) de Tempero Mineiro Temperanzza",
      "Couve refogada ou couve-flor para acompanhar",
    ],
    steps: [
      "Aqueça a gordura em uma panela grande.",
      "Doure a carne moída em fogo alto, quebrando com a colher.",
      "Quando começar a soltar líquido, tempere com o Tempero Mineiro.",
      "Cozinhe até secar o líquido e sirva com o acompanhamento.",
    ],
    whyItWorks:
      "Carne moída é econômica e rica em proteína. O tempero é mix de especiarias sem amido ou açúcar.",
    substitution:
      "Use o mesmo tempero em frango ensopado ou para saborizar jiló e quiabo refogados.",
    hero: { color: "oklch(0.42 0.1 30)" },
  },
  {
    slug: "frango-panela-ana-maria",
    title: "Frango na panela com Ana Maria",
    featuredHandle: "ana-maria",
    compatibleDiets: ["lowcarb"],
    moment: "jantar",
    profile: "casa",
    intro: "O clássico dominical em versão low carb.",
    ingredients: [
      "4 sobrecoxas ou 2 peitos de frango em cubos",
      "1 colher (sopa) de Ana Maria Temperanzza",
      "1 colher (sopa) de azeite",
      "1 xícara de água",
      "Brócolis ou couve-flor cozidos para acompanhar",
    ],
    steps: [
      "Tempere o frango com Ana Maria e deixe descansar 10 minutos.",
      "Doure o frango no azeite em fogo alto.",
      "Adicione a água, tampe e cozinhe em fogo baixo por 20 minutos.",
      "Sirva com os legumes cozidos.",
    ],
    whyItWorks:
      "Frango é proteína versátil. O Ana Maria contém pequena porção de amido — cabe no low carb com moderação, mas não é a escolha para cetose estrita.",
    substitution:
      "Se você segue cetogênica, troque por Tempero Mineiro ou Du Chefe com Páprica.",
    hero: { color: "oklch(0.55 0.12 50)" },
  },

  // Perfil 4 — Especiarias puras e saúde
  {
    slug: "ovos-dourados-curcuma",
    title: "Ovos mexidos dourados com Cúrcuma",
    featuredHandle: "curcuma",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "puras",
    intro: "Ouro no prato, anti-inflamatório natural.",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de azeite",
      "1 pitada de Cúrcuma Temperanzza",
      "Sal e pimenta-do-reino a gosto",
    ],
    steps: [
      "Bata os ovos com sal, pimenta e a cúrcuma.",
      "Aqueça o azeite em fogo baixo e adicione os ovos.",
      "Mexa devagar até formar cremosidade.",
      "Sirva imediatamente.",
    ],
    whyItWorks:
      "Cúrcuma é especiaria pura com curcumina anti-inflamatória. Ovos entregam proteína e gordura.",
    substitution:
      "Adicione a cúrcuma em caldos de ossos ou para colorir arroz de couve-flor.",
    hero: { color: "oklch(0.75 0.16 80)" },
  },
  {
    slug: "frango-grelhado-cebola-em-po",
    title: "Frango grelhado com Cebola em Pó",
    featuredHandle: "cebola-em-po",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "puras",
    intro: "Três ingredientes. Um resultado que engana de tão bom.",
    ingredients: [
      "2 filés de peito de frango",
      "1 colher (chá) de Cebola em Pó Temperanzza",
      "Sal e azeite a gosto",
    ],
    steps: [
      "Tempere os filés com sal e Cebola em Pó.",
      "Regue com azeite e deixe descansar 10 minutos.",
      "Grelhe em frigideira quente 4 minutos de cada lado.",
      "Sirva com salada verde.",
    ],
    whyItWorks:
      "Cebola em pó é coringa: sabor doce-adocicado concentrado, sem carboidrato relevante por porção.",
    substitution:
      "Use a mesma cebola em maionese caseira low carb, manteigas temperadas ou rubs de carne.",
    hero: { color: "oklch(0.86 0.02 90)" },
  },
  {
    slug: "sopa-legumes-cebola-em-po",
    title: "Sopa de legumes com Cebola em Pó",
    featuredHandle: "cebola-em-po",
    compatibleDiets: ["lowcarb", "keto"],
    moment: "jantar",
    profile: "puras",
    intro: "O conforto de uma sopa quente, sem carboidrato pesado.",
    ingredients: [
      "1 abobrinha em cubos",
      "1/2 couve-flor em floretes",
      "1 punhado de brócolis",
      "1 litro de caldo de ossos ou água",
      "1 colher (chá) de Cebola em Pó Temperanzza",
      "Sal, azeite e pimenta-do-reino a gosto",
    ],
    steps: [
      "Refogue os legumes no azeite por 3 minutos.",
      "Adicione o caldo, a Cebola em Pó e sal.",
      "Cozinhe por 15 minutos em fogo médio.",
      "Sirva quente com uma pitada de Pimenta-do-Reino Temperanzza.",
    ],
    whyItWorks:
      "Legumes de baixo carboidrato e caldo de ossos entregam sabor e nutrientes sem pesar.",
    substitution:
      "Use o mesmo tempero em carne moída ou purê de couve-flor.",
    hero: { color: "oklch(0.78 0.04 75)" },
  },

  // Perfil 5 — Cítrico e picante
  {
    slug: "ovo-frito-lemon-pepper",
    title: "Ovo frito com Lemon Pepper",
    featuredHandle: "lemon-pepper",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "cafe",
    profile: "citrico-picante",
    intro: "Um ovo, um sopro cítrico, e a manhã começa diferente.",
    ingredients: [
      "2 ovos",
      "1 colher (sopa) de manteiga",
      "1 pitada de Lemon Pepper Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Derreta a manteiga em frigideira antiaderente.",
      "Quebre os ovos, sem misturar as gemas.",
      "Cozinhe até a clara firmar mantendo a gema mole.",
      "Finalize com uma pitada de Lemon Pepper.",
    ],
    whyItWorks:
      "Ovo é a proteína ideal do café low carb. O Lemon Pepper acorda sem adicionar carboidrato.",
    substitution:
      "Use o mesmo tempero em abacate amassado para um lanche cítrico e cremoso.",
    hero: { color: "oklch(0.75 0.16 95)" },
  },
  {
    slug: "porco-assado-paprica-picante",
    title: "Costelinha de porco com Páprica Picante",
    featuredHandle: "paprica-picante",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "citrico-picante",
    intro: "Casca crocante, gordura derretendo, calor que fica na memória.",
    ingredients: [
      "800 g de costelinha suína",
      "1 colher (sopa) cheia de Páprica Picante Temperanzza",
      "1 colher (chá) de sal grosso",
      "1 colher (sopa) de azeite",
    ],
    steps: [
      "Seque bem a costelinha e faça pequenos cortes na gordura.",
      "Massageie com azeite, sal e Páprica Picante.",
      "Asse a 180 °C por 1 hora coberta com papel-alumínio.",
      "Retire o alumínio e asse mais 20 minutos até dourar.",
    ],
    whyItWorks:
      "Porco é rico em gordura e proteína; a páprica é pura, sem carboidratos adicionados.",
    substitution:
      "A mesma páprica funciona em asas de frango — reduza o forno para 40 minutos.",
    hero: { color: "oklch(0.5 0.2 32)" },
  },
  {
    slug: "camarao-chimi-churri-picante",
    title: "Camarão refogado com Chimi Churri Picante",
    featuredHandle: "chimi-churri-picante",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "jantar",
    profile: "citrico-picante",
    intro: "Frigideira quente, camarão rosado, ervas explodindo. Sete minutos.",
    ingredients: [
      "400 g de camarão limpo",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) de Chimi Churri Picante Temperanzza",
      "Sal e limão a gosto",
      "Arroz de couve-flor para acompanhar",
    ],
    steps: [
      "Seque os camarões com papel-toalha.",
      "Aqueça o azeite em frigideira e adicione os camarões.",
      "Refogue por 2 minutos de cada lado.",
      "Finalize com o Chimi Churri Picante, sal e um esguicho de limão.",
    ],
    whyItWorks:
      "Camarão é proteína magra de baixo carboidrato. O Chimi Churri adiciona complexidade sem açúcar.",
    substitution:
      "Sem camarão? Use frango em cubos — dobre o tempo de cocção para 8 minutos.",
    hero: { color: "oklch(0.55 0.18 30)" },
  },

  // ================================================================
  // MESA DE TODOS — Cozinha Tradicional Brasileira
  // Momento de celebração / Dia Livre — sabor de casa realçado pela Temperanzza
  // ================================================================

  // Perfil 6 — Sabor brasileiro (caseiro, mineiro)
  {
    slug: "pao-de-queijo-tempero-mineiro",
    title: "Pão de queijo com Tempero Mineiro",
    featuredHandle: "tempero-mineiro",
    compatibleDiets: [],
    moment: "cafe",
    profile: "casa",
    category: "tradicional",
    intro: "O clássico das Gerais com um sopro extra de fazenda no aroma.",
    ingredients: [
      "500 g de polvilho azedo",
      "250 ml de leite",
      "125 ml de óleo",
      "2 ovos",
      "250 g de queijo minas meia-cura ralado",
      "1 colher (chá) de sal",
      "1 colher (chá) de Tempero Mineiro Temperanzza",
    ],
    steps: [
      "Ferva o leite com o óleo e o sal.",
      "Escalde o polvilho com a mistura quente e sove até esfriar.",
      "Incorpore os ovos, o queijo ralado e o Tempero Mineiro.",
      "Modele bolinhas e asse a 200 °C por 25 minutos até dourar.",
    ],
    whyItWorks:
      "O Tempero Mineiro é a alma da cozinha das Gerais. Uma pitada na massa realça o queijo e traz o gosto de fogão a lenha ao pão de queijo tradicional.",
    substitution:
      "Também vai bem em omeletes e ovos mexidos para um café da manhã com sabor de fazenda.",
    hero: { color: "oklch(0.75 0.09 85)" },
  },
  {
    slug: "arroz-soltinho-cebola-em-po",
    title: "Arroz soltinho com Cebola em Pó",
    featuredHandle: "cebola-em-po",
    compatibleDiets: [],
    moment: "almoco",
    profile: "puras",
    category: "tradicional",
    intro: "O arroz de todo dia, com o gostinho de um refogado bem feito — em minutos.",
    ingredients: [
      "2 xícaras de arroz branco",
      "1 colher (sopa) de óleo ou manteiga",
      "1 colher (chá) de Cebola em Pó Temperanzza",
      "4 xícaras de água quente",
      "Sal a gosto",
    ],
    steps: [
      "Aqueça o óleo na panela e adicione a Cebola em Pó.",
      "Refogue o arroz por 1 minuto até ficar translúcido.",
      "Adicione a água quente e o sal.",
      "Tampe e cozinhe em fogo baixo até secar. Solte com um garfo.",
    ],
    whyItWorks:
      "A Cebola em Pó é a base do tempero brasileiro. A versão desidratada preserva o sabor sem o trabalho de picar — praticidade que alimenta.",
    substitution:
      "Para um toque extra, adicione uma pitada de Tempero do Edu enquanto o arroz cozinha.",
    hero: { color: "oklch(0.9 0.02 90)" },
  },
  {
    slug: "frango-quiabo-ana-maria",
    title: "Frango com quiabo e Ana Maria",
    featuredHandle: "ana-maria",
    compatibleDiets: [],
    moment: "jantar",
    profile: "casa",
    category: "tradicional",
    intro: "Prato de domingo mineiro — angu, quiabo e frango num só bocado.",
    ingredients: [
      "1 kg de frango em pedaços",
      "300 g de quiabo cortado em rodelas",
      "2 tomates picados",
      "1 cebola picada",
      "2 dentes de alho amassados",
      "2 colheres (sopa) de Ana Maria Temperanzza",
      "Óleo, sal e água a gosto",
    ],
    steps: [
      "Doure o frango no óleo com a cebola e o alho.",
      "Adicione o tomate, o Ana Maria e um pouco de água. Cozinhe 15 minutos.",
      "Junte o quiabo e deixe cozinhar mais 10 minutos em fogo baixo.",
      "Sirva com angu ou polenta cremosa.",
    ],
    whyItWorks:
      "O Ana Maria é o tempero-coringa da cozinha caseira brasileira. Realça o frango e combina com o quiabo num prato que abraça.",
    substitution:
      "Sem quiabo? Faça frango com jiló ou uma canja tradicional usando o mesmo tempero.",
    hero: { color: "oklch(0.5 0.14 55)" },
  },

  // Perfil 7 — Churrasco e grelhados
  {
    slug: "ovos-fritos-bacon-tradicional",
    title: "Ovos fritos com Temperaflix Bacon",
    featuredHandle: "temperaflix-bacon",
    compatibleDiets: [],
    moment: "cafe",
    profile: "defumado",
    category: "tradicional",
    intro: "Café da manhã de fim de semana — defumado no primeiro cheiro.",
    ingredients: [
      "3 ovos",
      "1 colher (sopa) de manteiga",
      "1 colher (chá) cheia de Temperaflix Bacon",
      "Pão francês, tapioca ou torradas para acompanhar",
    ],
    steps: [
      "Derreta a manteiga numa frigideira antiaderente.",
      "Frite os ovos mantendo a gema mole.",
      "Salpique o Temperaflix Bacon generosamente por cima.",
      "Sirva com o acompanhamento de sua preferência.",
    ],
    whyItWorks:
      "O Temperaflix Bacon traz o aroma e o sabor do bacon fatiado de forma instantânea — perfeito para transformar um ovo frito comum em algo memorável.",
    substitution:
      "Experimente no pão na chapa com queijo derretido ou em patês para um lanche defumado.",
    hero: { color: "oklch(0.4 0.08 40)" },
  },
  {
    slug: "bife-acebolado-lemon-pepper",
    title: "Bife acebolado com Lemon Pepper",
    featuredHandle: "lemon-pepper",
    compatibleDiets: [],
    moment: "almoco",
    profile: "citrico-picante",
    category: "tradicional",
    intro: "O bife de PF elevado — cítrico, dourado, com cebola caramelizada.",
    ingredients: [
      "2 bifes de contrafilé ou alcatra",
      "1 cebola grande em rodelas",
      "2 colheres (sopa) de óleo",
      "1 colher (chá) de Lemon Pepper Temperanzza",
      "Sal a gosto",
      "Arroz e feijão para acompanhar",
    ],
    steps: [
      "Tempere os bifes com sal e Lemon Pepper.",
      "Aqueça o óleo em frigideira bem quente e sele os bifes 2 minutos de cada lado.",
      "Retire os bifes e, na mesma frigideira, refogue a cebola até dourar.",
      "Devolva os bifes, misture com a cebola e sirva com arroz e feijão.",
    ],
    whyItWorks:
      "O toque cítrico do Lemon Pepper corta a gordura da carne e realça a doçura da cebola caramelizada — um clássico brasileiro reinventado.",
    substitution:
      "Também é excelente em peixes assados, filé de frango grelhado ou batata frita rústica.",
    hero: { color: "oklch(0.6 0.14 85)" },
  },
  {
    slug: "costelinha-paprica-defumada-tradicional",
    title: "Costelinha de porco assada com Páprica Defumada",
    featuredHandle: "paprica-defumada",
    compatibleDiets: [],
    moment: "jantar",
    profile: "defumado",
    category: "tradicional",
    intro: "Domingo em família, forno ligado, aroma defumado tomando a casa.",
    ingredients: [
      "1,2 kg de costelinha suína",
      "2 colheres (sopa) cheias de Páprica Defumada Temperanzza",
      "2 colheres (sopa) de azeite",
      "Sal grosso a gosto",
      "1 limão",
      "Mandioca cozida e farofa para acompanhar",
    ],
    steps: [
      "Tempere a costelinha com sal, azeite, Páprica Defumada e o suco do limão.",
      "Deixe marinar por 30 minutos.",
      "Asse coberta a 180 °C por 1 h 30 min.",
      "Retire a cobertura e asse mais 20 minutos até dourar. Sirva com mandioca e farofa.",
    ],
    whyItWorks:
      "A Páprica Defumada confere aquele aroma de churrasqueira sem sair da cozinha — um clássico brasileiro que abraça a mesa toda.",
    substitution:
      "Excelente para temperar linguiças caseiras, frango a passarinho ou molhos barbecue tradicionais.",
    hero: { color: "oklch(0.42 0.15 35)" },
  },

  // Perfil 8 — Ervas e especiarias em pratos tradicionais
  {
    slug: "omelete-ervas-finas-tradicional",
    title: "Omelete aromática com Ervas Finas",
    featuredHandle: "ervas-finas",
    compatibleDiets: [],
    moment: "cafe",
    profile: "ervas",
    category: "tradicional",
    intro: "Um café da manhã simples e perfumado — no espírito da mesa francesa e brasileira.",
    ingredients: [
      "3 ovos",
      "50 g de queijo mussarela ralado",
      "1 colher (sopa) de manteiga",
      "1 pitada generosa de Ervas Finas Temperanzza",
      "Sal e pimenta a gosto",
      "Pão de forma ou tapioca para acompanhar",
    ],
    steps: [
      "Bata os ovos com sal, pimenta e as Ervas Finas.",
      "Derreta a manteiga em frigideira antiaderente.",
      "Despeje os ovos, distribua o queijo e cozinhe em fogo baixo.",
      "Dobre a omelete ao meio e sirva com o acompanhamento.",
    ],
    whyItWorks:
      "As Ervas Finas dão frescor e sofisticação a um prato do dia a dia — o mesmo omelete de sempre com aroma de bistrô.",
    substitution:
      "Use as Ervas Finas em patês de queijo, saladas de batata ou para temperar queijos frescos como boursin caseiro.",
    hero: { color: "oklch(0.6 0.11 140)" },
  },
  {
    slug: "frango-chimi-churri-tradicional",
    title: "Frango grelhado com Chimi Churri",
    featuredHandle: "chimi-churri-sem-pimenta",
    compatibleDiets: [],
    moment: "almoco",
    profile: "ervas",
    category: "tradicional",
    intro: "O frango de todo dia com o sabor do pampa argentino no prato.",
    ingredients: [
      "4 filés de peito de frango",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) cheia de Chimi Churri Sem Pimenta Temperanzza",
      "Sal a gosto",
      "Arroz branco e salada para acompanhar",
    ],
    steps: [
      "Tempere os filés com sal, azeite e Chimi Churri. Deixe marinar 15 minutos.",
      "Grelhe em frigideira ou churrasqueira 4 minutos de cada lado.",
      "Deixe descansar 2 minutos antes de cortar.",
      "Sirva com arroz branco e salada de folhas.",
    ],
    whyItWorks:
      "O Chimi Churri é a assinatura sul-americana no frango — ervas, alho e um leve vinagre que combinam com qualquer prato do almoço brasileiro.",
    substitution:
      "Ótimo em carnes vermelhas grelhadas, peixes assados ou como molho para salada com azeite e vinagre.",
    hero: { color: "oklch(0.55 0.13 145)" },
  },
  {
    slug: "legumes-assados-curcuma-tradicional",
    title: "Legumes assados com Cúrcuma",
    featuredHandle: "curcuma",
    compatibleDiets: [],
    moment: "jantar",
    profile: "puras",
    category: "tradicional",
    intro: "Cor, aroma e um acompanhamento que vira protagonista.",
    ingredients: [
      "1 abobrinha em cubos",
      "1 berinjela em cubos",
      "2 cenouras em rodelas grossas",
      "2 batatas em cubos",
      "3 colheres (sopa) de azeite",
      "1 colher (chá) de Cúrcuma Temperanzza",
      "Sal e pimenta-do-reino a gosto",
    ],
    steps: [
      "Misture todos os legumes numa assadeira grande.",
      "Regue com azeite e polvilhe sal, pimenta e a Cúrcuma.",
      "Misture bem para colorir por igual.",
      "Asse a 200 °C por 35 minutos, mexendo na metade do tempo.",
    ],
    whyItWorks:
      "A Cúrcuma dá cor de ouro aos legumes e um sabor terroso suave — transforma um acompanhamento comum em prato de destaque na mesa da família.",
    substitution:
      "Use a Cúrcuma em sopas, caldos, arroz amarelo ou para temperar lentilha e grão de bico.",
    hero: { color: "oklch(0.78 0.14 80)" },
  },

  // ── Páprica Doce ──
  {
    slug: "frango-dourado-paprica-doce",
    title: "Frango dourado com Páprica Doce",
    featuredHandle: "paprica-doce",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "defumado",
    intro: "Cor de outono, sabor redondo — a páprica doce dourando cada pedaço.",
    ingredients: [
      "4 filés de frango (peito ou sassami)",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) cheia de Páprica Doce Temperanzza",
      "Sal grosso a gosto",
      "Suco de meio limão",
    ],
    steps: [
      "Seque os filés com papel-toalha e tempere com sal.",
      "Massageie com azeite e Páprica Doce até cobrir por completo.",
      "Grelhe em frigideira quente por 4 minutos de cada lado.",
      "Finalize com o suco de limão fora do fogo e deixe descansar 2 minutos antes de servir.",
    ],
    whyItWorks:
      "Páprica Doce é especiaria pura, sem carga glicêmica — colore, adoça naturalmente e realça a proteína magra sem tirar o prato do escopo cetogênico ou carnívoro flexível.",
    substitution:
      "Troque o frango por peixe branco (tilápia, pescada) e reduza o tempo para 2 minutos de cada lado.",
    hero: { color: "oklch(0.55 0.16 55)" },
  },

  // ── Du-Chefe com Páprica ──
  {
    slug: "costela-porco-du-chefe",
    title: "Costela suína ao Du-Chefe com Páprica",
    featuredHandle: "du-chefe-com-paprica",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "jantar",
    profile: "casa",
    category: "tradicional",
    intro: "O tempero da casa que veste a costela de forno inteira.",
    ingredients: [
      "1,2 kg de costela suína em pedaços",
      "2 colheres (sopa) de Du-Chefe com Páprica",
      "3 colheres (sopa) de azeite",
      "1 cebola em rodelas grossas",
      "Sal a gosto",
    ],
    steps: [
      "Tempere a costela com sal e Du-Chefe — massageie bem para o tempero aderir.",
      "Deixe descansar 30 minutos na geladeira.",
      "Disponha em assadeira com as cebolas por baixo e regue com azeite.",
      "Cubra com papel-alumínio e asse a 180 °C por 1h30. Retire o alumínio e finalize por 20 minutos até dourar.",
    ],
    whyItWorks:
      "Du-Chefe é o mix da casa: páprica, ervas e especiarias sem amidos nem açúcares. Perfeito para carne suína, mantém a receita dentro do low carb e do carnívoro flexível.",
    substitution:
      "Sem forno? Faça na panela de pressão por 40 minutos com um dedo de água e finalize na frigideira para dourar.",
    hero: { color: "oklch(0.45 0.12 40)" },
  },

  // ── Pimenta-do-Reino ──
  {
    slug: "bife-cavalo-pimenta-reino",
    title: "Bife à cavalo com Pimenta-do-Reino Temperanzza",
    featuredHandle: "pimenta-do-reino",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "almoco",
    profile: "puras",
    category: "tradicional",
    intro: "O clássico do PF brasileiro, elevado por uma pimenta pura e aromática.",
    ingredients: [
      "2 bifes de contrafilé (200 g cada)",
      "2 ovos",
      "1 colher (sopa) de manteiga",
      "Pimenta-do-Reino Temperanzza a gosto",
      "Sal grosso a gosto",
    ],
    steps: [
      "Seque os bifes e tempere com sal dos dois lados.",
      "Aqueça a frigideira até fumegar. Grelhe os bifes 2 minutos de cada lado (ao ponto).",
      "Retire, cubra com uma boa pitada de Pimenta-do-Reino Temperanzza e deixe descansar.",
      "Na mesma frigideira, derreta a manteiga e frite os ovos com gema mole. Sirva sobre os bifes.",
    ],
    whyItWorks:
      "Bife e ovo é a dupla de proteína e gordura que cabe em todos os protocolos — inclusive na carnívora estrita. A pimenta-do-reino é a única especiaria universalmente aceita: puríssima, aromática, sem carboidratos.",
    substitution:
      "Prefere gema dura? Cozinhe os ovos 4 minutos. Sem contrafilé? Use alcatra ou coxão-mole.",
    hero: { color: "oklch(0.3 0.05 30)" },
  },

  // ── Canela Moída ──
  {
    slug: "cafe-ritual-canela",
    title: "Café ritual com Canela e manteiga",
    featuredHandle: "canela-moida",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "cafe",
    profile: "puras",
    intro: "O bulletproof brasileiro — café coado, manteiga e a canela como perfume.",
    ingredients: [
      "1 xícara de café coado forte",
      "1 colher (sopa) de manteiga sem sal",
      "1 colher (chá) de óleo de coco (opcional)",
      "1/2 colher (chá) de Canela Moída Temperanzza",
    ],
    steps: [
      "Bata todos os ingredientes no liquidificador ou mixer por 20 segundos.",
      "Sirva imediatamente em uma caneca alta, com um pouco de canela extra por cima.",
    ],
    whyItWorks:
      "Gordura boa como fonte de energia matinal — sem picos de glicose. A canela realça a doçura natural do café sem adicionar carboidratos, mantendo a cetose intacta.",
    substitution:
      "Não come laticínio? Troque a manteiga por 2 colheres (sopa) de leite de coco integral.",
    hero: { color: "oklch(0.45 0.09 55)" },
  },
  {
    slug: "maca-assada-canela",
    title: "Maçã assada com Canela na air fryer",
    featuredHandle: "canela-moida",
    compatibleDiets: ["lowcarb"],
    moment: "jantar",
    profile: "puras",
    category: "tradicional",
    intro: "Sobremesa de vó em versão rápida — sem açúcar, só a canela para adoçar.",
    ingredients: [
      "2 maçãs firmes (fuji ou gala) cortadas em gomos",
      "1 colher (sopa) de manteiga derretida",
      "1 colher (chá) cheia de Canela Moída Temperanzza",
      "1 pitada de sal",
    ],
    steps: [
      "Misture as maçãs com a manteiga, a canela e o sal.",
      "Disponha na cesta da air fryer em camada única.",
      "Asse a 180 °C por 12 minutos, agitando a cesta na metade do tempo.",
      "Sirva morna, sozinha ou com uma colherada de iogurte natural integral.",
    ],
    whyItWorks:
      "A canela intensifica a doçura da maçã e evita o pico glicêmico ao retardar a absorção do açúcar da fruta — sobremesa reconfortante que cabe no low carb sem culpa.",
    substitution:
      "Substitua a maçã por pera ou pêssego — mesma quantidade, mesmo tempo de forno.",
    hero: { color: "oklch(0.55 0.12 45)" },
  },

  // ── Temperaflix Tradicional ──
  {
    slug: "pipoca-caseira-temperaflix-tradicional",
    title: "Pipoca da casa com Temperaflix Tradicional",
    featuredHandle: "temperaflix-tradicional",
    compatibleDiets: ["lowcarb"],
    moment: "jantar",
    profile: "casa",
    category: "tradicional",
    intro: "A pipoca de cinema que a gente faz em casa e some do pote em 5 minutos.",
    ingredients: [
      "1/2 xícara de milho para pipoca",
      "2 colheres (sopa) de óleo de coco ou manteiga ghee",
      "Temperaflix Tradicional a gosto (borrifar quente)",
      "Sal fino se desejar",
    ],
    steps: [
      "Aqueça o óleo em panela grande com tampa em fogo médio-alto.",
      "Adicione o milho, tampe e sacuda a panela até os estouros pararem.",
      "Transfira para uma tigela ainda quente e polvilhe o Temperaflix Tradicional generosamente.",
      "Sacuda a tigela para o tempero cobrir todos os grãos.",
    ],
    whyItWorks:
      "Temperaflix Tradicional foi desenhado para aderir a alimentos quentes — a pipoca é o cenário ideal. Uma pitada por porção mantém o snack dentro do low carb, sem estragar a cetose ocasional.",
    substitution:
      "Sirva com uma cerveja artesanal ou refrigerante zero — vira o petisco perfeito para o filme de sexta.",
    hero: { color: "oklch(0.72 0.14 75)" },
  },

  // ── Temperaflix Ervas Finas ──
  {
    slug: "mix-castanhas-temperaflix-ervas",
    title: "Mix de castanhas assadas com Temperaflix Ervas Finas",
    featuredHandle: "temperaflix-ervas-finas",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "jantar",
    profile: "ervas",
    intro: "O aperitivo elegante que salva qualquer happy hour em casa.",
    ingredients: [
      "200 g de mix de castanhas cruas (do pará, caju, amêndoa, nozes)",
      "1 colher (sopa) de azeite",
      "2 colheres (chá) de Temperaflix Ervas Finas",
      "Sal grosso a gosto",
    ],
    steps: [
      "Espalhe as castanhas numa assadeira, regue com azeite e misture.",
      "Leve ao forno a 160 °C por 12 minutos, mexendo na metade.",
      "Assim que sair do forno, polvilhe o Temperaflix Ervas Finas e o sal.",
      "Sacuda para cobrir por igual e deixe esfriar antes de servir.",
    ],
    whyItWorks:
      "Castanhas são gordura boa e proteína — combinação ideal para keto e low carb. As ervas finas trazem o toque provençal que eleva o snack de comum a memorável.",
    substitution:
      "Sem forno? Use a air fryer a 160 °C por 8 minutos. Sem mix pronto? Use só amêndoas — funciona igual.",
    hero: { color: "oklch(0.6 0.11 130)" },
  },

  // ═══════════════════════════════════════════════════════════════
  // Capítulo novo — 12 receitas autorais (2026)
  // ═══════════════════════════════════════════════════════════════

  // ── I. Cetogênicas ──
  {
    slug: "salmao-crosta-ervas-finas",
    title: "Salmão selado com crosta de Ervas Finas",
    featuredHandle: "ervas-finas",
    compatibleDiets: ["keto", "lowcarb", "carnivora-flex"],
    moment: "jantar",
    profile: "ervas",
    subtitle: "Ômega-3 e crocância numa selada rápida.",
    intro: "Ômega-3 e crocância numa selada rápida.",
    time: "15 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 postas de salmão com pele",
      "1 colher (sopa) de azeite",
      "1 colher (sopa) cheia de Ervas Finas Temperanzza",
      "Sal grosso a gosto",
      "½ limão siciliano",
    ],
    steps: [
      "Seque as postas de salmão e tempere com sal e Ervas Finas dos dois lados.",
      "Aqueça o azeite em frigideira antiaderente até quase fumegar.",
      "Sele o salmão com a pele para baixo por 4 minutos, vire e finalize por mais 2 minutos.",
      "Regue com limão siciliano antes de servir.",
    ],
    chefWord:
      "Salmão é rico em ômega-3 e praticamente livre de carboidrato — a Ervas Finas realça sem competir com a gordura do peixe.",
    whyItWorks:
      "Salmão é rico em ômega-3 e praticamente livre de carboidrato — a Ervas Finas realça sem competir com a gordura do peixe.",
    substitution:
      "Sem salmão? Truta ou robalo funcionam com o mesmo tempo de selada.",
    harmonization: ["lemon-pepper", "salsa-cebola-e-alho"],
    hero: { color: "oklch(0.58 0.10 140)" },
  },
  {
    slug: "abacate-recheado-frango-chimi-churri",
    title: "Abacate recheado com frango e Chimichurri sem Pimenta",
    featuredHandle: "chimichurri-sem-pimenta",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "almoco",
    profile: "ervas",
    subtitle: "Gordura boa e proteína num só abacate.",
    intro: "Gordura boa e proteína num só abacate.",
    time: "20 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 abacates maduros",
      "200 g de frango cozido desfiado",
      "1 colher (sopa) de Chimichurri sem Pimenta Temperanzza",
      "1 colher (sopa) de azeite",
      "Sal a gosto",
    ],
    steps: [
      "Corte os abacates ao meio e retire o caroço.",
      "Misture o frango desfiado com azeite, sal e Chimichurri sem Pimenta.",
      "Recheie as metades de abacate com a mistura.",
      "Sirva em temperatura ambiente ou leve 5 minutos ao forno para gratinar levemente.",
    ],
    chefWord:
      "O abacate é gordura monoinsaturada pura; o Chimichurri sem Pimenta traz acidez e verde sem abrir mão do baixo carboidrato.",
    whyItWorks:
      "O abacate é gordura monoinsaturada pura; o Chimichurri sem Pimenta traz acidez e verde sem abrir mão do baixo carboidrato.",
    substitution:
      "Troque o frango por atum em lata escorrido para uma versão ainda mais rápida.",
    harmonization: ["chimichurri-picante", "salsa-cebola-e-alho"],
    hero: { color: "oklch(0.56 0.11 145)" },
  },
  {
    slug: "couve-flor-gratinada-curcuma",
    title: "Couve-flor gratinada com manteiga e Cúrcuma",
    featuredHandle: "curcuma",
    compatibleDiets: ["keto", "lowcarb"],
    moment: "jantar",
    profile: "puras",
    subtitle: "Dourada por fora, cremosa por dentro.",
    intro: "Dourada por fora, cremosa por dentro.",
    time: "30 min",
    serves: "4 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "1 couve-flor média em buquês",
      "2 colheres (sopa) de manteiga derretida",
      "1 colher (chá) de Cúrcuma Temperanzza",
      "100 g de queijo ralado",
      "Sal a gosto",
    ],
    steps: [
      "Cozinhe os buquês no vapor por 8 minutos, até ficarem macios.",
      "Misture a manteiga com a Cúrcuma e o sal, e regue sobre a couve-flor.",
      "Cubra com queijo ralado e leve ao forno a 200 °C por 12 minutos, até gratinar.",
    ],
    chefWord:
      "Cúrcuma tem função anti-inflamatória reconhecida e zero carboidrato líquido — perfeita para pratos vegetarianos dentro do protocolo cetogênico.",
    whyItWorks:
      "Cúrcuma tem função anti-inflamatória reconhecida e zero carboidrato líquido — perfeita para pratos vegetarianos dentro do protocolo cetogênico.",
    substitution:
      "Sem lactose? Troque a manteiga por ghee e o queijo por castanhas trituradas.",
    harmonization: ["cebola-em-po", "ervas-finas"],
    hero: { color: "oklch(0.68 0.15 85)" },
  },

  // ── II. Low Carb ──
  {
    slug: "sardinha-grelhada-lemon-pepper",
    title: "Sardinha grelhada com Lemon Pepper",
    featuredHandle: "lemon-pepper",
    compatibleDiets: ["lowcarb", "keto", "carnivora-flex"],
    moment: "almoco",
    profile: "citrico-picante",
    subtitle: "Peixe do dia, tempero da casa.",
    intro: "Peixe do dia, tempero da casa.",
    time: "12 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "6 sardinhas limpas",
      "1 colher (sopa) de azeite",
      "1 colher (sopa) de Lemon Pepper Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Tempere as sardinhas com azeite, sal e Lemon Pepper, por dentro e por fora.",
      "Grelhe em fogo alto por 3 minutos de cada lado.",
      "Sirva imediatamente, ainda quente.",
    ],
    chefWord:
      "Peixes pequenos como a sardinha são a fonte de ômega-3 mais acessível — o limão do Lemon Pepper equilibra o gosto mais forte do peixe.",
    whyItWorks:
      "Peixes pequenos como a sardinha são a fonte de ômega-3 mais acessível — o limão do Lemon Pepper equilibra o gosto mais forte do peixe.",
    substitution:
      "Prefira sardinha fresca; se usar congelada, seque bem antes de temperar para dourar melhor.",
    harmonization: ["ervas-finas", "salsa-cebola-e-alho"],
    hero: { color: "oklch(0.72 0.14 100)" },
  },
  {
    slug: "panqueca-proteica-tempero-edu",
    title: "Panqueca proteica com Tempero do Edu",
    featuredHandle: "edu-guedes",
    compatibleDiets: ["lowcarb", "keto"],
    moment: "cafe",
    profile: "casa",
    subtitle: "Café da manhã salgado, sem pressa.",
    intro: "Café da manhã salgado, sem pressa.",
    time: "10 min",
    serves: "1 pessoa",
    difficulty: "Fácil",
    ingredients: [
      "2 ovos",
      "30 g de queijo cottage ou ricota",
      "1 colher (chá) de Tempero do Edu Temperanzza",
      "1 colher (sopa) de manteiga para a frigideira",
    ],
    steps: [
      "Bata os ovos com o queijo e o Tempero do Edu até ficar homogêneo.",
      "Derreta a manteiga numa frigideira antiaderente em fogo médio-baixo.",
      "Despeje a massa e cozinhe 2 minutos de cada lado, até dourar.",
    ],
    chefWord:
      "Ovo e queijo formam uma dupla de proteína completa; o Tempero do Edu dá o toque de casa sem precisar de farinha.",
    whyItWorks:
      "Ovo e queijo formam uma dupla de proteína completa; o Tempero do Edu dá o toque de casa sem precisar de farinha.",
    substitution:
      "Adicione espinafre picado à massa para mais volume sem carboidrato.",
    harmonization: ["ervas-finas", "cebola-em-po"],
    hero: { color: "oklch(0.62 0.12 60)" },
  },
  {
    slug: "berinjela-assada-tempero-mineiro",
    title: "Berinjela assada recheada com Tempero Mineiro",
    featuredHandle: "tempero-mineiro",
    compatibleDiets: ["lowcarb"],
    moment: "jantar",
    profile: "casa",
    subtitle: "A berinjela vira prato principal.",
    intro: "A berinjela vira prato principal.",
    time: "35 min",
    serves: "2 pessoas",
    difficulty: "Médio",
    ingredients: [
      "2 berinjelas médias",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) de Tempero Mineiro Temperanzza",
      "100 g de queijo muçarela ralado",
      "Sal a gosto",
    ],
    steps: [
      "Corte as berinjelas ao meio, risque a polpa em quadriculado e regue com azeite, sal e Tempero Mineiro.",
      "Asse a 200 °C por 20 minutos, até a polpa amaciar.",
      "Amasse levemente a polpa, cubra com queijo e volte ao forno por mais 8 minutos, até gratinar.",
    ],
    chefWord:
      "Berinjela assada tem baixa carga de carboidrato e absorve bem o Tempero Mineiro, feito para dar profundidade sem pesar.",
    whyItWorks:
      "Berinjela assada tem baixa carga de carboidrato e absorve bem o Tempero Mineiro, feito para dar profundidade sem pesar.",
    substitution:
      "Adicione carne moída refogada ao recheio para uma versão mais robusta.",
    harmonization: ["cebola-em-po", "ana-maria"],
    hero: { color: "oklch(0.42 0.09 320)" },
  },

  // ── III. Carnívora Flexível ──
  {
    slug: "costela-bovina-pimenta-reino",
    title: "Costela bovina lenta com Pimenta-do-Reino",
    featuredHandle: "pimenta-do-reino-premium-black-30g",
    compatibleDiets: ["carnivora-flex", "keto", "lowcarb"],
    moment: "jantar",
    profile: "puras",
    subtitle: "Fogo baixo, sabor que não se apressa.",
    intro: "Fogo baixo, sabor que não se apressa.",
    time: "3 h",
    serves: "4 pessoas",
    difficulty: "Médio",
    ingredients: [
      "1,5 kg de costela bovina em peça única",
      "Sal grosso a gosto",
      "1 colher (sopa) de Pimenta-do-Reino Temperanzza",
      "2 colheres (sopa) de azeite",
    ],
    steps: [
      "Tempere a costela com sal, azeite e Pimenta-do-Reino, cobrindo toda a peça.",
      "Embrulhe em papel-alumínio e leve ao forno a 150 °C por 2h30.",
      "Retire o papel-alumínio e volte ao forno por 20 minutos, até dourar por fora.",
      "Deixe descansar 10 minutos antes de fatiar.",
    ],
    chefWord:
      "Costela é proteína e gordura em estado puro; a Pimenta-do-Reino da casa realça sem disfarçar o sabor da carne — base de qualquer protocolo carnívoro.",
    whyItWorks:
      "Costela é proteína e gordura em estado puro; a Pimenta-do-Reino da casa realça sem disfarçar o sabor da carne — base de qualquer protocolo carnívoro.",
    substitution:
      "Sem tempo? Use panela de pressão por 45 minutos no lugar do forno lento.",
    harmonization: ["edu-guedes", "paprica-defumada"],
    hero: { color: "oklch(0.3 0.05 30)" },
  },
  {
    slug: "figado-acebolado-cebola-po",
    title: "Fígado acebolado com Cebola em Pó",
    featuredHandle: "cebola-em-po",
    compatibleDiets: ["carnivora-flex", "keto", "lowcarb"],
    moment: "almoco",
    profile: "puras",
    subtitle: "Densidade nutricional em 15 minutos.",
    intro: "Densidade nutricional em 15 minutos.",
    time: "15 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "400 g de fígado bovino fatiado",
      "1 cebola grande fatiada",
      "1 colher (sopa) de manteiga",
      "1 colher (chá) de Cebola em Pó Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Tempere o fígado com sal e Cebola em Pó.",
      "Refogue a cebola fatiada na manteiga até dourar e murchar; reserve.",
      "Na mesma panela, sele o fígado em fogo alto por 2 minutos de cada lado — não passe do ponto.",
      "Devolva a cebola à panela, misture e sirva.",
    ],
    chefWord:
      "Fígado é um dos alimentos mais densos em nutrientes que existem; a Cebola em Pó suaviza o gosto sem mascarar o que importa.",
    whyItWorks:
      "Fígado é um dos alimentos mais densos em nutrientes que existem; a Cebola em Pó suaviza o gosto sem mascarar o que importa.",
    substitution:
      "Fígado de frango reduz o sabor mais forte e cozinha em metade do tempo.",
    harmonization: ["tempero-mineiro", "ana-maria"],
    hero: { color: "oklch(0.36 0.06 25)" },
  },
  {
    slug: "camarao-manteiga-salsa-cebola-alho",
    title: "Camarão na manteiga com Salsa, Cebola e Alho",
    featuredHandle: "salsa-cebola-e-alho",
    compatibleDiets: ["carnivora-flex", "keto", "lowcarb"],
    moment: "jantar",
    profile: "casa",
    subtitle: "Cinco minutos entre a panela e a mesa.",
    intro: "Cinco minutos entre a panela e a mesa.",
    time: "10 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "400 g de camarão limpo",
      "2 colheres (sopa) de manteiga",
      "1 colher (sopa) de Salsa, Cebola e Alho Temperanzza",
      "Suco de ½ limão",
      "Sal a gosto",
    ],
    steps: [
      "Derreta a manteiga em fogo alto numa frigideira ampla.",
      "Adicione o camarão temperado com sal e Salsa, Cebola e Alho.",
      "Salteie por 2 a 3 minutos, até o camarão ficar rosado — não passe do ponto.",
      "Finalize com o suco de limão e sirva imediatamente.",
    ],
    chefWord:
      "Camarão cozinha rápido e é praticamente proteína pura; a Salsa, Cebola e Alho já traz a base aromática pronta, sem precisar picar nada.",
    whyItWorks:
      "Camarão cozinha rápido e é praticamente proteína pura; a Salsa, Cebola e Alho já traz a base aromática pronta, sem precisar picar nada.",
    substitution:
      "Reserve um pouco da manteiga da panela para regar arroz ou legumes de acompanhamento.",
    harmonization: ["chimichurri-sem-pimenta", "lemon-pepper"],
    hero: { color: "oklch(0.66 0.14 45)" },
  },

  // ── IV. Pratos Tradicionais ──
  {
    slug: "carne-panela-batatas-tempero-mineiro",
    title: "Carne de panela com batatas e Tempero Mineiro",
    featuredHandle: "tempero-mineiro",
    compatibleDiets: [],
    moment: "jantar",
    profile: "casa",
    category: "tradicional",
    subtitle: "O prato de domingo, todo dia.",
    intro: "O prato de domingo, todo dia.",
    time: "1h20",
    serves: "4 pessoas",
    difficulty: "Médio",
    ingredients: [
      "800 g de acém em cubos",
      "4 batatas médias em pedaços grandes",
      "1 cebola picada",
      "2 colheres (sopa) cheias de Tempero Mineiro Temperanzza",
      "2 colheres (sopa) de óleo",
    ],
    steps: [
      "Doure a carne no óleo em fogo alto, em porções, até selar todos os lados.",
      "Adicione a cebola e o Tempero Mineiro, refogue por 2 minutos.",
      "Cubra com água quente, tampe e cozinhe em fogo baixo por 50 minutos.",
      "Acrescente as batatas e cozinhe por mais 20 minutos, até a carne desmanchar e o molho encorpar.",
    ],
    chefWord:
      "Carne de panela é sobre paciência — o Tempero Mineiro foi feito para segurar o sabor durante o cozimento longo, sem se perder no caldo.",
    whyItWorks:
      "Carne de panela é sobre paciência — o Tempero Mineiro foi feito para segurar o sabor durante o cozimento longo, sem se perder no caldo.",
    substitution:
      "Panela de pressão reduz o tempo total para cerca de 35 minutos.",
    harmonization: ["ana-maria", "pimenta-do-reino-premium-black-30g"],
    hero: { color: "oklch(0.38 0.08 40)" },
  },
  {
    slug: "peixe-assado-legumes-salsa-cebola-alho",
    title: "Peixe assado com legumes e Salsa, Cebola e Alho",
    featuredHandle: "salsa-cebola-e-alho",
    compatibleDiets: [],
    moment: "jantar",
    profile: "casa",
    category: "tradicional",
    subtitle: "Uma travessa só, sem complicação.",
    intro: "Uma travessa só, sem complicação.",
    time: "40 min",
    serves: "2 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "2 filés de peixe branco (tilápia ou merluza)",
      "2 xícaras de legumes variados (abobrinha, cenoura, pimentão) em fatias",
      "2 colheres (sopa) de azeite",
      "1 colher (sopa) de Salsa, Cebola e Alho Temperanzza",
      "Sal a gosto",
    ],
    steps: [
      "Disponha os legumes numa assadeira, regue com metade do azeite e metade do tempero.",
      "Leve ao forno a 200 °C por 15 minutos.",
      "Retire, acomode os filés de peixe sobre os legumes e regue com o restante do azeite e do tempero.",
      "Volte ao forno por mais 15 minutos, até o peixe ficar macio e os legumes dourados.",
    ],
    chefWord:
      "Peixe branco é leve e neutro; a Salsa, Cebola e Alho dá a base de sabor que uma travessa só precisa para virar refeição completa.",
    whyItWorks:
      "Peixe branco é leve e neutro; a Salsa, Cebola e Alho dá a base de sabor que uma travessa só precisa para virar refeição completa.",
    substitution:
      "Troque os legumes conforme a estação — brócolis e couve-flor também funcionam bem.",
    harmonization: ["lemon-pepper", "ervas-finas"],
    hero: { color: "oklch(0.6 0.10 130)" },
  },
  {
    slug: "feijao-tropeiro-ana-maria",
    title: "Feijão tropeiro com Ana Maria",
    featuredHandle: "ana-maria",
    compatibleDiets: [],
    moment: "almoco",
    profile: "casa",
    category: "tradicional",
    subtitle: "Tradição mineira, do jeito que deve ser.",
    intro: "Tradição mineira, do jeito que deve ser.",
    time: "30 min",
    serves: "4 pessoas",
    difficulty: "Fácil",
    ingredients: [
      "3 xícaras de feijão carioca cozido e escorrido",
      "150 g de bacon em cubos",
      "2 ovos",
      "1 xícara de farinha de mandioca",
      "1 colher (sopa) de Ana Maria Temperanzza",
    ],
    steps: [
      "Frite o bacon até dourar e soltar gordura; reserve parte da gordura na panela.",
      "Frite os ovos mexidos na mesma gordura e reserve.",
      "Refogue o feijão escorrido com a Ana Maria por 3 minutos.",
      "Adicione a farinha de mandioca aos poucos, misturando, e finalize com o bacon e os ovos.",
    ],
    chefWord:
      "Feijão tropeiro é memória afetiva de Minas — a Ana Maria é a nossa homenagem a esse tempero de fundo de quintal, que dá liga sem exagero.",
    whyItWorks:
      "Feijão tropeiro é memória afetiva de Minas — a Ana Maria é a nossa homenagem a esse tempero de fundo de quintal, que dá liga sem exagero.",
    substitution:
      "Sirva com couve refogada e arroz branco para o combo mineiro completo.",
    harmonization: ["tempero-mineiro", "cebola-em-po"],
    hero: { color: "oklch(0.45 0.09 55)" },
  },
];



export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export function getRecipesByHandle(handle: string): Recipe[] {
  return RECIPES.filter((r) => r.featuredHandle === handle);
}

// ═══════════════════════════════════════════════════════════════════
// Proteína principal — filtro complementar da Biblioteca Gastronômica
// ═══════════════════════════════════════════════════════════════════

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
 * Mantida como mapa por slug (em vez de campo repetido em cada objeto)
 * para não tocar em nenhum registro existente.
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
  "frango-panela-ana-maria": "frango",
  "ovos-dourados-curcuma": "ovo",
  "frango-grelhado-cebola-em-po": "frango",
  "sopa-legumes-cebola-em-po": "vegetariano",
  "ovo-frito-lemon-pepper": "ovo",
  "porco-assado-paprica-picante": "suino",
  "camarao-chimi-churri-picante": "pescados",
  "pao-de-queijo-tempero-mineiro": "vegetariano",
  "arroz-soltinho-cebola-em-po": "vegetariano",
  "frango-quiabo-ana-maria": "frango",
  "ovos-fritos-bacon-tradicional": "ovo",
  "bife-acebolado-lemon-pepper": "bovina",
  "costelinha-paprica-defumada-tradicional": "suino",
  "omelete-ervas-finas-tradicional": "ovo",
  "frango-chimi-churri-tradicional": "frango",
  "legumes-assados-curcuma-tradicional": "vegetariano",
  "frango-dourado-paprica-doce": "frango",
  "costela-porco-du-chefe": "suino",
  "bife-cavalo-pimenta-reino": "bovina",
  "cafe-ritual-canela": "vegetariano",
  "maca-assada-canela": "vegetariano",
  "pipoca-caseira-temperaflix-tradicional": "vegetariano",
  "mix-castanhas-temperaflix-ervas": "vegetariano",
  "salmao-crosta-ervas-finas": "pescados",
  "abacate-recheado-frango-chimi-churri": "frango",
  "couve-flor-gratinada-curcuma": "vegetariano",
  "sardinha-grelhada-lemon-pepper": "pescados",
  "panqueca-proteica-tempero-edu": "ovo",
  "berinjela-assada-tempero-mineiro": "vegetariano",
  "costela-bovina-pimenta-reino": "bovina",
  "figado-acebolado-cebola-po": "bovina",
  "camarao-manteiga-salsa-cebola-alho": "pescados",
  "carne-panela-batatas-tempero-mineiro": "bovina",
  "peixe-assado-legumes-salsa-cebola-alho": "pescados",
  "feijao-tropeiro-ana-maria": "vegetariano",
};

/** Proteína dominante da receita (campo explícito tem prioridade sobre o mapa). */
export function getRecipeProtein(r: Recipe): Protein | undefined {
  return r.proteinaPrincipal ?? RECIPE_PROTEIN[r.slug];
}
