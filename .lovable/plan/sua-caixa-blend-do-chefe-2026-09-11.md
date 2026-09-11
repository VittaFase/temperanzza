# Sua caixa — Blend do Chefe

## Proposta
Substituir a apresentação dos seis blends prontos por uma única experiência: o cliente monta sua caixa autoral com **exatamente 12 potes**, repetindo os sabores que quiser entre os disponíveis. Ao completar a caixa, recebe **10% de desconto no fechamento da compra**, com o cupom **BLENDS10**.

## Apresentação
- Menu: **Sua caixa** no lugar de Blends.
- Título principal: **Monte sua caixa**.
- Identidade da opção autoral: **Blend do Chefe · Sua caixa autoral**.
- Frase: **A sua caixa, o seu blend, o seu gosto.**
- Descrição: **Aqui você é o chefe da casa. Monte sua própria caixa com 12 potes à sua escolha entre os sabores da casa.**
- Observação: **Complete sua caixa com 12 potes e ganhe 10% de desconto no fechamento da compra com o cupom BLENDS10.**
- Botão: **Montar sua caixa**.
- Manter a imagem atual da caixa do chefe, a identidade visual e os sabores disponíveis. Rebranding da logo e adaptação ao site de referência ficam fora desta etapa.

## Retirada dos seis blends
Remover Brasil, Churrasco, Essenza, Gourmet, Supremo e Temperaflix da apresentação, das configurações de kits e das páginas de compra correspondentes. Remover também o botão “Ver os 6 blends” e referências promocionais a essas seis caixas.

**Preservar todos os temperos individuais**, inclusive a linha Temperaflix, seus estoques, receitas e integrações. Outras ofertas, como o combo de três Temperaflix e o Duo Premium Black, não fazem parte desta exclusão.

## Estrutura e segurança da mudança
A leitura do código confirmou que os kits são composições de produtos individuais: os seis registros têm `shopifyHandle: null`. O montador já limita a seleção a 12 potes e permite repetições. Isso permite reaproveitar a estrutura, sem reconstruir a compra.

Não é possível garantir ausência de quebras só pela análise: os pontos principais a validar são links antigos, referências aos kits e aplicação efetiva do desconto. O código encaminha BLENDS10 ao fechamento da compra; a configuração vigente do cupom na Shopify ainda precisa ser conferida.

### Detalhes técnicos
1. Usar `/sua-caixa` para a apresentação e `/sua-caixa/chefe` para o montador, reaproveitando os componentes existentes.
2. Redirecionar permanentemente `/blends`, `/blends/chefe` e as seis URLs antigas para a experiência correspondente. Os kits retirados levam à apresentação da caixa autoral, não a páginas quebradas.
3. Atualizar menu, rodapé, ofertas que levam ao montador, links internos, títulos, descrições, canonical e sitemap.
4. Remover configurações e lógica exclusivas dos kits curados; preservar o montador, preços e integração do carrinho usados pela caixa autoral.
5. Conferir registros remotos antes de qualquer exclusão. Só retirar eventuais registros exclusivos dos seis kits, caso existam; não excluir produtos individuais nem históricos de pedidos. O código não comprova a existência de cadastros remotos exclusivos.
6. Conferir BLENDS10 na Shopify e testar 10% com a caixa completa. Não alterar regras globais de descontos ou acumulação sem necessidade comprovada.

## Validação
- Montar uma caixa com sabores repetidos até totalizar 12 potes.
- Confirmar que menos de 12 não permite concluir a caixa e que não é possível adicionar um 13º pote ao montador.
- Conferir quantidades, preços e desconto no fechamento da compra, sem concluir um pedido real.
- Verificar menus, links antigos e ausência dos seis kits na navegação e no sitemap.
- Conferir apresentação no celular, tablet e computador.

## Esforço
Mudança concentrada na apresentação, configurações dos kits e navegação, reaproveitando o montador existente. Não exige uma nova estrutura de compra; o consumo exato de créditos não pode ser garantido antecipadamente.
