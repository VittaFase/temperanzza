Diagnóstico atual das integrações

1. Shopify — Loja conectada, mas token admin expirado
   - Loja: temperanzza-spice-emporium-dy1i0.myshopify.com (claimed).
   - Storefront API (vitrine e checkout no site) está funcionando.
   - Admin API (usada pelo sync Bling → Shopify) está retornando 401: "Invalid API key or access token".
   - Resultado: o último sync de produtos falhou em 19/19 SKUs.

2. Bling — OAuth conectado, mas token expirado
   - Token salvo em `bling_tokens`, mas expirou em 2026-07-09.
   - Refresh automático não manteve o token válido.
   - Último sync: 0/0 atualizados, 19 erros, todos por falha no Shopify Admin.
   - Nenhum pedido Shopify → Bling foi processado até agora.

3. Webhook Shopify → Bling
   - Rota `/api/public/shopify/order-webhook` implementada e assinada com HMAC.
   - Depende do Shopify admin token e do Bling token — ambos precisam estar válidos para criar pedidos e emitir NFe.

4. GitHub
   - Sync bidirecional com VittaFase/temperanzza.git já está ativo (commits recentes confirmam).

Plano de correção

A. Reconectar Shopify
   - Usar `shopify--connect_shopify_account` para renovar o online/admin token.
   - Isso restaura a Admin API e permite que o sync Bling atualize preços e estoque.

B. Reconectar Bling
   - O token atual expirou. Precisamos refazer o OAuth em `/admin/bling` para gerar novo access/refresh token.
   - Isso garante que pedidos do Shopify possam ser criados no Bling automaticamente.

C. Testar sync Bling → Shopify
   - Após ambos conectados, executar o sync manual em `/admin/bling`.
   - Verificar se os 19 SKUs foram mapeados e se preços/estoque foram atualizados.

D. Verificar webhook Shopify → Bling
   - Confirmar se o webhook de "orders/create" ainda está configurado no admin Shopify apontando para `https://temperanzza.com.br/api/public/shopify/order-webhook`.
   - Se necessário, reconfigurar após a reconexão.

E. Testar fluxo de pedido completo
   - Simular um pedido de teste para confirmar que:
     a) Carrinho Shopify gera checkoutUrl;
     b) Pedido pago dispara webhook;
     c) Pedido e NFe são criados no Bling.

Observação importante: o Shopify admin token usado pelo sync é o mesmo que precisa ser renovado. A reconexão da conta Shopify é o passo crítico — sem ela, nem preços, nem estoque, nem pedidos fluem corretamente.

Quer que eu execute esse plano agora?