import './global.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import SecretaryRoutes from './routes/SecretaryRoutes';
import { useAuth } from './hooks/useAuth';
import { PrivacyProvider } from './hooks/PrivacyContext';
import InactivityTracker from './components/InactivityTracker';

function App() {
  const location = useLocation();
  const { user, isCheckingAuth } = useAuth();

  useEffect(() => {
    // Não fazemos nada enquanto o sistema ainda está verificando se o usuário está logado
    if (isCheckingAuth) return;

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

    const isPublicPath = publicPaths.includes(location.pathname);
    const savedTheme = localStorage.getItem('theme');

    // Se estiver em rota pública OU se realmente não houver usuário logado, força o CLARO
    if (isPublicPath || !user) {
      document.documentElement.classList.remove('dark');
    } 
    // Caso contrário (está logado e em rota privada), respeita o tema salvo
    else if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname, user, isCheckingAuth]);

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
      <PrivacyProvider>
        <InactivityTracker />
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
      </PrivacyProvider>
    </>
  );
}

export default App;
