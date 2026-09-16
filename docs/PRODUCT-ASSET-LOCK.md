# PRODUCT ASSET LOCK — Casa Temperanzza

Status: **ATIVO — FONTE CANÔNICA CONFIRMADA**

Este registro protege a experiência rebrand contra regressão para mockups históricos.

## Regra de uso

1. Shopify continua sendo a fonte comercial de produto, preço, disponibilidade e variante.
2. A camada editorial do rebrand só pode usar um pote classificado como `REBRAND_CONFIRMED`.
3. Arquivos históricos em `src/assets` não se tornam rebrand apenas por terem o mesmo handle.
4. Não reconstruir, redesenhar, completar ou reinterpretar pote/rótulo com IA.
5. Quando um ativo confirmado ainda não estiver incorporado ao repositório, não exibir o SKU em superfície editorial e registrar `MISSING_REBRAND_ASSET`; nunca usar imagem Shopify ou mockup histórico como fallback visual.
6. O original fornecido deve ser preservado. Recorte/transparência/otimização, quando necessários, são derivados técnicos e não podem alterar a arte.
7. A participação nas superfícies editoriais do rebrand é governada exclusivamente pela allowlist positiva de fontes confirmadas. SKUs ausentes dessa lista não podem ser publicados, mesmo que permaneçam no histórico comercial do Shopify.

## Fonte canônica e lote operacional

O PDF original **Nova logotipia Temperanzza (1).pdf**, com 15 páginas, permanece como fonte visual canônica deste Asset Lock. Em 15/09/2026, o proprietário forneceu o lote operacional `01`–`15` em PNG, acompanhado de `MANIFESTO_POTES_REBRAND.csv`, declarando a página-fonte de cada arquivo. Os PNGs recebidos têm 1800 × 1013 px, RGB, fundo branco e devem ser incorporados sem recompressão, recorte, reconstrução ou redesenho da embalagem.

| Página | SKU | Handle canônico | Status |
|---|---|---|---|
| 01 | Temperaflix Tradicional, 60 g | `temperaflix-tradicional` | REBRAND_CONFIRMED |
| 02 | Temperaflix Ervas Finas, 75 g | `temperaflix-ervas-finas` | REBRAND_CONFIRMED |
| 03 | Temperaflix Sabor Bacon, 65 g | `temperaflix-bacon` | REBRAND_CONFIRMED |
| 04 | Du Chefe com Páprica, 45 g | `du-chefe-com-paprica` | REBRAND_CONFIRMED |
| 05 | Edu Guedes, 45 g | `tempero-do-edu` | REBRAND_CONFIRMED |
| 06 | Ana Maria, 55 g | `ana-maria` | REBRAND_CONFIRMED |
| 07 | Chimi Churri Picante, 39 g | `chimichurri-picante` | REBRAND_CONFIRMED |
| 08 | Chimi Churri sem Pimenta, 40 g | `chimichurri-sem-pimenta` | REBRAND_CONFIRMED |
| 09 | Cúrcuma — Açafrão-da-Terra, 40 g | `curcuma` | REBRAND_CONFIRMED |
| 10 | Ervas Finas, 20 g | `ervas-finas` | REBRAND_CONFIRMED |
| 11 | Lemon Pepper, 50 g | `lemon-pepper` | REBRAND_CONFIRMED |
| 12 | Páprica Defumada, 60 g | `paprica-defumada` | REBRAND_CONFIRMED |
| 13 | Páprica Doce, 60 g | `paprica-doce` | REBRAND_CONFIRMED |
| 14 | Páprica Picante, 45 g | `paprica-picante` | REBRAND_CONFIRMED |
| 15 | Salsa, Cebola e Alho, 30 g | `salsa-cebola-e-alho` | REBRAND_CONFIRMED |

Aliases técnicos continuam resolvendo para o handle canônico; não criam SKUs adicionais. Em especial, `tempero-chefe` resolve para `du-chefe-com-paprica`, `edu-guedes` resolve para `tempero-do-edu`, e não existe um SKU genérico `bacon` separado de `temperaflix-bacon`.

## Locks de binário incorporado

Os 15 PNGs recebidos em 15/09/2026 foram incorporados integralmente sob nomes canônicos estáveis:

| Handle | Arquivo incorporado |
|---|---|
| `temperaflix-tradicional` | `src/assets/rebrand-products/temperaflix-tradicional.png` |
| `temperaflix-ervas-finas` | `src/assets/rebrand-products/temperaflix-ervas-finas.png` |
| `temperaflix-bacon` | `src/assets/rebrand-products/temperaflix-bacon.png` |
| `du-chefe-com-paprica` | `src/assets/rebrand-products/du-chefe-com-paprica.png` |
| `tempero-do-edu` | `src/assets/rebrand-products/tempero-do-edu.png` |
| `ana-maria` | `src/assets/rebrand-products/ana-maria.png` |
| `chimichurri-picante` | `src/assets/rebrand-products/chimichurri-picante.png` |
| `chimichurri-sem-pimenta` | `src/assets/rebrand-products/chimichurri-sem-pimenta.png` |
| `curcuma` | `src/assets/rebrand-products/curcuma.png` |
| `ervas-finas` | `src/assets/rebrand-products/ervas-finas.png` |
| `lemon-pepper` | `src/assets/rebrand-products/lemon-pepper.png` |
| `paprica-defumada` | `src/assets/rebrand-products/paprica-defumada.png` |
| `paprica-doce` | `src/assets/rebrand-products/paprica-doce.png` |
| `paprica-picante` | `src/assets/rebrand-products/paprica-picante.png` |
| `salsa-cebola-e-alho` | `src/assets/rebrand-products/salsa-cebola-e-alho.png` |

## Pendências explícitas

- `tempero-mineiro` → `MISSING_REBRAND_ASSET`. O SKU permanece na fonte comercial, mas não integra a allowlist pública nem pode receber imagem Shopify/legada enquanto o master Rebrand não for incorporado.

## Gate técnico

O arquivo `src/lib/productImages.ts` só pode trocar o asset histórico de um handle depois que o binário da fonte canônica estiver incorporado e verificado. A resolução deve ser por handle canônico exato, nunca por substring ou inferência de nome. Assets históricos podem permanecer no repositório durante a auditoria, mas nunca podem ser importados, renderizados ou usados como fallback público.
