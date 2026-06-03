import { useState, useEffect } from 'react';
import { validacaoEmail } from '../../utils/utils';
import { useAuth } from '../../hooks/useAuth';
import './Login.scss';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import BackgroundLogin from '../../components/BackgroundLogin';
import ContactAdm from '../../components/ContactAdm';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isContactAdmOpen, setIsContactAdmOpen] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Garantia extra: Login sempre modo claro
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validacaoEmail(email)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    if (!password) {
      toast.error('Por favor, insira uma senha válida.');
      return;
    }

    await login(email, password);
  };

  return (
    <div className="login">
      <div className="login__container" role="region" aria-label="Formulário de login">
        <div className="login__header">
          <h1 className="login__title">Login</h1>
          <p className="login__subtitle">Porque seu corpo é único</p>
        </div>

        <form className="login__form" onSubmit={handleLogin}>
          <div className="login__field">
            <label htmlFor="email" className="login__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login__input"
              placeholder="onepilates@email.com"
              required
            />
          </div>

          <div className="login__field">
            <label htmlFor="password" className="login__label">
              Senha
            </label>
            <div className="login__password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login__input"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="login__bottom-row">
            {/* <div className="login__checkbox">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar senha</label>
            </div> */}
            <button
              type="button"
              onClick={() => navigate('/esqueci-senha')}
              className="login__forgot"
            >
              Esqueci minha senha
            </button>
          </div>

          <button type="submit" className="login__button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="login__contact">
          Precisa de acesso?{' '}
          <span
            onClick={() => setIsContactAdmOpen(true)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Contate o administrador
          </span>
        </p>
      </div>

      <ContactAdm isOpen={isContactAdmOpen} onClose={() => setIsContactAdmOpen(false)} />

      <BackgroundLogin />

      <p
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '40%',
          right: '0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#fff',
          zIndex: 3,
          opacity: 0.9,
        }}
      >
        Powered by{' '}
        <span className="font-bold tracking-widest" style={{ color: '#f77433' }}>
          OneIA
        </span>{' '}
        ✨
      </p>

      <p className="login__terms">
        Ao continuar, você concorda com nossos{' '}
        <Link to="/termos-de-uso" className="login__terms-link">
          Termos de Uso
        </Link>{' '}
        e{' '}
        <Link to="/politica-de-privacidade" className="login__terms-link">
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
  );
}
