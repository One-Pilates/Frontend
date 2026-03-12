import { useState } from 'react';
import './Login.scss';
import './CodigoVerificacao.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../services/api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IoArrowBack } from 'react-icons/io5';
import BackgroundLogin from '../../components/BackgroundLogin';
import { useAuth } from '../../hooks/useAuth';

export default function NovaSenha() {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const email = useLocation().state?.email;
  const isPrimeiroAcesso = user?.primeiroAcesso || false;

  // Função de validação
  const validatePassword = (password) => {
    return {
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
  };

  const rules = validatePassword(password1);

  const handleLogin = async (e) => {
    e.preventDefault();

    const allValid = Object.values(rules).every(Boolean);
    if (!allValid) {
      toast.error('A senha não atende aos requisitos mínimos.');
      return;
    }

    if (password1 !== password2) {
      toast.error('As senhas devem ser iguais.');
      return;
    }

    const loadingId = toast.loading('Redefinindo sua senha...');

    try {
      await api.post('auth/alterarSenha', {
        senha: password1,
        email: email || user.email,
      });

      toast.success('Nova senha cadastrada com sucesso!', { id: loadingId });

      if (isPrimeiroAcesso) {
        const route = user.role === 'PROFESSOR' ? '/professora/agenda' : '/secretaria/dashboard';
        navigate(route);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Não foi possível atualizar sua senha. Tente novamente.', { id: loadingId });
    }
  };

  return (
    <div className="login">
      <div
        className="login__container"
        role="region"
        aria-label="Formulário de redefinição de senha"
      >
        {!isPrimeiroAcesso && (
          <button onClick={() => navigate(-1)} className="botao-voltar">
            <IoArrowBack size={18} /> Voltar
          </button>
        )}

        <div className="login__header">
          <h1 id="login-title" className="login__title">
            {isPrimeiroAcesso ? 'Primeiro Acesso' : 'Criar Nova Senha'}
          </h1>
          <p className="login__subtitle">
            {isPrimeiroAcesso
              ? 'Defina sua senha para acessar o sistema.'
              : 'Por favor, crie uma nova senha para sua conta.'}
          </p>
        </div>

        <form className="login__form" onSubmit={handleLogin} aria-describedby="login-help">
          <div className="login__field">
            <label htmlFor="password1" className="login__label">
              Senha
            </label>
            <div className="login__password-wrapper">
              <input
                type={showPassword1 ? 'text' : 'password'}
                id="password1"
                name="password1"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="login__input"
                required
                placeholder="********"
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword1(!showPassword1)}
                aria-label={showPassword1 ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword1 ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="login__field">
            <label htmlFor="password2" className="login__label">
              Repetir Senha
            </label>
            <div className="login__password-wrapper">
              <input
                type={showPassword2 ? 'text' : 'password'}
                id="password2"
                name="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="login__input"
                required
                placeholder="********"
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword2(!showPassword2)}
                aria-label={showPassword2 ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword2 ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            <br />
            <h3>A senha deve conter:</h3>
            <ul>
              <li style={{ color: rules.length ? 'green' : 'red' }}>10 caracteres</li>
              <li style={{ color: rules.uppercase ? 'green' : 'red' }}>Uma letra maiúscula</li>
              <li style={{ color: rules.lowercase ? 'green' : 'red' }}>Uma letra minúscula</li>
              <li style={{ color: rules.number ? 'green' : 'red' }}>Um número</li>
              <li style={{ color: rules.special ? 'green' : 'red' }}>
                Um caractere especial (!@#$%^&*)
              </li>
            </ul>
          </div>

          <button type="submit" className="login__button">
            {isPrimeiroAcesso ? 'Definir Senha' : 'Redefinir Senha'}
          </button>
        </form>

        <p className="login__contact">
          Precisa de acesso? <span>Contate o administrador</span>
        </p>
      </div>

      <BackgroundLogin />

      <p className="login__terms">
        Ao continuar, você concorda com nossos <span>Termos de Uso</span> e{' '}
        <span>Política de Privacidade</span>.
      </p>
    </div>
  );
}
