# CONSTITUIÇÃO DA PLATAFORMA TEMPERANZZA
### Documento de Arquitetura Mestra — v1.0
Casa de Temperos Artesanais · Minas Gerais
Stack: Lovable · TanStack Start (React 19 + SSR) · TypeScript · Tailwind v4 · Lovable Cloud (Supabase) · Shopify Storefront/Admin · Bling ERP

> **Regra Zero (precede todas as outras):** antes de propor ou implementar qualquer alteração, é obrigatório auditar a estrutura existente do projeto, identificar o que já foi implementado, apontar inconsistências em relação a esta arquitetura e **priorizar reutilização em vez de criação**. Nenhuma recomendação pode assumir que uma funcionalidade não existe sem antes verificar sua presença na base de código atual.

---

## ÍNDICE

1. Filosofia da Plataforma
2. Mapa Completo do Front-end
3. Arquitetura do Back-end
4. Modelo de Dados
5. Arquitetura do Conteúdo
6. Padrão de Implementação
7. Padrões de Expansão
8. Governança da Plataforma
9. Auditoria Final
10. Anexos — Inventário Real do Projeto

---

# CAPÍTULO 1 — FILOSOFIA DA PLATAFORMA

## 1.1 Finalidade
A Temperanzza não é um catálogo com carrinho. É uma **casa de temperos** que usa o digital como extensão do balcão: a plataforma existe para **traduzir conhecimento gastronômico em decisão de compra**.

O site tem três funções, nessa ordem de importância:
1. **Ensinar** — receitas, blends, guias e conteúdo editorial que mostram *o que fazer* com o tempero.
2. **Provar autoridade** — imagem real do pote ao lado do prato, origem, artesania, curadoria.
3. **Vender** — checkout Shopify como consequência natural do conteúdo, nunca como interrupção dele.

## 1.2 Problema que resolve
O consumidor brasileiro compra tempero por hábito, não por escolha. Ele não sabe:
- qual tempero usa em qual prato;
- qual a diferença entre páprica doce, defumada e picante;
- o que combina com sua dieta ou ocasião.

A plataforma resolve isso com **rotas de descoberta paralelas**: por produto (`/produtos`), por prato (`/cozinha`), por ocasião/kit (`/blends`), por momento (`/temperaflix`) e por conhecimento (`/blog`).

## 1.3 Experiência-alvo
Editorial, industrial, tátil. Sensação de folhear uma revista gastronômica impressa e poder comprar a página. Sem ruído, sem pop-up agressivo, sem estética genérica de e-commerce.

## 1.4 Princípios inquebráveis

| # | Princípio | Consequência prática |
|---|-----------|----------------------|
| P1 | **Conteúdo antes de conversão** | Nenhuma página abre com modal de venda. CTA vem depois do valor entregue. |
| P2 | **O pote é o herói** | Todo conteúdo que cita um condimento exibe o PNG real do produto. Nunca ilustração genérica. |
| P3 | **Identidade única** | Big Shoulders Stencil (display) + Inter (corpo) + Playfair itálico (editorial). Cantos retos em CTAs. Tokens `brand-*`. Nenhuma identidade paralela. |
| P4 | **Tudo tem URL** | Drawers e acordeões são camada de UX sobre rotas reais. SEO nunca depende de estado de cliente. |
| P5 | **SSR-first** | Conteúdo indexável renderiza no servidor. `head()` por rota, sempre. |
| P6 | **Português brasileiro** | Toda a UI, sem exceção. |
| P7 | **Fonte única de verdade** | Cada dado tem um dono: preço = Shopify; estoque/fiscal = Bling; conteúdo = repositório; operação = Lovable Cloud. |
| P8 | **Reuso obrigatório** | Novo componente só existe se nenhum dos existentes puder ser estendido. |
| P9 | **Degradação graciosa** | Falha de Shopify/Bling não derruba página. Conteúdo estático continua servindo. |
| P10 | **Zero dado sensível no cliente** | Tokens Admin, segredos de webhook e credenciais Bling vivem apenas no servidor. |

---

# CAPÍTULO 2 — MAPA COMPLETO DO FRONT-END

## 2.1 Estrutura de rotas (file-based routing)

```
src/routes/
├── __root.tsx                    Shell global · <head> base · Outlet
├── index.tsx                     / .................. Home
├── produtos.tsx                  /produtos .......... Catálogo (19 SKUs)
├── product.$handle.tsx           /product/:handle ... PDP (Shopify)
├── temperaflix.tsx               /temperaflix ....... Sublinha "streaming de sabor"
├── blends.tsx                    layout (Outlet)
│   ├── blends.index.tsx          /blends ............ 6 caixas + Blend do Chefe
│   └── blends.$slug.tsx          /blends/:slug ...... Caixa curada + BlendBuilder
├── cozinha.tsx                   layout + shell da Biblioteca Gastronômica
│   ├── cozinha.index.tsx         /cozinha ........... Índice de receitas
│   └── cozinha.$slug.tsx         /cozinha/:slug ..... Receita completa
├── blog.index.tsx                /blog .............. Editorial (10 artigos)
├── blog.$slug.tsx                /blog/:slug ........ Artigo
├── sobre.tsx                     /sobre ............. Institucional
├── lojas.tsx                     /lojas ............. 301 → /blog (legado preservado)
├── admin.bling.tsx               /admin/bling ....... Painel operacional (chave)
├── sitemap[.]xml.ts              /sitemap.xml ....... Gerado dinamicamente
└── api/public/...                Endpoints HTTP externos (ver Cap. 3)
```

**Regra de rota:** o parâmetro de `createFileRoute("...")` deve espelhar exatamente o nome do arquivo. `routeTree.gen.ts` é gerado — nunca editado.

## 2.2 Mapa de navegação

```
                          ┌──────────────┐
                          │     HOME     │
                          └──────┬───────┘
        ┌───────────┬───────────┼───────────┬────────────┐
        ▼           ▼           ▼           ▼            ▼
   /produtos   /cozinha     /blends   /temperaflix    /blog
        │           │           │           │            │
        ▼           ▼           ▼           ▼            ▼
 /product/:h  /cozinha/:s /blends/:s  /product/:h  /blog/:s
        │           │           │           │            │
        └───────────┴─────┬─────┴───────────┴────────────┘
                          ▼
                    CartDrawer  ──►  Checkout Shopify (externo)
```

Toda folha (PDP, receita, blend, artigo) tem pelo menos **um caminho de volta** e **um caminho lateral** (relacionados). Nenhum beco sem saída.

## 2.3 Fluxos do usuário

**Fluxo A — Descoberta por prato (principal diferencial)**
```
/cozinha → filtro por dieta/ocasião → /cozinha/:slug
   → hero com prato + pote real → ingredientes → modo de fazer
   → "condimento usado" → CTA add-to-cart → CartDrawer → Shopify
```

**Fluxo B — Compra direta**
```
/produtos → ProductCard → /product/:handle → variante → carrinho → checkout
```

**Fluxo C — Kit / presente**
```
/blends → caixa curada OU Blend do Chefe → BlendBuilder (12 potes)
   → validação de cupom (12+) → BlendCelebration → checkout
```

**Fluxo D — Conteúdo → produto**
```
/blog → artigo → link interno para receita ou produto citado
```

## 2.4 Sistema de componentes

Três camadas, sem mistura:

| Camada | Local | Regra |
|--------|-------|-------|
| **Primitivos** | `src/components/ui/*` (shadcn) | Não editar visualmente. Só compor. |
| **Domínio** | `src/components/site/*` | Conhecem o negócio Temperanzza. Reuso obrigatório. |
| **Rotas** | `src/routes/*` | Composição + `head()` + data loading. Sem lógica de negócio. |

**Inventário de componentes de domínio (21) e sua responsabilidade única:**

| Componente | Responsabilidade | Consumido por |
|---|---|---|
| `SiteLayout` | Shell (header, footer, promo, toaster, skip-link) | todas as páginas |
| `SiteHeader` / `SiteFooter` | Navegação global | SiteLayout |
| `PromoAnnouncement` | Faixa promocional | SiteLayout |
| `CartDrawer` | Carrinho + handoff Shopify | SiteLayout/Header |
| `ProductCard` / `ProductGrid` / `CatalogGrid` | Exibição de SKU | produtos, home, PDP |
| `FeaturedRow` | Vitrine horizontal | home |
| `ProductBadge` / `DietBadge` | Selos | cards, receitas |
| `DietCompatibilityPanel` | Compatibilidade tempero × dieta | receita, PDP |
| `CombinaCom` | Cross-sell semântico | PDP, receita |
| `FlavorTile` / `FlavorTiles` | Paleta de sabor | produtos, PDP |
| `BlendBuilder` | Montagem dos 12 potes | blends/:slug |
| `BlendCelebration` | Confirmação do blend | BlendBuilder |
| `TemperaflixShowcase` | Vitrine da sublinha | /temperaflix, home |
| `BrandSeal` / `ZigzagDivider` | Assinatura gráfica | transversal |
| `CountUp` | Número animado | home, sobre |

## 2.5 Hierarquia visual padrão de página

```
[1] HERO         imagem/vídeo + display + subtítulo + CTA primário
[2] PROVA        números, selos, manifesto
[3] CONTEÚDO     grid, receita, artigo — o miolo
[4] RELACIONADOS caminho lateral obrigatório
[5] CTA FINAL    conversão + volta à navegação
```

## 2.6 Responsividade
Mobile-first. Breakpoints Tailwind padrão. Regras fixas:
- Alvo de toque mínimo **44×44px**.
- Tipografia display escala em 3 degraus (`text-5xl` → `sm:` → `lg:`).
- Grid: 1 col (mobile) → 2 (sm) → 3/4 (lg).
- Vídeo de fundo (bokeh) desativado sob `prefers-reduced-motion`.

## 2.7 Organização de arquivos

```
src/
├── routes/        páginas + endpoints (composição)
├── components/
│   ├── ui/        shadcn (primitivos)
│   └── site/      domínio Temperanzza
├── lib/           regra de negócio + dados de conteúdo
│   ├── bling/     *.server.ts (nunca no cliente)
│   └── shopify/   admin.server.ts
├── hooks/         estado reativo compartilhado
├── stores/        zustand (cartStore)
├── integrations/  gerado — não editar
├── assets/        PNGs reais dos produtos + vídeos
└── styles.css     tokens, tema, animações
```

---

# CAPÍTULO 3 — ARQUITETURA DO BACK-END

## 3.1 Princípio de fronteira

| Necessidade | Mecanismo | Onde |
|---|---|---|
| Lógica interna chamada pelo app | `createServerFn` | `src/lib/*.functions.ts` |
| Chamada por sistema externo | Server route | `src/routes/api/public/*` |
| Segredo / token | Apenas em `*.server.ts` e handlers | nunca em `src/lib/*.ts` cliente |

## 3.2 Módulos de serviço existentes

```
src/lib/
├── shopify.ts              Storefront API (público, leitura de catálogo/preço)
├── shopify/admin.server.ts Admin API (privado, escrita)
├── bling/
│   ├── client.server.ts    OAuth2 + refresh de token
│   ├── sync.server.ts      Bling → Shopify (produtos/estoque)
│   └── orders.server.ts    Shopify → Bling (pedidos)
├── blendPricing.ts         precificação de kits
├── blendCheckout.ts        montagem do carrinho de blend
├── dietCompatibility.ts    matriz tempero × dieta
└── error-capture.ts        telemetria de erro
```

## 3.3 Endpoints públicos

| Rota | Direção | Proteção |
|---|---|---|
| `/api/public/shopify/order-webhook` | Shopify → Bling | HMAC SHA-256 |
| `/api/public/bling/connect` | início OAuth | chave admin |
| `/api/public/bling/callback` | retorno OAuth | `state` |
| `/api/public/bling/status` | leitura de estado | chave admin |
| `/api/public/bling/sync` | sync manual | chave admin |
| `/api/public/bling/cron-sync` | sync agendado (20 min, pg_cron) | segredo |
| `/api/public/bling/disconnect` | revogação | chave admin |

**Regra:** todo endpoint em `/api/public/*` deve validar o chamador **na primeira linha do handler**, antes de qualquer parsing ou escrita.

## 3.4 Fluxo das informações

```
        ┌──────────┐  produtos/estoque   ┌──────────┐
        │  BLING   │ ──────────────────► │ SHOPIFY  │
        │  (ERP)   │ ◄────────────────── │ (comércio)│
        └────┬─────┘      pedidos        └────┬─────┘
             │                                │
             │ tokens, logs, mapas            │ Storefront API
             ▼                                ▼
        ┌────────────────────────────────────────────┐
        │            LOVABLE CLOUD (Postgres)         │
        │  bling_tokens · bling_*_map · sync_log      │
        │  pricing_* · product_costs · user_roles     │
        └────────────────────┬───────────────────────┘
                             │  server functions (RLS)
                             ▼
        ┌────────────────────────────────────────────┐
        │        TANSTACK START (SSR + cliente)       │
        │  conteúdo estático (lib/) + dados dinâmicos │
        └────────────────────────────────────────────┘
```

**Propriedade do dado (inegociável):**

| Domínio | Dono | Consequência |
|---|---|---|
| Preço, variantes, checkout | **Shopify** | app nunca inventa preço |
| Estoque, NF, pedido fiscal | **Bling** | app nunca decide estoque |
| Receitas, blog, blends, dietas | **Repositório** (`src/lib/`) | versionado em Git, SSR instantâneo |
| Custos, regras de preço, papéis, logs | **Lovable Cloud** | RLS obrigatório |

## 3.5 Organização do Lovable Cloud
- **RLS habilitada em 100% das tabelas públicas.** Sem política = sem acesso.
- **`GRANT` explícito** em toda tabela nova (`authenticated` e/ou `service_role`).
- **Papéis isolados** em `user_roles` + `has_role()` `SECURITY DEFINER` com `search_path = public`. Papel **nunca** em tabela de perfil.
- Tabelas operacionais (Bling/preço) não expostas a `anon`.

---

# CAPÍTULO 4 — MODELO DE DADOS

## 4.1 Grafo de entidades

```
                            ┌─────────────┐
                            │   PRODUTO   │  (SKU · 19)
                            └──────┬──────┘
        ┌──────────┬───────────────┼───────────────┬──────────┐
        ▼          ▼               ▼               ▼          ▼
   ┌────────┐ ┌────────┐    ┌────────────┐   ┌─────────┐ ┌────────┐
   │ LINHA  │ │CATEGORIA│   │ IMAGEM/PNG │   │ PERFIL  │ │ CUSTO  │
   │Core    │ │Pimentas │   │ (asset)    │   │ SABOR   │ │ /PREÇO │
   │Premium │ │Ervas    │   └────────────┘   └────┬────┘ └───┬────┘
   │Flix    │ │Mixes    │                         │          │
   └───┬────┘ └────────┘                          ▼          ▼
       │                                    ┌──────────┐ ┌────────┐
       │                                    │  DIETA   │ │ BLING/ │
       │                                    └────┬─────┘ │SHOPIFY │
       │                                         │       │  MAP   │
       ▼                                         ▼       └────────┘
   ┌────────┐   usa N   ┌──────────┐  compatível ┌──────────────┐
   │ BLEND  │◄──────────│ RECEITA  │────────────►│ COMPATIBILID.│
   │(caixa) │           └────┬─────┘             └──────────────┘
   └────────┘                │
                    ┌────────┼────────┬──────────┐
                    ▼        ▼        ▼          ▼
                 OCASIÃO   TAG    INGREDIENTES  MODO DE FAZER
                    │        │
                    └────┬───┘
                         ▼
                    ┌──────────┐   cita   ┌──────────┐
                    │ COLEÇÃO  │◄─────────│ ARTIGO   │
                    └──────────┘          │ (BLOG)   │
                                          └────┬─────┘
                                               ▼
                                          ┌──────────┐
                                          │   SEO    │ (title, desc,
                                          └──────────┘  OG, JSON-LD,
                                                        canonical)
```

## 4.2 Entidades e conversas

| Entidade | Chave | Fonte | Conversa com |
|---|---|---|---|
| **Produto** | `handle` | Shopify + `productImages.ts` | Linha, Categoria, Receita, Blend, Dieta, Custo |
| **Linha** | slug | `lib/` | Produto (1:N) — Core (13), Premium Black (2), Temperaflix (3) |
| **Receita** | `slug` | `lib/recipes.ts` | Produto (N:N), Dieta, Ocasião, Tag |
| **Blend** | `slug` | `lib/blends.ts` | Produto (12 potes), Ocasião, Preço |
| **Artigo** | `slug` | `lib/blog.ts` | Produto, Receita, Tag |
| **Dieta** | id | `lib/diets.ts` | Produto, Receita (via `dietCompatibility.ts`) |
| **Paleta de sabor** | id | `lib/flavorPalette.ts` | Produto, cross-sell |
| **SEO** | por rota | `head()` | todas as entidades de conteúdo |
| **Custo/Regra de preço** | uuid | Cloud | Produto (via map Bling/Shopify) |
| **Log de sync** | uuid | Cloud | Pedido, Produto |
| **Papel** | uuid | Cloud (`user_roles`) | acesso ao `/admin/*` |

**Chave universal de junção:** o `handle` do produto. Receita, blend, artigo e compatibilidade referenciam produto **sempre por handle** — nunca por nome legível, nunca por índice de array.

## 4.3 Regras de integridade
1. Toda receita cita ≥ 1 produto **existente no catálogo**. Ingrediente sem SKU correspondente não pode ser apresentado como produto da casa e deve ser substituído por um SKU aprovado.
2. Toda menção a "bacon em pó" resolve para **Temperaflix Bacon**.
3. Todo blend soma exatamente **12 potes**.
4. Todo conteúdo publicado tem `slug` único e imutável (mudança exige 301).

---

# CAPÍTULO 5 — ARQUITETURA DO CONTEÚDO

## 5.1 Camadas de conteúdo

| Camada | Objetivo SEO | Exemplos |
|---|---|---|
| **Pilar** | autoridade de tema | `/cozinha`, `/blends`, `/blog`, `/produtos` |
| **Cluster** | cauda longa | receitas, artigos, caixas |
| **Transacional** | conversão | `/product/:handle` |
| **Institucional** | confiança | `/sobre` |

## 5.2 Estrutura de URLs (congelada)

```
/                        home
/produtos                catálogo
/product/{handle}        PDP           ← handle = handle Shopify
/cozinha                 índice receitas
/cozinha/{slug}          receita
/blends                  índice caixas
/blends/{slug}           caixa
/temperaflix             sublinha
/blog                    índice editorial
/blog/{slug}             artigo
/sobre                   institucional
/sitemap.xml             gerado
```

Regras: minúsculas, hífen, sem acento, sem data, sem `/pt-br/`, sem parâmetro de sessão. Slug nunca é reescrito — só redirecionado (301), como já feito em `/lojas → /blog`.

## 5.3 Malha de links internos (obrigatória)

```
ARTIGO ──► RECEITA ──► PRODUTO ──► BLEND
   ▲          ▲           │          │
   └──────────┴───────────┴──────────┘
          (relacionados / cross-sell)
```
Mínimo por página: **3 links internos contextuais**. Nenhuma página órfã. Toda nova página entra no `sitemap.xml`.

## 5.4 Padrão de SEO por rota
Cada rota-folha declara em `head()`: `title` único, `description`, `og:title`, `og:description`, `og:type`, `twitter:card`, `canonical` e, quando houver imagem absoluta relevante, `og:image` + `twitter:image` — **apenas na folha, nunca no `__root`**.

JSON-LD por tipo: `Product` (PDP), `Recipe` (cozinha), `Article` (blog), `Organization` (root), `BreadcrumbList` (todas).

## 5.5 Padrão editorial
- Título display em caixa alta, curto, com quebra intencional.
- Subtítulo Playfair itálico.
- Corpo Inter, parágrafos curtos.
- Toda receita: hero (prato + **pote real ao lado**) → tempo/rendimento → ingredientes → modo de fazer → dica do chefe → produto usado (CTA) → relacionadas.
- Emojis: permitidos **exclusivamente** na linha Temperaflix (🍿🎬🎮).

---

# CAPÍTULO 6 — PADRÃO DE IMPLEMENTAÇÃO

## 6.1 Checklist obrigatório (a "Ficha de Funcionalidade")

Nenhuma funcionalidade entra sem responder, por escrito, às 10 perguntas:

| # | Pergunta | Critério de aceite |
|---|---|---|
| 1 | Onde ela fica? | Rota existente ou nova rota nomeada |
| 2 | A que módulo pertence? | Catálogo · Cozinha · Blends · Editorial · Comércio · Integração · Operação |
| 3 | Que páginas utiliza? | Lista de rotas afetadas |
| 4 | Que componentes reutiliza? | Mínimo 1 de `components/site` — reuso antes de criação |
| 5 | Que tabelas utiliza? | Nome + justificativa + RLS + GRANT |
| 6 | Que dados consome? | Fonte e dono (Cap. 3.4) |
| 7 | Que dados produz? | Destino e ciclo de vida |
| 8 | Como interfere no SEO? | `head()`, JSON-LD, sitemap, links internos |
| 9 | Como interfere na experiência? | Impacto em hierarquia, performance, acessibilidade |
| 10 | Quebra algum padrão? | Se sim → **não implementa**; abre exceção documentada |

## 6.2 Ordem de execução
```
AUDITAR existente → RESPONDER a ficha → REUSAR componentes
→ IMPLEMENTAR → head() + sitemap → VERIFICAR build → PUBLICAR
```

## 6.3 Regras técnicas fixas
- Cor/sombra/gradiente: **apenas tokens semânticos** (`brand-*`, `accent`). Nunca `text-white`, `bg-black`, `bg-[#...]`.
- Estado global mínimo: zustand só para carrinho.
- Dados de rota: loader + TanStack Query. Nunca `useEffect` de fetch para conteúdo indexável.
- Segredo só em `*.server.ts` ou dentro de `.handler()`.
- Toda tabela nova: `CREATE` → `GRANT` → `ENABLE RLS` → `POLICY`, nessa ordem.

---

# CAPÍTULO 7 — PADRÕES DE EXPANSÃO

| Expansão | Caminho canônico | Não fazer |
|---|---|---|
| **Novo produto** | Bling → sync → Shopify → PNG em `assets/` → `productImages.ts` → perfil de sabor → ≥1 receita | criar página estática de produto |
| **Nova linha** | slug de linha + filtro no catálogo (+ rota só se tiver narrativa própria, como Temperaflix) | duplicar `/produtos` |
| **Novo blend** | entrada em `lib/blends.ts` com 12 handles | novo componente de builder |
| **Nova categoria** | atributo de filtro | nova rota |
| **Nova receita** | entrada em `lib/recipes.ts` + imagem do prato + pote real + dietas + tags | receita sem produto da casa |
| **Novo artigo** | `lib/blog.ts` + 3 links internos | artigo sem destino comercial |
| **Nova página** | rota + `SiteLayout` + `head()` + sitemap + link de entrada | página órfã |
| **Novo módulo** | ficha do Cap. 6 + tabelas com RLS | tabela sem justificativa |
| **Nova integração** | `*.server.ts` + endpoint `/api/public/*` validado + log em `bling_sync_log` (ou equivalente) | chamada de API com token no cliente |

**Fronteira de migração de conteúdo:** conteúdo permanece em `src/lib/` enquanto for curado pela casa e cabível em Git. Migra para banco **somente** quando houver necessidade real de autoria externa/CMS — e, nesse caso, mantendo o mesmo contrato de tipos, sem alterar rotas nem slugs.

---

# CAPÍTULO 8 — GOVERNANÇA

## 8.1 Leis da plataforma
1. Esta documentação precede o código. Divergência entre código e documento é **bug**.
2. Nenhum componente duplicado sem justificativa registrada.
3. Nenhuma tabela sem finalidade declarada, RLS e GRANT.
4. Nenhuma página fora do padrão visual e do `SiteLayout`.
5. Nenhum conteúdo publicado sem intenção de busca e links internos.
6. Nenhum slug alterado sem 301.
7. Nenhuma dependência adicionada sem verificar equivalente já instalado.
8. Nenhum segredo no bundle do cliente.
9. Todo release preserva: **consistência · performance · SEO · escalabilidade · manutenção · experiência**.
10. Exceções existem, mas são **escritas** no Cap. 10 deste documento.

## 8.2 Rito de revisão
Antes do merge: build verde · rotas afetadas testadas em mobile e desktop · `head()` conferido · sitemap atualizado · ficha do Cap. 6 preenchida.

---

# CAPÍTULO 9 — AUDITORIA FINAL DO ESTADO ATUAL

## 9.1 Pontos fortes
- **Roteamento maduro e SEO-consciente**: 14 rotas de conteúdo, sitemap dinâmico (inclui produtos do Shopify), `head()` presente em praticamente todas as folhas, `/lojas` tratada com 301 em vez de deleção — sinal de disciplina rara.
- **Camada de domínio bem separada**: 21 componentes em `components/site` com responsabilidade única e reuso real entre home, catálogo, receita e PDP.
- **Conteúdo como código**: `recipes.ts` (944 linhas), `blog.ts` (881) e `blends.ts` versionados em Git → SSR instantâneo, zero latência de banco, histórico auditável.
- **Integração de três pontas funcionando**: Bling ↔ Shopify ↔ site, com mapas de correspondência, log de sincronização e cron a cada 20 minutos.
- **Segurança de dados sólida**: RLS em todas as tabelas públicas, papéis isolados em `user_roles`, `has_role()` no padrão correto, webhooks validando HMAC antes de processar.
- **Diferencial competitivo real**: a Cozinha (prato + pote real + compatibilidade de dieta) é ativo defensável, não commodity.

## 9.2 Fragilidades

| # | Fragilidade | Impacto | Correção recomendada |
|---|---|---|---|
| F1 | **Rotas gigantes**: `temperaflix.tsx` (914) e `cozinha.$slug.tsx` (641) misturam composição, dados e apresentação | manutenção, risco de regressão | extrair blocos para `components/site` (ex.: `RecipeHero`, `RecipeSteps`, `FlixSection`) |
| F2 | **Três grids coexistindo** (`ProductGrid`, `CatalogGrid`, `FeaturedRow`) | divergência visual | unificar em `ProductGrid` com variantes `grid | catalog | row` |
| F3 | **`cozinha.tsx` como layout com 384 linhas** | layout deveria ser fino | mover UI do shell para componente; layout mantém `<Outlet />` |
| F4 | **Ausência de camada de tipos compartilhada** (`Product`, `Recipe`, `Blend` definidos por arquivo) | acoplamento silencioso | criar `src/lib/types.ts` como contrato único |
| F5 | **Sem página 404 / notFound dedicada** | UX e SEO em links quebrados | rota `$.tsx` com busca e links de resgate |
| F6 | **Sem busca global** | descoberta limitada com o volume atual (19 SKUs + 22 receitas + 10 artigos) | busca client-side sobre índice estático — `cmdk` já instalado |
| F7 | **`/admin/bling` protegido por chave em query string** | chave pode vazar em histórico/referrer | migrar para autenticação real + `has_role('admin')` |
| F8 | **Sem entidade de Cliente/Embaixador** (previstas no escopo) | não há base para relacionamento/fidelidade | modelar quando o módulo for priorizado — não antecipar |
| F9 | **Cupom validado no cliente** (regra dos 12+) | contornável | validar no servidor/Shopify antes do checkout |
| F10 | **Dependência de assets pesados** (vídeos de fundo) | LCP em 3G/mobile | `poster` + carregamento condicional por rede |

## 9.3 Riscos futuros
- **R1 — Deriva de conteúdo**: crescimento de `recipes.ts`/`blog.ts` além de ~2.000 linhas torna o arquivo hostil. *Mitigação:* dividir por sublinha/categoria antes disso, mantendo o mesmo tipo exportado.
- **R2 — Divergência de catálogo**: SKU criado no Shopify sem PNG e sem receita quebra o Princípio P2. *Mitigação:* checklist de produto no Cap. 7.
- **R3 — Acoplamento a Shopify**: preço e checkout são externos. *Mitigação:* já existe degradação graciosa; manter e testar.
- **R4 — Ausência de dono explícito do SEO**: sem revisão, novas páginas nascem sem `head()`. *Mitigação:* item obrigatório no rito de merge.
- **R5 — Débito de dependências**: overrides manuais (`seroval`) indicam gestão reativa. *Mitigação:* revisão mensal.

## 9.4 Componentes ausentes (recomendados, em ordem de valor)
1. `SearchCommand` — busca global sobre índice estático.
2. `NotFound` — rota `$.tsx` com resgate.
3. `Breadcrumbs` — componente único (hoje o padrão é implícito).
4. `RecipeHero` / `RecipeSteps` — extração de `cozinha.$slug.tsx`.
5. `SeoHead` — helper para padronizar `head()` e JSON-LD.
6. `Newsletter` — captura de lead (hoje só via WhatsApp/e-mail em blends).
7. `types.ts` — contrato de dados único.

## 9.5 Estruturas redundantes
- `ProductGrid` × `CatalogGrid` × `FeaturedRow` (F2).
- `FlavorTile`/`FlavorTiles` × `DietBadge`/`DietCompatibilityPanel` — famílias de "atributo visual" que podem compartilhar base.
- Lógica de "produto citado" repetida entre receita, blog e PDP → candidata a hook `useProductRef(handle)`.

## 9.6 Roteiro sugerido (sem quebrar nada)

| Onda | Escopo | Risco |
|---|---|---|
| **1 — Higiene** | `types.ts`, `SeoHead`, rota 404, unificação de grids | baixo |
| **2 — Descoberta** | busca global, breadcrumbs, filtros unificados | baixo/médio |
| **3 — Robustez** | auth real no `/admin`, cupom no servidor, extração das rotas gigantes | médio |
| **4 — Relacionamento** | Cliente, Newsletter, Embaixadores, Coleções | médio |
| **5 — Futuro** | IA/Concierge/Dashboard — **fora do escopo desta versão** | — |

---

# CAPÍTULO 10 — ANEXO: INVENTÁRIO REAL (auditado)

**Rotas:** 19 arquivos · 14 de conteúdo · 7 endpoints públicos · 1 sitemap · 1 redirect.
**Componentes de domínio:** 21. **Primitivos shadcn:** biblioteca completa instalada.
**Bibliotecas de domínio:** 15 módulos em `src/lib` + 2 pacotes server (`bling`, `shopify`).
**Tabelas Lovable Cloud (10):** `bling_order_map`, `bling_product_map`, `bling_sync_log`, `bling_tokens`, `dashboard_temperos`, `dashboard_variables`, `pricing_history`, `pricing_rules`, `product_costs`, `user_roles` — todas com RLS. Função: `has_role()`.
**Catálogo:** 19 SKUs — Core (13), Premium Black (2), Temperaflix (3) + Blend do Chefe.
**Conteúdo:** 22 receitas · 10 artigos · 6 caixas curadas + 1 personalizável.
**Integrações:** Shopify Storefront + Admin · Bling OAuth2 + cron 20 min · webhook HMAC.

**Exceções documentadas:** nenhuma no momento. Toda exceção futura deve ser registrada aqui com data, motivo e prazo de correção.

---

*Documento vivo. Toda alteração estrutural da plataforma deve atualizar este arquivo no mesmo commit.*
