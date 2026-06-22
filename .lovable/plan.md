
# Landing Temperaflix — `/temperaflix`

Página dedicada à sublinha de shakers (Tradicional, Ervas Finas, Bacon) com narrativa de "momentos de tela".

## Estrutura da página

1. **Hero cinematográfico**
   - Headline: "O tempero que entra em cena"
   - Subhead curta sobre shakers prontos para a mesa do sofá
   - CTA primário "Ver os 3 sabores" (scroll) + secundário "Levar o combo"
   - Visual: composição escura tipo home theater com os 3 potes em destaque (usa imagens reais já no Shopify)

2. **Três shakers, três gêneros**
   - Grid de 3 cards grandes, cada um com um "gênero" atribuído:
     - Tradicional → "O clássico atemporal"
     - Ervas Finas → "O drama sofisticado"
     - Bacon → "O blockbuster de ação"
   - Cada card: imagem do shaker, nome, gênero, descrição curta, preço (R$ 10,49), botão "Adicionar ao carrinho" (usa o carrinho Shopify já existente)

3. **Como usar — momentos de tela**
   - Seção editorial em 3 colunas pareando blend × ocasião (pipoca, batata, petiscos)
   - Tipografia Big Shoulders Stencil + Playfair italic para os títulos das cenas

4. **Combo Maratona**
   - Bloco destacando os 3 juntos como kit para o "fim de semana de série"
   - CTA agrupado adicionando os 3 ao carrinho de uma vez

5. **Faixa de marca / rodapé da página**
   - Reforço da identidade Temperanzza + link para o catálogo completo `/produtos`

## Detalhes técnicos

- Novo arquivo `src/routes/temperaflix.tsx` com `createFileRoute("/temperaflix")` e `head()` próprio (title, description, og:title/description/image apontando para uma das imagens dos shakers)
- Busca dos 3 produtos via Storefront API filtrando por `query: "tag:temperaflix"` (ou pelos handles conhecidos) reusando o helper em `src/lib/shopify.ts`
- Reuso do carrinho/checkout Shopify existente (sem mexer em lógica de compra)
- Link "Temperaflix" adicionado ao header principal
- 100% PT-BR, tokens de cor da marca (`brand-ink`, `brand-paper`, `brand-red`, `brand-mustard`), cantos retos nos CTAs, fontes do design system
- Sem mocks, sem reviews falsas; se a Storefront API não retornar os 3, mostra estado vazio amigável

## Fora de escopo

- Vídeo real no hero (fica como placeholder visual estático por ora)
- Página de produto individual (já existe `/product/[handle]`)
- Alteração da home ou de `/produtos`
