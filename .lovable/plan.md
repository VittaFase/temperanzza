## Objetivo

Reproduzir o "espírito visual" da Kinder's na apresentação dos produtos Temperanzza — sem copiar a marca deles, mas adotando o mesmo sistema de exposição: cada produto vive sobre um **bloco de cor sólido e saturado próprio do sabor**, com tipografia stencil pesada, selos circulares ("NOVO", "PREMIUM"), e grid de variações como tiles coloridos.

Como nossa marca já roda em Big Shoulders Stencil + vermelho tijolo + paper cream, o casamento é natural — vamos só puxar a régua visual para o nível Kinder's.

## O que muda

### 1. Card de produto (catálogo + home)
- Fundo do card vira um **bloco de cor sólido por SKU** (mapeado por sabor: páprica doce = âmbar quente, páprica picante = vermelho-pimenta, canela = marrom-canela, açafrão = ouro, alecrim = verde-musgo, etc.).
- Foto do potinho centralizada, grande, ocupando ~70% do tile, com sombra projetada sutil.
- Textura de "poeira/partículas" sobreposta no fundo (CSS radial-gradients muito sutis) para imitar o granulado da Kinder's.
- Selo circular preto rotacionado no canto superior esquerdo quando aplicável: **NOVO**, **PREMIUM BLACK**, **EDIÇÃO LIMITADA**.
- Abaixo do tile colorido: nome do produto em stencil bold maiúsculo + linha fina com sublinha/categoria + preço em vermelho tijolo.
- Hover: leve zoom no potinho + brilho no fundo.

### 2. Página de produto (`/product/$handle`)
- Hero split: à esquerda o **bloco de cor gigante** com o potinho centralizado (mesmo tratamento do card, em escala grande, com selo NOVO quando aplicável); à direita coluna de info.
- Coluna direita: tag de categoria em pill vermelha (ex. "TEMPEROS CORE"), título em stencil enorme, preço em vermelho, descrição editorial em Playfair italic + Inter, peso/tamanho como label discreta.
- Abaixo: **grid "OUTROS SABORES DA LINHA"** — mini-tiles coloridos com cada SKU irmão (Core mostra Core, Premium Black mostra Premium Black, Temperaflix mostra Temperaflix), no mesmo formato dos color tiles da Kinder's.
- CTA "ADICIONAR À SACOLA" sharp corners, full-width na coluna, vermelho tijolo.

### 3. Sistema de cores por sabor
Criar um mapa `flavorPalette` em `src/lib/flavorPalette.ts` que dá `{bg, particle, accent}` para cada handle/sabor. Fallback para vermelho-marca se não mapeado. Isso permite escalar para os 19 SKUs sem hardcode em cada componente.

### 4. Detalhes finais
- Borda decorativa zigue-zague vermelha no rodapé de seções (igual à serra dentada da Kinder's) — reaproveitar como divisor de seções.
- Selo "NOVO" circular preto com rotação -8°, fonte stencil branca.
- Manter sharp corners (rounded-none) nos CTAs como já está na régua da marca.

## Arquivos afetados

- `src/lib/flavorPalette.ts` (novo) — mapa cor por SKU
- `src/components/site/ProductCard.tsx` — refatorar para o tile colorido
- `src/components/site/ProductGrid.tsx` — ajustar gap/colunas se necessário
- `src/routes/product.$handle.tsx` — PDP nova
- `src/components/site/FlavorTiles.tsx` (novo) — grid de variações coloridas
- `src/components/site/ProductBadge.tsx` (novo) — selo circular
- `src/components/site/ZigzagDivider.tsx` (novo) — serra decorativa
- `src/styles.css` — adicionar tokens de cor de sabor + utilidade `.particle-bg`

## O que NÃO vai mudar

- Paleta base da marca (paper cream, ink, vermelho tijolo) e tipografia continuam iguais.
- Estrutura de rotas, carrinho Shopify, header, footer — nada toca.
- Nada de backend.

## Pergunta antes de implementar

Quer que eu defina o mapa de cor de cada um dos 19 SKUs agora (eu escolho baseado no perfil do tempero) ou prefere validar cor a cor comigo?