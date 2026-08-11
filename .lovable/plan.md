# Plano de Implementação: Base Cinematográfica para Potes Temperaflix

O objetivo é transformar a base de apresentação dos potes Temperaflix em um elemento intencional e natural, como se estivessem sobre uma caixa de estúdio (apple box) que serve de pedestal, reforçando a estética de "cenário de gravação" e destacando os produtos como estrelas.

## Alterações Visuais

1.  **Criação da Base (Caixa de Estúdio)**:
    *   Implementar um elemento visual que simule uma caixa de madeira escura ou plataforma metálica industrial na base de cada pote.
    *   A caixa terá perspectiva 3D, sombras de oclusão realistas e luz de borda (rim light) sincronizada com o sabor ativo.

2.  **Harmonização com o Cenário**:
    *   Ajustar o "piso" do palco para que a caixa pareça estar firmemente apoiada nele.
    *   Melhorar a sombra de contato entre o pote e a caixa para evitar o efeito de "flutuação".

3.  **Composição "Estrela"**:
    *   Ajustar a escala e posição dos potes para que a caixa seja a base natural, elevando o produto na hierarquia visual.
    *   Adicionar efeitos de reflexo na base da caixa para simular materiais premium.

## Detalhes Técnicos

### `src/routes/temperaflix.tsx` (Seção de Episódios)
*   Substituir o gradiente de pedestal atual por uma estrutura JSX que represente a caixa.
*   Utilizar `motion.div` para animar a iluminação da caixa conforme o sabor troca.

### `src/components/site/TemperaflixShowcase.tsx` (Seção da Home)
*   Aplicar a mesma lógica de base para manter a consistência visual em toda a plataforma.
*   Ajustar os `staggered layout` para que as caixas se alinhem de forma harmoniosa.

---

Este ajuste resolverá o problema de percepção de "fora da base" e elevará a experiência de marca para um nível cinematográfico profissional.
