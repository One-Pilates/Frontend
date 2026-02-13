import { useState, useRef } from "react";
import "./CodigoVerificacao.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";
import BackgroundLogin from "../../components/BackgroundLogin";

export default function CodigoVerificacao() {
  const [codigo, setCodigo] = useState(["", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const email = useLocation().state?.email;
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index, value) => {
    if (!/^[A-Za-z0-9]?$/.test(value)) return;

    const novoCodigo = [...codigo];
    novoCodigo[index] = value.toUpperCase();
    setCodigo(novoCodigo);

    if (value && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const confirmarCodigo = async () => {
    const codigoFinal = codigo.join("");

    if (!codigoFinal || codigoFinal.length < 5) {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "Por favor, insira o código completo.",
      });
      return;
    }

    Swal.fire({
      title: "Validando...",
      text: "Estamos verificando seu código",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await api.post("auth/validarCodigo", { email, codigo: codigoFinal });

      console.log("Resposta do servidor:", response.data);

      Swal.fire({
        icon: "success",
        title: "Código válido!",
        text: "Agora você pode redefinir sua senha.",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/nova-senha", { state: { email } });
      }, 2000);
    } catch (error) {
      console.error("Erro ao validar código:", error);

      Swal.fire({
        icon: "error",
        title: "Erro na validação",
        text: "Código incorreto ou expirado. Tente novamente.",
      });
    }
  };

  const reenviarCodigo = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Email não encontrado. Por favor, reinicie o processo.",
      });
      return;
    }

    setIsResending(true);

    try {
      await api.post("auth/criarCodigoVerificacao", { email });

      setCodigo(["", "", "", "", ""]);
      inputsRef.current[0]?.focus();

      Swal.fire({
        icon: "success",
        title: "Código reenviado!",
        text: "Verifique seu e-mail novamente.",
        timer: 2000,
      });
    } catch (error) {
      console.error("Erro ao reenviar código:", error);

      Swal.fire({
        icon: "error",
        title: "Erro ao reenviar",
        text: "Não foi possível reenviar o código. Tente novamente.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <button onClick={() => navigate(-1)} className="botao-voltar">
          <i className="bi bi-arrow-left-circle-fill"></i>Voltar
        </button>

        <div className="login__header">
          <h1 className="login__title">Código de verificação</h1>
          <p className="login__subtitle">
            Confira sua caixa de entrada e informe o código <br /> recebido
          </p>
        </div>

        <p className="login__success">O e-mail foi enviado com sucesso</p>

        <div className="code-inputs">
          {codigo.map((valor, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={valor}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="input-codigo"
            />
          ))}
        </div>

        <button onClick={confirmarCodigo} className="login__button">
          Confirmar código
        </button>

        <div className="login__links">
          <button
            type="button"
            onClick={reenviarCodigo}
            className="login__forgot"
            disabled={isResending}
          >
            {isResending ? "Reenviando..." : "Reenviar código"}
          </button>
        </div>
      </div>

      <BackgroundLogin />
    </div>
  );
}
