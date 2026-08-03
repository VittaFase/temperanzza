## Leitura da referência (kinders.com/recipes)

A estrutura do Kinder's tem 3 camadas, e hoje temos só uma delas:

| Camada Kinder's | Temperanzza hoje |
|---|---|
| **Hub `/recipes`** — hero com receita em destaque, faixa de vídeos how-to, texto de convite, carrosséis curados por tema ("Easy Grilling", "Teriyaki Favorites"), grade de coleções | `/cozinha` tem hero + accordion de índice apenas |
| **Índice `/recipes/all`** — grade de cards com foto + filtros facetados (Tipo de refeição, Ingrediente, Ocasião, Tempero, Método), busca, contador, "carregar mais" | não existe |
| **Receita `/recipes/[slug]`** — foto grande do prato, ficha (tempo/rende/dificuldade), **compartilhar**, **imprimir**, ingredientes com checkbox, passos numerados, produto usado com "add to cart", receitas relacionadas | drawer editorial já cobre ficha, ingredientes, passos, pote, add-to-cart e relacionadas — falta foto do prato, compartilhar, imprimir, checkbox, print view |

Nada da estrutura atual é descartado: o drawer, o SEO, o JSON-LD `Recipe`, o `RecipeAddToCart`, a harmonização e o "Continue a leitura" continuam sendo o núcleo. O trabalho é **envelopar** isso com as camadas que faltam.

## Decisões confirmadas

- Cada receita ganha **foto do prato pronto gerada por IA**, no padrão visual da casa (luz lateral quente, madeira escura, fundo ink, o pote real da Temperanzza em cena). Isso **muda a diretriz atual** de "sem foto de prato" — vou atualizar a memória do projeto e a skill de imagem para o novo padrão.
- A faixa de vídeos how-to fica **estruturada mas oculta**, ligada por uma flag quando você enviar os vídeos reais.
- Filtros facetados completos: **Tipo de refeição · Ingrediente principal · Ocasião · Tempero · Dieta**.

## Etapa 1 — Camada de dados (sem quebrar nada)

`src/lib/recipes.ts`: novos campos **todos opcionais**, então nenhuma receita existente quebra em tipo nem em runtime.

- `mealType?: MealType` — pratos principais, ensopados/sopas, aperitivos e molhos, acompanhamentos, hambúrgueres, café da manhã, sanduíches, saladas
- `mainIngredient?: MainIngredient` — frango, carne bovina, porco, frutos do mar, ovos, vegetariano, legumes
- `occasion?: Occasion[]` — rápido e fácil, comida reconfortante, jantar compartilhado, uma panela, dia de churrasco, prático para a semana, sazonal
- `image?: string` — pointer do asset da foto do prato
- `imageAlt?: string`
- `featured?: boolean` — elege a receita do hero
- `collections?: string[]` — pertence a carrosséis curados
- `videoUrl?: string` — reservado para os how-to

Fallback obrigatório: onde `image` não existir, o card e o hero continuam usando o bloco `hero.color` + pote + tipografia atual. Assim a implementação nunca depende de todas as fotos existirem ao mesmo tempo.

Novo arquivo `src/lib/recipeFacets.ts`: rótulos em PT-BR, ordem de exibição, contagem por faceta e a função de filtro (aplicada em memória sobre `RECIPES` — zero backend).

Novo arquivo `src/lib/recipeCollections.ts`: as coleções curadas do hub (título, subtítulo, filtro ou lista de slugs, link "ver mais" pré-filtrado).

## Etapa 2 — Hub `/cozinha`

Mantém hero atual e passa a ter, na ordem:

1. **Receita em destaque** — foto grande do prato, título, ficha resumida, CTA "Ver receita" (e slot de vídeo quando existir).
2. **Faixa "Aprenda a técnica"** — 3 cards de vídeo com duração; oculta enquanto não houver `videoUrl`.
3. **"O que estamos cozinhando"** — texto de convite + botão **Ver todas as receitas** → `/cozinha/todas`.
4. **Carrosséis curados** (3 a 4 faixas, ex.: "Fogo e Defumado", "Mesa de Todos os Dias", "Low Carb sem tristeza"), cada card com foto, nome e "Ver receita" com o traço fino da casa; cabeçalho e rodapé com "Ver mais".
5. **Grade de coleções** — 4 blocos que levam ao índice já filtrado.
6. O **accordion "O Menu da Casa"** atual permanece, agora como índice tipográfico no fim da página (é a assinatura Temperanzza e ninguém perde o que já conhece).

## Etapa 3 — Índice `/cozinha/todas`

Nova rota irmã (não conflita com `/cozinha/$slug`, que é o drawer).

- Coluna/painel de filtros com as 5 facetas em colunas maiúsculas espaçadas, exatamente no ritmo do print que você enviou (versão mobile em drawer).
- Busca por texto (título, subtítulo, ingredientes).
- Estado dos filtros na **URL** (`?meal=&ingredient=&occasion=&tempero=&dieta=&q=`), então cada combinação é linkável, compartilhável e indexável.
- Grade de cards com foto, contador "N receitas", chips de filtro ativo removíveis, "Limpar tudo" e paginação incremental.
- Estado vazio editorial com sugestão de remover filtros.

## Etapa 4 — Receita: compartilhar, imprimir e leitura ativa

Dentro do drawer atual (`src/routes/cozinha.$slug.tsx`), sem trocar a arquitetura:

- **Foto do prato no hero** ao lado do pote real; sem foto, cai no visual atual.
- **Barra de ações** sticky: `Compartilhar` (Web Share API nativa no mobile; no desktop popover com WhatsApp, Facebook, X, Pinterest, e-mail e "copiar link" com toast) + `Imprimir` + `Salvar` (favoritos em localStorage, sem backend).
- **Ingredientes com checkbox** — marcar risca o item; estado por receita em localStorage.
- **Passos numerados clicáveis** — passo concluído esmaece; ajuda quem cozinha com o celular na bancada.
- **Ajuste de porções** — botões 1x/2x/3x recalculando as quantidades numéricas dos ingredientes (heurística segura: só multiplica número no início da string; texto sem número fica intacto).
- Bloco do tempero protagonista, harmonização e "Continue a leitura" ficam como estão.

## Etapa 5 — Área de impressão

Nova rota `/cozinha/$slug/imprimir` (layout limpo, sem drawer): logo da casa, título, ficha, ingredientes, passos, tempero usado e rodapé `temperanzza.com.br`. CSS `@page` com margens, cores desligadas para não gastar tinta e quebras controladas. O botão Imprimir abre essa view e chama `window.print()`.

## Etapa 6 — Fotos dos pratos

Geração em lotes, com prompt padronizado da casa (madeira escura, luz lateral quente, louça sóbria, pote real ao lado, sem texto, sem mãos, sem clichê de banco de imagens), salvas como asset pointers em `src/assets/receitas/`. Ordem: destaques do hub → capas dos carrosséis → restante do índice. Cada lote é validado no preview antes do próximo, e o fallback garante que o site nunca fica quebrado no meio do processo.

## Detalhes técnicos

- **Backend: zero mudanças.** Nenhuma migração, nenhuma server function, nada em Shopify ou Bling. Tudo roda sobre o array `RECIPES` em memória.
- Rotas novas: `src/routes/cozinha.todas.tsx` e `src/routes/cozinha.$slug.imprimir.tsx`. `routeTree.gen.ts` é regerado pelo plugin — não editado à mão.
- Componentes novos em `src/components/site/`: `RecipeCard`, `RecipeCarousel` (reaproveitando o padrão do `FlavorCarousel`), `RecipeFacetFilters`, `RecipeShare`, `RecipePrintButton`, `RecipeHeroFeatured`, `RecipeCollectionGrid`.
- SEO: hub e índice ganham `head()` próprio; o índice filtrado recebe `canonical` para `/cozinha/todas` (evita conteúdo duplicado por combinação de filtro) e a rota de impressão fica `noindex`. `ItemList` JSON-LD no hub e no índice; o `Recipe` JSON-LD da receita passa a incluir `image` da foto do prato, `prepTime`/`cookTime`/`recipeYield`.
- Acessibilidade: filtros como `fieldset`/`legend`, checkbox de ingrediente com label real, carrossel navegável por teclado, foco visível, `prefers-reduced-motion` respeitado.
- Assinatura Temperanzza mantida em tudo: `rounded-none`, Big Shoulders Stencil nos títulos, Playfair itálico nas linhas editoriais, tokens `brand-*` (nenhuma cor hardcoded), traço fino como separador em vez do dash-line do Kinder's.
- Validação: `tsgo`, build, e verificação no preview do hub, do índice com filtros combinados, de 3 receitas, do compartilhar e da view de impressão.

## Ordem de entrega sugerida

1. Etapas 1 + 4 (dados + ações na receita) — ganho imediato, risco mínimo.
2. Etapa 5 (impressão).
3. Etapa 3 (índice com filtros).
4. Etapa 2 (hub curado).
5. Etapa 6 (fotos, em lotes) rodando em paralelo a partir da etapa 2.
