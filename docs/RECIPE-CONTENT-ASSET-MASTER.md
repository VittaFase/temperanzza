# CASA TEMPERANZZA — RECIPE CONTENT & ASSET MASTER

**Status:** OFFICIAL MASTER / ASSET LOCK  
**Version:** 1.0 — 2026-09-15  
**Scope:** 15 official Rebrand SKUs  
**Purpose:** canonical source of truth for recipe imagery, recipe identity, SKU association and future recipe content used by the Temperanzza storefront.

## 1. Governance

1. This document is the canonical registry for recipe imagery and recipe content associations.
2. SKU association is exact. Never infer association from a substring.
3. Standalone `cebola-em-po` is excluded from the Rebrand journey. `salsa-cebola-e-alho` is a valid independent SKU and must remain.
4. `temperaflix-bacon` means **TemperaFlix Sabor Bacon**; never expose it as a generic standalone Bacon SKU.
5. Recipe masters already contain the product jar in the photographic scene. The storefront must **not** overlay a second product PNG, redraw the jar, regenerate the label, or reinterpret the product with AI.
6. Allowed image processing: lossless/controlled optimization, responsive derivatives, crop and `object-position` required for layout. Preserve food and product visibility.
7. Original uploaded master remains immutable. Derived web files must be traceable to the master.
8. A filename is not a license to invent ingredients, quantities, preparation steps, yield, timing, nutrition or claims. Those fields remain `PENDING_CONTENT_LOCK` until explicitly authored/approved.
9. Duplicate historical uploads are not additional recipes. The entries below refer to the latest audited upload set supplied for the 15-SKU recipe collection.

## 2. Canonical SKU registry

| # | Canonical handle | Display name | Audited images |
|---:|---|---|---:|
| 01 | `ana-maria` | Ana Maria | 2 |
| 02 | `temperaflix-ervas-finas` | Temperaflix Ervas Finas | 2 |
| 03 | `temperaflix-tradicional` | Temperaflix Tradicional | 2 |
| 04 | `temperaflix-bacon` | Temperaflix Sabor Bacon | 5 |
| 05 | `tempero-mineiro` | Tempero Mineiro | 5 |
| 06 | `paprica-defumada` | Páprica Defumada | 4 |
| 07 | `paprica-picante` | Páprica Picante | 4 |
| 08 | `salsa-cebola-e-alho` | Salsa, Cebola e Alho | 4 |
| 09 | `ervas-finas` | Ervas Finas | 2 |
| 10 | `chimichurri-sem-pimenta` | Chimi Churri sem Pimenta | 2 |
| 11 | `tempero-do-edu` | Tempero do Edu / Edu Guedes | 3 |
| 12 | `chimichurri-picante` | Chimi Churri Picante | 3 |
| 13 | `lemon-pepper` | Lemon Pepper | 2 |
| 14 | `paprica-doce` | Páprica Doce | 2 |
| 15 | `curcuma` | Cúrcuma | 2 |

**AUDIT TOTAL: 15/15 SKUs — 44 current recipe-image masters.**

## 3. Recipe image master map

### 01 — Ana Maria (`ana-maria`)
- `Nova receita - Frango ensopado.png`
- `Nova Receita - Frango Grelhado com Ana Maria(1).png`

### 02 — Temperaflix Ervas Finas (`temperaflix-ervas-finas`)
- `Nova Receita - Omelete Cremoso com Temperaflix Ervas Finas of.png`
- `Nova Receita - Petiscos(3).png`

### 03 — Temperaflix Tradicional (`temperaflix-tradicional`)
- `Nova Receita - Ovos Cremosos com queijo Gratinado(1).png`
- `Nova Receita - Petiscos (2).png`

### 04 — Temperaflix Sabor Bacon (`temperaflix-bacon`)
- `Nova Receita - Costelas Glaceadas com Tempero Defumado(1).png`
- `Nova Receita - Hambúrguer Bacon com Queijo e Temperaflix Bacon(1).png`
- `Nova Receita - Omelete de Bacon(1).png`
- `Nova Receita - Ovos Benedict (1).png`
- `Nova Receita - Petiscos Gourmet Sabor Bacon(1).png`

### 05 — Tempero Mineiro (`tempero-mineiro`)
- `Nova Receita - Ensopado Rústico com Tempero Mineiro(1).png`
- `Nova Receita - Feijão Tropeiro com Tempero Mineiro(1).png`
- `Nova Receita - Pão de Queijo com Tempero Mineiro(1).png`
- `Nova Receita pote(2).png`
- `prato carne moida(1).png`

### 06 — Páprica Defumada (`paprica-defumada`)
- `Nova Receita - Costelas Defumadas e Páprica Premium(1).png`
- `Nova Receita - Ensopado de carne cozida com Páprica Defumada(1).png`
- `Nova Receita - Frango Assado com Páprica Defumada(1).png`
- `Nova Receita - Hambúrguer artesanal gourmet(1).png`

### 07 — Páprica Picante (`paprica-picante`)
- `Nova Receita - Camarão Picante com Páprica (2).png`
- `Nova Receita - Costelas Defumadas e Páprica Picante(2).png`
- `Nova Receita - Sardinhas Grelhadas com Páprica e Salada(2).png`
- `Nova Receita - Sopa de Legumes com Páprica Picante(2).png`

### 08 — Salsa, Cebola e Alho (`salsa-cebola-e-alho`)
- `Nova receita - Camarões ao alho com tempero artesanal(1).png`
- `Nova Receita - Peixe Assado com Legumes(1).png`
- `Nova Receita - Peixe Grelhado com Salada(1).png`
- `Receita novo pote(1).png`

### 09 — Ervas Finas (`ervas-finas`)
- `Nova Receita - Salmão Defumado com Ervas Finas(1).png`
- `Nova Receita - Torrada Carnivora com alho e Ervas Finas(1).png`

### 10 — Chimi Churri sem Pimenta (`chimichurri-sem-pimenta`)
- `Nova Receita - Bolo Carnivoro Dourado (1).png`
- `Novo pote receita(1).png`

### 11 — Tempero do Edu / Edu Guedes (`tempero-do-edu`)
- `Nova Receita - Contra File Acebolado(1).png`
- `Nova Receita - Ovos ao Molho com Queijo(1).png`
- `Nova Receita - Pancakes Douradas(1).png`

### 12 — Chimi Churri Picante (`chimichurri-picante`)
- `Nova Receita - Bife na frigideira com tempero artesanal(1).png`
- `Nova Receita - Brunch na Frigideira(1).png`
- `Nova Receita - Lombo Grelhada com Chimichurri Picante(1).png`

### 13 — Lemon Pepper (`lemon-pepper`)
- `Nova receita - Bife com Cebolas e Lemon Pepper(1).png`
- `Nova Receita - Hambúrguer artesanal gourmet(2).png`

### 14 — Páprica Doce (`paprica-doce`)
- `Nova Receita - Ensopado de Frango com Quiabo e Páprica(2).png`
- `Nova Receita - Frango a passarinho(2).png`

### 15 — Cúrcuma (`curcuma`)
- `Nova Receita - Gratinado de couve-flor com cúrcuma(1).png`
- `Nova receita - Panela de Legumes Assados com Cúrcuma(1).png`

## 4. Recipe content schema — mandatory

Every recipe page/card promoted from this master must use the following canonical fields:

```text
recipe_id
slug
status
sku_handle
product_display_name
title
short_description
hero_master
hero_alt
additional_images[]
servings
prep_time_minutes
cook_time_minutes
total_time_minutes
ingredients[]
method_steps[]
serving_suggestion
seo_title
seo_description
keywords[]
content_approved_at
content_approved_by
```

### Current content state

For all entries in version 1.0:

```text
status = IMAGE_LOCKED_CONTENT_PENDING
```

The uploaded material establishes the image, its filename/title cue and SKU association. It does **not** establish complete culinary instructions. Therefore ingredients, quantities, preparation method, timing, yield and nutritional information must not be fabricated from the photograph.

## 5. Web implementation contract

- `/cozinha` may discover only recipes whose SKU is eligible under the Rebrand catalog.
- Recipe cards and hero may use only an image registered in this master or an approved derivative of it.
- Recipe detail must resolve `recipe -> sku_handle -> canonical product` deterministically.
- Product PDP may show related recipes only through this canonical association.
- Never use `cebola-em-po` as a fallback for `salsa-cebola-e-alho`.
- Never add a synthetic jar overlay to a recipe image.
- No fake review/rating data, health claim, nutritional claim or unsupported culinary fact.
- Mobile crop must retain the food subject and, where technically feasible, the product already present in the master image.
- Any rename must preserve provenance to the original filename.

## 6. NO-REGRESSION gates

Before a recipe/content release is accepted:

- [ ] 15/15 canonical SKUs remain represented.
- [ ] No standalone `cebola-em-po` recipe exposure.
- [ ] `salsa-cebola-e-alho` remains independent and correctly mapped.
- [ ] `temperaflix-bacon` is never normalized to generic Bacon.
- [ ] Every rendered recipe image resolves to a registered master/approved derivative.
- [ ] No second product jar is overlaid on a recipe master.
- [ ] Recipe-to-product links resolve to the expected canonical handle.
- [ ] No recipe with `IMAGE_LOCKED_CONTENT_PENDING` is presented as having approved full recipe instructions.
- [ ] Desktop/tablet/mobile crops pass visual inspection.
- [ ] No horizontal overflow or broken image.

## 7. Change control

Any addition, deletion, SKU reassignment, title change, recipe text approval or replacement of a master image requires a versioned change to this document and must pass the NO-REGRESSION gates above. Silent substitutions are prohibited.
