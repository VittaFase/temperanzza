# Temperaflix — Subir o pote até a altura do Ep 01 e centralizar no halo

## Objetivo
Na seção "Escolha sua sessão" (`/temperaflix`), o pote em destaque e o halo de cor precisam subir mais: o centro do pote deve ficar na mesma linha do episódio **01 — Temperaflix Tradicional** da playlist à direita, e o pote deve ficar exatamente no centro do halo colorido.

## Mudanças

### 1. Subir a composição
- Aumentar a subida do pote ativo de `y: -170` para cerca de `-260`, alinhando seu centro com a primeira linha da playlist (Ep 01).
- Reduzir o `pb` do palco (de `pb-[10%]` para ~`pb-[6%]`) e, se necessário, aumentar o `min-h` no desktop para evitar corte da tampa.
- Reajustar a sombra de origem no baú (hoje `y: 320`) somando o mesmo delta de subida, para ela continuar ancorada no tampo.

### 2. Centralizar o pote dentro do halo
- Subir o key light colorido junto: `top` de `15%` para ~`4%`, com altura ~`50%`, mantendo `left-1/2 -translate-x-1/2`.
- Calcular o centro do halo para coincidir com o centro vertical do pote na posição final (halo centrado no pote, não atrás da base).
- Alinhar a "tela de cinema" 16:9 do fundo (hoje `top-[35%]`) ao novo centro, para o pote permanecer dentro da projeção.

### 3. Verificação
- Checar mobile (`min-h-[420px]`): reduzir proporcionalmente a subida para não estourar o topo da seção.
- Manter os demais efeitos (scanline, FilmGate, gradiente de piso) intactos.

## Detalhes técnicos
Arquivo: `src/routes/temperaflix.tsx`, bloco `#episodios` (palco à esquerda). Apenas valores de layout/animação — `y` do Framer Motion, `top/height` do halo e da tela, `pb`/`min-h` do container. Sem alterações de dados, Shopify ou backend.
