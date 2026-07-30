---
name: temperanzza-capability-map
description: Use a cada novo pedido do usuário para verificar se o projeto Temperanzza já tem uma skill que cobre aquele domínio. Aciona implicitamente antes de planejar qualquer implementação.
---

# Mapa de Capacidades Temperanzza

## Quando usar
- Sempre que o usuário fizer um pedido novo, antes de propor solução.
- Para responder: "temos habilidade para esse desempenho" ou "precisamos ativar a habilidade X para esse fim".
- Para evitar reinventar padrões já documentados em outra skill.

## Skills ativas no projeto

| Skill | Domínio | Quando acionar |
|---|---|---|
| `seo-temperanzza` | SEO, metadados, JSON-LD, sitemap, canonical, Open Graph | Novas rotas, revisão de SEO, "Google", "title", "description" |
| `brand-copywriting-temperanzza` | Tom de voz, textos de UI, receitas, blog, nomenclatura | Mudança de texto, nova receita, novo artigo, "copy", "tom" |
| `bling-erp-integration` | Conexão Bling, sync, pedidos, estoque, preços, OAuth | "Bling", "sincronizar", "pedido", "estoque", "ERP" |
| `shopify-storefront-conversion` | Catálogo, produtos, carrinho, checkout, PDP | "Shopify", "produto", "carrinho", "checkout", "comprar" |
| `image-generation-temperanzza` | Geração/escolha de imagens, assets, mockups | "imagem", "foto", "mockup", "gerar imagem" |
| `analytics-event-tracking` | Analytics, pixels, eventos de conversão | "analytics", "pixel", "Google Analytics", "eventos", "rastrear" |

## Como comunicar ao usuário
Sempre que um pedido se encaixar em uma skill existente, avise de forma breve:

> "Temos a habilidade **SEO Temperanzza** para esse fim — vou seguir as regras de metadados, canonical e JSON-LD do projeto."

Ou, se for necessário ativar uma capacidade ainda não implementada:

> "Essa implementação precisa da habilidade **Analytics & Event Tracking**, que ainda não está ativa no projeto. Vamos ativá-la primeiro?"

## Regras de governança
1. **Nunca ignore uma skill relevante.** Se o pedido tocar SEO, consulte `seo-temperanzza`.
2. **Não duplique conhecimento.** Se uma skill já cobre o tema, siga ela em vez de inventar novo padrão.
3. **Atualize este mapa** quando novas skills forem adicionadas ao projeto.
4. **Mantenha consistência.** Se duas skills conflitarem (ex.: SEO pede foto absoluta, Image Generation proíbe foto de prato), priorize a restrição mais estrita e explique ao usuário.

## Conflitos comuns e resolução
| Situação | Resolução |
|---|---|
| SEO pede `og:image` para receita, mas skill de imagem proíbe foto de prato | Use o PNG transparente do pote real como `og:image`. |
| Brand pede "Bacon em Pó", mas catálogo tem "Temperaflix Bacon" | Use "Temperaflix Bacon" e explique a consolidação. |
| Shopify pede checkout rápido, Bling precisa de pedido | Siga o fluxo Shopify → webhook → Bling; não quebre a cadeia. |

## Validação
- Ao final de cada implementação, confirme se alguma skill deveria ter sido consultada e não foi.
- Se o usuário pedir algo fora das skills existentes, registre a lacuna e sugira criar nova skill.
