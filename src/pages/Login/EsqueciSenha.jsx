import { useState} from "react";
import "./CodigoVerificacao.scss";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import BackgroundLogin from "../../components/BackgroundLogin";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEnviar = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor, insira um email válido.",
      });
      return;
    }

    Swal.fire({
      title: "Enviando...",
      text: "Estamos processando sua solicitação",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await api.post("auth/criarCodigoVerificacao",{ email });
      console.log("Email enviado para:", email);

      console.log("Resposta do servidor:", response.data);

      Swal.fire({
        icon: "success",
        title: "Código enviado!",
        text: "Verifique seu e-mail",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/codigo-verificacao", { state: { email } });
      }, 2000);

    } catch (error) {
      console.error("Erro ao enviar requisição:", error);

      Swal.fire({
        icon: "error",
        title: "Erro ao enviar",
        text: "Não foi possível enviar o código. Tente novamente.",
      });
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <button onClick={() => navigate(-1)} className="botao-voltar">
          <i className="bi bi-arrow-left-circle-fill"></i>Voltar
        </button>

        <div className="login__header">
          <h1 className="login__title">Esqueci minha senha</h1>
          <p className="login__subtitle">
            Informe seu e-mail para recuperar o acesso.
          </p>
        </div>

        <div className="login__field">
          <label htmlFor="email" className="login__label">
            Email
          </label>

          <input
            placeholder="onepilates@onepilates.com"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login__input"
            required
          />
        </div>
        <button onClick={handleEnviar} className="login__button">
          Enviar
        </button>
      </div>

      <BackgroundLogin />
    </div>
  );
}
