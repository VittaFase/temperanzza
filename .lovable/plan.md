# Temperaflix — Subir o pote e centralizar o halo de cor

## Objetivo
Na seção "Escolha sua sessão" (rota `/temperaflix`), o pote em destaque e o brilho colorido que o acompanha estão baixos e desalinhados entre si: o halo nasce à esquerda/acima e o pote flutua abaixo dele. A correção sobe a composição até a altura da linha "02 — O drama sofisticado" da playlist e faz o pote ficar exatamente no centro do seu halo de cor.

## Mudanças

### 1. Subir a composição do palco
- Reduzir o preenchimento inferior do palco (`pb-[16%]`) para elevar o ponto de apoio da cena.
- Aumentar o deslocamento vertical do pote ativo (de `y: -80` para cerca de `-170`), colocando o centro do pote na mesma faixa horizontal do episódio 02 da playlist à direita.
- Manter a sombra de origem ancorada no tampo do baú (ajustar seu `y` no mesmo valor da subida, para não subir junto com o pote).

### 2. Centralizar o halo de cor no pote
- Trocar o posicionamento do key light de `top: 12% / left: 22%` para um bloco centralizado (`left: 50%` com `translateX(-50%)`), com o centro vertical coincidindo com o centro do pote na posição final.
- Ajustar largura/altura do halo (~60% x 55%) para o brilho envolver o pote de forma simétrica, sem vazar para a lateral.
- Alinhar a "tela de cinema" 16:9 do fundo (`top: 40%`) ao novo centro do pote, para que o produto continue enquadrado dentro da projeção.

### 3. Consistência
- Aplicar o mesmo alinhamento de halo + pote na vitrine Temperaflix da Home, se ficar visualmente divergente após o ajuste.
- Conferir em mobile (`min-h` menor) para o pote não encostar no topo nem cortar a tampa.

## Detalhes técnicos
Arquivos: `src/routes/temperaflix.tsx` (bloco `#episodios`, palco à esquerda) e, se necessário, `src/components/site/TemperaflixShowcase.tsx`. Apenas valores de layout/animação (Tailwind + Framer Motion): `pb`, `y`, `top/left/width/height` do halo e da tela. Nenhuma alteração de dados, Shopify ou backend.
