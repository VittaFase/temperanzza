## Diagnóstico dos PNGs enviados

Inspecionei o lote em `/mnt/user-uploads` (54 arquivos, 1448×2000). Existem **dois formatos misturados**:

| Tipo | Exemplos | Modo | Fundo | Ação necessária |
|---|---|---|---|---|
| Numerados | `62.png`, `67.png`, `72.png`, `77.png`, `82.png`, `11.png`, `16.png`, `27.png`, `32.png`, `6.png` | RGBA | Transparente real (alfa 0 nas bordas) | Subir direto |
| Nomeados | `ANA_MARIA.png`, `CEBOLA_EM_PÓ.png`, `CHIMI_CHURRI_*`, `CÚRCUMA`, `DU_CHEFE_*`, `ERVAS_FINAS`, `LEMON_PEPPER`, `PÁPRICA_*`, `SALSA_*`, `TEMPERAFLIX_*`, `TEMPERO_*` (e variantes `-2`/`-3`) | RGB | Branco chapado | Rodar recorte antes de subir |
| Acessórios | `POTE_CANELEIRO`, `POTE_PIMENTEIRO`, `image*.png` | RGB | Branco | Ignorar (não fazem parte das 19 SKUs) |

**Resumo:** só ~5 dos 19 produtos vieram com transparência real. Os demais ainda têm fundo branco — vou processar com o mesmo `cutout.py` que já foi usado antes, garantindo RGBA com bordas suaves.

## Plano de execução

### 1. Mapeamento arquivo → handle Shopify
Montar tabela de correspondência (acentos/underscores → slugs):
- `PÁPRICA_PICANTE` → `paprica-picante`
- `TEMPERO_MINEIRO` → `tempero-mineiro`
- `CEBOLA_EM_PÓ` → `cebola-em-po`
- `TEMPERAFLIX_ERVAS_FINAS` → `temperaflix-ervas-finas`
- (e assim por diante, 19 SKUs)

Quando houver duplicata (`-2`, `-3`), eu escolho a versão de melhor ângulo/iluminação (preferência: arquivos numerados quando existirem, depois `-2`, depois base).

### 2. Normalização para RGBA
- Arquivos já RGBA: copiar direto para `/tmp/cutout/{handle}.png`.
- Arquivos RGB com fundo branco: rodar `cutout.py` (threshold + feather nas bordas) → salvar em `/tmp/cutout/{handle}.png`.
- Validar amostragem (3 arquivos): cantos com alfa=0, miolo com alfa=255, borda do pote com gradiente suave.

### 3. Reupload via `lovable-assets`
Para cada handle:
```bash
lovable-assets create --file /tmp/cutout/{handle}.png --filename {handle}.png \
  > src/assets/{handle}.png.asset.json
```
Isso sobrescreve os pointers existentes — o `src/lib/productImages.ts` continua mapeando handle → asset.url sem precisar de edição.

### 4. Vitrine clara (visual leve estilo Kinder's)
- `ProductCard.tsx`: default `variant="paper"`, fundo `bg-brand-cream` com `bg-paper-grain` muito sutil, pote em `w-[72%] h-[82%]` com `object-contain`, sombra `drop-shadow-[0_22px_28px_rgba(0,0,0,0.18)]` + elipse de contato (`bg-black/15 blur-xl`, opacidade reduzida). Remover `ProductBadge` circular sobreposto na variante paper.
- `FlavorTile.tsx`: permanece disponível para hero e banners pontuais (Temperaflix), não é mais o padrão da grade.
- `FeaturedRow.tsx`: fundo branco/cream, pote centralizado, título stencil gigante (`font-display`), preço em `text-brand-red`, CTA texto vermelho com underline fino.
- `product.$handle.tsx`: hero da PDP com fundo cream e pote grande com sombra suave (sem cor saturada de fundo).

### 5. Aplicação nas rotas
- `/produtos`, `/temperaflix`, `/` (Home) → padrão paper refinado.
- PDP → hero claro.
- Header/footer/cart/checkout/sobre/lojas/fontes/paleta → **fora de escopo**.

## Fora de escopo
- Gerar imagens novas com IA.
- Editar header, footer, cart drawer, checkout, rotas `/sobre` e `/lojas`.
- Trocar paleta base, fontes ou tokens semânticos.
- Reupload dos arquivos acessórios (`POTE_CANELEIRO`, `POTE_PIMENTEIRO`, `image*.png`).

## Riscos
- Recorte automático pode deixar halo branco em potes com vidro transparente (paprica picante, tempero mineiro). Plano de mitigação: comparar amostra após corte; se houver halo, aplicar erode no canal alfa antes de feather.
- Se algum handle Shopify ainda não tiver pointer correspondente, eu crio o `.asset.json` novo e adiciono no map de `productImages.ts`.

Aprova para eu executar?