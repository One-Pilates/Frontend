import { useState, useEffect } from "react";
import { validacaoEmail } from "../../utils/utils";
import { useAuth } from "../../hooks/useAuth";
import "./Login.scss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import BackgroundLogin from "../../components/BackgroundLogin";

export default function Login() {
  const navigate = useNavigate();
  const {login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Carregar VLibras apenas na página de login
  useEffect(() => {
    // Criar o container do VLibras
    const vlibrasDiv = document.createElement('div');
    vlibrasDiv.setAttribute('vw', '');
    vlibrasDiv.className = 'enabled';
    vlibrasDiv.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(vlibrasDiv);

    // Carregar o script do VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);

    // Cleanup: remover o VLibras ao desmontar o componente
    return () => {
      if (vlibrasDiv && vlibrasDiv.parentNode) {
        vlibrasDiv.parentNode.removeChild(vlibrasDiv);
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Limpar a instância do VLibras se existir
      if (window.VLibras) {
        delete window.VLibras;
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validacaoEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor, insira um email válido.",
      });
      return;
    }
    
    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Senha inválida",
        text: "Por favor, insira uma senha válida.",
      });
      return;
    }
    
    await login(email, password);
  };

  return (
    <div className="login">
      <div
        className="login__container"
        role="region"
        aria-label="Formulário de login"
      >
        <div className="login__header">
          <h1 id="login-title" className="login__title">
            Login
          </h1>
          <p className="login__subtitle">Porque seu corpo é único!</p>
        </div>
        
        <form
          className="login__form"
          onSubmit={handleLogin}
          aria-describedby="login-help"
        >
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
              placeholder="onepilates@onepilates.com"
              required
            />
          </div>
          
          <div className="login__field">
            <label htmlFor="password" className="login__label">
              Senha
            </label>
            <div className="login__password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login__input"
                placeholder="********"
                required
              />
              <button
                type="button"
                className="login__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="login__checkbox">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Lembrar senha</label>
          </div>

          <button type="submit" className="login__button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          
          <div className="login__links" id="login-help">
            <button
              type="button"
              onClick={() => navigate("/esqueci-senha")}
              className="login__forgot"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
        
        <p className="login__contact">
        Precisa de acesso? Contate o administrador.
      </p>
      </div>
      
      <BackgroundLogin />
    </div>
  );
}