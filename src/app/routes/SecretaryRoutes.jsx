import { Navigate, Routes, Route } from 'react-router-dom';
import Secretary from '../features/Secretary/Secretary';
import Dashboard from '../features/Secretary/Dashboard';
import Profile from '../features/Teacher/Profile';
import Calendar from '../features/Secretary/Calendar';
import RegisterTeacher from '../features/Secretary/RegisterTeacher';
import RegisterStudent from '../features/Secretary/RegisterStudent';
import RegisterAula from '../features/Secretary/RegisterAula';
import NotFound from './NotFound';
import GerenciamentoProfessor from '../features/Secretary/GerenciamentoProfessor';
import GerenciamentoAluno from '../features/Secretary/GerenciamentoAluno';
import ViewProfile from '../features/Secretary/ProfileView';
import StudioView from '../features/Secretary/Studio';


export default function SecretaryRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Secretary />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="perfil" element={<Profile/>} />
        <Route path="perfil/professor/:id" element={<ViewProfile/>} />
        <Route path="perfil/aluno/:id" element={<ViewProfile/>} />
        <Route path="agenda" element={<Calendar/>} />
        <Route path="agendamento" element={<Calendar/>} />
        <Route path="agendamento/criar" element={<RegisterAula/>} />
        <Route path="professor" element={<GerenciamentoProfessor/>} />
        <Route path="professor/cadastrar" element={<RegisterTeacher/>} />
        <Route path="aluno/cadastrar" element={<RegisterStudent/>} />
        <Route path="alunos" element={<GerenciamentoAluno/>} />
        <Route path="studio" element={<StudioView />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
