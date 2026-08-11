# Cinema Temperaflix — A Tela de Cinema

## Problema
A apresentação atual dos potes sobre o baú na seção Temperaflix ainda parece artificial/mockup. O usuário deseja uma experiência 100% intencional onde os produtos são apresentados em uma "tela de cinema" no fundo do estúdio, saindo do baú e sendo exibidos como em um filme de apresentação.

## O que muda

1. **Transformação do Cenário (Background)**
   - Ajuste do fundo `studioBg` para mostrar mais do estúdio (trazer cadeiras para baixo, abrir o enquadramento).
   - Implementação de um "Cinema Screen" (Tela de Cinema) no fundo, onde a cadeira virada aponta, servindo como o palco principal para o produto.

2. **Coreografia da Apresentação (Animação)**
   - O produto ativo terá um fluxo de animação dinâmico: ele se destaca no baú e é "projetado" para a tela de cinema ao fundo.
   - Na tela, o produto será apresentado como o protagonista de um filme, com movimentos lentos e elegantes (cinematic zoom/pan).

3. **Camada de "Vida de Câmera" (FilmGate)**
   - Implementação do componente `FilmGate` para adicionar imperfeições orgânicas de película:
     - **Grão de Filme**: Ruído de alta frequência (12fps) para textura.
     - **Gate Weave**: Micro-oscilações de câmera (handheld feel).
     - **Light Flicker**: Variação sutil de brilho simulando um projetor.
     - **Lens Breathing**: Desfoque sutil na transição de foco.

4. **Iluminação de Cinema Reativa**
   - Spotlights que iluminam a "tela" conforme o sabor muda, com luzes de contorno (rim light) reforçadas.
   - Brilho da tela (glow) refletindo levemente no ambiente ao redor.

## Detalhes técnicos
- **Componentes**: Criação de `src/components/site/FilmGate.tsx`. Atualização de `src/components/site/TemperaflixShowcase.tsx` e `src/routes/temperaflix.tsx`.
- **Animação**: Uso de Framer Motion (`layoutId`, `animate`, `transition`) para orquestrar a transição suave entre o baú e a tela.
- **CSS/SVG**: Filtros de ruído cinematográfico e sobreposições de textura de filme.
- **Background**: Ajuste de `object-position` para garantir que o enquadramento do estúdio permita a visualização da tela de cinema.
