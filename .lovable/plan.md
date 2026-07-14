
# Cozinha Temperanzza — Compatibilidade Dietética & Receitas

Um módulo educativo sofisticado que comunica ao público de dietas específicas (Cetogênica, Low Carb, Carnívora Flexível, Carnívora Estrita) quais condimentos servem seu estilo de vida e como usá-los. Tom editorial, didático, sem infantilizar — coerente com a estética industrial-artesanal Temperanzza (Big Shoulders Stencil, paper cream, brick-red, sharp corners).

---

## 1. Fundação de dados (nenhum backend novo)

Criar `src/lib/dietCompatibility.ts` como fonte única da verdade, indexada por `handle` do produto Shopify.

```ts
type DietVerdict = "ok" | "moderate" | "no";
type DietKey = "keto" | "lowcarb" | "carnivora-flex" | "carnivora-estrita";

interface ProductDiet {
  handle: string;
  verdicts: Record<DietKey, { verdict: DietVerdict; note: string }>;
  profile: "defumado" | "ervas" | "casa" | "puras" | "citrico-picante";
}
```

Popular com os 19 SKUs a partir da tabela fornecida (ex.: `bacon-em-po` → keto: moderate ("contém amido de milho…"), lowcarb: ok, ambas carnívoras: no).

Também `src/lib/diets.ts` com os metadados das 4 dietas (nome, definição curta, cor-token, ícone).

---

## 2. Sistema visual de compatibilidade (componente reutilizável)

`src/components/site/DietBadge.tsx` — chip industrial, canto reto, coerente com `label-tag` já existente:

- **ok** — círculo brand-emerald + Check
- **moderate** — triângulo brand-mustard + AlertTriangle
- **no** — círculo brand-red + X

Variantes: `compact` (só ícone + sigla, para grid/card) e `full` (ícone + nome da dieta + nota explicativa em Playfair italic).

`src/components/site/DietCompatibilityPanel.tsx` — painel completo para a página de produto: 4 linhas, uma por dieta, com badge + observação didática. Cabeçalho "COMO ESTE TEMPERO CONVERSA COM SUA DIETA" em font-display.

---

## 3. Página de produto — nova seção

Adicionar ao `src/routes/product.$handle.tsx`, abaixo da descrição e antes do bloco de quantidade/CTA:

- **DietCompatibilityPanel** com as 4 verdictos + notas
- Bloco compacto "Este tempero também aparece em X receitas →" com link para `/cozinha?condimento={handle}`

No **ProductCard** do catálogo: adicionar uma tira discreta de 4 mini-dots coloridos (ok/moderate/no) — leitura instantânea sem poluir o card.

---

## 4. Nova rota: `/cozinha` (Cozinha Temperanzza)

`src/routes/cozinha.tsx` — landing da seção com `head()` próprio (title, description, og:title/description específicos para SEO de "receitas low carb", "tempero keto" etc.).

Estrutura:

```
Hero editorial (paper-grain bg, Big Shoulders headline)
  "COZINHA TEMPERANZZA"
  "Sabor e saúde para quem come com consciência"

Bloco "Entendendo as Dietas" — 4 cards horizontais
  Cada card: ícone + nome + definição de 2 linhas + link "ver receitas →"

Filtros (sticky bar):
  [Dieta ▾] [Condimento ▾] [Momento do dia ▾]  |  🔍 buscar

Grid de receitas (masonry ou 3-col cards)
  Cada card:
    - foto ou tile colorido (mesma linguagem FlavorTile)
    - título em font-display
    - condimento em destaque (chip)
    - badges de compatibilidade (compact)
    - momento do dia (café/almoço/jantar) em label-tag
```

`src/routes/cozinha.$slug.tsx` — página da receita individual:

- Header editorial com título grande, foto, chip do condimento
- Painel de compatibilidade (mesmo componente do produto)
- Duas colunas em desktop: **Ingredientes** (lista limpa, checkbox visual) | **Modo de Preparo** (passos numerados em stencil display)
- Bloco "Por que funciona para sua dieta" — cream card com aspas Playfair
- Bloco "Dica de Substituição" — mustard accent
- CTA final: "Leve o [condimento] para sua cozinha →" (link ao produto)

---

## 5. Conteúdo de receitas

`src/lib/recipes.ts` — 15 receitas dos 5 perfis fornecidos, tipadas:

```ts
interface Recipe {
  slug: string;
  title: string;
  featuredHandle: string;      // condimento protagonista
  compatibleDiets: DietKey[];
  moment: "cafe" | "almoco" | "jantar";
  profile: ProductDiet["profile"];
  ingredients: string[];
  steps: string[];
  whyItWorks: string;
  substitution: string;
  heroTile?: { color: string; emoji?: string };  // fallback quando sem foto
}
```

---

## 6. Integração no site

- **SiteHeader**: adicionar "COZINHA" ao NAV entre "BLENDS" e "TEMPERAFLIX"
- **Home (index)**: nova seção editorial "COZINHA CONSCIENTE" após a coleção — 3 receitas em destaque com CTA "explore a cozinha →"
- **SiteFooter**: link "Cozinha & Dietas" na coluna institucional

---

## 7. SEO & acessibilidade

- `head()` por rota com title/description específicos e og tags (imagem só nas rotas-folha)
- Semântica: `<article>` por receita, `<section>` por dieta, `<h1>` único por página
- Alt text descritivo em todas as imagens; ícones dietéticos com `aria-label` + `role="img"`
- JSON-LD `Recipe` schema em `cozinha.$slug.tsx` (nome, ingredientes, instruções, dietas — melhora rich results)

---

## Detalhes técnicos

- **Zero mudanças de backend/Shopify** — puramente frontend com dados estáticos versionados
- **Tokens já existentes**: brand-emerald (ok), brand-mustard (moderate), brand-red (no), brand-cream (surfaces), font-display (headings), Playfair italic (editorial)
- **Rotas TanStack**: `cozinha.tsx` (index) + `cozinha.$slug.tsx` (detalhe), ambas com `createFileRoute("/cozinha")` / `("/cozinha/$slug")`
- **Filtros**: `useSearch()` da rota `/cozinha` para persistir `?dieta=&condimento=&momento=` na URL (shareable, SEO-friendly)
- **Reuso**: `DietBadge` e `DietCompatibilityPanel` servem produto E receita — uma linguagem visual, dois contextos
- **Progressive enhancement**: receitas rendem via loader (SSR-friendly); filtros são client-side sobre a lista já hidratada
- **Sem dependências novas** — Lucide já cobre Check/AlertTriangle/X/Filter/Search

---

## Escopo desta primeira entrega

1. Fundação: `dietCompatibility.ts`, `diets.ts`, `recipes.ts` (15 receitas)
2. Componentes: `DietBadge`, `DietCompatibilityPanel`
3. Integração produto: painel na página + mini-dots no card
4. Rotas novas: `/cozinha` (com filtros) e `/cozinha/$slug`
5. Header/Home/Footer com pontos de entrada
6. SEO: head + JSON-LD

Fora de escopo (pode vir depois): fotos reais das receitas (usaremos tiles de cor + emoji sutil no perfil correspondente até você aprovar sessão fotográfica), coleções salvas, plano semanal de refeições, print-friendly view.
