# PRODUCT ASSET LOCK — Casa Temperanzza

Status: **ATIVO — FONTE CANÔNICA CONFIRMADA**

Este registro protege a experiência rebrand contra regressão para mockups históricos.

## Regra de uso

1. Shopify continua sendo a fonte comercial de produto, preço, disponibilidade e variante.
2. A camada editorial do rebrand só pode usar um pote classificado como `REBRAND_CONFIRMED`.
3. Arquivos históricos em `src/assets` não se tornam rebrand apenas por terem o mesmo handle.
4. Não reconstruir, redesenhar, completar ou reinterpretar pote/rótulo com IA.
5. Quando um ativo confirmado ainda não estiver incorporado ao repositório, usar `SHOPIFY_FALLBACK` ou não exibir o SKU em superfície editorial; nunca substituir silenciosamente por mockup histórico.
6. O original fornecido deve ser preservado. Recorte/transparência/otimização, quando necessários, são derivados técnicos e não podem alterar a arte.
7. **CEBOLA / `cebola-em-po` está FORA DO ESCOPO desta implementação do rebrand.** Não integrar o SKU às superfícies editoriais do novo rebrand nem tratá-lo como fonte visual confirmada. Esta regra de escopo não apaga dados históricos/comerciais do Shopify.

## Fonte canônica recebida em 14/09/2026

O PDF original **Nova logotipia Temperanzza (1).pdf**, com 15 páginas, é a fonte visual canônica deste Asset Lock. Cada página contém um pote rebrand isolado e o PDF contém imagem raster + máscara de transparência por página. A incorporação web deve extrair esses objetos diretamente, recompor o canal alpha e não redesenhar a embalagem.

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

- `temperaflix-tradicional` → `src/assets/rebrand-products/Untitled design - 1.png`. Identidade confirmada visualmente pelo proprietário em 14/09/2026: **TEMPERAFLIX / CASA TEMPERANZZA / TRADICIONAL / 60 g**. O nome genérico do arquivo não altera sua identidade canônica.
- `temperaflix-bacon` → `src/assets/rebrand-products/TEMPERAFLIX BACON - 1.png`. Este é o pote definitivo incorporado para o SKU; não criar SKU genérico `bacon`.

## Gate técnico

O arquivo `src/lib/productImages.ts` só pode trocar o asset histórico de um handle depois que o binário da fonte canônica estiver incorporado e verificado. A resolução deve ser por handle canônico exato, nunca por substring ou inferência de nome. Assets históricos permanecem apenas como fallback para SKUs ainda sem binário definitivo incorporado.
