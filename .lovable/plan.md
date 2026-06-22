# Apresentação dos potes estilo Kinder's

As três referências mostram **três padrões distintos** que o Kinder's usa para apresentar o mesmo pote. A boa notícia: nossa base (`FlavorTile` + `ProductCard` + paleta por handle) já está alinhada com o padrão #3. Falta refinar três coisas: **qualidade do recorte do PNG**, **tratamento de sombra/escala do pote**, e **adicionar os outros dois layouts** onde fazem sentido.

## Os três padrões do Kinder's

**A — Vitrine sobre papel** (img 1, "Global Flavors"): pote flutuando sobre **fundo cream/paper**, selo "NEW" circular preto sobreposto no canto, título stencil em duas linhas abaixo, preço grande, "+ ADD TO CART" em texto.

**B — Linha editorial** (img 2, "Featured Products"): row horizontal com **moldura vermelha fina**, pote pequeno à esquerda, título stencil enorme à direita, CTA em vermelho. Usado para destacar 3–5 SKUs curados.

**C — Bloco de cor** (img 3, "Signature Flavors"): tile com **fundo de cor sólida saturada** específica do sabor, pote centralizado com sombra projetada, faixa branca embaixo com o nome. Marcador de "selecionado" no topo. É o que já temos.

## O que muda no nosso site

### 1. Refinar o padrão C (já existe) — `ProductCard` + `FlavorTile`
- Aumentar o pote: hoje `w-[72%] h-[82%]` → subir para `w-[80%] h-[90%]` para o pote dominar o tile como no Kinder's.
- Sombra mais dramática: trocar `drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]` por uma sombra elíptica embaixo (pseudo-elemento ou segundo drop-shadow) para dar sensação de "pote pousado".
- Hover: `scale-[1.06]` + leve `translate-y` para sugerir "levantar".
- Faixa branca do nome: hoje a info fica em borda fina; trocar para **bloco branco sólido** colado ao tile (sem gap), título stencil **dentro** desse bloco (como img 3), com divisória horizontal fina acima do nome.

### 2. Novo padrão A — variante "vitrine" para a home e Temperaflix
- Criar um modo `variant="paper"` no `ProductCard` (ou um `ProductCardPaper` separado) que renderiza o pote sobre `bg-brand-cream` com textura `bg-paper-grain`, sem bloco de cor.
- Selo circular preto **"NOVO"** ou **"PREMIUM BLACK"** sobreposto no canto superior esquerdo (componente `ProductBadge` já existe — só precisa de uma variante circular grande).
- Usar na seção destaque da home (3–4 SKUs em rotação) e na grade da `/temperaflix`.

### 3. Novo padrão B — faixa "Em destaque" na home
- Componente novo `FeaturedRow.tsx`: container com `border-2 border-brand-red`, label "EM DESTAQUE" centralizado no topo cortando a borda (como no Kinder's), 3 linhas com pote à esquerda + título stencil enorme + CTA em vermelho à direita.
- Substitui (ou complementa) a seção "Selo da Casa" que está hoje na home.

### 4. Qualidade dos PNGs — pré-requisito crítico
A experiência só vira "igual Kinder's" se os PNGs forem **recortes limpos com fundo 100% transparente**, fotografados/renderizados do mesmo ângulo (frente, levemente de cima), mesma iluminação. Vou inspecionar 2–3 dos PNGs já em `src/assets/` (paprica-doce, curcuma, temperaflix-bacon) para confirmar se atendem. Se algum tiver fundo branco ou halo, sinalizo para o usuário e proponho reprocessamento (remove.bg / IA).

### 5. Onde aplicar cada padrão

| Local | Padrão |
|---|---|
| `/produtos` (grade principal) | C — bloco de cor (refinado) |
| `/product/$handle` (galeria) | C — bloco grande (já existe, refinar sombra) |
| Home — seção "Em destaque" | B — faixa editorial vermelha |
| Home — seção "Lançamentos / Premium Black" | A — vitrine paper com selo NOVO |
| `/temperaflix` | A — vitrine paper, fundo cream com grão |

## Detalhes técnicos

- **`src/components/site/FlavorTile.tsx`**: adicionar prop `padding` e ajustar para acomodar pote maior. Sombra dupla: drop-shadow no PNG + radial-gradient ellipse abaixo do pote simulando contato com a superfície.
- **`src/components/site/ProductCard.tsx`**: aceitar `variant?: "color" | "paper"`. Em `paper`, renderiza `bg-brand-cream` + `bg-paper-grain` em vez de `FlavorTile`. Info block sempre colado (sem `border-x border-b` com gap).
- **`src/components/site/ProductBadge.tsx`**: adicionar `shape?: "tag" | "circle"`. Circle = disco preto ~64px com texto branco stencil rotacionado levemente (-8deg) como o "NEW" do Kinder's.
- **Novo `src/components/site/FeaturedRow.tsx`**: aceita `products: ShopifyProduct[]` (3 a 5), renderiza faixa com borda brick-red e linhas horizontais. Cada linha: `grid-cols-[140px_1fr_auto]` com pote, título stencil `text-5xl`, CTA.
- **`src/routes/index.tsx`**: substituir seção atual "Selo da Casa" OU adicionar `FeaturedRow` acima dela; adicionar seção "Lançamentos" com `ProductCard variant="paper"`.
- **`src/routes/temperaflix.tsx`**: trocar a grade atual por `ProductCard variant="paper"`.
- **PNGs**: inspeção visual via `code--view` em 3 assets para confirmar transparência e ângulo. Reporto resultado antes de finalizar a etapa visual.

## Fora de escopo

- Não vou alterar o sistema de cart/checkout.
- Não vou refazer header/footer/sobre — só páginas de catálogo e home.
- Não vou trocar fontes nem tokens da marca.
- Não vou gerar fotos novas dos potes nesta entrega — se algum PNG estiver ruim, sinalizo e proponho reprocessamento como etapa separada.

## Pergunta antes de executar

Qual desses padrões você quer que eu **priorize** — implementar os três de uma vez, ou começar refinando só o C (grade atual, impacto imediato em `/produtos`) e validar antes de adicionar A e B?
