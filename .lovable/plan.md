## Feedback do novo prompt

O prompt novo é **compatível** com o que já planejamos — não conflita, mas é um subconjunto mais enxuto, com 3 diferenças que valem incorporar e 2 pontos que precisam de correção porque partem de premissas desatualizadas do projeto.

**Traz de novo (vale adotar):**
- Compartilhamento explícito em **WhatsApp / Instagram (copiar link) / E-mail** — mais preciso que o "popover genérico" do plano anterior. Adotado.
- **Vídeo em loop no hero** por convenção `/videos/[slug].mp4`, com `poster` no PNG do pote e botão "Assistir em tela cheia". Isso substitui bem a "faixa de vídeos how-to" que estava planejada como oculta — melhor solução, porque o vídeo entra na receita e não numa faixa vazia.
- Campo **`proteinaPrincipal`** com lista de valores fechada e revisão humana da classificação antes de aplicar. Adotado (no plano anterior eu chamava de `mainIngredient`).

**Precisa ser corrigido no prompt:**
1. **Carrinho já existe.** O item 4 é condicional, mas a condição já está satisfeita: há `src/stores/cartStore.ts` (Zustand + Shopify Cart API), `CartDrawer`, checkout real e — mais importante — o botão **"Adicionar ao Carrinho" já está implementado dentro do drawer da receita** (`src/components/site/RecipeAddToCart.tsx`, com preço, esgotado e evento de analytics). Então o item 4 já está pronto; o que resta é só **replicar o botão nos cards de "Harmoniza também com"**.
2. **Impressão via `window.print()` na própria página** é mais frágil que a rota dedicada `/cozinha/$slug/imprimir` que eu havia planejado (o drawer tem scroll interno, backdrop e `position: fixed`, que costumam sair recortados no papel). Sugiro manter a rota de impressão, e o botão "Imprimir" abre essa rota e chama `window.print()` — o resultado visual para o cliente é o mesmo, sem risco de página cortada.
3. São **45 receitas**, não 43 (o `RECIPES` cresceu depois daquela contagem). O campo novo será preenchido nas 45.

**O que fica de fora desta rodada** (do plano anterior, para entregar mais rápido): índice `/cozinha/todas` com facetas completas, carrosséis curados, grade de coleções e as fotos de prato geradas por IA. Nada disso é descartado — os filtros desta rodada já entram no formato que a página `/todas` vai reaproveitar depois.

## Etapa 1 — Dados (adições apenas)

`src/lib/recipes.ts`: novo campo **opcional** `proteinaPrincipal?: Protein` com `Protein = "frango" | "bovina" | "suino" | "pescados" | "ovo" | "vegetariano"` e um mapa `PROTEINS` de rótulos PT-BR. `moment` já existe nas 45 receitas e só precisa virar filtro.

Antes de aplicar, eu **listo no chat a proteína atribuída a cada uma das 45 receitas** para você revisar e corrigir o que discordar. Nada é publicado antes do seu OK nessa lista.

## Etapa 2 — Filtros complementares em `/cozinha`

Barra de filtros acima do índice "O Menu da Casa", em cima da estrutura atual (as 4 dietas continuam intactas):

- **Refeição**: Café da manhã · Almoço · Jantar
- **Proteína principal**: Frango · Carne bovina · Suíno · Peixe & Frutos do Mar · Ovo · Vegetariano

Combinam entre si e com a dieta (dieta E refeição E proteína), filtragem client-side, sem recarregar. Numeração e link de cada receita preservados. Chips ativos removíveis, contador "N receitas", "Limpar filtros" e estado vazio editorial. Estado espelhado na URL (`?refeicao=&proteina=`) para o filtro ser linkável e compartilhável.

## Etapa 3 — Compartilhar na receita

Linha de ações logo abaixo da barra de meta (Tempo/Rende/Dificuldade/Perfil), antes do bloco do pote:

- **WhatsApp** → `https://wa.me/?text=` com título + tagline + URL codificados.
- **Instagram** → copia a URL e mostra toast "Link copiado! Cole no story ou direct do Instagram."
- **E-mail** → `mailto:` com assunto e corpo.
- **Imprimir** → abre `/cozinha/$slug/imprimir`.

Ícones Lucide, `rounded-none`, traço fino da casa, alvo de toque mínimo 44px, `aria-label` em todos.

## Etapa 4 — Área de impressão

Rota `/cozinha/$slug/imprimir`: logo, título, tagline, ficha (tempo/rende/dificuldade), imagem pequena do pote, ingredientes, modo de preparo e rodapé `temperanzza.com.br`. Uma coluna, preto sobre branco, sem cor de fundo, `@page` com margens e quebras controladas, `noindex`. Sem menu, rodapé, compartilhamento, harmonização ou "Continue a leitura".

## Etapa 5 — Vídeo no hero da receita

Componente `RecipeHeroMedia`: `<video muted loop autoplay playsinline poster={PNG do pote}>` apontando para `/videos/[slug].mp4`. Enquanto o arquivo não existir, o `onError` derruba para exatamente o visual atual (pote + `animate-pote-float` + gradiente), então o site nunca fica quebrado. Botão discreto **"Assistir em tela cheia"** sobre o vídeo (Fullscreen API) e `prefers-reduced-motion` respeitado (não dá autoplay).

## Etapa 6 — Carrinho (só o que falta)

`RecipeAddToCart` já cobre o card "Assinatura desta receita". Falta apenas um botão compacto **"Adicionar"** nos cards de "Harmoniza também com", reutilizando `useCartStore` + `useShopifyProducts` e o mesmo evento de analytics — sem nova lógica de carrinho.

## Detalhes técnicos

- **Backend: zero mudanças.** Nenhuma migração, nenhuma server function, nada em Shopify ou Bling. Tudo em memória sobre `RECIPES`.
- Rota nova: `src/routes/cozinha.$slug.imprimir.tsx`. `routeTree.gen.ts` é regerado pelo plugin.
- Componentes novos em `src/components/site/`: `RecipeShareBar`, `RecipeFilters`, `RecipeHeroMedia`, `HarmonizeAddButton`.
- Vídeos ficam em `public/videos/[slug].mp4` (arquivos grandes entram como asset pointer).
- SEO: rota de impressão `noindex`; `/cozinha` com filtro recebe `canonical` para `/cozinha`; `Recipe` JSON-LD ganha `video` quando o arquivo existir.
- Assinatura da casa mantida: `rounded-none`, Big Shoulders Stencil, Playfair itálico, tokens `brand-*`, nenhuma cor hardcoded.
- Validação: `tsgo`, build e conferência no preview de 3 receitas, dos filtros combinados, do compartilhar e da view de impressão.

## Ordem de entrega

1. Etapa 1 (lista das 45 proteínas para sua revisão).
2. Etapas 3 + 4 (compartilhar + impressão).
3. Etapa 2 (filtros).
4. Etapas 5 + 6 (vídeo + botão na harmonização).
