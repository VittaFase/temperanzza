Remover o fundo preto do quadrado do hero e deixar o selo transparente ocupando o mesmo espaço do quadro, flutuando sobre o fundo da página.

Alterações em `src/routes/index.tsx`:
- Remover `bg-brand-ink` do container do selo.
- Remover/adaptar os overlays de iluminação radial e vinheta que só faziam sentido sobre o fundo escuro.
- Aumentar o selo para ocupar o tamanho total do quadro (aproveitar o espaço do `aspect-square` sem a moldura preta).
- Trocar as cores dos micro-rótulos de `text-brand-paper/40` para uma cor legível sobre o fundo claro da página (ex.: `text-foreground/40`).
- Manter o badge "19 referências" e a responsividade atual.

Resultado esperado: o selo transparente vira o elemento principal do quadrado, sem fundo preto, com a mesma presença sólida e efeito de relevo metálico já aplicado.