# PRODUCT ASSET LOCK — Casa Temperanzza

Status: **ATIVO**

Este registro protege a experiência rebrand contra regressão para mockups históricos.

## Regra de uso

1. Shopify continua sendo a fonte comercial de produto, preço, disponibilidade e variante.
2. A camada editorial do rebrand só pode usar um pote classificado como `REBRAND_CONFIRMED`.
3. Arquivos históricos em `src/assets` não se tornam rebrand apenas por terem o mesmo handle.
4. Não reconstruir, redesenhar, completar ou reinterpretar pote/rótulo com IA.
5. Quando um ativo confirmado ainda não estiver incorporado ao repositório, usar `SHOPIFY_FALLBACK` ou não exibir o SKU em superfície editorial; nunca substituir silenciosamente por mockup histórico.
6. O original fornecido deve ser preservado. Recorte/transparência/otimização, quando necessários, são derivados técnicos e não podem alterar a arte.

## Lote de referência recebido em 14/09/2026

| # | SKU / referência | Handle canônico | Status | Observação |
|---|---|---|---|---|
| 01 | Ervas Finas — imagem com marca TEMPERAFLIX, tampa verde, 75 g | `temperaflix-ervas-finas` | REBRAND_CONFIRMED_SOURCE | Preservar original; existe divergência visual com a referência 07. |
| 02 | Temperaflix Tradicional, 60 g | `temperaflix-tradicional` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 03 | Tempero Mineiro, 45 g | `tempero-mineiro` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 04 | Temperaflix Sabor Bacon, 65 g | `temperaflix-bacon` | REBRAND_CONFIRMED_SOURCE | Único SKU Bacon desta linha; não criar handle genérico `bacon`. |
| 05 | Páprica Picante | `paprica-picante` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 06 | Salsa, Cebola e Alho, 30 g | `salsa-cebola-e-alho` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 07 | Referência enviada como Temperaflix Ervas Finas; imagem frontal mostra TEMPERANZZA | — | HOLD_IDENTITY | Não mapear automaticamente até resolver a divergência com 01/10. |
| 08 | Cúrcuma — Açafrão-da-Terra, 40 g | `curcuma` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 09 | Edu Guedes | `tempero-do-edu` | REBRAND_CONFIRMED_SOURCE | Alias `edu-guedes` deve resolver para este handle. |
| 10 | Ervas Finas, 20 g | `ervas-finas` | REBRAND_CONFIRMED_SOURCE | Linha regular. |
| 11 | Páprica Defumada, faixa roxa, 60 g | `paprica-defumada` | REBRAND_CONFIRMED_SOURCE | Identificação pelo nome impresso no pote. |
| 12 | Páprica Doce, faixa vermelho/laranja, 60 g | `paprica-doce` | REBRAND_CONFIRMED_SOURCE | Identificação pelo nome impresso no pote. |
| 13 | Du Chefe com Páprica, 45 g | `du-chefe-com-paprica` | REBRAND_CONFIRMED_SOURCE | Alias `tempero-chefe` deve resolver para este handle. |
| 14 | Chimi Churri sem Pimenta, 40 g | `chimichurri-sem-pimenta` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |
| 15 | Chimi Churri Picante, 39 g | `chimichurri-picante` | REBRAND_CONFIRMED_SOURCE | Fonte fornecida pelo proprietário. |

`REBRAND_CONFIRMED_SOURCE` significa que a referência visual foi fornecida e aprovada como fonte do novo rebrand. Isso **não** significa que o arquivo histórico atualmente importado por `productImages.ts` seja o mesmo arquivo.

## Gate técnico

Até que cada fonte confirmada seja incorporada e verificada no repositório, `src/lib/productImages.ts` deve ser tratado como **registro comercial legado**, não como prova de Asset Lock. Qualquer nova seção editorial deve consultar um registro explícito de elegibilidade rebrand e não inferir elegibilidade pela existência de uma imagem histórica.
