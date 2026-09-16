# PRODUCT ASSET LOCK — Casa Temperanzza

Status: **ATIVO — LOTE OFICIAL CONFIRMADO EM 15/09/2026**

Este registro protege a experiência Rebrand contra regressão para potes históricos, imagens Shopify ou arquivos provisórios.

## Regras imutáveis

1. A camada pública só pode renderizar os PNGs oficiais listados neste documento.
2. Não reconstruir, redesenhar, completar, recortar ou reinterpretar pote/rótulo com IA.
3. Os arquivos oficiais devem permanecer sem recompressão e com o canal alpha original.
4. Shopify permanece como fonte de preço, disponibilidade e variante, nunca como fallback visual.
5. Cebola em Pó e Du Chefe com Páprica não integram o catálogo oficial desta implementação.
6. Salsa, Cebola e Alho é um SKU único e permanece válido.
7. Qualquer SKU sem master oficial deve retornar `missing`.

## Masters oficiais incorporados

Todos os arquivos abaixo foram recebidos diretamente do proprietário em PNG 2048 × 1152, RGBA, com transparência.

| Nº | SKU | Handle | Master canônico | Status |
|---:|---|---|---|---|
| 01 | Ana Maria — 55 g | `ana-maria` | `ana-maria.png` | REBRAND_CONFIRMED |
| 02 | Chimi Churri Picante — 39 g | `chimichurri-picante` | `chimichurri-picante.png` | REBRAND_CONFIRMED |
| 03 | Chimi Churri sem Pimenta — 40 g | `chimichurri-sem-pimenta` | `chimichurri-sem-pimenta.png` | REBRAND_CONFIRMED |
| 04 | Cúrcuma / Açafrão-da-Terra — 40 g | `curcuma` | `curcuma.png` | REBRAND_CONFIRMED |
| 05 | Edu Guedes — 45 g | `tempero-do-edu` | `tempero-do-edu.png` | REBRAND_CONFIRMED |
| 06 | Ervas Finas — 20 g | `ervas-finas` | `ervas-finas.png` | REBRAND_CONFIRMED |
| 07 | Lemon Pepper — 50 g | `lemon-pepper` | `lemon-pepper.png` | REBRAND_CONFIRMED |
| 08 | Páprica Defumada — 60 g | `paprica-defumada` | `paprica-defumada.png` | REBRAND_CONFIRMED |
| 09 | Páprica Doce — 60 g | `paprica-doce` | `paprica-doce.png` | REBRAND_CONFIRMED |
| 10 | Páprica Picante — 45 g | `paprica-picante` | `paprica-picante.png` | REBRAND_CONFIRMED |
| 11 | Salsa, Cebola e Alho — 30 g | `salsa-cebola-e-alho` | `salsa-cebola-e-alho.png` | REBRAND_CONFIRMED |
| 12 | Temperaflix Ervas Finas — 75 g | `temperaflix-ervas-finas` | `temperaflix-ervas-finas.png` | REBRAND_CONFIRMED |
| 13 | Temperaflix Sabor Bacon — 65 g | `temperaflix-bacon` | `temperaflix-bacon.png` | REBRAND_CONFIRMED |
| 14 | Temperaflix Tradicional — 60 g | `temperaflix-tradicional` | `temperaflix-tradicional.png` | REBRAND_CONFIRMED |
| 15 | Tempero Mineiro — 45 g | `tempero-mineiro` | `tempero-mineiro.png` | REBRAND_CONFIRMED |

## Gate técnico

A correspondência é feita por handle canônico exato em `src/lib/productImages.ts`. Nenhum componente público pode usar substring, inferência de nome, imagem legada ou fallback da Shopify.
