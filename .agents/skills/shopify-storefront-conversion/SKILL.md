---
name: shopify-storefront-conversion
description: Use ao trabalhar com catálogo, produtos, carrinho, checkout, PDP e listagens da loja Shopify no site Temperanzza. Aciona em pedidos de "Shopify", "produto", "catálogo", "carrinho", "checkout", "comprar", "preço".
---

# Shopify Storefront + Conversion

## Quando usar
- Exibir produtos, preços, imagens ou variações no frontend.
- Implementar carrinho, drawer de carrinho ou botão "Adicionar".
- Criar checkout via Shopify Storefront API.
- Construir PDP (`/product/$handle`) ou listagens.
- O usuário pedir "produto", "catálogo", "carrinho", "checkout", "comprar".

## Constantes fixas
Toda comunicação com Shopify usa:
- `SHOPIFY_API_VERSION = "2025-07"` (sempre esta versão).
- `SHOPIFY_STORE_PERMANENT_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com"`.
- `SHOPIFY_STOREFRONT_TOKEN` (já em `src/lib/shopify.ts`).

## Fluxo obrigatório de checkout
1. Todos os botões "Comprar" / "Adicionar ao Carrinho" primeiro adicionam ao **carrinho local** (`src/stores/cartStore.ts`).
2. O carrinho cria/usa um `cartId` do Shopify via Storefront API.
3. No checkout, chama `cartCreate`/`cartLinesAdd` e abre a URL de checkout em nova aba.
4. A URL de checkout **sempre** inclui `?channel=online_store`.
5. A URL **sempre** abre com `window.open(url, "_blank")`.

### PROIBIDO
- Redirecionar direto para página de produto Shopify.
- Usar URLs manuais tipo `/cart/add?id=variant-id`.
- Criar checkout permalinks.
- Abrir checkout na mesma aba.

## Arquivos principais
- `src/lib/shopify.ts`: queries, tipos, helper `storefrontApiRequest`, `formatBRL`.
- `src/lib/shopify/admin.server.ts`: Admin API (server-only) para sync de preço/estoque.
- `src/stores/cartStore.ts`: estado do carrinho local.
- `src/components/site/CartDrawer.tsx`: drawer de carrinho.
- `src/components/site/ProductCard.tsx`, `ProductGrid.tsx`, `CatalogGrid.tsx`: listagens.
- `src/routes/product.$handle.tsx`: PDP.

## Potes reais vs imagens Shopify
- As imagens da Shopify têm fundo branco; o site usa PNGs transparentes locais via `src/lib/productImages.ts`.
- `getProductImage(handle)` deve ser preferido para renderização no site.
- A imagem Shopify serve para OG/sitemap quando necessário.

## Regras de produto
- Nunca criar produtos fictícios ou mockados.
- Se não houver produtos na Shopify, mostrar grid vazio com mensagem "No products found" e orientar o usuário a criar produto.
- Nunca gerar avaliações/reviews falsas.
- Se o usuário pedir reviews, criar UI vazia com "Ainda não há avaliações".

## Variações e shakers
- Temperaflix é linha de shakers; variações podem existir na Shopify.
- Blends são caixas com 12 potes; ainda não têm handle Shopify (`shopifyHandle: null` no `src/lib/blends.ts`).
- Quando blend tiver handle Shopify, o CTA passa de "Reservar" para "Adicionar ao Carrinho".

## Cupom e conversão
- Cupom de desconto só é aplicável a carrinhos com 12+ itens (caixa display).
- Validação de cupom deve ser feita server-side ou via Shopify checkout.

## Diagnóstico
- Erro `402` da Shopify = loja precisa de plano ativo.
- Erro `401` = token Storefront inválido.
- Produto não aparecendo = verificar handle na Shopify e na query GraphQL.

## Validação
- Após alterar fluxo de compra, fazer pedido de teste no preview.
- Verificar se a URL de checkout contém `channel=online_store`.
- Confirmar que carrinho persiste entre navegações (localStorage + Shopify cart ID).
