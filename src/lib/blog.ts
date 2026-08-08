import paoTradicionalAsset from "@/assets/receitas/45-pao-carnivoro-tradicional-clean.png.asset.json";
import paoHamburguerAsset from "@/assets/receitas/46-pao-carnivoro-hamburguer-v5.webp.asset.json";
import paoTorradaAsset from "@/assets/receitas/47-pao-carnivoro-torrada-v5.webp.asset.json";

/**
 * Blog Temperanzza — base editorial estática.
 */

export type BlogCategory = "tecnica" | "ingrediente" | "dieta" | "casa";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  /** lista opcional de bullets após os parágrafos */
  bullets?: string[];
  /** Imagem opcional para ilustrar a seção */
  image?: string;
  /** Legenda da imagem */
  imageCaption?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  /** título editorial (H1) */
  title: string;
  /** a pergunta real que originou o artigo — usada no <title> e no FAQPage */
  question: string;
  /** resposta direta, 2–3 frases, para snippet e motores de resposta */
  directAnswer: string;
  /** linha de apoio curta abaixo do H1 */
  standfirst: string;
  category: BlogCategory;
  /** minutos de leitura */
  readTime: number;
  /** data de publicação ISO (AAAA-MM-DD) — usada no Article JSON-LD */
  publishedAt: string;
  /** cor de acento do tile (token oklch já usado na casa) */
  tone: string;
  sections: BlogSection[];
  faq: BlogFaq[];
  /** condimento protagonista do artigo (handle Shopify) */
  productHandle: string;
  /** rótulo humano do produto para CTA */
  productName: string;
  /** receitas da Cozinha que aprofundam o tema */
  relatedRecipes: string[];
  /** outros artigos */
  relatedPosts: string[];
}

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  tecnica: "Técnica",
  ingrediente: "Ingrediente",
  dieta: "Dieta & Performance",
  casa: "A Casa",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "coma-pao-em-sua-dieta",
    title: "Coma pão em sua dieta: a volta da textura à mesa carnívora e low carb",
    question: "Posso comer pão na dieta cetogênica ou carnívora?",
    directAnswer:
      "Sim, é possível através de versões proteicas sem farinha de trigo. Utilizando ovos, carne ou queijos como base, o pão carnívoro entrega a textura e o conforto do pão tradicional com zero carboidratos e alta densidade nutricional, permitindo sanduíches e torradas sem quebrar a cetose.",
    standfirst:
      "O conforto da padaria, reconstruído com densidade nutricional mineira.",
    category: "dieta",
    readTime: 6,
    publishedAt: "2026-08-08",
    tone: "oklch(0.52 0.21 28)",
    sections: [
      {
        heading: "A quebra do paradigma: pão sem grãos",
        paragraphs: [
          "Para muitos, o pão é a maior barreira para a adesão a longo prazo em dietas de baixo carboidrato. A falta da textura 'mastigável' e da praticidade do sanduíche gera um vazio que receitas à base de farinhas de oleaginosas (como amêndoas) nem sempre preenchem.",
          "O Pão Carnívoro Temperanzza surge como uma solução de performance: base proteica, sem glúten e sem antinutrientes de sementes.",
        ],
        image: paoTradicionalAsset.url,
        imageCaption: "Pão Carnívoro Tradicional: fofinho, proteico e perfeito para fatiar.",
      },
      {
        heading: "Versão Tradicional — O café da manhã mineiro",
        paragraphs: [
          "A versão clássica utiliza Ervas Finas e um toque de Salsa, Cebola e Alho para conferir aquele aroma de padaria artesanal. É ideal para comer com manteiga de garrafa ou queijo canastra derretido.",
        ],
      },
      {
        heading: "O Hambúrguer Perfeito",
        paragraphs: [
          "Moldado em formato circular e finalizado com Lemon Pepper ou Páprica Defumada, esta variação sustenta o peso de um blend de carne sem desmanchar, entregando a experiência completa de uma hamburgueria gourmet.",
        ],
        image: paoHamburguerAsset.url,
        imageCaption: "Versão Hambúrguer: estrutura firme e sabor realçado com Lemon Pepper.",
      },
      {
        heading: "Torradas Crocantes: O Toque do Chef",
        paragraphs: [
          "Fatiado e levado à frigideira com manteiga e Tempero Mineiro ou Chimi Churri, o pão carnívoro se transforma em torradas de elite, perfeitas para acompanhar caldos ou servir de base para antepastos.",
        ],
        image: paoTorradaAsset.url,
        imageCaption: "Torradas Carnívoras: crocância absoluta com Chimi Churri e Tempero Mineiro.",
      },
    ],
    faq: [
      {
        question: "O pão carnívoro tem gosto de ovo?",
        answer:
          "Se preparado com a técnica correta e os temperos certos (como nossas Ervas Finas), o sabor residual de ovo desaparece, dando lugar ao perfil aromático dos condimentos.",
      },
      {
        question: "Como conservar meu pão proteico?",
        answer:
          "Por ser rico em proteína e gordura, ele dura até 5 dias na geladeira em pote fechado ou pode ser congelado fatiado por 3 meses.",
      },
    ],
    productHandle: "ervas-finas",
    productName: "Ervas Finas",
    relatedRecipes: [
      "pao-carnivoro-tradicional",
      "pao-carnivoro-hamburguer",
      "pao-carnivoro-torrada",
    ],
    relatedPosts: ["por-que-tempero-artesanal-e-diferente", "o-que-e-temperaflix"],
  },
  {
    slug: "por-que-tempero-artesanal-e-diferente",
    title: "Tempero artesanal versus industrial: onde está a diferença real",
    question: "Qual a diferença entre tempero artesanal e industrial?",
    directAnswer:
      "A diferença está em três pontos: composição, frescor e proporção. Blends artesanais usam especiarias reconhecíveis, sem amido, maltodextrina ou aroma sintético como enchimento; são embalados em lotes pequenos, mais próximos da moagem; e mantêm proporção pensada por sabor, não por custo de matéria-prima.",
    standfirst:
      "Não é romantismo de rótulo — é o que está e o que não está na lista de ingredientes.",
    category: "casa",
    readTime: 5,
    publishedAt: "2026-03-09",
    tone: "oklch(0.45 0.06 60)",
    sections: [
      {
        heading: "Ponto 1 — o que preenche o pote",
        paragraphs: [
          "Especiaria é o item caro de um blend. Amido, sal e maltodextrina são baratos. Em produção de larga escala, a tentação econômica é evidente e o rótulo revela: quando os três primeiros ingredientes de um tempero de ervas são sal, amido e açúcar, o que se está comprando majoritariamente não é tempero.",
          "Um blend artesanal se define pela ausência desse recheio. A lista é curta e cada item é reconhecível como comida.",
        ],
      },
      {
        heading: "Ponto 2 — o tempo entre moer e usar",
        paragraphs: [
          "Especiaria moída começa a perder aroma no instante em que a superfície é exposta ao ar. Um pote que passou dezoito meses em cadeia logística e prateleira de distribuição chega ao consumidor já enfraquecido.",
          "Lote pequeno encurta esse caminho. A cadeia mais curta é a razão técnica pela qual um blend artesanal cheira mais forte na abertura — não é sugestão, é frescor mensurável.",
        ],
      },
      {
        heading: "Ponto 3 — proporção decidida por sabor",
        paragraphs: [
          "Em escala industrial a fórmula é otimizada por custo por quilo. Se a páprica encareceu na safra, a proporção cai e o sal sobe. O produto continua vendável e o consumidor raramente percebe a mudança gradual.",
          "Em produção pequena, a fórmula é fixa porque foi construída por paladar. O custo oscila; a receita não.",
        ],
        bullets: [
          "Leia sempre os três primeiros ingredientes — eles representam a maior parte do pote",
          "Desconfie de 'aroma' e 'aroma idêntico ao natural' sem especificação",
          "Cheiro forte na abertura é indicador prático de frescor",
        ],
      },
      {
        heading: "O que isso muda na sua cozinha",
        paragraphs: [
          "Rende mais por colherada. Um blend concentrado exige menos volume para o mesmo efeito, o que compensa parte da diferença de preço por grama.",
          "E entrega previsibilidade: a mesma quantidade produz o mesmo resultado sempre, o que é o que permite cozinhar com confiança em vez de ajustar no escuro.",
        ],
      },
      {
        heading: "Como a Temperanzza trabalha",
        paragraphs: [
          "A casa opera em Minas Gerais com lotes pequenos, especiarias selecionadas por fornecedor e embalagem próxima da data de envase. Sem açúcar, sem maltodextrina, sem aroma sintético.",
          "É a razão pela qual o catálogo tem 19 potes e não 60: cada blend precisa justificar sua existência por um uso que os outros não cobrem.",
        ],
      },
    ],
    faq: [
      {
        question: "Tempero artesanal é sempre mais caro?",
        answer:
          "Por grama, geralmente sim. Por prato temperado, a diferença encolhe bastante, porque a concentração maior exige menos produto para o mesmo resultado.",
      },
      {
        question: "Como identificar enchimento no rótulo?",
        answer:
          "Procure amido, maltodextrina, açúcar e dextrose na lista. Quanto mais cedo aparecem, maior a proporção no pote.",
      },
      {
        question: "Os temperos Temperanzza têm conservantes?",
        answer:
          "Não. São especiarias e ervas secas, que se conservam pela ausência de umidade. O cuidado necessário é de armazenamento, não químico.",
      },
    ],
    productHandle: "tempero-mineiro",
    productName: "Tempero Mineiro",
    relatedRecipes: [
      "carne-moida-tempero-mineiro",
      "pao-de-queijo-tempero-mineiro",
    ],
    relatedPosts: ["como-conservar-temperos-secos", "o-que-e-temperaflix"],
  },
  {
    slug: "quanto-tempero-usar-por-pessoa",
    title: "Quanto tempero usar: a medida que funciona sem provar toda hora",
    question: "Quanto tempero devo usar por porção?",
    directAnswer:
      "A referência prática é meia colher de chá de blend seco para cada 100 g de proteína, ou uma colher de chá para quatro porções de acompanhamento. Blends com sal na composição pedem redução do sal adicional. Comece por baixo: é possível corrigir para mais, nunca para menos.",
    standfirst:
      "A pergunta mais frequente da cozinha doméstica tem uma resposta razoavelmente simples.",
    category: "tecnica",
    readTime: 4,
    publishedAt: "2026-03-16",
    tone: "oklch(0.6 0.16 40)",
    sections: [
      {
        heading: "A régua de partida",
        paragraphs: [
          "Para proteína, meia colher de chá para cada 100 g é o ponto seguro. Um peito de frango de 200 g pede uma colher de chá rasa; um quilo de carne moída pede cerca de duas colheres e meia.",
          "Para acompanhamentos — arroz, legumes, purês — a densidade de sabor esperada é menor: uma colher de chá para quatro porções resolve.",
        ],
      },
      {
        heading: "Ajuste por tipo de tempero",
        paragraphs: [
          "Nem todo pote tem a mesma intensidade. Ervas secas ocupam muito volume e pesam pouco, então aceitam dose maior. Pós densos como cúrcuma e pimenta-do-reino concentram muito em pouco espaço e pedem dose menor.",
          "Blends de finalização, aplicados fora do fogo, entregam mais aroma perceptível por grama — vale começar com metade da medida padrão.",
        ],
        bullets: [
          "Ervas secas: dose padrão ou até o dobro",
          "Pós densos (cúrcuma, pimenta, canela): metade da dose padrão",
          "Finalizadores (lemon pepper, shakers): metade, ajustando no prato",
        ],
      },
      {
        heading: "Cuidado com sal duplicado",
        paragraphs: [
          "Vários blends já trazem sal na composição. Aplicar a dose cheia do blend e depois salgar por hábito é o caminho direto para o prato salgado demais.",
          "A regra é: se o blend tem sal, tempere primeiro com ele e só depois avalie se falta. Na maioria dos casos, não falta.",
        ],
      },
      {
        heading: "Por que começar por baixo",
        paragraphs: [
          "Sabor excessivo não tem correção elegante. Diluir exige aumentar o volume do prato inteiro, o que raramente é viável no meio do preparo.",
          "Faltando, a correção custa uma pitada. Essa assimetria é o único argumento necessário para a dose conservadora na primeira vez que você usa um pote novo.",
        ],
      },
      {
        heading: "Depois da terceira vez, esqueça a colher",
        paragraphs: [
          "A medida existe para calibrar o olho e a mão. Depois de três ou quatro usos do mesmo pote, você já sabe o que aquela quantidade produz naquele prato — e a colher medidora vira desnecessária.",
        ],
      },
    ],
    faq: [
      {
        question: "Quanto tempero para um quilo de carne?",
        answer:
          "Cerca de duas colheres e meia de chá de blend seco, ajustando para menos se o blend já contiver sal.",
      },
      {
        question: "Posso temperar demais e corrigir depois?",
        answer:
          "Corrigir excesso é difícil: exige aumentar o volume do prato com ingrediente neutro. Sempre comece com menos.",
      },
      {
        question: "A medida muda se eu temperar na véspera?",
        answer:
          "A quantidade se mantém, mas o sabor fica mais intenso porque houve tempo de penetração. Se for temperar com antecedência, fique no limite inferior da faixa.",
      },
    ],
    productHandle: "du-chefe-com-paprica",
    productName: "Du Chefe com Páprica",
    relatedRecipes: ["costela-porco-du-chefe", "carne-moida-tempero-mineiro"],
    relatedPosts: [
      "quando-colocar-o-tempero-no-prato",
      "qual-a-diferenca-entre-paprica-doce-defumada-e-picante",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}
