# Plano: GitHub Sync — Projeto Temperanzza → VittaFase/Site-Temperanzza-Spice-Emporium

## Objetivo
Conectar o projeto Lovable atual (Temperanzza Spice Emporium) ao repositório GitHub já criado e enviar todo o código/estrutura atual para ele, habilitando sincronização bidirecional entre Lovable e GitHub.

## Estado atual confirmado
- O projeto só possui remotes internos do Lovable (`origin` e `secondary`);
- Não há configuração de GitHub sync ativa em `.lovable/project.json`;
- O repositório de destino informado é: `https://github.com/VittaFase/Site-Temperanzza-Spice-Emporium`.

## Etapas

### 1. Verificar o repositório de destino no GitHub
- Confirmar se `VittaFase/Site-Temperanzza-Spice-Emporium` existe e está vazio ou já contém arquivos.
- Se já contiver arquivos, avaliar se podem ser sobrescritos (README inicial, por exemplo) ou se é necessário clonar/fazer backup antes do push inicial.
- **Restrição**: o sync do Lovable funciona melhor quando cria o repositório do zero. Se o repo já existir com conteúdo, pode ser necessário limpá-lo ou usar push manual como fallback.

### 2. Autorizar o app Lovable no GitHub
- Ação do usuário na interface do Lovable: menu **Plus (+)** → **GitHub** → **Connect project**.
- Autorizar o app Lovable na conta/organização **VittaFase**.
- Conceder acesso ao repositório desejado.

### 3. Selecionar ou criar o repositório
- Na tela de conexão do Lovable, escolher a conta/organização **VittaFase**.
- Selecionar o repositório existente `Site-Temperanzza-Spice-Emporium` (ou criar um novo caso o existente não possa ser usado diretamente).
- Definir o branch padrão como `main`.

### 4. Push inicial do código
- Após a conexão, o Lovable fará o push automático de todo o codebase atual para o GitHub.
- Verificar se todos os arquivos essenciais foram enviados:
  - `src/`, `public/`, `package.json`, `vite.config.ts`, etc.
  - Arquivos de configuração do backend/migrations (se houver).

### 5. Verificar sincronização bidirecional
- Abrir o repositório no GitHub e confirmar que o commit inicial reflete a estrutura atual.
- Testar se alterações futuras no Lovable aparecem no GitHub e vice-versa.
- Verificar se `.gitignore` está correto para não subir arquivos sensíveis (`.env`, `node_modules`, etc.).

## Riscos e decisões

| Situação | Ação recomendada |
|----------|------------------|
| Repositório já existe e está vazio | Conectar diretamente e fazer push inicial. |
| Repositório já existe com conteúdo | Avaliar se limpa ou faz push manual forçado; o sync automático pode falhar. |
| Conta VittaFase não tem permissão para o app Lovable | Reautorizar ou usar conta com permissão de admin no repo. |

## O que será entregue
- Projeto Temperanzza sincronizado com o GitHub;
- Código atual disponível em `https://github.com/VittaFemperanzza-Spice-Emporium`;
- Instruções de uso do fluxo bidirecional (editar no Lovable ou no IDE local).

## Nota importante
A autorização do GitHub App e a seleção do repositório são etapas que exigem interação do usuário na interface do Lovable (não podem ser feitas 100% por código). Eu posso guiar passo a passo durante a execução.