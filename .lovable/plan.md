## Plano: guardar Client ID e Secret do Bling com segurança

Já temos toda a integração Bling implementada no código (rotas OAuth, cliente API, painel admin, sync, webhook). Só falta guardar as duas credenciais que tu vais gerar no Bling.

## O que vou fazer ao aprovares

Abrir o **formulário seguro do Lovable** pra tu colares os valores. Esses valores viram variáveis de ambiente criptografadas — ficam disponíveis só no servidor (nunca no navegador, nunca no código-fonte, nunca no chat).

Vou pedir 3 secrets ao mesmo tempo:

1. **`BLING_CLIENT_ID`** — o Client ID que o Bling te mostra na tela do app
2. **`BLING_CLIENT_SECRET`** — o Client Secret (aquele que só aparece 1 vez)
3. **`BLING_ADMIN_TOKEN`** — senha que só tu vais saber pra acessar `/admin/bling` no site (podes inventar qualquer texto forte, ex: `temperanzza-admin-2026-xK9mP`)

## Como funciona o formulário seguro

- Aparece uma caixa no chat com 3 campos
- Colas os valores e clicas em salvar
- Eu **nunca** vejo os valores em texto — só sei que foram salvos
- Ficam guardados no backend do projeto (Lovable Cloud)

## Depois de guardar

1. Tu abres: `https://temperanzza.com.br/admin/bling?key=SEU_ADMIN_TOKEN`
2. Clica em **"Conectar ao Bling"** → autoriza na tela do Bling → volta conectado
3. Testamos sincronizar produtos

## Importante antes de aprovares

**Já criaste o app no Bling e tens as duas chaves em mãos?**
- Se **sim** → aprova o plano que eu abro o formulário
- Se **não** → volta pro Bling, cria o app primeiro (redirect URI: `https://temperanzza.com.br/api/public/bling/callback`), copia Client ID + Secret, e depois aprova
