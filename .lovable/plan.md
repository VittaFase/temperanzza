## Mudança

No componente `src/components/site/FlavorTiles.tsx`, a imagem do produto vem direto da Shopify (`p.node.images.edges[0]?.node.url`), que tem fundo branco. A seção "Catálogo" usa `getProductImage(handle, fallback)` de `src/lib/productImages.ts`, que devolve o PNG transparente local.

### Passo único
- Em `FlavorTiles.tsx`:
  - Importar `getProductImage` de `@/lib/productImages`.
  - Trocar `src={image.url}` por `src={getProductImage(p.node.handle, image?.url) ?? image?.url}`.
  - Ajustar a condição para renderizar `<img>` quando houver imagem local OU imagem da Shopify.

Sem mudanças em layout, tamanhos ou backend. Mantém o fallback para Shopify caso o handle não esteja mapeado.
