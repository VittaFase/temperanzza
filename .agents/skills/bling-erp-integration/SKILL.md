---
name: bling-erp-integration
description: Use ao conectar, sincronizar, diagnosticar ou expandir a integração entre Bling ERP e o site Temperanzza. Aciona em pedidos de "Bling", "sincronizar", "pedido", "estoque", "preço", "ERP", "OAuth".
---

# Bling ERP Integration

## Quando usar
- Conectar ou reconectar a conta Bling.
- Sincronizar produtos, preços ou estoque Bling → Shopify.
- Diagnosticar falhas de autenticação (`401`, `insufficient_scope`).
- Criar pedido de venda no Bling a partir de pedido Shopify.
- Configurar cron de sincronização automática.
- O usuário pedir "Bling", "sincronizar", "pedido não apareceu", "token expirou".

## Arquitetura
- O site atua como **ponte**: Shopify (vendas) → webhook → Bling (pedido de venda).
- Sincronização de produtos: Bling → site → Shopify (preços e estoque).
- Autenticação OAuth2 com refresh token automático.

## Fluxo de conexão OAuth
1. Administrador acessa `/admin/bling?key=<BLING_ADMIN_TOKEN>`.
2. Clica em "Conectar ao Bling".
3. Endpoint `/api/public/bling/connect` redireciona para Bling OAuth.
4. Bling chama `/api/public/bling/callback` com `code` e `state`.
5. Site troca o code por access/refresh token e salva em `bling_tokens`.

## Tabelas do banco
- `bling_tokens`: access_token, refresh_token, expires_at, scope.
- `bling_sync_log`: log de sincronizações (kind, status, message, details).
- `bling_orders_log`: log de pedidos criados via webhook (se existir).

## Escopos necessários no Bling
Para o funcionamento completo, o aplicativo Bling precisa de permissões para:
- **Vendas** (Pedidos de Venda)
- **Clientes** (Contatos)
- **Estoque** (Produtos, depósitos)
- **Produtos** (para buscar SKU e preço)

Se aparecer `insufficient_scope`, a conexão precisa ser refeita com todos os escopos.

## Endpoints públicos
| Rota | Uso | Autenticação |
|---|---|---|
| `/api/public/bling/connect` | Iniciar OAuth | `BLING_ADMIN_TOKEN` |
| `/api/public/bling/callback` | Callback OAuth | state implícito |
| `/api/public/bling/sync` | Sincronização manual | `BLING_ADMIN_TOKEN` |
| `/api/public/bling/cron-sync` | Sincronização agendada | `apikey` = `SUPABASE_PUBLISHABLE_KEY` |
| `/api/public/bling/disconnect` | Limpar tokens | `BLING_ADMIN_TOKEN` |

## Sincronização automática
- Agendador recomendado: `pg_cron` a cada 20 minutos chamando `/api/public/bling/cron-sync`.
- O cron usa header `apikey` com a chave publicável do backend.

## Webhook Shopify → Bling
- Shopify dispara `orders/create` para `/api/public/shopify/order-webhook`.
- O site valida HMAC do Shopify e cria o pedido no Bling via `src/lib/bling/orders.server.ts`.
- Requer `SHOPIFY_WEBHOOK_SECRET` configurado.

## Diagnóstico de falhas

### `401` no Bling
1. Tentar refresh automático do token.
2. Se persistir, limpar tokens (`bling_tokens.delete().eq("id", true)`) e pedir reconexão em `/admin/bling`.

### Pedido Shopify não aparece no Bling
1. Verificar se webhook `orders/create` está ativo no Shopify.
2. Verificar logs em `bling_sync_log` ou `bling_orders_log`.
3. Verificar se token Bling tem escopo de Vendas.
4. Verificar se `SHOPIFY_WEBHOOK_SECRET` está correto.

### Caminho no Bling para ver pedido
**Menu lateral → Vendas → Pedidos de Venda**.

## Variáveis de ambiente
- `BLING_CLIENT_ID`
- `BLING_CLIENT_SECRET`
- `BLING_OAUTH_STATE_SECRET`
- `BLING_ADMIN_TOKEN`
- `SUPABASE_PUBLISHABLE_KEY` (para cron)
- `SHOPIFY_WEBHOOK_SECRET`

## O que nunca fazer
- Expor `BLING_CLIENT_SECRET`, tokens de acesso ou refresh em logs ou cliente.
- Chamar API Bling diretamente do navegador.
- Ignorar `insufficient_scope` — sempre reconectar com escopos completos.

## Validação
- Após reconectar, chamar `/api/public/bling/sync` manualmente e verificar `bling_sync_log`.
- Fazer um pedido de teste no Shopify e confirmar aparecimento no Bling em até alguns minutos.
