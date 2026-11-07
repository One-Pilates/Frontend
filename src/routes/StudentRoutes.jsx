import { Navigate, Route, Routes } from 'react-router-dom';
import Student from '../pages/Student/Student';
import Home from '../pages/Student/Home';
import Agenda from '../pages/Student/Agenda';
import Historico from '../pages/Student/Historico';
import AulaDetalhe from '../pages/Student/AulaDetalhe';
import Mais from '../pages/Student/Mais';
import Perfil from '../pages/Student/Perfil';
import Notificacoes from '../pages/Student/Notificacoes';
import NotFound from './NotFound';

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Student />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<Home />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="historico" element={<Historico />} />
        <Route path="aulas/:id" element={<AulaDetalhe />} />
        <Route path="mais" element={<Mais />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="notificacoes" element={<Notificacoes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
