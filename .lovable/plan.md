## Resumo
Atualizar o secret `BLING_ADMIN_TOKEN` do projeto para a nova senha fornecida pelo usuário (`Senh@1202`).

## Motivação
O usuário precisa trocar a senha de acesso à página de administração da integração Bling (`/admin/bling`).

## Escopo técnico
- Chamar `secrets--update_secret` para `BLING_ADMIN_TOKEN`.
- O valor será fornecido pelo usuário no formulário seguro.
- Nenhuma alteração de código é necessária — a página `admin.bling.tsx` já lê o token do ambiente.

## Após aprovação
1. Abrir formulário seguro para atualizar `BLING_ADMIN_TOKEN`.
2. Confirmar ao usuário que a nova senha está ativa e explicar como acessar a página de admin com a nova senha.

## Observação de segurança
- A senha atual não será exposta em momento algum.
- A nova senha será digitada apenas no formulário seguro, fora do chat.