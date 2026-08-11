# Refinamento Temperaflix — Cenário de Estúdio Cinematográfico

Dois ajustes: corrigir a cadeira espelhada e trocar as bolhas de bokeh por uma linguagem de luz de estúdio (troca de cena).

## 1. Cadeira "TEMPERANZZA" legível

Na seção "Escolha sua sessão" o fundo de estúdio recebe `scale-x-[-1]` (espelhamento horizontal), o que inverte a escrita na cadeira. Solução: remover o espelhamento e diferenciar o fundo da seção de baixo em relação ao topo por outros meios — enquadramento (`object-position` deslocado à esquerda), escala leve e brilho/contraste — mantendo a leitura correta da marca.

## 2. Substituir as bolhas por luz cinematográfica

Sai o `BokehBackdrop` (vídeo/poster de bokeh dourado, hoje presente nos dois blocos de `/temperaflix` e no showcase da Home). Entra um novo componente de atmosfera de estúdio, `StudioLightRig`, com três camadas discretas e sem "festa":

- **Key light lateral**: feixe suave e alongado entrando pelo canto superior (gradiente cônico/elíptico), fixo, dando direção de luz coerente com as luminárias da foto.
- **Troca de cena**: quando o sabor ativo muda, a cor da luz de fundo faz um cross-fade lento (~1,2 s) para o tom do sabor — como um gelatinado sendo trocado no set. Sem pulsação contínua.
- **Respiro de set**: variação lentíssima de intensidade (opacidade 0,22 → 0,30, ciclo de ~8 s) apenas na luz de fundo, para o ambiente não parecer congelado. Um "haze" de fumaça muito sutil, em gradiente, substitui o brilho pontilhado.

Nada de círculos desfocados, `animate-ping` de partículas ou halos redondos flutuando. O halo redondo pulsante atrás do pote (`rim light` com `blur-[100px] rounded-full`) também sai, trocado por um **rim light direcional** atrás do produto: faixa vertical estreita e desfocada, na cor do sabor, que reforça a silhueta do pote em vez de criar uma bolha.

## 3. Coerência em cima e embaixo

O mesmo rig é aplicado no Hero e na seção de episódios, com intensidades diferentes (topo mais claro, embaixo mais fechado e com queda para o piso), e no showcase Temperaflix da Home — para que Home e página dedicada contem a mesma cena.

Acessibilidade e performance: tudo em CSS/gradientes + Motion (nenhum vídeo novo), `prefers-reduced-motion` desativa a animação e mantém o estado estático; um arquivo de vídeo a menos carregando na seção.

## Detalhes técnicos

- `src/routes/temperaflix.tsx`: remover `scale-x-[-1]` do fundo dos episódios; substituir `BokehBackdrop` por `StudioLightRig`; trocar o bloco de rim light circular por faixa direcional.
- `src/components/site/TemperaflixShowcase.tsx`: mesma troca de backdrop e remoção dos halos circulares.
- Novo `src/components/site/StudioLightRig.tsx` com props `intensity` e `accent` (cor do sabor ativo), usando tokens `brand-*` já existentes.
- Imports de `hero-bokeh` removidos onde deixarem de ser usados; o asset permanece no projeto para outras seções.
