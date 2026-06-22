## Objetivo
Substituir o bloco tipográfico "T + Temperanzza" no quadrado preto da hero section pelo **selo da marca (BrandSeal) com fundo transparente**, aplicando um efeito visual de **relevo metálico/embossed** que reforce a sensação de carimbo de qualidade premium.

## Escopo
- **Apenas a hero section** (`src/routes/index.tsx`) — o quadrado preto `aspect-square bg-brand-ink`.
- Nenhuma mudança em rotas, lógica de negócio, Shopify ou catálogo.

## Passos

### 1. Verificar / gerar selo transparente
- Verificar se `src/assets/temperanzza-seal.png` já possui canal alpha (fundo transparente).
- Caso contrário, gerar uma nova versão do selo com fundo transparente via `imagegen--edit_image` ou `lovable-assets`.

### 2. Adaptar `BrandSeal.tsx`
- Adicionar prop opcional `embossed?: boolean`.
- Quando `embossed=true`, aplicar classes CSS com sombras múltiplas simulando relevo:
  - `drop-shadow` combinado com bordas luminosas para efeito de metal sobre fundo escuro.
  - Opcional: `filter: brightness(1.1) contrast(1.05)` para realçar textura.

### 3. Substituir na hero
- No quadrado preto, remover o bloco com "T", "Temperanzza" e "Spice House · MG".
- Inserir `<BrandSeal size="xl" tone="paper" embossed className="..." />` proporcional ao container.
- Ajustar padding interno do quadrado para que o selo ocuça ~70-80% da área sem encostar nas bordas.

### 4. Preservar elementos periféricos
- Manter os micro-rótulos nos cantos: "Lote 2026", "45g", "Artesanal", "Sem aditivos".
- Manter o badge "19 referências" posicionado abaixo.

## Resultado esperado
Selo da marca centralizado no quadrado preto, com aparência de carimbo metálico em relevo, fundo transparente deixando o preto do quadrado como base, criando um momento de impacto visual imediato e reforçando a identidade da casa.
