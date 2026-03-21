# One Pilates — Frontend

Sistema de gerenciamento de agendamentos do estúdio One Pilates, com interface moderna, intuitiva e responsiva para administradores, professores e secretárias.

<p align="center">
  <img src="https://skillicons.dev/icons?i=vite,react,tailwind,sass" alt="Tecnologias principais" />
</p>

## Stack
- Vite
- React 19
- Tailwind CSS
- SASS/SCSS
- React Router DOM
- Axios
- FullCalendar
- HighCharts
- EmailJS
- SweetAlert2
- Sonner (Toasts)

## Funcionalidades
- Dashboard intuitivo para administradores, professores e secretárias
- Gestão de agendamentos de aulas
- Calendario interativo com FullCalendar
- Gestão de alunos e professores
- Relatórios e gráficos (KPI, Frequência, Pizza)
- Autenticação e controle de acesso por perfil
- Exportação de dados (PDF, Excel)
- Integração com WhatsApp para contato
- Notificações em tempo real (Sonner)
- Validação de formulários

## Requisitos
- Node.js 18+
- npm 9+

## Como rodar localmente
```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev
```

Aplicação local: http://localhost:5173

## Scripts
```bash
# desenvolvimento
npm run dev

# build de produção
npm run build

# preview local do build
npm run preview

# linting
npm run lint

# formatação de código
npm run format

# verificação de formatação
npm run format:check
```

## Build para produção
```bash
npm run build
```

Os arquivos finais serão gerados em dist/.

## Estrutura principal
```text
src/
  components/
    Account.jsx
    Navbar.jsx
    Sidebar.jsx
    LoadingSpinner.jsx
    StepIndicator.jsx
    [outros componentes]
  pages/
    Login/
    Secretary/
      Calendar/
      Dashboard/
      GerenciamentoAluno/
      GerenciamentoProfessor/
      RegisterAula/
      RegisterStudent/
      RegisterTeacher/
    Teacher/
      Calendar/
      Dashboard/
  hooks/
    AuthContext.js
    AuthProvider.jsx
    useAuth.jsx
  routes/
    PrivateRoutes.jsx
    PublicRoutes.jsx
    SecretaryRoutes.jsx
    TeacherRoutes.jsx
  services/
    api.js
  utils/
    utils.js
  styles/
    global.css
    variables.scss
```
