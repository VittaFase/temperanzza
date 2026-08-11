# Estratégia: Estúdio Cinematográfico Temperaflix

Substituição da estética de "festas/bokeh" por um sistema de iluminação de estúdio profissional e dinâmico, reforçando a identidade "Flix" com foco em realismo, profundidade e atmosfera de cena.

## Mudanças Visuais

### 1. Remoção de Elementos "Energia/Festa"
- **Desativação do Bokeh**: Remover o componente `BokehBackdrop` (vídeo/imagem de bolhas brilhantes) tanto da Home quanto da página `/temperaflix`.
- **Limpeza de Overlays**: Retirar gradientes que sugerem "aura" mágica ou brilhos artificiais não justificados pela luz física.

### 2. Implementação do Studio Light Rig
- **Rim Lighting (Luz de Contorno)**: Adicionar luzes direcionais que "cortam" a silhueta dos potes, destacando o vidro e o rótulo.
- **Mudança de Cena (Spotlights)**: Implementar luzes que acompanham o ciclo de sabores, simulando refletores de estúdio focando no produto ativo.
- **Top & Bottom Lights**: Adicionar gradientes suaves no topo (luz de teto de estúdio) e sombras/luzes de contato na base (tampo da mesa/baú) para ancorar o produto.
- **Atmosfera Volumétrica**: Usar um leve efeito de névoa (fog/smoke) estático ou sutil para dar volume aos feixes de luz.

### 3. Centralização e Ergonomia
- Garantir que os potes estejam centralizados e fisicamente assentados sobre o baú/mesa, usando sombras de oclusão realistas.

## Detalhes Técnicos

### Componentes e Estilos
- **StudioLightRig**: Novo sub-componente interno para gerenciar as luzes.
- **Framing**: Uso de `mix-blend-mode: soft-light` e `overlay` para as luzes volumétricas sobre o `studioBg`.
- **Animações**: Transições suaves de cor e opacidade nas luzes ao trocar o sabor ativo (`activeMeta.accent`).

### Arquivos Afetados
- `src/components/site/TemperaflixShowcase.tsx`: Refatoração para o novo rig de luz.
- `src/routes/temperaflix.tsx`: Sincronização da estética cinematográfica.
- `src/routes/index.tsx`: Remoção de comentários obsoletos.

## Impacto na Jornada
O cliente deixará de ver uma "vitrine de produtos" para entrar em um "set de filmagem", elevando o valor percebido da marca e conectando o produto diretamente ao lifestyle de entretenimento (cinema/streaming).
