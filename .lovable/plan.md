
# Plano de Execução — Temperanzza E-commerce

Stack: TanStack Start + React 19 + Tailwind v4 + Shopify (integração nativa Lovable) + Lovable AI Gateway (Gemini).

## Fase 1 — Setup Shopify + Design System

**Shopify:**
- Acionar `shopify--enable` no modo "Create new store" (development store gratuita, sem cobrança até você fazer "Claim Store").
- Após criação, opção de claim fica disponível quando quiser ativar venda real.

**Design tokens em `src/styles.css` (Tailwind v4 `@theme`):**
- `--background: #E0E0E0`, `--foreground: #000000`, `--accent: #FF3D00`
- Cores semânticas por sabor (a popular quando você mandar SKUs):
  - `--flavor-spicy: <hex>` (picante → vermelho/laranja)
  - `--flavor-herbal: <hex>` (herbal → verde escuro)
  - `--flavor-smoky: <hex>` (defumado → marrom/preto)
  - `--flavor-sweet: <hex>` (doce → âmbar)
  - `--flavor-citrus: <hex>` (cítrico → amarelo)
- Borda tracejada utilitária: `border-2 border-dashed border-black`
- Sombras "flash" (duras, sem blur): `box-shadow: 8px 8px 0 0 #000`
- Sem `border-radius` (estética industrial)

**Tipografia (ajustada):**
- H1-H3: **Big Shoulders Stencil Display** (stencil real, peso 700-900) — não Space Grotesk, que não é stencil
- Body / UI: **Inter** (legível em mobile, peso 400/500/600)
- Acento serif para citações curtas: Playfair Display 600 (uso pontual, não corpo)
- Carregamento via `<link>` no `src/routes/__root.tsx` (regra Tailwind v4 / Lightning CSS)

**Componentes base shadcn customizados:**
- `Button` (variants: primary vermelho sólido, ghost com borda tracejada, hover por deslocamento de borda 4px)
- `Card` (borda tracejada 2px, sombra flash, sem radius)
- `Badge` (rodapé colorido por sabor)
- `Input` (borda tracejada, foco em #FF3D00)

**Estrutura de rotas (TanStack):**
```
src/routes/
  __root.tsx          (head: fonts, meta global, OG defaults)
  index.tsx           (landing premium)
  produtos.tsx        (catálogo grid 5col)
  produtos.$handle.tsx (PDP individual)
  carrinho.tsx        (cart → redireciona checkout Shopify)
  lojas.tsx           (store locator)
  sobre.tsx           (institucional mosaico)
```

## Fase 2 — Catálogo Shopify (após você enviar fotos + SKUs)

**Cadastro via integração nativa (cada mutação pede aprovação sua):**
- Criar coleção "Signature"
- Criar produtos com: nome, descrição, preço, peso, imagens, tags de sabor (`spicy|herbal|smoky|sweet|citrus`), SKU
- Tag de sabor vira chave do `--flavor-*` no card

**Storefront lê produtos via integração Shopify Lovable:**
- Grid 5 colunas (5 → 4 → 3 → 2 → 1 conforme breakpoint)
- Card: imagem (lazy + WebP via Shopify CDN com `?width=` automático), nome stencil, preço, estrelas (placeholder fase 1, integração Judge.me fase 4 se quiser), rodapé colorido por sabor
- Hover: borda desloca 4px diagonal + fundo do botão vira #FF3D00
- PDP: galeria, descrição, qty selector, "Adicionar ao Carrinho"

**Carrinho:**
- Persistente em `localStorage` (cart token)
- Subtotal dinâmico
- Botão "Finalizar Compra" → redireciona pro checkout Shopify (PCI/SSL/antifraude no domínio Shopify)

## Fase 3 — Storefront Premium (landing + institucional + lojas)

**Landing `/`:**
- Hero stencil bold com produto destaque + CTA vermelho
- Grid 5col de bestsellers
- Seção "Premium desde 2023" em mosaico assimétrico (3-2-3 layout)
- Faixa de categorias por sabor com chips coloridos
- Footer com newsletter (signup Shopify Customer)
- SEO: H1 único, meta description <160c, JSON-LD `Organization` + `ItemList`, OG image do produto hero

**Localizador `/lojas`:**
- Input de CEP + lista de PDVs renderizada por proximidade (Haversine simples sobre coords salvas em Shopify metafields da loja, ou JSON local fase 1)
- Sem mapa interativo na fase 1 (evita custo Google Maps + cartão obrigatório); decide depois se vale Mapbox
- Cards de loja com endereço, telefone, horário, botão "Como chegar" → Google Maps externo

**Institucional `/sobre`:**
- Mosaico bento com história, valores, processo, fundadores
- Conteúdo gerenciado via Shopify Pages (read via API)

## Fase 4 — IA Recomendador Gastronômico

**Chat flutuante (botão canto inferior direito):**
- Ícone discreto com borda tracejada estilo Temperanzza
- Painel desliza da direita, mobile-first

**Backend:** server route `src/routes/api/chat.ts` usando AI SDK + Lovable AI Gateway (`google/gemini-3-flash-preview`, grátis no tier inicial).

**System prompt:** consultor gastronômico que conhece o catálogo Temperanzza. Recebe contexto dos produtos via tool/Output structured (Zod schema com lista de SKUs+sabores). Retorna 2-3 recomendações com explicação curta + links pros PDPs.

**Exemplo de UX:**
> Usuário: "Vou fazer picanha no churrasco amanhã"  
> IA: "Pra picanha eu sugiro o **Defumado da Casa** (realça o sabor da gordura), o **Pimenta Calabresa** (toque picante no final) e o **Sal de Parrilla** (textura grossa pra crosta). Quer ver os 3?"

**Privacidade:** zero PII enviada à IA fase 1 (sem login, sem histórico). LGPD-compliant.

**Sem WebSocket, sem motor próprio, sem API Gateway externo** — request/response HTTP simples basta para o volume e UX.

## O que fica fora desta entrega (fases futuras se quiser)

- Login de cliente Shopify + "meus pedidos" (Customer Account API — trabalho 3x maior)
- Avaliações reais com Judge.me/Loox (precisa app instalado no Shopify primeiro)
- Mapa interativo (Mapbox/Google Maps) no localizador
- Multi-idioma / multi-moeda
- Status de pedido via chat IA

## Detalhes Técnicos

**Performance:**
- Imagens via Shopify CDN com `loading="lazy"`, `srcset` responsivo, formato WebP/AVIF
- Fontes com `font-display: swap`
- Code-splitting automático por rota (TanStack)
- Meta Core Web Vitals: LCP <2.5s, CLS <0.1

**Acessibilidade (WCAG AA):**
- Contraste verificado (#000 sobre #E0E0E0 = 16.1:1 ✓; #FF3D00 sobre #E0E0E0 = 3.8:1, OK para texto grande/CTA, evitar em corpo)
- Navegação por teclado completa
- `alt` em todas imagens
- ARIA labels no chat e cart

**Segurança:**
- Checkout no domínio Shopify → PCI DSS Nível 1 herdado, sem armazenar cartão
- SSL/TLS automático Lovable + Shopify
- LGPD: banner de cookies (consent), política linkada no footer
- Chave da AI Gateway server-side (`LOVABLE_API_KEY`), nunca exposta ao browser

**Ordem de entrega real:**
Faço **uma fase por vez**, mostro o resultado no preview, você valida, próximo. Não é "rodar 4 prompts seguidos" — cada fase reage à anterior.

## Próximo passo

Aprovando este plano, começo a **Fase 1** imediatamente:
1. Aciono Shopify (development store nova)
2. Monto design system + estrutura de rotas + componentes base
3. Landing com produtos mock visual pra você ver a estética antes de cadastrar SKUs reais

Aí você manda o Master Prompt completo (se tiver detalhe extra), as fotos dos potes e a lista de SKUs, e vamos pra Fase 2.
