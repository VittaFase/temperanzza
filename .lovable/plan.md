## Plano

### Objetivo
Atualizar o catálogo com o **lote final completo** de PNGs em produção, mantendo a vitrine clara e sofisticada já definida, usando estes novos arquivos como versões definitivas quando o restante chegar.

### O que farei quando o lote estiver completo
1. **Conferir e mapear os arquivos finais**
   - Identificar cada PNG pelo SKU/handle Shopify.
   - Confirmar duplicatas e escolher apenas a versão final de cada produto.
   - Incluir os 4 novos já enviados como definitivos:
     - `chimi-churri-picante`
     - `du-chefe-com-paprica`
     - `curcuma`
     - `chimi-churri-sem-pimenta`

2. **Substituir os assets do catálogo**
   - Reenviar os PNGs finais para os pointers já usados em `src/assets/*.png.asset.json`.
   - Manter o mapeamento de `src/lib/productImages.ts` funcionando sem alterar a estrutura do catálogo.

3. **Validar consistência visual**
   - Garantir que os potes fiquem com recorte limpo e escala consistente.
   - Verificar o comportamento nas vitrines claras (`ProductCard`) e nas PDPs.
   - Ajustar apenas se algum novo PNG exigir correção fina de sombra, escala ou enquadramento.

4. **Fechar o lote inteiro de uma vez**
   - Aplicar tudo num único passe para evitar catálogo misturado com imagens antigas e novas.

### Fora de escopo
- Mudar layout além de pequenos ajustes necessários ao novo recorte.
- Trocar tipografia, header, footer, checkout ou estrutura de navegação.
- Publicar antes da revisão final do lote completo.

### Detalhes técnicos
- Os novos PNGs recebidos agora serão tratados como **versões finais de produção**.
- A atualização será feita preservando os mesmos handles e o fluxo atual de imagens locais sobrescrevendo as da Shopify.
- Se algum arquivo vier com recorte inconsistente, eu normalizo antes do upload para manter o mesmo padrão visual.

Assim que você enviar o restante, executo a substituição completa em um único lote.