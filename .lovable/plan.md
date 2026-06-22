
# Integração da logo "Chef Temperanzza"

A logo enviada é um brasão circular em preto e branco, estilo gravura/woodcut: chef de braços cruzados, bigode, bandana, com o nome TEMPERANZZA em arco ao redor. Ela conversa perfeitamente com o aesthetic "industrial spice-house" do site (Big Shoulders Stencil, brand-ink/brand-paper, brick-red). É um **selo**, não um logotipo horizontal — então o uso deve respeitar isso.

## Princípios de uso

- **Selo, não wordmark**: nunca esticar nem usar em larguras pequenas onde o texto em arco fique ilegível. Mínimo prático ~40px, ideal 56–120px.
- **Monocromático**: o brasão é preto. Aparece em **brand-ink sobre brand-paper** ou invertido (paper sobre ink) — nunca colorido, nunca sobre fundos vibrantes (brick-red, mustard).
- **Companhia, não substituição**: o wordmark "TEMPERANZZA / SPICE HOUSE" no header continua existindo. O selo aparece **ao lado** ou em contextos editoriais — não substitui o tipo.

## Onde aplicar (escopo desta entrega)

### 1. Header (`SiteHeader.tsx`)
- Adiciona o brasão (h-10) à esquerda do wordmark, com border-right sutil separando do tipo.
- Em mobile, o brasão sozinho serve como link "home" (wordmark some abaixo de sm).

### 2. Footer (`SiteFooter.tsx`)
- Substitui o texto "Temperanzza" da coluna principal por **brasão (h-20) + tagline curta abaixo**. Cria autoridade no fechamento da página.
- Selo aparece em `brand-paper` (invertido) sobre o `brand-ink` do footer.

### 3. Home — Hero (`routes/index.tsx`)
- Pequeno selo (h-12) acima da headline, junto da divider-stencil "Desde 2019 — Minas Gerais". Funciona como carimbo de origem.

### 4. Home — nova faixa "Selo da Casa"
- Seção curta entre catálogo e CTA final: brasão grande (h-40 a h-56) centralizado sobre fundo `brand-cream` com textura paper-grain, frase editorial em Playfair italic ("Casa de temperos. Minas Gerais. Desde 2019.") e divisórias stencil nas laterais. Reforça identidade artesanal sem virar página "sobre".

### 5. Sobre (`routes/sobre.tsx`)
- Brasão (h-32) no topo do hero da página, acima do "Quem somos". Coerente com o tom autoral da página.

### 6. Favicon + OG
- Trocar favicon para uma versão recortada do brasão (apenas o rosto do chef, dentro do círculo).
- Atualizar `og:image` padrão no `__root.tsx` para incluir o brasão se ainda não houver.

## Fora de escopo

- Não vou refazer Temperaflix nem product pages (a linha tem identidade própria escura, o selo entraria conflitante).
- Não vou criar variações coloridas do brasão.
- Não vou mexer em embalagens dos produtos Shopify.

## Detalhes técnicos

- Upload da imagem via `lovable-assets` a partir de `/mnt/user-uploads/IMG_9302.PNG` → pointer em `src/assets/temperanzza-seal.png.asset.json`.
- Criar componente `src/components/site/BrandSeal.tsx` aceitando `size` (sm/md/lg/xl) e `tone` (ink/paper). Em tone="paper", aplica filtro `invert` no img.
- Importar pointer e usar `<img src={seal.url} alt="Brasão Temperanzza" />` com `loading="eager"` no header, `loading="lazy"` no resto.
- Favicon: gerar PNG quadrado recortado e referenciar em `__root.tsx head.links`.

## Resultado esperado

O selo passa a aparecer em 5 superfícies-chave, reforçando reconhecimento de marca sem competir com o sistema tipográfico existente. Mantém PT-BR, tokens da marca, cantos retos.
