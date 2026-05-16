import { Navigate, Routes, Route } from 'react-router-dom';
import Secretary from '../pages/Secretary/Secretary';
import Dashboard from '../pages/Secretary/Dashboard';
import Profile from '../pages/Teacher/Profile';
import Calendar from '../pages/Secretary/Calendar';
import RegisterCollaborator from '../pages/Secretary/RegisterCollaborator';
import RegisterStudent from '../pages/Secretary/RegisterStudent';
import RegisterAula from '../pages/Secretary/RegisterAula';
import NotFound from './NotFound';
import GerenciamentoProfessor from '../pages/Secretary/GerenciamentoColaboradores/Professor';
import GerenciamentoSecretaria from '../pages/Secretary/GerenciamentoColaboradores/Secretaria';
import GerenciamentoAluno from '../pages/Secretary/GerenciamentoAluno';
import ViewProfile from '../pages/Secretary/ProfileView';
import StudioView from '../pages/Secretary/Studio';
import CardsColaborador from '../pages/Secretary/GerenciamentoColaboradores/cardsColaborador';

export default function SecretaryRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Secretary />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="perfil/aluno/:id" element={<ViewProfile />} />
        <Route path="agenda" element={<Calendar />} />
        <Route path="agendamento" element={<Calendar />} />
        <Route path="agendamento/criar" element={<RegisterAula />} />
        <Route path="colaboradores" element={<CardsColaborador />} />
        <Route path="professor" element={<GerenciamentoProfessor />} />
        <Route path="secretaria" element={<GerenciamentoSecretaria />} />
        <Route path="colaborador/cadastrar/:role" element={<RegisterCollaborator />} />
        <Route path="aluno/cadastrar" element={<RegisterStudent />} />
        <Route path="aluno/editar/:id" element={<RegisterStudent />} />
        <Route path="alunos" element={<GerenciamentoAluno />} />
        <Route path="studio" element={<StudioView />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
