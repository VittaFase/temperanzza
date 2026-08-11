# Potes assentados na mesa do estúdio (Temperaflix)

## Problema
Na seção "Escolha sua sessão", o pote aparece gigante, deslocado para a esquerda e flutuando: a base do vidro não coincide com o tampo da mesa/baú do cenário, e o bokeh (bolhas de luz) reforça a sensação de colagem/fake.

## O que muda

1. **Ancoragem física do pote no tampo da mesa**
   - O palco passa a alinhar o produto pela base (não pelo centro): o pote é posicionado a partir da linha do tampo do cenário, com um offset único e calibrado, em vez do deslocamento vertical atual de -40px combinado com centralização.
   - Centralização horizontal real sobre o baú (fim do desvio para a esquerda), inclusive em mobile.

2. **Escala coerente com o cenário**
   - Altura máxima do pote reduzida para uma proporção realista frente à mesa e às cadeiras de direção (hoje ele é mais alto que o próprio móvel).
   - Enquadramento do fundo ajustado para o tampo ficar na altura da linha de base do produto.

3. **Contato realista (sem "faixa preta")**
   - Sombra de contato curta e elíptica, presa à base do vidro, atrás do produto: núcleo escuro estreito + difusão suave, sem barra reta e sem sombra na frente do pote.
   - Leve reflexo/oclusão na madeira imediatamente sob a base, sincronizado com a cor do sabor ativo.

4. **Bokeh fora, luz de estúdio dentro**
   - Remoção das bolhas de bokeh do palco Temperaflix (vídeo/poster) nessa seção, mantendo o rig de luz: key light lateral, rim light na cor do sabor e queda de luz no piso.

5. **Consistência Home + /temperaflix**
   - Mesmo tratamento (ancoragem, escala, contato e luz) aplicado ao trio de shakers na Home, preservando o pote central em destaque.

## Detalhes técnicos
- Arquivos: `src/routes/temperaflix.tsx` e `src/components/site/TemperaflixShowcase.tsx`.
- Palco: trocar `items-center` por alinhamento inferior com padding calibrado; produto com `transform-origin: bottom center` e `y` único.
- Fundo: `object-position` ajustado para fixar a linha do tampo; opacidade/blur mantidos.
- Sombra: dois `div` sobrepostos (elipse core + difusa) com `z-index` abaixo do produto e `translateY` positivo mínimo.
- Bokeh: remover o bloco de vídeo/poster apenas do palco Temperaflix; sem mudanças no Hero da Home.
- Sem alterações de dados, Shopify, rotas ou backend.
