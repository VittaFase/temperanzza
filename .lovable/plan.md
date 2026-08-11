# Escolha sua sessão — pote dentro do halo nas 3 plataformas

## O que está errado hoje

Na seção `#episodios` de `/temperaflix`, a composição é montada com números mágicos independentes:

- pote: `y: -140` (mobile) / `y: -332` (desktop), `scale` 1.5 / 1.15
- halo (key light): `top: 12%` / `top: 1%`
- tela de cinema 16:9: `top: 42%` / `top: 28%`
- sombra de origem: `y: 260` / `y: 472`
- palco: `-mt-24` no mobile, `min-h-[300px]` / `min-h-[700px]`
- playlist: `lg:-translate-y-[150px]`

Como cada camada tem seu próprio deslocamento, o centro do pote e o centro do halo não coincidem — e no mobile o palco com `-mt-24` sobe por cima do título "Escolha sua sessão" e da frase "Cada pote, um episódio…" (visível no print).

Além disso, `typeof window !== 'undefined' && window.innerWidth < 640` é lido dentro do `animate`: não reage a redimensionamento nem a rotação de tela, e no primeiro render (SSR) sempre assume desktop — daí o "salto" da composição. Não existe nenhum tratamento intermediário para tablet.

## Abordagem: um único centro de cena

Trocar os offsets soltos por um **palco com centro único**. O halo, a tela de cinema e o pote passam a ser filhos de um mesmo contêiner centralizado, então o pote fica dentro do halo por construção — sem calibragem por pixel.

```text
  stage (relative, altura por breakpoint)
  └── scene (absolute, centro do palco)  ← centro comum
      ├── halo        (centrado na scene)
      ├── tela 16:9   (centrada na scene)
      └── pote        (base ancorada, centro óptico = centro da scene)
      └── sombra      (ancorada ao pé do baú, único offset restante)
```

O pote é dimensionado por altura relativa ao palco (não por `scale`), então cresce/encolhe junto com a cena em cada breakpoint.

### Três plataformas, três presets

Um único objeto de preset por breakpoint (mobile / tablet / desktop) controla: altura do palco, altura do pote, tamanho do halo, largura da tela de cinema e offset da sombra. Nada de valores duplicados espalhados no JSX.

- **Celular** — palco compacto, sem `-mt-24` (fim da sobreposição com o título), pote grande mas contido, playlist logo abaixo com pouco respiro morto.
- **Tablet** — preset próprio (hoje inexistente): palco médio, pote intermediário, playlist ainda empilhada.
- **PC** — palco alto, pote e halo grandes, playlist em coluna ao lado, alinhada ao centro da cena sem `-translate-y` fixo.

### Reatividade correta

Substituir a leitura de `window.innerWidth` dentro do `animate` por um hook de breakpoint com listener de `matchMedia` (mesmo padrão de `src/hooks/use-mobile.tsx`), com fallback SSR estável. Assim a cena se reorganiza ao girar o telefone e não pisca na hidratação.

### Backend

Nada muda: a seção só consome os 3 produtos Temperaflix já carregados via Shopify. Sem alteração de dados, rotas, banco ou integrações.

## Detalhes técnicos

Arquivo principal: `src/routes/temperaflix.tsx` (seção `#episodios`).

1. Extrair a cena para um subcomponente local (`EpisodeStage`) com um mapa `STAGE = { mobile, tablet, desktop }` de tokens: `stageH`, `potH`, `haloW/haloH`, `screenW`, `shadowY`.
2. Envolver halo + tela + pote num wrapper `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`; remover `y: -140/-332`, `top: 12%/1%`, `top: 42%/28%`.
3. Pote: `style={{ height: preset.potH }}` + `object-contain`, `transformOrigin: "center"`; manter `layoutId`, scanline e `AnimatePresence`.
4. Palco: remover `-mt-24`; usar `min-h` por breakpoint e `items-center` uniforme.
5. Playlist: trocar `lg:-translate-y-[150px]` por `lg:self-center` no grid (`items-center` já presente), alinhando pelo centro real.
6. Novo hook `useBreakpoint()` em `src/hooks/` (matchMedia 640/1024) usado pelo palco.
7. Reaplicar o mesmo preset em `src/components/site/TemperaflixShowcase.tsx` (Home) apenas se houver divergência visível — sem mudar sua composição.

## Verificação

Medir na pré-visualização, em 393px, 820px e 1440px: centro do pote vs. centro do halo (diferença < 10px), ausência de sobreposição com o título/parágrafo, e nenhum corte de tampa do pote. Screenshots nos três tamanhos antes e depois.
