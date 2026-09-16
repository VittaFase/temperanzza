---
name: brand-copywriting-temperanzza
description: Use ao escrever ou revisar textos de interface, receitas, blog, descrições de produto, CTAs e comunicação da marca Temperanzza. Aciona em pedidos de "texto", "copy", "tom de voz", "descrição", "receita", "artigo".
---

# Brand Copywriting Temperanzza

## Quando usar
- Escrever ou revisar textos de UI, botões, hero, descrições, CTAs.
- Criar/editar receitas da Biblioteca Gastronômica (`src/lib/recipes.ts`).
- Criar/editar artigos do Blog (`src/lib/blog.ts`).
- Descrever produtos, blends, páginas institucionais.
- O usuário pedir "mude o texto", "melhore a copy", "deixe mais Temperanzza".

## Tom de voz
- **Autoridade sem arrogância**: a casa sabe de tempero, mas fala como quem ensina na cozinha.
- **Sensorial e concreto**: aromas, texturas, momentos da mesa — evite adjetivos genéricos.
- **Mineiro com requinte**: orgulho de Minas Gerais, tradição, lote a lote.
- **Curadoria**: cada mistura é "receita da casa", "proporção testada", "seleção".
- **Conversão sutil**: o pote é o herói; o conteúdo vende antes do CTA.

## Nomenclatura fixa (nunca alterar)
- Marca: **Temperanzza** (com dois z's).
- Sub-marca shaker: **Temperaflix** (nunca "Tempera Flix").
- Linha Premium: **Premium Black**.
- Sub-linhas: **Core**, **Premium Black**, **Temperaflix**.
- Nome do builder: **Blend do Chefe** / **Chefe da Casa**.
- Biblioteca de receitas: **Biblioteca Gastronômica Temperanzza**.
- Blog: **Blog Temperanzza**.

## Restrições de emoji
- **Geral**: não usar emojis. A identidade visual usa selos, tipografia stencil e cor.
- **Exceção única**: linha Temperaflix pode usar 🍿🎬🎮 em contextos de "momentos de tela", com moderação.

## Regras de conteúdo
- **Nunca inventar ingredientes ou produtos** que não existam no catálogo. Verifique `src/lib/recipes.ts`, `src/lib/blends.ts`, `src/lib/productImages.ts` e a Shopify antes de citar.
- **Bacon em pó** foi consolidado para **Temperaflix Bacon**. Não use "Bacon em Pó".
- **Alho em Pó** foi removido do projeto. Se aparecer em receita, substitua por **Salsa, Cebola e Alho** ou outro condimento aprovado.
- Receitas devem ter: título, `featuredHandle` real, ingredientes realistas, modo de preparo, `whyItWorks`, `substitution`.
- Artigos de blog seguem AEO: pergunta real → resposta direta → corpo aprofundado → FAQ.

## Estrutura de receita
```ts
{
  slug: "nome-da-receita",
  title: "Nome do prato com condimento Temperanzza",
  featuredHandle: "handle-real-da-shopify",
  compatibleDiets: ["keto", "lowcarb", "carnivora-flex"], // removida "carnivora-restrita"
  moment: "cafe" | "almoco" | "jantar",
  profile: "defumado" | "ervas" | "picante" | "citrinco" | "adocicado" | "terroso",
  category: "dieta" | "tradicional",
  intro: "uma frase de impacto sensorial",
  ingredients: [...],
  steps: [...],
  whyItWorks: "...",
  substitution: "...",
  hero: { color: "oklch(...)" },
  // opcional, mas preferido:
  subtitle, chefWord, time, serves, difficulty, harmonization
}
```

## Estrutura de artigo de blog
- `title`: H1 editorial.
- `question`: pergunta real que originou o artigo.
- `directAnswer`: 2–3 frases para snippet.
- `standfirst`: linha de apoio.
- `sections`: cada uma com `heading` e `paragraphs` (e opcional `bullets`).
- `faq`: 3–5 perguntas/respostas.
- `productHandle`: condimento protagonista.
- `relatedRecipes` e `relatedPosts`: slugs reais existentes.

## CTAs permitidos
- "Ver o Catálogo", "Explorar a Cozinha", "Montar meu Blend", "Adicionar ao Carrinho", "Fechar pedido", "Reservar".
- Evite "Comprar agora" como CTA principal — o fluxo é carrinho → checkout Shopify.

## O que nunca fazer
- Criar produtos, receitas ou condimentos fictícios.
- Usar fotos de pratos geradas quando a diretriz atual é "pote real + bloco de cor".
- Mudar nomenclatura fixa da marca.
- Usar gírias que não combinem com o tom editorial ("top", "demais", "incrível" solto).

## Validação
- Leia `src/lib/recipes.ts` e `src/lib/blog.ts` para confirmar padrões antes de editar.
- Após alterar texto, verifique visualmente no preview se não quebrou layout.
