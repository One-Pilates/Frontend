import { Navigate, Routes, Route } from 'react-router-dom';
import Secretary from '../pages/Secretary/Secretary';
import Dashboard from '../pages/Secretary/Dashboard';
import Profile from '../pages/Teacher/Profile';
import Calendar from '../pages/Secretary/Calendar';
import RegisterTeacher from '../pages/Secretary/RegisterTeacher';
import RegisterStudent from '../pages/Secretary/RegisterStudent';
import RegisterAula from '../pages/Secretary/RegisterAula';
import NotFound from './NotFound';
import GerenciamentoProfessor from '../pages/Secretary/GerenciamentoProfessor';
import GerenciamentoAluno from '../pages/Secretary/GerenciamentoAluno';
import ViewProfile from '../pages/Secretary/ProfileView';
import StudioView from '../pages/Secretary/Studio';


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
