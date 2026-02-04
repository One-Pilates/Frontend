import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/Landing/Index';
import Login from '../features/login/Login';
import EsqueciSenha from '../features/login/EsqueciSenha';
import CodigoVerificacao from '../features/login/CodigoVerificacao';
import NovaSenha from '../features/login/NovaSenha';
import NotFound from './NotFound';
import RedefinirSenha from '../shared/components/Password';

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/login/codigo-verificacao" element={<CodigoVerificacao />} />
      <Route path="/login/nova-senha" element={<NovaSenha />} />
      <Route path="/redifinir-senha" element={<RedefinirSenha />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
