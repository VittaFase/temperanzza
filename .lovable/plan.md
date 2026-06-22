## Lote de imagens recebido

4 novos PNGs finais para mapear aos SKUs existentes:

| Upload | SKU / handle |
|---|---|
| `87.png` | `temperaflix-bacon` |
| `88.png` | `pimenta-do-reino` (Premium Black 30g) |
| `89.png` | `canela-moida` (Premium Black 30g) |
| `PÁPRICA_DOCE-4.png` | `paprica-doce` |

## Passos

1. Reenviar cada PNG via `lovable-assets create` para sobrescrever os pointers em `src/assets/*.png.asset.json` correspondentes (mesmos nomes de arquivo já usados em `src/lib/productImages.ts`).
   - `src/assets/temperaflix-bacon.png.asset.json`
   - `src/assets/pimenta-do-reino.png.asset.json` (criar — ainda não existe pointer dedicado; adicionar mapeamento se faltar)
   - `src/assets/canela-moida.png.asset.json` (idem)
   - `src/assets/paprica-doce.png.asset.json`
2. Conferir `src/lib/productImages.ts`: garantir que os handles `pimenta-do-reino` e `canela-moida` apontem para os novos pointers (adicionar entradas se ausentes).
3. Validar visualmente na grid do catálogo e na PDP — escala e enquadramento consistentes com os demais frascos.

## Fora de escopo

- Nenhum ajuste de layout, tipografia, cabeçalho ou checkout.
- Não publicar até o lote completo (faltam SKUs restantes) estar revisado.

## Faltando ainda (aguardar lote final)

Comparando os 19 SKUs do catálogo com PNGs finais já recebidos, ainda faltam: `ana-maria`, `cebola-em-po`, `ervas-finas`, `lemon-pepper`, `paprica-defumada`, `paprica-picante`, `salsa-cebola-e-alho`, `temperaflix-ervas-finas`, `temperaflix-tradicional`, `tempero-do-edu`, `tempero-mineiro` — confirmar com você se algum desses já foi enviado em lote anterior ou se virão depois.
