# Restaurar build e Preview

## Objetivo
Eliminar os erros que impedem a compilação e devolver o Preview funcional, preservando as regras atuais de catálogo, imagens oficiais e integração comercial.

## Implementação
- Restaurar em `rebrandCatalog.ts` os cinco contratos consumidos pelo site: normalização de handles, elegibilidade, exclusões e ordenação da seleção da página inicial.
- Basear a elegibilidade no Asset Lock vigente: aceitar os produtos confirmados e aliases técnicos; impedir que `cebola-em-po` e SKUs antigos excluídos reapareçam nas superfícies do rebrand.
- Corrigir os erros TypeScript correlatos na receita, no produto e no middleware de autenticação sem alterar a conexão do backend.
- Confirmar que `use-mobile.tsx` não contém texto corrompido e preservar seu comportamento atual.

## Validação
- Executar a checagem TypeScript e resolver todos os erros reportados.
- Verificar no Preview a página inicial, catálogo, produto, cozinha e “Sua caixa”, observando erros de runtime e respostas HTTP.
- Confirmar que a aplicação está tecnicamente pronta para publicação; a publicação em si só será feita mediante pedido explícito.

## Limites
- Não alterar credenciais, `.env`, banco de dados, preços, estoque ou produtos da Shopify.
- Não recriar imagens nem mudar a identidade visual.
