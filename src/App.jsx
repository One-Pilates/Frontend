import './global.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import SecretaryRoutes from './routes/SecretaryRoutes';

function App() {
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
