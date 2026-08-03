## Feedback antes de executar

Boa notícia: **90% do prompt já é suportado pela estrutura atual — e vários itens dele são desnecessários (e até arriscados) se executados literalmente.**

O que **não** deve ser feito (evita quebra de estrutura):

1. **Não criar rotas novas.** `/cozinha/$slug` e `/product/$handle` já são rotas dinâmicas. Criar 12 arquivos `cozinha.salmao-....tsx` duplicaria o layout, quebraria o drawer editorial e o `routeTree.gen.ts`. As 12 receitas entram como **12 objetos no array `RECIPES`** em `src/lib/recipes.ts` — SEO, breadcrumb, meta bar, pote, Palavra do Chef, pills, "Assinatura desta receita", harmonização e "Continue a leitura" são gerados automaticamente pelo template existente.
2. **Não criar páginas de produto.** `/product/$handle` busca da Shopify em tempo real. Os 10 produtos citados existem no catálogo — não há link quebrado a criar. Vou apenas **validar os handles** (ver ponto técnico abaixo).
3. **Não criar perfis sensoriais novos.** O campo `profile` é um enum fechado de 5 valores (`defumado | ervas | casa | puras | citrico-picante`) usado pela harmonização e pelo painel de compatibilidade. "Herbáceo", "Terroso", "Encorpado", "Intenso", "Picante suave" seriam tokens inválidos → erro de tipo. Vou mapear para o enum existente e preservar a nuance no `subtitle`/tagline.
4. **Não mexer na numeração nem nos índices de categoria.** O accordion de `/cozinha` filtra `RECIPES` por dieta/categoria e numera automaticamente — inserir no fim do array já coloca as novas como 18, 19, 20 etc.

Correção real que o prompt revelou: o contador do hero diz **"5 estilos"** hardcoded, mas hoje existem **4 categorias**. Vou corrigir para 4. O número de receitas já é dinâmico (`RECIPES.length`).

## O que será implementado

**Arquivo alterado: `src/lib/recipes.ts`** — 12 novas entradas ao final do array, cada uma com: `slug`, `title`, `featuredHandle`, `compatibleDiets`, `moment`, `profile`, `category`, `subtitle` (tagline), `intro`, `ingredients`, `steps`, `chefWord`, `whyItWorks`, `substitution`, `time`, `serves`, `difficulty`, `harmonization`, `hero.color`.

Mapeamento de dados:

| # | slug | handle | dietas / categoria | profile |
|---|------|--------|--------------------|---------|
| 1 | salmao-crosta-ervas-finas | ervas-finas | keto, lowcarb, carnivora-flex | ervas |
| 2 | abacate-recheado-frango-chimi-churri | chimi-churri-sem-pimenta | keto, lowcarb | ervas |
| 3 | couve-flor-gratinada-curcuma | curcuma | keto, lowcarb | puras |
| 4 | sardinha-grelhada-lemon-pepper | lemon-pepper | lowcarb, keto, carnivora-flex | citrico-picante |
| 5 | panqueca-proteica-tempero-edu | tempero-do-edu | lowcarb, keto | casa |
| 6 | berinjela-assada-tempero-mineiro | tempero-mineiro | lowcarb | casa |
| 7 | costela-bovina-pimenta-reino | pimenta-do-reino | carnivora-flex, keto, lowcarb | puras |
| 8 | figado-acebolado-cebola-po | cebola-em-po | carnivora-flex, keto, lowcarb | puras |
| 9 | camarao-manteiga-salsa-cebola-alho | salsa-cebola-e-alho | carnivora-flex, keto, lowcarb | casa |
| 10 | carne-panela-batatas-tempero-mineiro | tempero-mineiro | tradicional | casa |
| 11 | peixe-assado-legumes-salsa-cebola-alho | salsa-cebola-e-alho | tradicional | casa |
| 12 | feijao-tropeiro-ana-maria | ana-maria | tradicional | casa |

Momentos: café (5), almoço (2, 4, 8, 12), jantar (1, 3, 6, 7, 9, 10, 11) — o "Continue a leitura" já prioriza mesmo momento.

**Arquivo alterado: `src/routes/cozinha.tsx`** — contador do hero: `5 estilos` → `4 estilos`.

## Validações técnicas antes de fechar

- Conferir na Shopify que os 10 handles resolvem em `/product/[handle]` (`tempero-do-edu` vs `edu-guedes`, `chimi-churri-sem-pimenta` vs `chimichurri-sem-pimenta`). Se o handle real divergir, uso o handle Shopify em `featuredHandle` — `getProductImage` já tem alias para os dois formatos, então o pote continua aparecendo.
- Todos os 12 potes já têm PNG local em `src/lib/productImages.ts` — nenhum placeholder necessário.
- `bun run build` + checagem visual do accordion e de 2 receitas no preview.

## Impacto em back-end

Zero. Nenhuma migração, nenhuma função de servidor, nada em Shopify/Bling. O `sitemap.xml` já é gerado a partir de `RECIPES`, então as 12 novas URLs entram no sitemap automaticamente.
