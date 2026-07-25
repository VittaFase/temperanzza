/**
 * Blog Temperanzza — base editorial estática.
 *
 * Cada artigo nasce de uma pergunta real de quem cozinha. A estrutura segue o
 * padrão AEO (Answer Engine Optimization): resposta direta no topo, corpo
 * aprofundado em seções, FAQ ao final. Isso alimenta tanto o snippet do Google
 * quanto os assistentes de IA.
 *
 * Sem fotos de pratos — a identidade da casa é o pote real, tipografia stencil
 * e blocos de cor. O `productHandle` puxa o PNG transparente oficial via
 * `getProductImage`.
 */

export type BlogCategory = "tecnica" | "ingrediente" | "dieta" | "casa";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  /** lista opcional de bullets após os parágrafos */
  bullets?: string[];
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
    slug: "qual-a-diferenca-entre-paprica-doce-defumada-e-picante",
    title: "Páprica doce, defumada e picante: qual usar em cada prato",
    question: "Qual a diferença entre páprica doce, defumada e picante?",
    directAnswer:
      "As três vêm do mesmo pimentão seco e moído — o que muda é o processo. A páprica doce é secagem simples e entrega cor e adocicado suave. A defumada passa por defumação lenta em madeira e traz aroma de churrasco sem picância. A picante inclui variedades ardidas do pimentão, somando calor à cor.",
    standfirst:
      "Três potes, uma origem, comportamentos completamente diferentes na panela.",
    category: "ingrediente",
    readTime: 6,
    publishedAt: "2026-01-12",
    tone: "oklch(0.52 0.21 28)",
    sections: [
      {
        heading: "A mesma matéria-prima, três caminhos",
        paragraphs: [
          "Toda páprica nasce do mesmo lugar: pimentão maduro, seco e moído até virar pó fino. A diferença entre os potes está no que acontece entre a colheita e a moagem — e é aí que se decide se o tempero vai adoçar, defumar ou arder no prato.",
          "Entender esse processo é o que separa jogar páprica em cima de qualquer coisa de usar páprica com intenção. São três ferramentas distintas, não três versões do mesmo tempero.",
        ],
      },
      {
        heading: "Páprica doce — cor antes de tudo",
        paragraphs: [
          "É a mais versátil das três e a que menos interfere no sabor original do prato. Secagem simples, sem fogo direto, preservando o açúcar natural do pimentão. O resultado é um vermelho profundo e um fundo levemente adocicado.",
          "Use quando o objetivo é cor e corpo: frango dourado, molhos de tomate, maioneses temperadas, farofas. Ela pinta o prato sem disputar espaço com o ingrediente principal.",
        ],
        bullets: [
          "Melhor momento: no início do preparo, junto da gordura, para liberar a cor",
          "Cuidado: em fogo muito alto amarga — sempre em óleo morno, nunca fumegante",
        ],
      },
      {
        heading: "Páprica defumada — churrasco sem churrasqueira",
        paragraphs: [
          "Aqui o pimentão é seco sobre fumaça de madeira por dias. Esse tempo é o que constrói o aroma que remete a carne na brasa, bacon e defumados em geral — sem nenhuma picância envolvida.",
          "É o atalho mais honesto para dar profundidade a preparos feitos no forno ou na frigideira. Meia colher em uma costelinha assada muda a percepção do prato inteiro.",
        ],
        bullets: [
          "Melhor momento: na marinada ou esfregada seca, antes do forno",
          "Combina com: carne suína, frango assado, batata rústica, grão-de-bico",
        ],
      },
      {
        heading: "Páprica picante — calor com cor",
        paragraphs: [
          "Leva variedades ardidas do pimentão na composição. Entrega a mesma cor da doce, mas com um calor presente e limpo, que sobe rápido e não se prolonga como o de uma pimenta fresca.",
          "É a escolha para quem quer ardência controlada: o pó se distribui por igual no prato, diferente de uma pimenta picada, que cria pontos de calor concentrados.",
        ],
      },
      {
        heading: "Como decidir em dez segundos",
        paragraphs: [
          "A pergunta prática é: o que falta no prato? Se falta cor, doce. Se falta profundidade e aquele fundo de brasa, defumada. Se falta calor, picante.",
          "Nada impede combinar. Doce mais defumada é uma dupla que funciona em quase toda carne assada — a primeira constrói a base, a segunda dá o caráter.",
        ],
      },
    ],
    faq: [
      {
        question: "Posso substituir páprica defumada por doce?",
        answer:
          "Pode, mas o prato perde o aroma de brasa, que é justamente o que a defumada entrega. A cor se mantém quase idêntica; o caráter, não.",
      },
      {
        question: "Páprica perde força com o tempo?",
        answer:
          "Sim. É um pó de alta superfície de contato e volatiliza rápido. Guarde fechado, longe de luz e do vapor do fogão, e consuma em até seis meses após aberto para manter cor e aroma.",
      },
      {
        question: "Qual páprica é mais picante?",
        answer:
          "A picante. A doce e a defumada não têm ardência — a defumada é frequentemente confundida com picante por causa da intensidade do aroma, mas não arde.",
      },
    ],
    productHandle: "paprica-defumada",
    productName: "Páprica Defumada",
    relatedRecipes: [
      "frango-assado-paprica-defumada",
      "costelinha-paprica-defumada-tradicional",
      "frango-dourado-paprica-doce",
    ],
    relatedPosts: [
      "quando-colocar-o-tempero-no-prato",
      "como-conservar-temperos-secos",
    ],
  },
  {
    slug: "quando-colocar-o-tempero-no-prato",
    title: "Quando colocar o tempero: antes, durante ou depois do fogo",
    question: "Qual o momento certo de colocar o tempero no prato?",
    directAnswer:
      "Temperos secos em pó, como páprica e cúrcuma, entram no início, em gordura morna, para liberar aroma. Ervas secas entram no meio do cozimento. Blends com sal e ervas delicadas, como lemon pepper e chimichurri, entram no fim ou fora do fogo — o calor prolongado destrói seus óleos voláteis.",
    standfirst:
      "O mesmo tempero, na mesma quantidade, entrega pratos diferentes conforme a hora em que encosta no fogo.",
    category: "tecnica",
    readTime: 5,
    publishedAt: "2026-01-19",
    tone: "oklch(0.62 0.15 55)",
    sections: [
      {
        heading: "Por que o momento importa mais que a quantidade",
        paragraphs: [
          "Quase todo sabor de um tempero seco está em óleos voláteis — compostos que evaporam com o calor. É por isso que abrir um pote perfuma a cozinha inteira: você está literalmente perdendo aroma no ar.",
          "Na panela acontece o mesmo, em velocidade maior. Colocar o tempero cedo demais significa entregar seu aroma para a coifa. Tarde demais significa não extrair nada dele. O ponto certo depende da estrutura do tempero.",
        ],
      },
      {
        heading: "Pós densos: no começo, na gordura",
        paragraphs: [
          "Páprica, cúrcuma, cebola em pó, pimenta-do-reino moída e canela têm compostos lipossolúveis — dissolvem em gordura, não em água. Refogá-los por 20 a 30 segundos em óleo, manteiga ou azeite morno é o que abre o sabor deles no prato inteiro.",
          "A regra é morno, não fumegante. Acima de certa temperatura esses pós queimam em segundos e o amargor não sai mais do preparo.",
        ],
      },
      {
        heading: "Ervas secas: no meio do caminho",
        paragraphs: [
          "Ervas finas, salsa e orégano secos precisam de líquido e tempo para reidratar. Em molhos, sopas e ensopados, entram junto com o caldo, com pelo menos dez minutos de fervura pela frente.",
          "Em preparos rápidos, como um ovo mexido, o comportamento muda: sem líquido e sem tempo, elas funcionam melhor como finalização.",
        ],
      },
      {
        heading: "Blends de finalização: fora do fogo",
        paragraphs: [
          "Chimichurri, lemon pepper e os shakers Temperaflix foram construídos para serem sentidos na boca, não cozidos. A raspa cítrica do lemon pepper e a acidez do chimichurri são exatamente o que o calor prolongado apaga primeiro.",
          "Tempere no prato, ou nos últimos trinta segundos de frigideira, com o fogo já desligado. O calor residual é suficiente para liberar o aroma sem destruí-lo.",
        ],
        bullets: [
          "Carne grelhada: chimichurri depois do descanso, nunca antes da grelha",
          "Pipoca e petiscos: shaker direto, com a superfície ainda quente e levemente gordurosa",
        ],
      },
      {
        heading: "A exceção: marinadas",
        paragraphs: [
          "Marinada é uma categoria à parte. Ali o tempero fica horas em contato com a proteína, sem calor, e penetra por difusão. Nesse caso vale usar tanto pós quanto ervas desde o início — o que faltar de aroma se corrige com um toque de finalização antes de servir.",
        ],
      },
    ],
    faq: [
      {
        question: "Posso temperar a carne na véspera?",
        answer:
          "Sim, e em geral melhora. Blends secos com sal atuam como salga a seco: puxam umidade, dissolvem e voltam para dentro da carne, temperando por igual. Reserve um toque final para depois do fogo.",
      },
      {
        question: "Por que meu tempero fica amargo?",
        answer:
          "Quase sempre é pó queimado em gordura quente demais. Páprica e cúrcuma amargam em poucos segundos acima do ponto. Baixe o fogo antes de adicionar.",
      },
      {
        question: "Devo dobrar a quantidade se colocar no fim?",
        answer:
          "Não. Temperar no fim entrega mais aroma perceptível, não menos — a tendência é precisar de menos, não de mais.",
      },
    ],
    productHandle: "lemon-pepper",
    productName: "Lemon Pepper",
    relatedRecipes: [
      "ovo-frito-lemon-pepper",
      "bife-manteiga-chimi-churri",
      "bife-acebolado-lemon-pepper",
    ],
    relatedPosts: [
      "qual-a-diferenca-entre-paprica-doce-defumada-e-picante",
      "como-conservar-temperos-secos",
    ],
  },
  {
    slug: "como-conservar-temperos-secos",
    title: "Como conservar temperos secos e não perder o aroma em um mês",
    question: "Como conservar temperos secos para durarem mais?",
    directAnswer:
      "Guarde os potes fechados, em local escuro, seco e longe do calor do fogão. Os quatro inimigos do tempero seco são luz, calor, umidade e ar. Nunca tempere com o pote aberto sobre a panela: o vapor entra, empedra o pó e acelera a perda de aroma.",
    standfirst:
      "O tempero não estraga — ele desbota. E quase sempre a culpa é de onde o pote está guardado.",
    category: "casa",
    readTime: 5,
    publishedAt: "2026-01-26",
    tone: "oklch(0.55 0.12 145)",
    sections: [
      {
        heading: "Tempero seco não estraga, perde potência",
        paragraphs: [
          "Um pote de páprica de dois anos raramente oferece risco. O que ele oferece é decepção: cor apagada, aroma fraco e a sensação de que o prato ficou sem graça mesmo você tendo usado a mesma colherada de sempre.",
          "A validade útil real de um tempero moído aberto gira em torno de seis meses. Inteiros — grãos, paus, sementes — chegam facilmente a dois anos, porque a superfície exposta ao oxigênio é muito menor.",
        ],
      },
      {
        heading: "Os quatro inimigos",
        paragraphs: [
          "Luz degrada pigmentos: é por isso que a páprica esmaece do vermelho para o alaranjado. Calor acelera a evaporação dos óleos aromáticos. Umidade empedra e abre porta para bolor. Ar oxida.",
          "O detalhe é que quase toda cozinha brasileira comete os quatro erros ao mesmo tempo: prateleira aberta, ao lado do fogão, na parede que pega sol da tarde.",
        ],
        bullets: [
          "Armário fechado, longe do fogão e do forno",
          "Nunca sobre a geladeira — o motor esquenta a superfície o dia inteiro",
          "Pote sempre bem tampado, mesmo entre um uso e outro na mesma refeição",
        ],
      },
      {
        heading: "O erro mais comum: temperar sobre a panela",
        paragraphs: [
          "É o gesto mais natural do mundo e o mais destrutivo. Ao inclinar o pote sobre a panela em fervura, o vapor sobe direto para dentro dele. A umidade condensa no pó, forma torrões e transforma um tempero solto em um bloco compacto em poucas semanas.",
          "A correção custa dois segundos: sirva a quantidade na mão ou em uma colher, afastado do fogão, e só então leve à panela.",
        ],
      },
      {
        heading: "Geladeira: quase sempre não",
        paragraphs: [
          "Guardar tempero seco na geladeira parece cuidadoso, mas cria ciclos de condensação a cada abertura do pote. O pó absorve essa umidade e empedra mais rápido do que ficaria em um armário comum.",
          "A exceção fica para blends com alto teor de gordura ou sementes oleaginosas, que podem rançar — e para climas de umidade extrema, onde um pote hermético na geladeira, aberto só depois de atingir a temperatura ambiente, faz sentido.",
        ],
      },
      {
        heading: "Como saber que passou do ponto",
        paragraphs: [
          "Esfregue uma pitada entre os dedos e cheire. Se o aroma não chega imediato e claro, o tempero já entregou o que tinha. Cor apagada confirma o diagnóstico.",
          "Nesse ponto o pote ainda serve para dar cor e corpo, mas não vai mais assinar o prato. É a hora de repor.",
        ],
      },
    ],
    faq: [
      {
        question: "Tempero vencido faz mal?",
        answer:
          "Em geral não, desde que esteja seco e sem sinais de bolor ou odor estranho. O que se perde é aroma e cor, não segurança.",
      },
      {
        question: "Por que meu tempero empedrou?",
        answer:
          "Umidade. Quase sempre por temperar com o pote aberto sobre a panela ou por guardá-lo perto do fogão. Um pote empedrado ainda é utilizável, mas já perdeu parte do aroma.",
      },
      {
        question: "Vale transferir para outro pote?",
        answer:
          "Só se o novo recipiente for opaco, hermético e estiver completamente seco. Vidro transparente em prateleira aberta é bonito e péssimo para conservação.",
      },
    ],
    productHandle: "pimenta-do-reino",
    productName: "Pimenta-do-Reino",
    relatedRecipes: ["bife-cavalo-pimenta-reino", "cafe-ritual-canela"],
    relatedPosts: [
      "quando-colocar-o-tempero-no-prato",
      "por-que-tempero-artesanal-e-diferente",
    ],
  },
  {
    slug: "temperos-permitidos-na-dieta-keto",
    title: "Temperos na dieta keto: o que pode, o que esconde carboidrato",
    question: "Quais temperos são permitidos na dieta keto?",
    directAnswer:
      "Especiarias puras e ervas secas são praticamente livres de carboidrato e liberadas na keto: páprica, pimenta-do-reino, cúrcuma, ervas finas, chimichurri e cebola em pó em uso normal. A atenção deve ir para blends industriais com açúcar, maltodextrina ou amido na composição — esses somam carboidrato sem aparecer.",
    standfirst:
      "O problema da keto quase nunca é a especiaria. É o que vem escondido no rótulo do blend.",
    category: "dieta",
    readTime: 6,
    publishedAt: "2026-02-02",
    tone: "oklch(0.5 0.14 250)",
    sections: [
      {
        heading: "A conta real de carboidrato em um tempero",
        paragraphs: [
          "Uma colher de chá de páprica pesa cerca de dois gramas e carrega menos de um grama de carboidrato — parte dele fibra. Na prática, especiaria pura não move o ponteiro de ninguém em protocolo cetogênico.",
          "O raciocínio muda quando o pote não é especiaria pura, mas um blend. Aí a lista de ingredientes passa a importar mais do que a tabela nutricional, porque as quantidades declaradas por porção são pequenas o bastante para arredondar para zero.",
        ],
      },
      {
        heading: "O que procurar no rótulo",
        paragraphs: [
          "Três palavras merecem atenção imediata em qualquer blend: açúcar, maltodextrina e amido. As duas últimas entram como veículo ou antiumectante barato e são carboidrato de alto índice glicêmico.",
          "Um blend honesto declara ingredientes reconhecíveis — especiarias, ervas, sal — e nada mais. Se a lista tem mais aditivo do que tempero, o problema não é só a keto.",
        ],
        bullets: [
          "Livres: páprica, pimenta-do-reino, cúrcuma, canela, ervas finas, orégano",
          "Livres em uso normal: cebola em pó, alho desidratado, blends de ervas com sal",
          "Atenção: qualquer blend com açúcar, maltodextrina, amido ou 'aroma' não especificado",
        ],
      },
      {
        heading: "Cebola em pó: o caso que gera dúvida",
        paragraphs: [
          "Cebola em pó tem, sim, mais carboidrato por 100 g do que uma páprica — é um vegetal desidratado e concentrado. Mas ninguém consome 100 g de cebola em pó.",
          "Na dose real de cozinha, meia colher de chá em um prato inteiro, a contribuição é fração de grama. Ela permanece perfeitamente compatível com keto e é uma das ferramentas mais eficientes para dar corpo a preparos sem molho.",
        ],
      },
      {
        heading: "Por que tempero importa mais na keto do que em qualquer dieta",
        paragraphs: [
          "Protocolos cetogênicos cortam justamente as fontes clássicas de prazer imediato: pão, massa, doce. O que sobra — proteína e gordura — é nutricionalmente sólido e sensorialmente repetitivo.",
          "É o tempero que resolve isso. O mesmo peito de frango vira quatro pratos distintos conforme o pote escolhido, e essa variedade é o que sustenta o protocolo no terceiro mês, quando a novidade já passou.",
        ],
      },
      {
        heading: "Onde ver isso aplicado",
        paragraphs: [
          "A Cozinha Temperanzza organiza as receitas por compatibilidade dietética justamente para isso. Filtrando por keto, você vê apenas preparos que respeitam o protocolo, cada um com o pote correspondente ao lado.",
        ],
      },
    ],
    faq: [
      {
        question: "Cebola em pó tira da cetose?",
        answer:
          "Não em dose de cozinha. Meia colher de chá em uma refeição inteira contribui com fração de grama de carboidrato líquido.",
      },
      {
        question: "Posso usar chimichurri na keto?",
        answer:
          "Sim. Chimichurri é ervas, alho, sal e acidez — sem carboidrato relevante. É um dos melhores finalizadores para carnes em protocolo cetogênico.",
      },
      {
        question: "Os temperos Temperanzza têm açúcar?",
        answer:
          "Não. A casa trabalha com especiarias e ervas, sem açúcar, maltodextrina ou amido como veículo. Os blends são compatíveis com keto, low carb e carnívora flex.",
      },
    ],
    productHandle: "chimichurri-sem-pimenta",
    productName: "Chimichurri Sem Pimenta",
    relatedRecipes: [
      "bife-manteiga-chimi-churri",
      "omelete-bacon-em-po",
      "frango-grelhado-cebola-em-po",
    ],
    relatedPosts: [
      "temperos-low-carb-sem-perder-sabor",
      "quando-colocar-o-tempero-no-prato",
    ],
  },
  {
    slug: "temperos-low-carb-sem-perder-sabor",
    title: "Low carb sem monotonia: como o tempero substitui o molho",
    question: "Como dar sabor à comida low carb sem usar molhos prontos?",
    directAnswer:
      "Molhos prontos entregam sabor via açúcar, amido e gordura industrial. Em low carb, o mesmo efeito se constrói com três camadas: um pó aromático refogado na gordura no início, uma erva no meio do cozimento e um finalizador ácido ou cítrico fora do fogo.",
    standfirst:
      "Cortar o molho não é cortar o sabor — é trocar de método.",
    category: "dieta",
    readTime: 5,
    publishedAt: "2026-02-09",
    tone: "oklch(0.58 0.13 195)",
    sections: [
      {
        heading: "O que o molho pronto realmente faz",
        paragraphs: [
          "Um molho industrial resolve três coisas de uma vez: adiciona sabor concentrado, dá viscosidade e cria contraste — normalmente doce ou ácido — contra a proteína. Nada disso é mágica; é engenharia de fórmula.",
          "Em low carb, os dois primeiros vêm de açúcar e amido, que estão fora. Mas o terceiro, o contraste, é o que mais pesa na percepção de sabor. E esse dá para reconstruir sem carboidrato nenhum.",
        ],
      },
      {
        heading: "Camada 1 — o pó na gordura",
        paragraphs: [
          "Antes da proteína encostar na panela, refogue meia colher de um pó aromático na gordura: páprica defumada, cúrcuma ou cebola em pó. Vinte segundos em fogo médio bastam.",
          "Esse passo cria um fundo que perfuma tudo o que entrar depois. É o equivalente low carb de começar um molho com refogado.",
        ],
      },
      {
        heading: "Camada 2 — a erva no meio",
        paragraphs: [
          "Com a proteína já selada e um pouco de líquido na panela — água, caldo, o próprio suco da carne — entram as ervas secas. Elas precisam desse tempo para reidratar e distribuir sabor.",
          "Salsa, cebola e alho ou ervas finas funcionam aqui. É a camada que dá a sensação de comida cozida com cuidado, não montada às pressas.",
        ],
      },
      {
        heading: "Camada 3 — o contraste fora do fogo",
        paragraphs: [
          "Essa é a camada que quase todo mundo pula e é a que mais impacta. Fogo desligado, prato montado: um finalizador cítrico ou ácido.",
          "Lemon pepper cumpre esse papel com raspa e pimenta. Chimichurri traz acidez e ervas frescas em conserva. É o contraste que impede a refeição de parecer plana, que é a queixa número um de quem abandona low carb.",
        ],
        bullets: [
          "Frango: cebola em pó no início, ervas finas no meio, lemon pepper no fim",
          "Carne vermelha: páprica defumada no início, pimenta-do-reino no meio, chimichurri no fim",
          "Peixe: cúrcuma no início, salsa cebola e alho no meio, raspas cítricas no fim",
        ],
      },
      {
        heading: "Gordura é veículo, não vilã",
        paragraphs: [
          "Em low carb a gordura está liberada e isso é uma vantagem técnica, não só calórica. Manteiga, azeite e a gordura da própria carne carregam os compostos aromáticos dos temperos por todo o prato.",
          "Um tempero jogado sobre carne magra e seca rende metade do que renderia com uma colher de manteiga na frigideira.",
        ],
      },
    ],
    faq: [
      {
        question: "Preciso comprar muitos potes para variar?",
        answer:
          "Não. Quatro potes bem escolhidos — um defumado, um cítrico, uma erva e um aromático de base — já geram dezenas de combinações. A variação vem do método, não da quantidade.",
      },
      {
        question: "Tempero com sal atrapalha low carb?",
        answer:
          "Não. Sal não é carboidrato. Em protocolos com restrição de carboidrato a necessidade de sódio até tende a aumentar, pela maior excreção de água.",
      },
      {
        question: "Dá para usar os mesmos temperos em jejum intermitente?",
        answer:
          "Durante a janela de alimentação, sim, sem restrição. Fora dela, qualquer tempero acompanhado de comida quebra o jejum — o tempero em si é irrelevante calóricamente.",
      },
    ],
    productHandle: "cebola-em-po",
    productName: "Cebola em Pó",
    relatedRecipes: [
      "frango-grelhado-cebola-em-po",
      "sopa-legumes-cebola-em-po",
      "peixe-grelhado-salsa-cebola-alho",
    ],
    relatedPosts: [
      "temperos-permitidos-na-dieta-keto",
      "quando-colocar-o-tempero-no-prato",
    ],
  },
  {
    slug: "para-que-serve-curcuma-na-cozinha",
    title: "Cúrcuma: para que serve de verdade na cozinha do dia a dia",
    question: "Para que serve a cúrcuma na cozinha?",
    directAnswer:
      "Cúrcuma é uma raiz seca e moída que entrega cor amarela intensa e um sabor terroso e levemente amargo. Na cozinha serve para dar cor a arroz, ovos e legumes, e para construir fundo aromático em refogados. Precisa de gordura para liberar sabor e cor — em água pura, rende pouco.",
    standfirst:
      "O pote amarelo mais subutilizado da despensa brasileira.",
    category: "ingrediente",
    readTime: 5,
    publishedAt: "2026-02-16",
    tone: "oklch(0.75 0.15 85)",
    sections: [
      {
        heading: "O que é, na prática",
        paragraphs: [
          "Cúrcuma — também chamada de açafrão-da-terra — é o rizoma de uma planta da família do gengibre, cozido, seco e moído. Não tem parentesco com o açafrão verdadeiro, que são estigmas de flor e custa dezenas de vezes mais.",
          "O sabor é terroso, com um amargor de fundo e um leve toque picante que aparece na garganta. Sozinha, é discreta. Em conjunto, transforma.",
        ],
      },
      {
        heading: "Cor: o uso mais imediato",
        paragraphs: [
          "Meia colher de chá pinta uma panela inteira de arroz de um amarelo profundo. É o uso mais popular no Brasil e o mais fácil de acertar.",
          "Vale para ovos mexidos, purês, massas de panqueca salgada, legumes assados e maioneses caseiras. A cor cria expectativa de sabor antes da primeira garfada — e isso conta.",
        ],
      },
      {
        heading: "Precisa de gordura, sempre",
        paragraphs: [
          "A curcumina, responsável pela cor e por boa parte do sabor, é lipossolúvel. Jogar cúrcuma em água fervendo rende cor fraca e sabor quase nulo.",
          "O método correto é refogá-la por vinte segundos em óleo, manteiga ou azeite antes de adicionar o resto. A diferença entre os dois caminhos é visível no primeiro teste.",
        ],
        bullets: [
          "Arroz: cúrcuma no óleo, depois o arroz, depois a água",
          "Legumes assados: misturada ao azeite antes de untar",
          "Ovos: no ovo batido só se houver manteiga na frigideira",
        ],
      },
      {
        heading: "Onde ela erra",
        paragraphs: [
          "Em excesso, cúrcuma amarga e domina. O ponto de virada costuma ser em torno de uma colher de chá para quatro porções — acima disso, o amargor terroso passa a competir com tudo.",
          "Também mancha: bancada de mármore claro, tábua de plástico e pano de prato. Não é defeito, é característica do pigmento. Limpe imediatamente.",
        ],
      },
      {
        heading: "Duplas que funcionam",
        paragraphs: [
          "Cúrcuma com pimenta-do-reino é o par clássico — a pimenta corta o terroso e adiciona presença. Com páprica doce, o resultado é um alaranjado quente que fica ótimo em frango.",
          "Com ervas finas ela ganha um contraponto fresco que suaviza o amargor de fundo, combinação natural para legumes de forno.",
        ],
      },
    ],
    faq: [
      {
        question: "Cúrcuma e açafrão são a mesma coisa?",
        answer:
          "Não. Cúrcuma é raiz moída, de cor amarela e sabor terroso. Açafrão verdadeiro são estigmas da flor do Crocus sativus, de aroma floral e preço muito superior.",
      },
      {
        question: "Cúrcuma amarga o prato?",
        answer:
          "Só em excesso ou se queimada em gordura quente demais. Em dose correta e fogo médio, entrega cor e fundo terroso sem amargor perceptível.",
      },
      {
        question: "Dá para usar cúrcuma em preparos doces?",
        answer:
          "Em pequena quantidade, sim — funciona em bolos de cenoura e em leites especiados, onde entra mais pela cor do que pelo sabor.",
      },
    ],
    productHandle: "curcuma",
    productName: "Cúrcuma",
    relatedRecipes: [
      "ovos-dourados-curcuma",
      "legumes-assados-curcuma-tradicional",
    ],
    relatedPosts: [
      "quando-colocar-o-tempero-no-prato",
      "qual-a-diferenca-entre-paprica-doce-defumada-e-picante",
    ],
  },
  {
    slug: "como-usar-chimichurri",
    title: "Chimichurri: como usar sem transformar em marinada errada",
    question: "Como usar chimichurri corretamente na carne?",
    directAnswer:
      "Chimichurri é molho de finalização, não marinada. Hidrate o blend seco em azeite e um ácido — vinagre ou limão — por quinze minutos, e aplique sobre a carne já grelhada e descansada. Levá-lo à grelha queima as ervas e apaga a acidez que define o preparo.",
    standfirst:
      "O erro mais comum com chimichurri acontece antes da carne entrar na grelha.",
    category: "tecnica",
    readTime: 5,
    publishedAt: "2026-02-23",
    tone: "oklch(0.52 0.14 150)",
    sections: [
      {
        heading: "O que o chimichurri é",
        paragraphs: [
          "Chimichurri é um molho de ervas com acidez, de origem rio-platense, tradicionalmente servido com carne assada. A base é salsa, orégano, alho e um ácido, ligados por azeite.",
          "Na versão seca, em pote, você tem as ervas e aromáticos prontos — falta a parte líquida, que é o que ativa o preparo. Esse é o passo que a maioria pula.",
        ],
      },
      {
        heading: "Como hidratar corretamente",
        paragraphs: [
          "Para cada duas colheres de sopa do blend seco, use quatro colheres de azeite e uma de vinagre de vinho tinto ou suco de limão. Misture e deixe descansar quinze minutos em temperatura ambiente.",
          "Esse descanso não é opcional. É o tempo que as ervas levam para reidratar e liberar aroma no azeite. Usado imediatamente, o molho tem textura arenosa e sabor fechado.",
        ],
        bullets: [
          "Proporção base: 2 partes de blend, 4 de azeite, 1 de ácido",
          "Descanso mínimo: 15 minutos; ideal: 1 hora",
          "Preparado, dura até 5 dias na geladeira em pote fechado",
        ],
      },
      {
        heading: "Por que não é marinada",
        paragraphs: [
          "Marinadas ácidas com ervas em contato longo com a carne desnaturam a superfície da proteína e, no calor, as folhas queimam antes da carne chegar ao ponto. O resultado é amargor e pontos carbonizados.",
          "O chimichurri foi desenhado para o momento contrário: carne pronta, descansada, fatiada, e o molho por cima. A gordura quente da carne encontra o azeite frio e o contraste térmico é parte da experiência.",
        ],
      },
      {
        heading: "Sem pimenta e picante: quando usar cada um",
        paragraphs: [
          "A versão sem pimenta é a escolha padrão para mesa compartilhada e para pratos onde o protagonista é delicado — peixe, frango, legumes grelhados. Ela entrega ervas e acidez, sem calor.",
          "A picante é para carne vermelha de sabor forte e para quem quer o contraste completo. Em camarão, ela funciona especialmente bem, porque o doce do crustáceo equilibra a ardência.",
        ],
      },
      {
        heading: "Além da carne",
        paragraphs: [
          "Chimichurri hidratado funciona como vinagrete de salada, como molho para batata assada, sobre ovo frito e como base para pão tostado. Onde couber azeite com ervas, ele cabe.",
        ],
      },
    ],
    faq: [
      {
        question: "Posso usar chimichurri seco direto na carne?",
        answer:
          "Pode, como esfregação seca antes do fogo — mas aí é outro preparo. Para o molho clássico, a hidratação em azeite e ácido é indispensável.",
      },
      {
        question: "Qual ácido é melhor: vinagre ou limão?",
        answer:
          "Vinagre de vinho tinto é o tradicional e sustenta melhor carnes vermelhas. Limão deixa o molho mais leve e combina com frango, peixe e frutos do mar.",
      },
      {
        question: "Quanto tempo o chimichurri hidratado dura?",
        answer:
          "Até cinco dias na geladeira, em pote fechado e coberto por azeite. O sabor melhora nas primeiras 24 horas.",
      },
    ],
    productHandle: "chimichurri-picante",
    productName: "Chimichurri Picante",
    relatedRecipes: [
      "bife-manteiga-chimi-churri",
      "camarao-chimi-churri-picante",
      "frango-chimi-churri-tradicional",
    ],
    relatedPosts: [
      "quando-colocar-o-tempero-no-prato",
      "temperos-permitidos-na-dieta-keto",
    ],
  },
  {
    slug: "o-que-e-temperaflix",
    title: "O que é a linha Temperaflix e por que ela existe",
    question: "O que é a linha Temperaflix da Temperanzza?",
    directAnswer:
      "Temperaflix é a linha de shakers da Temperanzza, criada para finalização imediata: pipoca, petiscos, batata, ovo frito e lanches. São três sabores — Tradicional, Bacon e Ervas Finas — em embalagem de polvilhamento direto, pensada para uso na mesa e não na panela.",
    standfirst:
      "Três shakers para o momento em que a comida já está pronta e ainda falta alguma coisa.",
    category: "casa",
    readTime: 4,
    publishedAt: "2026-03-02",
    tone: "oklch(0.55 0.2 20)",
    sections: [
      {
        heading: "Um problema específico",
        paragraphs: [
          "A linha principal da casa é feita para cozinhar: potes que entram no início do preparo, medidos em colher, aplicados com técnica. Mas existe um segundo momento, completamente diferente, em que ninguém quer medir nada.",
          "É a pipoca da noite, o ovo frito de dez da manhã, a batata que acabou de sair da air fryer. Ali o gesto é polvilhar, não temperar. A Temperaflix nasceu para esse gesto.",
        ],
      },
      {
        heading: "Os três sabores",
        paragraphs: [
          "Tradicional é o coringa: base salgada e aromática que funciona em qualquer coisa quente e levemente gordurosa. É o shaker que fica na mesa.",
          "Bacon entrega o defumado carnudo sem carne envolvida — o mais pedido em pipoca e batata. Ervas Finas é o mais leve dos três, para ovos, castanhas, torradas e queijos.",
        ],
        bullets: [
          "Temperaflix Tradicional — pipoca, batata, arroz, ovos",
          "Temperaflix Bacon — pipoca, batata rústica, hambúrguer, omelete",
          "Temperaflix Ervas Finas — castanhas, ovos, queijos, torradas",
        ],
      },
      {
        heading: "Por que shaker importa",
        paragraphs: [
          "A distribuição muda o resultado. Uma colher despeja o tempero concentrado em um ponto; o shaker espalha em camada fina e uniforme, que é exatamente o que um alimento seco e quente pede.",
          "É a diferença entre uma pipoca com três bocados salgados demais e uma pipoca temperada por inteiro.",
        ],
      },
      {
        heading: "Regra de uso",
        paragraphs: [
          "Superfície quente e levemente gordurosa. O calor volatiliza o aroma na hora, a gordura fixa o pó. Em alimento frio e seco, o tempero simplesmente cai para o fundo da tigela.",
          "Um fio de azeite ou manteiga derretida antes do shaker resolve qualquer caso em que a comida esteja seca demais.",
        ],
      },
    ],
    faq: [
      {
        question: "Posso cozinhar com Temperaflix?",
        answer:
          "Pode, mas não é o uso ideal. A linha foi construída para finalização — em cozimento longo, boa parte do aroma se perde. Para panela e forno, a linha principal rende mais.",
      },
      {
        question: "Qual Temperaflix é melhor para pipoca?",
        answer:
          "Bacon é o mais pedido, pelo defumado. Tradicional é o mais versátil e agrada mesa mista. Ervas Finas é o mais leve dos três.",
      },
      {
        question: "Temperaflix serve para dieta keto e low carb?",
        answer:
          "Sim. Os três shakers são compatíveis com keto, low carb e carnívora flex, sem açúcar ou amido na composição.",
      },
    ],
    productHandle: "temperaflix-bacon",
    productName: "Temperaflix Bacon",
    relatedRecipes: [
      "pipoca-caseira-temperaflix-tradicional",
      "mix-castanhas-temperaflix-ervas",
      "omelete-bacon-em-po",
    ],
    relatedPosts: [
      "por-que-tempero-artesanal-e-diferente",
      "temperos-low-carb-sem-perder-sabor",
    ],
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
