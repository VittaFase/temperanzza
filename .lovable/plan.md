# Alinhar a lista de episódios ao pote e ao halo

## Situação atual (medida na tela)

Na seção "Escolha sua sessão" (`/temperaflix`), a composição está desalinhada verticalmente:

- Centro do halo de cor: ~290px (topo da cena)
- Centro do pote ativo: ~240px (subiu para `y: -420`)
- Centro do grupo 01/02/03: ~553px (bem abaixo)

Diferença de cerca de 290px entre a lista lateral e o produto.

```text
antes                          depois
┌──────────────┬──────────┐    ┌──────────────┬──────────┐
│   halo/pote  │          │    │   halo/pote  │  01 ───  │
│      ▓       │          │    │      ▓       │  02 ───  │
│              │  01 ───  │    │              │  03 ───  │
│              │  02 ───  │    │              │          │
│   (baú)      │  03 ───  │    │   (baú)      │          │
└──────────────┴──────────┘    └──────────────┴──────────┘
```

## Abordagem

Subir 290px só a lista deixaria o bloco invadindo o título da seção. Então o alinhamento é feito pelos dois lados, encontrando um centro comum em torno de 400px:

1. **Lista de episódios sobe ~150px** (apenas no desktop, `lg`), mantendo-se abaixo do título "Escolha sua sessão".
2. **Pote desce um pouco**, de `y: -420` para `y: -260`, ficando na altura do centro do grupo 01/02/03.
3. **Halo de cor e tela de cinema 16:9 acompanham** o novo centro do pote, mantendo o produto exatamente dentro da projeção.
4. **Sombra de origem no baú recalibrada** para continuar ancorada na mesa, agora com o novo deslocamento.

No mobile e tablet nada muda: a lista continua empilhada abaixo do palco.

## Detalhes técnicos

Arquivo: `src/routes/temperaflix.tsx` (seção `#episodios`).

- Coluna da playlist (`lg:col-span-5`): adicionar deslocamento vertical apenas em desktop (`lg:-translate-y-[150px]`), preservando `border-y` e `divide-y`.
- `motion.div` do pote ativo: `y: -420` → `y: -260`.
- Sombra de origem: `y: 560` → `y: 400`.
- Halo (`blur-[120px]`): `top: -15%` → `top: 1%`.
- Tela de cinema 16:9: `top: 18%` → `top: 28%`.
- `StudioLightRig`: foco do spotlight ajustado para acompanhar o novo centro.

A seção Temperaflix da Home (`TemperaflixShowcase.tsx`) não é alterada nesta etapa.

## Verificação

Medir na pré-visualização os centros do pote, do halo e do grupo 01/02/03 e confirmar que ficam alinhados (diferença menor que ~20px), além de checar que nada é cortado no desktop e que o mobile segue intacto.
