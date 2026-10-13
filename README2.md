# OnePilates Frontend

Documentação técnica do frontend do sistema de gerenciamento do estúdio One Pilates.

## 1. Visão geral

O OnePilates é uma aplicação web para apoiar a operação de um estúdio de Pilates. O frontend oferece autenticação, controle de acesso por perfil, agenda de aulas, dashboards, cadastro e manutenção de alunos e colaboradores, gerenciamento de salas e especialidades, perfis, recuperação de senha e recursos de privacidade.

A aplicação foi construída como uma SPA (Single Page Application): as telas são carregadas pelo React e a navegação é feita pelo React Router, enquanto os dados são obtidos de uma API HTTP externa.

### Perfis de usuário

- **Professor (`PROFESSOR`)**: consulta sua agenda, visualiza as aulas, alunos e observações, registra ausências, acompanha seu dashboard e edita o próprio perfil.
- **Secretaria (`SECRETARIA`)**: acompanha o dashboard geral, gerencia agenda, aulas, alunos, salas, especialidades e perfis de colaboradores.
- **Administrador (`ADMINISTRADOR`)**: utiliza a mesma área operacional da secretaria, com permissões adicionais para cadastrar, ativar, desativar e excluir colaboradores.

> O frontend controla a experiência e a visibilidade das telas. A autorização real precisa ser validada pelo backend em todos os endpoints.

## 2. Tecnologias

- React 19 e React DOM
- Vite 7
- React Router DOM 7
- Axios para comunicação com a API
- Tailwind CSS 4 e Sass/SCSS
- FullCalendar para agendas
- Highcharts para gráficos
- Sonner e SweetAlert2 para notificações e confirmações
- React Icons e Bootstrap Icons
- date-fns e Day.js para datas e horários
- jsPDF, jspdf-autotable e XLSX para exportações
- EmailJS, disponível como dependência para integrações de e-mail
- Docker e NGINX para publicação

## 3. Requisitos

- Node.js 18 ou superior para desenvolvimento. O Dockerfile utiliza Node.js 20 Alpine.
- npm 9 ou superior.
- Backend OnePilates disponível e acessível pela URL configurada em `VITE_BASE_URL_API`.
- Navegador moderno com suporte a módulos JavaScript, `localStorage` e APIs de arquivo.

## 4. Instalação e execução local

```bash
npm install
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

Para gerar uma versão de produção:

```bash
npm run build
npm run preview
```

A saída do build é criada em `dist/`.

## 5. Variáveis de ambiente

O Vite disponibiliza no frontend somente variáveis com prefixo `VITE_`. Crie um arquivo `.env` na raiz, quando necessário:

```env
VITE_BASE_URL_API=http://localhost:8080
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_USE_MOCKS=false
```

### Variáveis observadas

| Variável | Uso | Obrigatória |
|---|---|---|
| `VITE_BASE_URL_API` | URL base usada pelo cliente Axios | Sim |
| `VITE_EMAILJS_SERVICE_ID` | Reservada para configuração de serviço EmailJS | Conforme a integração utilizada |
| `VITE_EMAILJS_TEMPLATE_ID` | Reservada para template EmailJS | Conforme a integração utilizada |
| `VITE_EMAILJS_PUBLIC_KEY` | Reservada para autenticação pública do EmailJS | Conforme a integração utilizada |
| `VITE_USE_MOCKS` | Variável aceita pelo build Docker | Não; não há uso funcional confirmado no código analisado |

Não coloque segredos privados em variáveis `VITE_`: elas são incorporadas ao bundle e ficam disponíveis no navegador.

## 6. Scripts npm

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Valida e gera o bundle de produção |
| `npm run preview` | Serve localmente o bundle de produção |
| `npm run lint` | Executa o ESLint no projeto |
| `npm run format` | Formata arquivos JavaScript e JSX em `src/` |
| `npm run format:check` | Verifica a formatação sem alterar arquivos |

## 7. Arquitetura da aplicação

### Inicialização

`src/main.jsx` configura o tema salvo, desativa logs em produção e monta a árvore principal:

```text
StrictMode
└── BrowserRouter
    └── AuthProvider
        └── App
```

`src/App.jsx` registra o `Toaster`, o `PrivacyProvider`, o rastreador de inatividade e as rotas públicas e privadas.

### Organização de pastas

```text
src/
├── App.jsx                         # Composição principal e rotas de alto nível
├── main.jsx                        # Ponto de entrada da aplicação
├── global.css                      # Estilos globais, Tailwind e animações
├── variables.scss                  # Variáveis visuais do projeto
├── components/                     # Componentes reutilizáveis
├── hooks/                          # Contextos e hooks de autenticação/privacidade
├── pages/
│   ├── Login/                      # Login, recuperação e documentos legais
│   ├── Secretary/                  # Área de secretaria e administrador
│   └── Teacher/                    # Área do professor
├── routes/                         # Composição das rotas por perfil
├── services/api.js                 # Cliente Axios e interceptors
└── utils/utils.js                  # Validações e formatações
```

## 8. Rotas públicas

| Rota | Tela |
|---|---|
| `/` | Login |
| `/esqueci-senha` | Solicitação de recuperação de senha |
| `/codigo-verificacao` | Validação do código enviado por e-mail |
| `/nova-senha` | Definição de senha no primeiro acesso ou após recuperação |
| `/redefinir-senha` | Redefinição de senha para usuário autenticado |
| `/termos-de-uso` | Termos de uso |
| `/politica-de-privacidade` | Política de privacidade |

Rotas desconhecidas exibem a tela `NotFound`.

## 9. Rotas privadas

### Professor

Prefixo: `/professor`

| Rota | Função |
|---|---|
| `/professor/dashboard` | Indicadores, frequência e distribuição de aulas |
| `/professor/perfil` | Visualização e edição do perfil |
| `/professor/agenda` | Agenda de aulas e ausências |

### Secretaria e administrador

Prefixos: `/secretaria` e `/admin`. Ambos utilizam o mesmo conjunto de telas operacionais; o prefixo é escolhido conforme o perfil autenticado.

| Rota | Função |
|---|---|
| `/secretaria/dashboard` ou `/admin/dashboard` | Indicadores gerais do estúdio |
| `/secretaria/perfil` ou `/admin/perfil` | Perfil do usuário |
| `/secretaria/agenda` e `/secretaria/agendamento` | Agenda com filtros de sala e professor |
| `/secretaria/agendamento/criar` | Criação de uma aula em etapas |
| `/secretaria/alunos` | Listagem, busca, filtro, exportação e ações sobre alunos |
| `/secretaria/aluno/cadastrar` | Cadastro de aluno |
| `/secretaria/aluno/editar/:id` | Edição de aluno |
| `/secretaria/colaboradores` | Entrada para as listagens de colaboradores |
| `/secretaria/professor` | Gerenciamento de professores |
| `/secretaria/secretaria` | Gerenciamento de secretarias |
| `/secretaria/colaborador/cadastrar/:role` | Cadastro de professor ou secretaria |
| `/secretaria/perfilView/aluno/:id` | Visualização de aluno |
| `/secretaria/perfilView/professor/:id` | Visualização de professor |
| `/secretaria/perfilView/secretaria/:id` | Visualização de secretaria |
| `/secretaria/studio` | Gerenciamento de salas e especialidades |

O mesmo conjunto pode ser acessado com o prefixo `/admin` por usuários administradores.

## 10. Autenticação e sessão

O fluxo está centralizado em `src/hooks/AuthProvider.jsx`:

1. O usuário envia e-mail e senha para `POST /auth/login`.
2. O frontend procura o token em campos compatíveis como `token`, `accessToken`, `jwt` ou `bearerToken`.
3. O token é normalizado e salvo em `localStorage` com a chave `token`.
4. Os dados de `funcionario` são salvos em `localStorage` com a chave `user`.
5. O perfil define o redirecionamento inicial:
   - Professor: `/professor/agenda`
   - Secretaria: `/secretaria/dashboard`
   - Administrador: `/admin/dashboard`
6. Quando `primeiroAcesso` é verdadeiro, o usuário é encaminhado para `/nova-senha`.

`src/services/api.js` adiciona automaticamente o token como `Authorization: Bearer <token>` nas requisições. Respostas consideradas falhas de autenticação, principalmente HTTP 401, limpam a sessão e redirecionam para `/`.

As rotas privadas usam `PrivateRoutes`, que verifica a existência do usuário, a presença do token e o perfil permitido. O componente `InactivityTracker` exibe um aviso antes de encerrar a sessão após 15 minutos de inatividade.

## 11. Principais funcionalidades

### Login e recuperação de senha

- Validação de e-mail e senha no formulário.
- Exibição e ocultação da senha.
- Solicitação de código por e-mail.
- Código de verificação com cinco campos e reenvio.
- Criação de nova senha com regras de tamanho, maiúsculas, minúsculas, número e caractere especial.
- Contato com o administrador via `mailto:admin@onepilates.com`.

### Dashboards

- Filtro por últimos 7, 30 ou 90 dias.
- Cards de KPI.
- Gráfico de frequência por dia da semana.
- Gráfico de distribuição por professor ou especialidade.
- Estado de ausência de dados.

### Agenda

- Visualização semanal e diária pelo FullCalendar.
- Eventos de aulas com cor por especialidade.
- Modal com dados da aula e alunos.
- Criação e edição de aula para a área operacional.
- Inclusão, consulta, edição e exclusão de ausências de professores.
- Verificação de conflitos de horários.
- Recomendações OneIA associadas às observações do aluno, com fallback simulado quando a API de IA não responde.

### Alunos

- Busca por nome e filtro por status.
- Paginação.
- Cadastro e edição em etapas: dados pessoais, endereço, informações e confirmação.
- Validação de CPF, e-mail, telefone e data de nascimento.
- Consulta automática de endereço via ViaCEP.
- Registro de limitações físicas e observações.
- Ativação ou desativação de notificações por e-mail.
- Exclusão com confirmação.
- Exportação para PDF ou Excel.
- Modo privacidade para ocultar informações sensíveis na interface.

### Colaboradores

- Listagem de professores com busca, paginação e controle de status.
- Listagem de secretarias com busca e controle de status.
- Cadastro em etapas com foto, dados pessoais, endereço e informações profissionais.
- Seleção de especialidades para professores.
- Visualização de perfis.
- Alteração de dados e foto do próprio perfil.

### Studio

- Cadastro, edição e exclusão de especialidades.
- Cadastro, edição e exclusão de salas.
- Configuração de capacidade máxima, equipamentos para PCD e especialidades atendidas.

## 12. Contrato de API utilizado

Os endpoints abaixo foram identificados nas chamadas do frontend. O backend deve manter os nomes, formatos e permissões compatíveis:

```text
POST   /auth/login
POST   /auth/criarCodigoVerificacao
POST   /auth/validarCodigo
POST   /auth/alterarSenha

GET    /api/agendamentos
GET    /api/agendamentos/{idSala}/{idProfessor}
GET    /api/agendamentos/professorId/{idProfessor}
GET    /api/agendamentos/sala/{idSala}
POST   /api/agendamentos
PATCH  /api/agendamentos/{id}/alunos/{alunoId}/observacao

GET    /api/ausencias/professor/{idProfessor}
POST   /api/ausencias
PATCH  /api/ausencias/{id}
DELETE /api/ausencias/{id}

GET    /api/alunos
GET    /api/alunos/{id}
GET    /api/alunos/paginacao
POST   /api/alunos
PATCH  /api/alunos/{id}
DELETE /api/alunos/{id}

GET    /api/professores
GET    /api/professores/{id}
GET    /api/professores/paginacao
PATCH  /api/professores/{id}
DELETE /api/professores/{id}

GET    /api/secretarias
GET    /api/secretarias/{id}
PATCH  /api/secretarias/{id}
DELETE /api/secretarias/{id}

GET    /api/salas
POST   /api/salas
PATCH  /api/salas/{id}
DELETE /api/salas/{id}

GET    /api/especialidades
POST   /api/especialidades
PATCH  /api/especialidades/{id}
DELETE /api/especialidades/{id}
GET    /api/especialidades/salas/{idEspecialidade}
GET    /api/especialidades/professores/{idEspecialidade}

POST   /api/ia/recomendacao
```

Os formatos exatos de request e response são definidos pelo backend e podem variar entre endpoints paginados e endpoints de listagem.

## 13. Tema, responsividade e privacidade

- O tema claro é o padrão.
- O tema escuro pode ser ativado no menu da conta e fica salvo em `localStorage.theme`.
- Rotas públicas forçam o tema claro.
- O layout possui sidebar responsiva: aberta em telas grandes e recolhida em telas menores.
- `PrivacyContext` salva a preferência em `localStorage.privacyMode` e aplica a classe `privacy-mode-active` no elemento raiz.
- O frontend usa Poppins, Tailwind, SCSS, variáveis CSS e animações para transições, modais e navegação.

## 14. Docker e publicação

O `Dockerfile` usa duas etapas:

1. Imagem Node 20 Alpine para instalar dependências e executar `npm run build`.
2. Imagem NGINX 1.27 Alpine para servir os arquivos estáticos de `dist/`.

Exemplo de build:

```bash
docker build \
  --build-arg VITE_BASE_URL_API=http://localhost:8080 \
  -t onepilates-frontend .
```

Exemplo de execução:

```bash
docker run --rm -p 8080:80 onepilates-frontend
```

O `nginx.conf` configura:

- fallback para `/index.html`, necessário ao React Router;
- gzip para arquivos textuais;
- cache de um ano para assets estáticos;
- ocultação da versão do NGINX.

## 15. Segurança e pontos de atenção

O arquivo `SECURITY_OWASP.md` contém uma análise de segurança mais detalhada. Os pontos principais para este frontend são:

- O JWT é armazenado em `localStorage`, ficando acessível a JavaScript executado na página. Cookies `HttpOnly`, `Secure` e `SameSite` são uma alternativa mais resistente a roubo via XSS.
- `user` e `role` também são lidos do `localStorage`; portanto, não devem ser tratados como prova de autorização.
- O backend precisa validar autenticação, perfil, propriedade dos recursos e permissões em todos os endpoints.
- Variáveis `VITE_` não são segredos, pois entram no bundle público.
- Imagens, dados pessoais, observações de saúde e informações de alunos precisam de proteção no backend e no transporte HTTPS.
- Dependências devem ser atualizadas e auditadas regularmente com `npm audit` e revisão de compatibilidade.
- Logs de desenvolvimento são removidos ou desativados no build de produção, conforme a configuração atual.

## 16. Limitações e observações encontradas

- O backend não está incluído neste workspace; a execução completa depende dele.
- Não há suíte de testes automatizados identificada no `package.json`.
- A validação de autorização do frontend é apenas uma camada de navegação e não substitui a segurança da API.
- O recurso OneIA possui uma resposta simulada quando o backend não responde. Essa resposta não deve ser considerada orientação clínica real.
- Há dependências e variáveis relacionadas a EmailJS, mas o uso funcional delas não ficou comprovado nos arquivos analisados.
- A função `validacaoEmail` aparece com formatos de retorno diferentes em `src/utils/utils.js`; esse contrato deve ser padronizado antes de depender dela em novos fluxos.
- O comentário do rastreador de inatividade menciona um valor de teste, mas a constante atual equivale a 900 segundos, ou 15 minutos.

## 17. Fluxos principais

### Primeiro acesso

```text
Login
  -> API /auth/login
  -> primeiroAcesso = true
  -> Nova senha
  -> Dashboard ou agenda conforme o perfil
```

### Recuperação de senha

```text
Esqueci minha senha
  -> envio do e-mail
  -> código de verificação
  -> Nova senha
  -> Login
```

### Criação de aula

```text
Data e hora
  -> professor, sala e especialidade
  -> seleção de alunos
  -> confirmação
  -> API de agendamentos
```

### Gestão de aluno

```text
Listagem de alunos
  -> cadastro ou edição
  -> dados pessoais
  -> endereço via ViaCEP
  -> informações de saúde e notificações
  -> revisão
  -> persistência na API
```

## 18. Manutenção recomendada

1. Manter os contratos de API documentados e versionados junto ao backend.
2. Adicionar testes para autenticação, permissões de rota, validações, agenda e cadastro.
3. Padronizar nomes de endpoints, uso de barras iniciais e formatos de payload.
4. Revisar a política de armazenamento de tokens e dados pessoais.
5. Corrigir e cobrir a validação de e-mail e senha com testes automatizados.
6. Manter `README.md`, este documento e `SECURITY_OWASP.md` sincronizados com cada mudança funcional.

## 19. Licença e contexto acadêmico

O projeto contém referências à São Paulo Tech School e aparenta fazer parte de um projeto acadêmico do curso. Não foi identificada uma licença de software explícita nos arquivos analisados.
