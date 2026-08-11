# Enquadramento da Tela de Cinema Temperaflix

Objetivo: a área retangular clara ao fundo passa a ser, de fato, **a tela**, e o pote fica centralizado dentro dela — sem cortes na base nem vazamento para a faixa preta inferior.

## O que muda visualmente

1. **A tela ganha forma de tela**
   - Deixa de ser uma mancha arredondada difusa e passa a ser um retângulo de projeção com proporção de cinema (16:9), bordas suaves e leve moldura de luz.
   - Recebe o brilho da cor do sabor ativo (verde/vermelho/âmbar) como luz de projeção, não como bolha colorida deslocada.

2. **Pote centralizado na tela**
   - O pote é posicionado pelo centro da tela (eixo vertical e horizontal), não mais empurrado por deslocamento fixo.
   - A escala é limitada para que a altura do pote ocupe cerca de 80% da altura da tela — tampa e base sempre dentro do quadro.

3. **Sobe o conjunto e elimina o corte**
   - A composição inteira sobe: o palco deixa de alinhar pela base (`items-end` + `pb-[16%]`) e passa a alinhar pelo centro da tela.
   - A faixa escura inferior (queda de luz do piso) é reduzida para não invadir a tela.
   - O enquadramento do cenário de fundo é reajustado para que a linha do baú fique abaixo da tela, com a tela inteira visível.

4. **Sombras coerentes**
   - As sombras que hoje ficam "penduradas" na base do pote passam a ser um reflexo/oclusão dentro da tela, alinhado ao novo centro.

## Onde aplicar

- `src/routes/temperaflix.tsx` — palco principal (tela + pote em destaque).
- `src/components/site/TemperaflixShowcase.tsx` — a mesma tela e centralização na seção da Home, mantendo os 3 potes em grade, com o pote ativo centralizado na tela.

## Detalhes técnicos

- Substituir o bloco `absolute top-[18%] ... rounded-[15%] blur-2xl` por um contêiner de tela com `aspect-[16/9]`, largura ~72%, `top` calculado para o centro coincidir com o centro do palco, `rounded-md`, `ring-1` translúcido e `boxShadow` reativo a `activeMeta.accent`.
- Trocar o posicionamento do pote: remover `y: -150` e `scale: 1.25`; usar contêiner absoluto centralizado sobre a tela (`inset-0 flex items-center justify-center`) com `max-h` derivado da altura da tela (~`clamp` 200–340px).
- Ajustar `objectPosition` do `studioBg` (de `50% 82%` / `50% 80%` para algo próximo de `50% 62%`) e reduzir a altura do gradiente de piso de `26%` para ~`14%`.
- Reposicionar a key light para o centro da tela e manter `FilmGate` como está.
- Validação por Playwright: capturar a seção na Home e em `/temperaflix` e conferir que o bounding box do pote fica contido no bounding box da tela.
