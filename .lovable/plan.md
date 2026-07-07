# Bíblia da Integração Temperanzza
**Dashboard × Shopify × Bling — Documento-mestre estrutural**

---

## Parte 1 — Arquitetura conceitual (os três papéis)

```text
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│  TEMPERANZZA DASHBOARD  │    │        SHOPIFY          │    │          BLING          │
│  (cérebro estratégico)  │───▶│    (vitrine + check.)   │───▶│  (cérebro fiscal/ERP)   │
│                         │    │                         │    │                         │
│ • SKUs, fichas, imagens │    │ • Catálogo público      │    │ • NF-e / NFC-e          │
│ • Custos e markup       │    │ • Carrinho + checkout   │    │ • Estoque físico real   │
│ • Regras de preço       │    │ • Preço final calculado │    │ • Contas / financeiro   │
│ • Descontos estratégicos│◀───│ • Webhooks de pedido    │◀───│ • Cadastro de clientes  │
│ • Histórico + auditoria │    │                         │    │ • Faturamento / relat.  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
         │                                                              ▲
         └──────────────── Dashboard LÊ Bling para KPIs fiscais ────────┘
```

### 1.1 — Dashboard Temperanzza (fonte da verdade estratégica)
- **É dono de:** ficha técnica dos 19 SKUs, imagens, custo unitário, regras de markup por sublinha (Core/Premium/Temperaflix), campanhas de desconto, histórico de mudanças de preço.
- **Autoridade:** qualquer alteração de custo ou markup aqui **reprograma automaticamente** o preço da Shopify via Admin API.
- **Nunca duplica dados que já vivem em outro lugar** — pedidos vêm da Shopify, estoque físico e nota fiscal vêm do Bling.

### 1.2 — Shopify (vitrine alimentada)
- **É dono de:** exibição pública, carrinho, checkout, meio de pagamento, webhook de pedido criado.
- **Recebe do Dashboard:** título, descrição, imagens, variantes, preço final, `compare_at_price` (preço "de/por" em campanhas).
- **Não decide preço** — apenas exibe o que o Dashboard mandou.
- **Falta de dado:** se algo que a Shopify precisa não existir ainda no Dashboard (ex: SEO description, peso para frete, código de barras), o Dashboard sinaliza no painel "Pendências de Catálogo" para o admin completar antes do próximo push.

### 1.3 — Bling (cérebro fiscal e operacional)
- **É dono de:** emissão de NF-e/NFC-e, estoque físico real (chão de fábrica), contas a pagar/receber, cadastro fiscal do cliente (CPF/CNPJ), relatórios contábeis.
- **Recebe da Shopify** (via webhook `orders/create` roteado pelo Dashboard): pedido → gera NF-e automaticamente.
- **Devolve ao Dashboard:** status fiscal do pedido, saldo de estoque físico, faturamento realizado, inadimplência.
- **Custo de matéria-prima:** hoje o Bling não empurra custo pra Shopify; o Dashboard exibe o custo lançado no Bling (leitura) e permite override manual para simulação de markup.

---

## Parte 2 — Fluxos operacionais (quem faz o quê)

### 2.1 — Fluxo de mudança de markup (o mais estratégico)
```text
Admin edita markup Core de 2.5× → 2.8× no Dashboard
        │
        ▼
Dashboard calcula novos preços dos 13 SKUs Core
        │
        ▼
Preview obrigatório: "13 SKUs afetados, receita estimada +R$X"
        │
        ▼  admin confirma
Server function → productVariantsBulkUpdate (Shopify Admin API)
        │
        ▼
Shopify atualiza preços na vitrine (imediato)
        │
        ▼
Webhook products/update → Dashboard replica preço no Bling (registro fiscal)
        │
        ▼
pricing_history registra: quem, quando, de/para, motivo, SKUs afetados
```

### 2.2 — Fluxo de venda
```text
Cliente compra na Shopify → webhook orders/create → /api/public/shopify-webhook (HMAC)
        │
        ├──▶ Bling: cria pedido de venda + emite NF-e + baixa estoque físico
        │
        └──▶ Dashboard: registra em sync_status (idempotente)
                │
                ▼
        Painel "Pedidos" no Dashboard mostra: pedido Shopify + status NF-e (Bling)
```

### 2.3 — Fluxo de custo/estoque (Bling → Dashboard)
```text
Compra de matéria-prima lançada no Bling
        │
        ▼
Job diário puxa custos atualizados via API Bling v3
        │
        ▼
Dashboard mostra custo atual + margem real por SKU
        │
        ▼
Alerta se margem caiu abaixo do mínimo definido na regra
```

---

## Parte 3 — Decisão sobre "Pedidos e Relatórios" no Dashboard

**Recomendação:** Dashboard **exibe** (não opera). Bling é a fonte única para tudo fiscal/financeiro.

| Área no Dashboard        | Fonte de dados        | Dashboard pode editar? |
|--------------------------|-----------------------|------------------------|
| Pedidos (últimos 30d)    | Shopify Admin API     | Não (só visualiza)     |
| Status NF-e do pedido    | Bling API v3          | Não (só visualiza)     |
| Faturamento realizado    | Bling (fiscal)        | Não                    |
| Faturamento bruto Shopify| Shopify               | Não                    |
| Estoque físico           | Bling                 | Não                    |
| Clientes (CRM básico)    | Shopify + Bling merge | Não                    |
| Preço / markup / desconto| Dashboard             | **SIM** (autoridade)   |
| Custo por SKU            | Bling (leitura) + override manual | Override sim |

**Por que assim:** duplicar operação de pedido/NF-e cria divergência fiscal. O Bling já é homologado pela Receita — o Dashboard vira o "painel de controle executivo" que consolida as duas fontes.

---

## Parte 4 — Passo a passo de implementação (do zero ao final)

### FASE 0 — Preparação (sem código, 1 dia)
- [ ] Confirmar credenciais Bling API v3 (client_id, client_secret OAuth2)
- [ ] Confirmar escopos do token Shopify Admin: `write_products`, `read_orders`, `read_inventory`, `write_price_rules`
- [ ] Auditar os 19 SKUs no Dashboard: garantir que todos têm imagem, ficha, custo estimado

### FASE 1 — Fundação do cérebro de preços (Sprint 1, ~5 dias)
**Objetivo:** Dashboard passa a controlar preço da Shopify.

1. **Migration 1** — tabelas:
   - `product_costs` (sku, custo_unitario, fonte, updated_at)
   - `pricing_rules` (id, nome, sublinha, markup_multiplier, ativo, created_by)
   - `pricing_history` (id, rule_id, sku, preco_anterior, preco_novo, aplicado_por, aplicado_em, revertido)
   - Todas RLS `admin only` via `has_role`
2. **Server functions** (`src/lib/pricing.functions.ts`):
   - `getPricingSnapshot()` — lê estado atual (custo + markup + preço Shopify)
   - `previewPriceChanges(ruleId)` — calcula sem gravar
   - `applyPricingRule(ruleId)` — chama `productVariantsBulkUpdate` + grava history
   - `revertToHistory(historyId)` — desfaz aplicação
3. **UI nova** em `/dashboard/precos`:
   - Tabela editável filtrada por sublinha
   - Modal de preview obrigatório (mostra delta por SKU)
   - Histórico com botão "reverter"
4. **Verificação:** editar markup Premium → conferir preço mudou na vitrine pública em <30s.

### FASE 2 — Webhook Shopify → Bling (Sprint 2, ~5 dias)
**Objetivo:** venda gera NF-e automaticamente.

1. **Secret:** `BLING_ACCESS_TOKEN` (via add_secret após usuário confirmar)
2. **Server route** `/api/public/shopify-webhook`:
   - Valida HMAC do header `X-Shopify-Hmac-Sha256` (timing-safe)
   - Roteia por tópico: `orders/create` → cria pedido no Bling
   - Idempotente (grava `shopify_order_id` em `sync_status`, ignora duplicatas)
3. **Server functions de leitura Bling:**
   - `getBlingOrderStatus(orderId)` — status NF-e
   - `getBlingInventory()` — estoque físico
   - `getBlingFinancials()` — faturamento realizado
4. **UI:** enriquecer `/dashboard` com coluna "NF-e" na tabela de pedidos + KPI "Faturamento fiscal (Bling) vs bruto (Shopify)".
5. **Verificação:** pedido de teste na Shopify → NF-e emitida no Bling → status visível no Dashboard.

### FASE 3 — Sincronização de custos e alertas (Sprint 3, ~3 dias)
1. Job diário (cron via `/api/public/cron-sync-costs`) puxa custos Bling → atualiza `product_costs`
2. Alerta no Dashboard: "Margem do SKU X caiu de 62% para 48% (custo subiu 15%)"
3. Job diário compara preço Shopify vs preço calculado pelo Dashboard → alerta se alguém editou direto na Shopify

### FASE 4 — Consolidação de relatórios (Sprint 4, ~3 dias)
1. Dashboard consolida em telas únicas:
   - **Vendas:** Shopify (bruto) + Bling (líquido fiscal)
   - **Clientes:** merge Shopify (email/pedidos) + Bling (CPF/NF)
   - **Estratégia:** simulador "se eu aumentar markup Core em X%, receita muda Y%"
2. Export CSV/PDF dos relatórios

---

## Parte 5 — Garantias de robustez

| Risco                              | Mitigação                                                  |
|------------------------------------|------------------------------------------------------------|
| Preço errado aplicado em massa     | Preview obrigatório + history + revert em 1 clique         |
| Webhook Shopify falha              | Fila idempotente + retry exponencial + alerta admin        |
| Bling fora do ar                   | Pedido fica em `sync_status=pending`, retry a cada 5min    |
| Edição direta na Shopify           | Job diário detecta divergência e alerta                    |
| Token Shopify exposto              | Nunca sai do backend (já garantido em `shopifyAdmin.functions.ts`) |
| Duplicação de NF-e                 | Idempotência por `shopify_order_id`                        |
| Quebra da estrutura existente      | Todas as adições são **aditivas** — nada é reescrito       |

**Nada que já existe é quebrado:** `blendPricing.ts`, `useShopifyPrices.ts`, Storefront API, `user_roles`, autenticação — tudo permanece. Só somamos camadas.

---

## Parte 6 — Pendências que precisam de você antes da Fase 2
1. Credenciais Bling API v3 (quando chegar a Fase 2)
2. Confirmação: quer manter Shopify como único checkout, ou avaliar checkout próprio no futuro? (não bloqueia agora)
3. Definição das regras de markup iniciais por sublinha (posso sugerir na Fase 1 baseado no que já está na Shopify)

---

**Próximo passo se aprovar:** começo a Fase 1 (migrations + server functions + UI `/dashboard/precos`).
