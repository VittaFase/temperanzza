## Objetivo

Conectar o Bling ao site Temperanzza pra:
1. **Bling é fonte da verdade** de produtos e estoque → sincroniza pra Shopify automaticamente
2. **Pedido novo na Shopify** → cria pedido no Bling → emite NF-e automática

## Como vai funcionar (visão do usuário)

- Novo item no menu admin: **"Integrações → Bling"**
- Botão **"Conectar ao Bling"** → abre tela do Bling pra autorizar → volta conectado
- Painel mostra: status da conexão, último sync, botão **"Sincronizar agora"**, botão **"Desconectar"**
- Log das últimas sincronizações (produto X atualizado, pedido Y enviado, NF Z emitida)
- Sync automático a cada 15 minutos (produtos/estoque Bling → Shopify)
- Cada pedido novo da Shopify dispara na hora: cria no Bling + emite NF-e

## Etapas técnicas

### 1. Banco de dados (1 migration)
Tabelas novas:
- `bling_tokens` — guarda access_token, refresh_token, expira_em (1 linha só)
- `bling_sync_log` — histórico de sincronizações (tipo, status, mensagem, timestamp)
- `bling_product_map` — liga SKU do Bling ↔ variant_id da Shopify (pra saber qual produto atualizar)
- `bling_order_map` — liga pedido Shopify ↔ pedido Bling ↔ NF-e (evita duplicar)

Todas com RLS: só admin lê/escreve.

### 2. Rotas OAuth (2 arquivos)
- `src/routes/api/public/bling/connect.ts` — redireciona pro Bling pedir autorização
- `src/routes/api/public/bling/callback.ts` — recebe o `code`, troca por token, salva no banco

### 3. Cliente Bling + helpers (server-only)
- `src/lib/bling/client.server.ts` — wrapper de fetch com auto-refresh de token
- `src/lib/bling/products.server.ts` — listar produtos e estoques do Bling
- `src/lib/bling/orders.server.ts` — criar pedido de venda + emitir NF-e
- `src/lib/shopify/admin.server.ts` — client Admin API pra atualizar produto/estoque/preço

### 4. Server functions (chamadas pelo admin)
- `syncBlingToShopify` — puxa produtos do Bling, atualiza Shopify (título, preço, estoque)
- `getBlingStatus` — retorna status da conexão + últimos logs
- `disconnectBling` — apaga tokens

### 5. Webhook de pedidos Shopify → Bling
- `src/routes/api/public/shopify/order-created.ts` — recebe webhook `orders/create` da Shopify, cria pedido no Bling, emite NF-e, salva mapeamento
- Configuração do webhook no Shopify Admin (te passo o link pra colar)

### 6. Cron de sync automático (15 min)
- Rota `src/routes/api/public/bling/cron-sync.ts` protegida por token secreto
- Configurar pg_cron no banco pra chamar a cada 15 min

### 7. UI Admin
- Nova página `/admin/bling` (protegida por role `admin`)
- Card de status + botões conectar/sync/desconectar + tabela de logs

## O que fica pra depois (não faz parte agora)

- Sync de clientes (só cria o cliente do pedido quando ele chega)
- Sync de categorias (usa categoria default no Bling)
- Envio de tracking code da NF-e de volta pra Shopify (posso adicionar depois se quiser)

## O que vou precisar de ti depois de implementar

1. Clicar "Conectar ao Bling" no admin e autorizar
2. Confirmar que teus produtos no Bling têm **SKU** batendo com o SKU dos variants na Shopify (é a chave de ligação)
3. Configurar o webhook `orders/create` no Shopify Admin (te passo o passo-a-passo)
4. Confirmar dados fiscais no Bling (CFOP, NCM, natureza da operação) — a emissão de NF-e depende disso tá certo lá

## Escopo/tempo

~10 arquivos novos, 1 migration. Tudo automático depois de conectar.

Aprova pra eu começar?
