import './global.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import SecretaryRoutes from './routes/SecretaryRoutes';
import { useAuth } from './hooks/useAuth';

function App() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Se o usuário não está logado, forçamos o modo claro SEMPRE
    if (!user) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      return;
    }

    // Lista de caminhos públicos onde o modo escuro NUNCA deve estar ativo
    const publicPaths = [
      '/',
      '/login',
      '/esqueci-senha',
      '/codigo-verificacao',
      '/nova-senha',
      '/redefinir-senha',
      '/termos-de-uso',
      '/politica-de-privacidade'
    ];

    // Se estiver em uma rota pública, removemos a classe dark obrigatoriamente
    if (publicPaths.includes(location.pathname)) {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname]);

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
          },
          duration: 4000,
        }}
      />
      <Routes>
        <Route element={<PrivateRoutes allowedRoles={['PROFESSOR']} />}>
          <Route path="/professor/*" element={<TeacherRoutes />} />
        </Route>
        <Route element={<PrivateRoutes allowedRoles={['SECRETARIA']} />}>
          <Route path="/secretaria/*" element={<SecretaryRoutes />} />
        </Route>
        <Route element={<PrivateRoutes allowedRoles={['ADMINISTRADOR']} />}>
          <Route path="/admin/*" element={<SecretaryRoutes />} />
        </Route>
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
}

export default App;
