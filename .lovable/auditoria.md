# Auditoria Temperanzza — Evolução Orientada por Evidências

_Entrega A · Documento vivo · Atualizado agora_

Escopo: mapear gaps reais de **SEO**, **Acessibilidade (A11y)**, **Performance** e **Consistência UX** em todas as rotas públicas para priorizar as próximas evoluções sem retrabalho.

Rotas auditadas: `/`, `/produtos`, `/product/$handle`, `/cozinha`, `/cozinha/$slug`, `/blends`, `/blends/$slug`, `/temperaflix`, `/sobre`, `/lojas`.

Legenda de prioridade: **P0** bloqueante · **P1** alto impacto · **P2** polimento.

---

## 1. SEO

### 1.1 Metadados por rota
| Rota | Title | Description | og:image | JSON-LD | Status |
|---|---|---|---|---|---|
| `/` | ok | ok | **faltando** | não | P1 |
| `/produtos` | verificar | verificar | faltando | não (ItemList) | P1 |
| `/product/$handle` | dinâmico | dinâmico | verificar (imagem do pote) | **não (Product)** | **P0** |
| `/cozinha` | ok | ok | faltando | não (CollectionPage) | P1 |
| `/cozinha/$slug` | dinâmico | dinâmico | derivar do hero | **não (Recipe)** | **P0** |
| `/blends`, `/blends/$slug` | verificar | verificar | faltando | não | P1 |
| `/temperaflix` | verificar | verificar | faltando | não (Product/Brand) | P1 |
| `/sobre` | ok | ok | faltando | não (Organization) | P2 |
| `/lojas` | verificar | verificar | faltando | não (LocalBusiness) | P1 |

**Ações P0**
- `product.$handle.tsx`: adicionar JSON-LD `Product` (name, image, brand=Temperanzza, offers com price/priceCurrency=BRL/availability) + `og:image` com URL absoluta do pote.
- `cozinha.$slug.tsx`: JSON-LD `Recipe` (name, recipeIngredient, recipeInstructions, recipeCategory, keywords das dietas compatíveis) + `og:image` derivado do hero.

**Ações P1**
- `sitemap.xml` dinâmico gerado em rota `api/public/sitemap.xml.ts` cobrindo produtos, receitas, blends.
- `robots.txt` com referência ao sitemap.
- Canonical em todas as rotas que aceitam querystring (`/cozinha?condimento=...`, `/produtos?...`).
- `og:image` padrão da marca (selo em fundo cream) como fallback global no `__root`.

### 1.2 Semântica
- Auditar H1 único por rota (hoje há risco em `/` com dois h1 potenciais entre hero e seções).
- Breadcrumbs semânticos (`nav[aria-label="breadcrumb"]` + `BreadcrumbList` JSON-LD) em `/cozinha/$slug`, `/product/$handle`, `/blends/$slug`.

---

## 2. Acessibilidade (A11y)

**P0 — bloqueadores WCAG AA**
- Contraste dos chips de dieta em fundo `bg-brand-cream/60` — verificar `text-accent` sobre cream (borderline 4.5:1).
- Vídeos de fundo (`hero-bokeh.mp4`) sem `aria-hidden="true"` explícito em todos os pontos de uso.
- Focus ring visível: confirmar que `:focus-visible` está preservado em botões `bg-foreground text-background` (o `outline` some em alguns hovers).

**P1**
- `alt` descritivo real nas imagens de pote (hoje muitas usam handle como alt genérico); ideal: `Pote de {nome} Temperanzza, {peso}g`.
- Landmarks: garantir um único `<main>` por página (já ok via `SiteLayout`) e `<nav aria-label="Principal">` no header.
- Sheet mobile: já tem `SheetTitle`; validar `aria-describedby` quando aplicável.
- Botões-ícone (+/− quantidade, sacola, HUD Temperaflix): checar `aria-label` em 100% dos casos.

**P2**
- `prefers-reduced-motion`: já respeitado em SmokeBackdrop/BokehBackdrop; estender à `animate-pote-float` e às HUD scanlines Temperaflix.
- Skip link "Ir para conteúdo" no topo do `__root`.

---

## 3. Performance

**P0**
- Vídeos MP4 de fundo (`hero-smoke.mp4`, `hero-bokeh.mp4`): confirmar `preload="metadata"`, `playsInline`, `muted`, `loop`, poster imagem leve. Servir só em `md:` e desativar em conexões `saveData`.
- Imagens de pote PNG: garantir `loading="lazy"` fora do viewport inicial e `decoding="async"`; hero-relevantes usam `eager`.

**P1**
- Adicionar `width`/`height` a todas as `<img>` para evitar CLS.
- Preload da fonte `Big Shoulders Stencil` (display swap já ok).
- Code-splitting: `framer-motion` está carregado em Home via TemperaflixShowcase — verificar se cabe em `React.lazy` fora do viewport inicial.
- Bundle audit: rodar `bun run build` e inspecionar chunks > 200KB.

**P2**
- Converter PNGs de pote para AVIF/WebP no CDN quando disponível (mantendo PNG fallback).
- `fetchpriority="high"` no BrandSeal do hero e primeira imagem do catálogo.

---

## 4. Mobile-first / UX

**P1**
- Tap targets: já corrigido em quantidade e sacola; revisar chips de dieta e chips de momento em `/cozinha` (mínimo 44×44).
- `viewport-fit=cover` + `safe-area-inset-*` no `PromoAnnouncement` e `CartDrawer` para iPhones com notch.
- Header sticky: revisar altura em mobile (h-16 ok) e comportamento durante scroll horizontal em tabelas de blends.

**P2**
- Estados vazios: `/cozinha` filtrado por dieta sem resultados hoje mostra grid vazio — desenhar estado "nenhuma receita para este filtro, veja X".
- Feedback tátil em `+ SACOLA` no mobile (toast já existe via sonner; confirmar posição não coberta pelo header).

---

## 5. Consistência de marca / conteúdo

**P1**
- Padronizar nomes: sempre "Temperaflix Bacon", "Cebola em Pó", "Pimenta-do-Reino" (com hífens) em textos e ARIA labels.
- Emojis: já removidos de receitas — varrer `sobre.tsx`, `lojas.tsx`, `blends/*` para garantir 0 ocorrências fora da linha Temperaflix (onde 🍿🎬🎮 é permitido).
- Textos de fallback (loading/error/notFound) em pt-BR e no tom da casa.

**P2**
- Microcopy dos CTAs unificado: verbos no infinitivo curto ("Ver catálogo", "Explorar cozinha", "Adicionar à sacola").

---

## 6. Backend / Integrações

**P1**
- `sitemap.xml` puxando produtos do Shopify Storefront + receitas de `src/lib/recipes.ts` + blends de `src/lib/blends.ts`.
- Endpoint público `/api/public/health` (200 OK) para monitoramento externo.

**P2**
- Cache de queries Shopify no `queryClient` com `staleTime` maior para catálogo (5 min) — hoje é 0 por padrão do router.

---

## 7. Priorização sugerida (próximas entregas)

**Entrega B — SEO estrutural (P0)**
1. JSON-LD `Product` em `/product/$handle`
2. JSON-LD `Recipe` em `/cozinha/$slug`
3. `og:image` absoluto em todas as rotas com hero relevante
4. Sitemap dinâmico + robots

**Entrega C — A11y AA (P0/P1)**
1. Auditar contraste e focus rings
2. Alts descritivos em 100% das imagens de pote
3. Skip link + landmarks revisados

**Entrega D — Performance (P1)**
1. `width`/`height` em todas as `<img>`
2. `React.lazy` no showcase Temperaflix + framer-motion
3. `preload` de fonte display + `fetchpriority` no BrandSeal hero

**Entrega E — UX mobile e estados vazios (P2)**
1. Safe-area em drawers/promo
2. Estado vazio de filtros em `/cozinha`
3. Microcopy unificado

---

## 8. Como validar cada entrega
- **SEO**: Lighthouse SEO ≥ 95 + validação de rich results no Google Rich Results Test.
- **A11y**: Lighthouse A11y ≥ 95 + axe DevTools sem violations críticas.
- **Performance**: Lighthouse Performance mobile ≥ 85, LCP < 2.5s, CLS < 0.1.
- **UX**: revisão manual em iPhone SE (375px) e Pixel 7 (412px).

Cada entrega fecha com: prints antes/depois + números de Lighthouse + checklist marcado.
