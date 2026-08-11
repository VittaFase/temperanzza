# Camada de "vida de câmera" sobre a cena Temperaflix

Diagnóstico: os potes já estão centralizados, com sombra e escala corretos. O que ainda soa "mockup" não é a posição — é a **ausência de imperfeição de captura**. Cena e produto estão pixel-perfeitos e imóveis: sem grão que respire, sem micro-movimento de câmera, sem variação de luz no tempo. O olho lê isso como render, não como filmagem.

A solução é adicionar uma camada de filtro em movimento **por cima da cena inteira** (fundo + potes), para que tudo pareça capturado pela mesma lente.

## O que será construído

Um componente `FilmGate` (overlay, `pointer-events-none`) sobre a seção, com cinco efeitos sutis:

1. **Grão animado** — textura de ruído que troca de posição ~12x/s (não um PNG estático). É o efeito que mais quebra a sensação de render.
2. **Gate weave** — micro-oscilação da cena toda: translate de 1-2px e rotate de ~0.05° em ciclo lento e irregular, imitando câmera na mão/tripé real.
3. **Flicker de luz** — variação de brilho/contraste de 1-2% em ritmo respirado, como refletor de estúdio com oscilação de rede.
4. **Halation / bloom de lente** — leve difusão quente nas altas luzes, mais forte perto do refletor principal, para as bordas do vidro não ficarem "recortadas".
5. **Vinheta viva** — vinheta que respira de leve junto com a troca de sabor, em vez de máscara fixa.

Além disso, na **entrada do pote** (quando o sabor ativo muda): em vez do pop atual, uma entrada com micro-blur de foco (`filter: blur(3px) → 0`) + leve overshoot na escala, como se a lente estivesse encontrando o foco. Esse é o ponto que hoje mais denuncia artificialidade.

## Ajustes de intensidade

Tudo em valores baixos e conservadores — o efeito deve ser sentido, não visto. Cada camada terá amplitude parametrizada para calibrarmos junto após ver o resultado.

## Detalhes técnicos

- Novo componente `src/components/site/FilmGate.tsx`, reutilizado nos dois lugares: `src/components/site/TemperaflixShowcase.tsx` (Home) e a seção equivalente em `src/routes/temperaflix.tsx`.
- Grão via SVG `feTurbulence` inline com `baseFrequency` animada por `motion` (steps), `mix-blend-overlay`, opacidade ~0.05-0.08.
- Gate weave aplicado no wrapper da cena (fundo + palco juntos), não em cada pote, para que a cena não se descole do produto.
- Flicker e halation com `motion` sobre `filter`/`background`, `will-change: transform, filter` e sem animar layout — mantém a performance.
- Respeitar `prefers-reduced-motion`: com a preferência ativa, só o grão estático permanece.
- Não altera posição, escala, sombra dos potes, nem o `StudioLightRig`, nem o carrinho ou qualquer lógica de dados.

## Fora de escopo

Sombras, ancoragem e escala atuais dos potes; fundo; catálogo; qualquer backend.
