import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PrivateRoutes from './app/routes/PrivateRoutes';
import PublicRoutes from './app/routes/PublicRoutes';
import TeacherRoutes from './app/routes/TeacherRoutes';
import SecretaryRoutes from './app/routes/SecretaryRoutes';

import './app/shared/styles/App.scss';

function App() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/' || location.pathname.startsWith('/login');
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    if (isPublicRoute) {
      document.documentElement.classList.remove('dark');
    } else {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, isPublicRoute]);

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/professora/*" element={<TeacherRoutes />} />
        <Route path="/secretaria/*" element={<SecretaryRoutes />} />
      </Route>
      
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default App;
