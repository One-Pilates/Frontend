import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

export default function InactivityTracker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isCheckingAuth } = useAuth();
  
  const INACTIVITY_TIMEOUT_SECONDS = 900; // 15 segundos para teste
  const WARNING_BEFORE_SECONDS = 30; // Inicia aviso 30s antes do final
  
  const INACTIVITY_MS = INACTIVITY_TIMEOUT_SECONDS * 1000;
  const WARNING_MS = (INACTIVITY_TIMEOUT_SECONDS - WARNING_BEFORE_SECONDS) * 1000;

  const timerRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // Lista de caminhos públicos onde o tracker não deve atuar
  const publicPaths = [
    '/',
    '/login',
    '/esqueci-senha',
    '/codigo-verificacao',
    '/nova-senha',
    '/redefinir-senha'
  ];

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Se o aviso estiver na tela e o usuário mexer, não fecha automaticamente (exige clique no botão).
    // Mas se o aviso não estiver na tela, continua resetando o tempo invisível.
    if (!showWarning) {
      timerRef.current = setTimeout(() => {
        setShowWarning(true);
      }, WARNING_MS);
    }
  };

  useEffect(() => {
    // Só ativa o tracker se estiver logado e não for página pública
    if (isCheckingAuth || !user || publicPaths.includes(location.pathname)) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    events.forEach((event) => window.addEventListener(event, resetTimer));
    
    // Inicia o timer
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, isCheckingAuth, location.pathname, showWarning]);

  // Efeito isolado para tratar quando o warning é exibido
  useEffect(() => {
    if (showWarning) {
      let isLoggedOut = false;
      let countdown = WARNING_BEFORE_SECONDS;
      let timerInterval;

      Swal.fire({
        title: 'Você está aí?',
        html: `Sua sessão vai expirar por inatividade em <b>${countdown}</b> segundos para proteger seus dados.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continuar logado',
        cancelButtonText: 'Sair agora',
        confirmButtonColor: '#f97316', // laranja principal
        cancelButtonColor: '#94a3b8',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            countdown -= 1;
            if (b) b.textContent = countdown;
            if (countdown <= 0) {
              clearInterval(timerInterval);
              isLoggedOut = true;
              Swal.close();
            }
          }, 1000);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setShowWarning(false);
          resetTimer();
        } else if (result.dismiss === Swal.DismissReason.cancel || isLoggedOut) {
          // Deslogar
          setShowWarning(false);
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } catch (e) {
            console.error(e);
          }
          navigate('/');
        }
      });
    }
  }, [showWarning]);

  return null; // Componente invisível
}
