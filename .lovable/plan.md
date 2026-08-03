# Fotos dos pratos na Biblioteca Gastronômica

Confirmado: as fotos dos pratos **não** foram implementadas. As 45 receitas usam apenas `hero: { color }` (bloco de cor + tipografia stencil + PNG real do pote). Não existe campo de imagem de prato em `src/lib/recipes.ts`, e a rodada anterior (compartilhar, imprimir, filtros, vídeo, carrinho) deixou as fotos explicitamente de fora.

Isto é uma mudança de diretriz editorial: hoje a casa não usa foto de prato. Este plano adiciona a foto **sem remover** o bloco de cor nem o pote — a foto entra como camada, e toda receita sem foto continua exatamente como está hoje.

## O que será feito

### 1. Campo de imagem (adição, opcional)
Novo campo opcional em `Recipe`:
- `dish?: { src: string; alt: string }`

Nenhuma receita existente é alterada. Onde `dish` não existir, o visual atual permanece.

### 2. Direção de arte única para as 45 fotos
Um único prompt-base, para as fotos parecerem uma série da mesma casa, não imagens de banco:
- luz lateral dura, fundo escuro texturizado (ardósia/ferro), vapor discreto;
- louça artesanal fosca, sem props coloridos;
- paleta puxada para paper cream / ink / brick-red / mustard;
- enquadramento 4:5 (retrato) para o hero e 16:9 para OG;
- **o pote real do condimento aparece na cena**, ao lado do prato, em foco secundário — é isso que assina Temperanzza.

Cada foto é gerada com o nome do prato + o condimento protagonista da receita.

### 3. Onde a foto aparece
- **Hero da receita** (`/cozinha/$slug`): foto como fundo do hero, com o gradiente da casa por cima e o pote/vídeo mantidos em primeiro plano. Se houver vídeo `/videos/[slug].mp4`, o vídeo continua tendo prioridade e a foto passa a ser o `poster`.
- **Índice `/cozinha`**: miniatura quadrada ao lado de cada linha do acordeão, com o bloco de cor como fundo enquanto carrega.
- **Rota de impressão**: foto pequena em escala de cinza (opcional, sem fundo colorido).
- **SEO**: `og:image` / `twitter:image` da receita passam a apontar para a foto absoluta, e o JSON-LD `Recipe` ganha `image`.

### 4. Entrega em lotes (para revisão)
- **Lote 1 — 6 receitas piloto** (uma de cada proteína). Você aprova a direção de arte antes de escalar.
- **Lote 2 — 12 receitas em destaque.**
- **Lote 3 — as 33 restantes.**

Cada lote: gerar, subir como asset de CDN, preencher o campo `dish` e conferir no preview.

## Detalhes técnicos

- Backend: zero mudanças. Nenhuma migração, nada em Shopify ou Bling.
- Imagens geradas em 4:5 e registradas como `src/assets/pratos/<slug>.jpg.asset.json` (asset pointer da CDN, o binário não fica no repo).
- `src/lib/recipes.ts`: só adição do campo `dish` na interface e nos slugs de cada lote.
- Componentes tocados: `RecipeHeroMedia` (aceita `dish` como camada/poster), o item do acordeão em `src/routes/cozinha.tsx`, e `src/routes/imprimir.$slug.tsx`.
- `loading="lazy"` + `decoding="async"` nas miniaturas; hero com `fetchPriority="high"`.
- Assinatura da casa preservada: `rounded-none`, Big Shoulders Stencil, Playfair itálico, tokens `brand-*`, nenhuma cor hardcoded.
- Validação: `tsgo`, build e conferência no preview (índice, 3 receitas, impressão, OG).

## Ordem de entrega

1. Campo `dish` + camadas visuais (hero, índice, impressão, SEO) usando as 6 fotos piloto.
2. Sua aprovação da direção de arte.
3. Lote 2 (12 destaques).
4. Lote 3 (33 restantes).
