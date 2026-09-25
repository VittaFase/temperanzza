# Sincronização MASTER-MAX e publicação

## Objetivo
Entregar o site usando exclusivamente os 15 potes MASTER-MAX e as 44 receitas novas, sem referências legadas, com `/receitas` redirecionando permanentemente para `/cozinha`, Preview validado e publicação concluída.

## Correções e implementação
1. **Sanear a fonte MASTER-MAX**
   - Remover de `database/seed-data.json` os comandos Git anexados depois do fechamento do JSON.
   - Preservar exatamente 15 potes e 44 receitas.
   - Validar os vínculos de cada receita com um dos 15 potes.
   - Corrigir somente inconsistências evidentes de identificação que impedem o vínculo, como aliases de handles e grafias técnicas.

2. **Unificar o catálogo ativo**
   - Completar `POTES_MASTER_MAX` com os 15 potes confirmados.
   - Restringir a elegibilidade do rebrand aos 15 handles canônicos e seus aliases válidos, em vez de aceitar qualquer produto não excluído.
   - Remover das superfícies ativas referências a produtos fora da lista MASTER-MAX, incluindo Canela, Pimenta-do-reino, Cebola em pó e Du Chefe.
   - Preservar Shopify como fonte comercial de preço, disponibilidade, variantes e carrinho; o filtro MASTER-MAX decidirá quais produtos podem aparecer.

3. **Atualizar a Biblioteca Gastronômica**
   - Substituir a coleção ativa de receitas pelas 44 receitas do seed.
   - Manter a distribuição exata: Café da Manhã 6, Almoço 17, Jantar 10 e Lanche 11.
   - Adaptar os dados ao formato usado pela Biblioteca e pelas páginas individuais.
   - Usar as imagens disponíveis quando houver correspondência; quando o seed apontar para imagem inexistente, aplicar um fallback visual seguro sem quebrar a página.
   - Garantir que todas as receitas usem somente os 15 condimentos MASTER-MAX.

4. **Compatibilizar as páginas solicitadas**
   - `/produtos`: exibir somente os produtos MASTER-MAX encontrados na Shopify, sem itens legados.
   - `/cozinha`: exibir exatamente as 44 receitas novas e os filtros por refeição.
   - `/receitas`: criar redirecionamento permanente para `/cozinha`, conforme definido.
   - `/sua-caixa`: oferecer somente os sabores MASTER-MAX elegíveis para a caixa, mantendo a regra de exatamente 12 potes, repetições permitidas e cupom BLENDS10.
   - Atualizar home, destaques e componentes derivados para não reintroduzirem dados antigos.

5. **Resolver o erro reportado**
   - Confirmar novamente que `src/hooks/use-mobile.tsx` não contém o texto anexado ao erro.
   - Executar a checagem TypeScript após as alterações; tratar qualquer erro real pela origem, sem modificar o hook quando ele estiver correto.

## Validação antes da publicação
- Validar mecanicamente o JSON, as contagens 15/44 e a distribuição 6/17/10/11.
- Procurar referências legadas em todas as superfícies de catálogo, receitas e caixa.
- Executar a checagem TypeScript e aguardar o Build indicar sucesso.
- Testar no Preview, em desktop e celular: `/produtos`, `/receitas`, `/cozinha`, uma receita individual, `/sua-caixa` e o montador.
- Confirmar ausência de tela branca, erros de execução, links quebrados e falhas de carregamento.
- Confirmar visualmente as contagens e que nenhum produto antigo aparece.

## Publicação
- Publicar somente depois de todas as validações passarem.
- Após publicar, abrir o endereço público e repetir as verificações essenciais nas três áreas.
- Se a Shopify não retornar algum dos 15 produtos ou o cupom BLENDS10 estiver indisponível, não inventar dados comerciais: registrar o bloqueio exato antes da publicação.

## Limites e segurança
- Não trocar credenciais nem editar `.env`.
- Não migrar ou apagar dados do backend externo automaticamente.
- Não alterar preços, estoque, variantes ou produtos na Shopify.
- Não recriar imagens.
- Não executar comandos Git de commit, push, merge ou sincronização manual; o projeto já usa a sincronização gerenciada do Lovable com GitHub.
