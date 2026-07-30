---
name: image-generation-temperanzza
description: Use ao decidir se, quando e como gerar imagens para produtos, receitas, blog ou marketing da Temperanzza. Aciona em pedidos de "gerar imagem", "foto do prato", "imagem de produto", "mockup", "ilustração".
---

# Image Generation Temperanzza

## Quando usar
- O usuário pedir imagem de produto, receita, blog, banner ou material de marca.
- Avaliar se a geração é permitida, necessária ou se deve usar asset existente.
- Decidir estilo, formato, dimensão e onde salvar.

## Regra principal: reutilizar antes de gerar
A Temperanzza já possui **potes reais em PNG transparente** para todos os produtos em `src/assets/*.png.asset.json` e mapeados em `src/lib/productImages.ts`.

Sempre prefira o asset real antes de gerar uma imagem.

## O que NÃO gerar
- **Fotos de pratos prontos** para a Biblioteca Gastronômica. A diretriz editorial atual usa:
  - blocos de cor (`hero.color` oklch);
  - tipografia stencil;
  - pote real do condimento como protagonista.
- Mockups que substituam a identidade visual existente (cores, tipografia, selos).
- Imagens de produtos que já tenham foto real.
- Reviews, depoimentos ou prova social fabricada.

## O que PODE ser gerado
- Banners editoriais ocasionais que sigam a paleta e tipografia da marca.
- Imagens para OG/social quando não houver imagem absoluta de qualidade.
- Material promocional pontual (campanhas sazonais), desde que respeite tokens de marca.
- Fotos de contexto de lifestyle para blog, **se** o usuário explicitamente solicitar e aprovar.

## Estilo visual permitido
- Paleta: paper cream, brand ink, brand red (oklch 0.52 0.21 28), brand mustard.
- Tipografia display: Big Shoulders Stencil Display.
- Texto: português brasileiro, maiúsculas para títulos display, itálico Playfair para quotes.
- Forma: cantos retos (`rounded-none`), estética industrial de casa de temperos.

## Onde salvar
- Assets do projeto: `src/assets/<nome>.png.asset.json` (gerenciado pelo Lovable assets).
- Rascunhos/exports: `/mnt/documents/`.
- Nunca salvar imagens geradas diretamente em `public/` sem necessidade de URL estática.

## Formatos e dimensões
- Produtos/potes: PNG transparente quando possível.
- Banners/OG: JPG ou PNG, 1200×630 para OG, 1920×1080 para hero.
- Ícones/selos: SVG ou PNG transparente.

## Processo de geração
1. Verificar se já existe asset real equivalente (`src/lib/productImages.ts`, `src/assets/`).
2. Se não existir, perguntar ao usuário se deseja gerar ou aguardar foto real.
3. Se gerar, usar prompt que inclua restrições de marca e estilo.
4. Salvar no local correto.
5. Atualizar referências no código.

## O que comunicar ao usuário
- Sempre que um pedido de imagem envolver produto existente: "Temos o pote real em PNG transparente — posso usá-lo em vez de gerar?"
- Quando a geração for de prato/receita: "A diretriz editorial atual não usa foto de prato, mas sim pote real + bloco de cor. Quer mudar essa diretriz?"

## Validação
- Verifique se a imagem gerada não conflita com assets existentes.
- Confira no preview se a imagem carrega corretamente e respeita proporção.
- Para OG, use URL absoluta e verifique com ferramenta de preview social.
