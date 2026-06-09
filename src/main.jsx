import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import './variables.scss';
import './global.css';
import App from './App.jsx';

// Tema: padrão é sempre CLARO. Modo escuro só se o usuário ativou explicitamente.
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
  // Se não houver tema salvo, garantimos que comece no light
  if (savedTheme !== 'light') {
    localStorage.setItem('theme', 'light');
  }
}

// Desativa logs em produção para segurança e performance
if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
