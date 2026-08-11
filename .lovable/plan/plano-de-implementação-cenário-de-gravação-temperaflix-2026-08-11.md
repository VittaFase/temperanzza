# Plano de Implementação: Cenário de Gravação Temperaflix

Entendi o objetivo: criar um fundo que simule um cenário de gravação profissional, alinhado aos efeitos visuais (halos de luz, efeitos de scan e profundidade) dos potes Temperaflix. A parte superior (Hero) manterá a imagem de estúdio atual, e a nova seção de episódios ganhará uma profundidade cênica harmonizada.

## O que será feito:

1.  **Criação do Efeito de Cenário Dinâmico:**
    *   Substituiremos o fundo estático da seção de episódios por uma composição de camadas.
    *   Utilizaremos a imagem de estúdio (`studioBg`) com ajustes de máscara e blend para criar um "palco" onde o pote flutua.
    *   Adicionaremos sombras de contato realistas e luzes de fundo (rim lights) que reagem ao sabor selecionado.

2.  **Harmonização com os Efeitos do Pote:**
    *   O "piso" do cenário será reforçado com gradientes que convergem para a base do pote, criando um ponto focal.
    *   Os halos de luz (halos oklch) serão integrados ao cenário, não apenas como uma aura atrás do pote, mas como iluminação ambiente que reflete no "chão" e nas "paredes" virtuais do estúdio.

3.  **Preservação do Topo:**
    *   A seção superior (Hero) continuará com a imagem de estúdio e o vídeo bokeh atual, garantindo a continuidade visual da marca.

4.  **Refinamento Visual (Estética Industrial/Cinematográfica):**
    *   Ajuste da opacidade da imagem de estúdio para 40% na parte inferior, com `mix-blend-luminosity` e uma escala invertida para diferenciar do topo, criando uma sensação de "bastidores" ou "set de filmagem" completo.

## Detalhes Técnicos:

*   **Arquivo:** `src/routes/temperaflix.tsx`.
*   **Componentes:** Atualização da seção `#episodios` e do "stage" onde o produto é exibido.
*   **CSS/Framer Motion:** Uso de `linear-gradient` e `radial-gradient` dinâmicos atrelados ao estado `activeMeta` para sincronizar a cor da cena com o sabor (ex: verde para Ervas Finas, dourado para Tradicional).

Após sua aprovação, aplicarei estas mudanças para transformar a visualização estática em uma experiência de imersão em um set de gravação.