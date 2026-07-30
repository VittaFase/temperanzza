---
name: seo-temperanzza
description: Use ao criar/editar rotas, metadados, JSON-LD, sitemap ou robots.txt do site Temperanzza. Aciona em pedidos de "SEO", "title", "description", "Open Graph", "canonical", "schema", "sitemap".
---

# SEO Temperanzza

## Quando usar
- Criar uma nova rota pública (produto, receita, blog, blend, página institucional).
- Revisar ou corrigir `title`, `description`, `og:*`, `canonical`, JSON-LD.
- Atualizar `sitemap.xml` ou `robots.txt`.
- O usuário pedir "melhorar SEO", "meta tags", "Google", "schema".

## Domínio e idioma
- URL canônica: `https://temperanzza.com.br` (sem `www`).
- Idioma: `pt-BR`.
- `og:locale`: `pt_BR`.

## Estrutura do `head()`
No TanStack Router o `title` vive **dentro** do array `meta`, não como campo top-level.

```tsx
head: () => ({
  meta: [
    { title: "Título da Página — Temperanzza" },
    { name: "description", content: "descrição de 120-160 caracteres" },
    { property: "og:title", content: "Título social" },
    { property: "og:description", content: "descrição social" },
    { property: "og:type", content: "website | article" },
    { property: "og:url", content: "https://temperanzza.com.br/rota" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [
    { rel: "canonical", href: "https://temperanzza.com.br/rota" },
  ],
  scripts: [
    { type: "application/ld+json", children: JSON.stringify({ ... }) },
  ],
})
```

### Regras
- `__root.tsx` só carrega defaults (charset, viewport, `og:type=website`, `og:site_name`, `twitter:card`).
- **Canonical e `og:url` só em leaf routes** — nunca em `__root.tsx`, senão o TanStack Router emite duplicatas.
- `og:type`: `website` para home/catálogo; `article` para receitas e posts de blog.
- Sempre que houver imagem absoluta de destaque (produto, receita, blog), incluir `og:image` e `twitter:image`.
- Sem imagem absoluta de qualidade, omita `og:image` — placeholder prejudica o preview.

## JSON-LD por tipo de rota

### Home (`/`)
- `Organization` + `WebSite` com `SearchAction` apontando para `/produtos?q={search_term_string}`.

### Página de listagem (`/produtos`, `/cozinha`, `/blog`, `/blends`)
- `CollectionPage` com `isPartOf` → WebSite.

### Receita (`/cozinha/$slug`)
- `Recipe` com `name`, `description`, `image`, `author`, `recipeCategory`, `recipeCuisine`, `recipeIngredient`, `recipeInstructions` (`HowToStep`), `suitableForDiet`.
- `BreadcrumbList` com 3 níveis: Início → Biblioteca → Receita.

### Post de blog (`/blog/$slug`)
- `Article` com `headline`, `author`, `datePublished`, `dateModified`, `publisher`, `image`.
- `BreadcrumbList`.

### Produto (`/product/$handle`)
- Se possível, `Product` com `name`, `image`, `offers` (extraído da Shopify).
- Caso contrário, `BreadcrumbList` + `WebPage`.

### Blend (`/blends/$slug`)
- `BreadcrumbList` + `Product` (quando o blend tiver handle Shopify preenchido).

## Sitemap (`src/routes/sitemap[.]xml.ts`)
- Gere dinamicamente a partir de:
  - `STATIC_ROUTES` (home, produtos, cozinha, blends, temperaflix, sobre, blog).
  - Produtos Shopify via `storefrontApiRequest`.
  - `RECIPES` de `src/lib/recipes.ts`.
  - `BLENDS` de `src/lib/blends.ts`.
  - `BLOG_POSTS` de `src/lib/blog.ts`.
- Prioridades: home `1.0`, catálogo/cozinha/blog `0.9`, produtos/blends/receitas/posts `0.8`–`0.7`.
- `changefreq`: `weekly` para conteúdo atualizado, `monthly` para estático.

## robots.txt (`public/robots.txt`)
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: https://temperanzza.com.br/sitemap.xml
```
- Não bloqueie `/cozinha`, `/produtos`, `/blog`, `/blends`, `/product`.

## Erros comuns a evitar
- Colocar `canonical` em `__root.tsx`.
- Usar `og:url` ou `canonical` relativos (`/rota`) — use URL absoluta.
- Esquecer `twitter:card`.
- Gerar `og:image` com caminho relativo — deve ser absoluto (`https://...`).
- JSON-LD mal formatado (falta `@context`, vírgula no final).

## Validação
- Após editar, verifique se a rota compila (`bun run build` ou preview).
- Confira o HTML renderizado no preview: `view-source:` ou DevTools → Elements → `<head>`.
- Para receitas, valide o JSON-LD no Google Rich Results Test (externo).
