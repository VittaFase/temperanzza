# Plano: Restauração da Home e do Componente SiteHero

O componente `SiteHero` é referenciado na página inicial (`src/routes/index.tsx`), mas o arquivo correspondente não foi encontrado no sistema de arquivos. Isso está causando um erro de build/transformação que impede o carregamento da Home. Como este projeto foca em uma estética industrial de casa de temperos mineira, vou recriar um Hero premium que utilize os ativos de vídeo e imagem disponíveis.

## Análise do Erro
- **Origem**: `src/routes/index.tsx` tenta importar `SiteHero` de `@/components/site/SiteHero`, mas o arquivo não existe.
- **Solução**: Recriar o componente `SiteHero.tsx` com uma implementação robusta que siga a identidade visual da marca (fontes Big Shoulders Stencil, cores oklch e fundo de papel com grão).

## Ações Propostas

### 1. Recriar SiteHero.tsx
Vou implementar um componente Hero premium que inclua:
- **Vídeo de fundo**: Utilizando o asset `hero-smoke.mp4` ou `hero-bokeh.mp4` para profundidade visual.
- **Tipografia**: Uso da fonte `Big Shoulders Stencil` para o título principal ("A ESSÊNCIA DO TEMPERO MINEIRO").
- **CTA**: Botão estilizado para "Explorar Sabores" ou "Ver Catálogo".
- **Selo da Marca**: Integração do `BrandSeal` para reforçar a autenticidade.

### 2. Verificar Ativos de Vídeo
Confirmar se os ponteiros `.asset.json` para os vídeos do Hero estão operacionais.

### 3. Ajustes de SEO e Acessibilidade
- Garantir que o `SiteHero` utilize um `H1` semântico.
- Adicionar `aria-hidden` ao vídeo de fundo para não interferir com leitores de tela.

## Detalhes Técnicos
- **Localização**: `src/components/site/SiteHero.tsx`
- **Dependências**: Lucide React para ícones, assets de vídeo e imagem do projeto.
- **Estilização**: Tailwind CSS v4 com os tokens semânticos da Temperanzza (`brand-paper`, `brand-ink`, `brand-red`).
