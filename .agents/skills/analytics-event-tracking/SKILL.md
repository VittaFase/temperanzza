---
name: analytics-event-tracking
description: Use ao adicionar, revisar ou diagnosticar rastreamento de eventos de conversão, analytics, pixels ou métricas no site Temperanzza. Aciona em pedidos de "analytics", "pixel", "Google Analytics", "Meta", "eventos", "conversão", "rastrear".
---

# Analytics & Event Tracking

## Quando usar
- O usuário pedir para "rastrear conversões", "instalar pixel", "Google Analytics", "Meta Pixel", "eventos".
- Adicionar eventos de e-commerce (add_to_cart, purchase, view_item).
- Criar dashboard ou relatório de métricas.
- Diagnosticar por que um evento não está disparando.

## Estado atual do projeto
- **Nenhuma ferramenta de analytics está instalada atualmente.**
- O site não tem Google Analytics, Meta Pixel, TikTok Pixel nem servidor de métricas próprio.
- Antes de implementar, decidir com o usuário qual stack usar.

## Opções recomendadas
1. **Google Analytics 4 + Google Tag Manager** — padrão para SEO e relatórios.
2. **Meta Pixel (Facebook/Instagram Ads)** — se houver campanhas pagas.
3. **Plausible ou Simple Analytics** — alternativa sem cookies, mais leve.
4. **Eventos próprios no backend** — se quiser dados brutos sem terceiros.

## Eventos de e-commerce essenciais
- `view_item` — ao abrir PDP.
- `view_item_list` — ao ver catálogo/listagem.
- `add_to_cart` — ao clicar "Adicionar ao Carrinho".
- `remove_from_cart` — ao remover item.
- `begin_checkout` — ao abrir checkout.
- `purchase` — ao confirmar pedido (idealmente via webhook Shopify, não só frontend).

## Onde colocar eventos
- **Frontend**: nos handlers de clique e no carregamento de rota.
- **Backend**: no webhook `/api/public/shopify/order-webhook` para `purchase` confiável (evita perda por adblock).

## Dados a rastrear
- `item_id` / `item_name`: handle ou nome do produto.
- `price`, `currency`: "BRL".
- `quantity`.
- `value` (total do carrinho/pedido).
- `coupon` (se aplicado).

## Privacidade e LGPD
- Sempre informar o usuário sobre LGPD/cookies se implementar GA/Meta.
- Considerar banner de consentimento se usar cookies de terceiros.
- Alternativas sem cookie (Plausible) simplificam conformidade.

## O que nunca fazer
- Enviar PII (e-mail, CPF, endereço) para pixels de terceiros.
- Rastrear eventos de compra apenas no frontend — adblockers perdem dados.
- Implementar analytics sem confirmar com o usuário qual ferramenta usar.

## Implementação típica
1. Escolher ferramenta com o usuário.
2. Adicionar script/tag no `__root.tsx` (head) ou via GTM.
3. Criar helper `src/lib/analytics.ts` para disparar eventos tipados.
4. Instrumentar `CartDrawer.tsx`, `ProductCard.tsx`, `product.$handle.tsx`.
5. Adicionar evento `purchase` no webhook Shopify.
6. Testar no preview com DevTools → Network/Console.

## Validação
- Verificar se eventos aparecem no dashboard da ferramenta escolhida.
- Para GA4, usar DebugView.
- Para Meta Pixel, usar Pixel Helper.
- Para backend, verificar logs de webhook.
