import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import api from "../services/api";
import StepIndicator from "./StepIndicator";
import { useAuth } from "../hooks/useAuth";

export default function RedefinirSenha() {
  const { user } = useAuth() || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState(["", "", "", "", ""]);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const steps = [
    { label: "Email" },
    { label: "Código" },
    { label: "Nova Senha" }
  ];

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

  // STEP 1: Enviar Email
  const handleEnviarEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Email obrigatório",
        text: "Por favor, informe seu email.",
      });
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor, informe um email válido.",
      });
      return;
    }

    Swal.fire({
      title: "Enviando...",
      text: "Estamos enviando o código de verificação",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/auth/criarCodigoVerificacao", { email });

      await Swal.fire({
        icon: "success",
        title: "Código enviado!",
        text: "Verifique sua caixa de entrada.",
        timer: 2000,
        showConfirmButton: false,
      });

      setCurrentStep(2);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.erro || "Não foi possível enviar o código. Verifique o email e tente novamente.";
      Swal.fire({
        icon: "error",
        title: "Erro ao enviar",
        text: errorMessage,
      });
    }
  };

  // STEP 2: Validar Código
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
      await api.post("/auth/validarCodigo", { email, codigo: codigoFinal });

      await Swal.fire({
        icon: "success",
        title: "Código válido!",
        text: "Agora você pode redefinir sua senha.",
        showConfirmButton: false,
        timer: 2000,
      });

      setCurrentStep(3);
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
    setIsResending(true);

    try {
      await api.post("/auth/criarCodigoVerificacao", { email });

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

  // STEP 3: Redefinir Senha
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();

    const allValid = Object.values(rules).every(Boolean);
    if (!allValid) {
      Swal.fire({
        icon: "error",
        title: "Senha inválida",
        text: "A senha não atende aos requisitos mínimos.",
      });
      return;
    }

    if (password1 !== password2) {
      Swal.fire({
        icon: "error",
        title: "Senha inválida",
        text: "As senhas devem ser iguais",
      });
      return;
    }

    Swal.fire({
      title: "Redefinindo...",
      text: "Estamos atualizando sua senha",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/auth/alterarSenha", {
        senha: password1,
        email: email,
      });

      await Swal.fire({
        icon: "success",
        title: "Senha alterada!",
        text: "Sua nova senha foi cadastrada com sucesso",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.erro || error.response?.data || "Não foi possível atualizar sua senha. Tente novamente.";
      Swal.fire({
        icon: "error",
        title: "Erro ao redefinir",
        text: typeof errorMessage === 'string' ? errorMessage : "Não foi possível atualizar sua senha. Tente novamente.",
      });
    }
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 bg-orange-50/30 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 bg-white dark:bg-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-component text-gray-700 dark:text-fontMain font-medium py-2.5 px-5 rounded-lg shadow-sm border border-gray-200 dark:border-dark-component transition-all duration-300 hover:shadow-md hover:-translate-x-1"
      >
        <BiArrowBack size={20} />
        Voltar
      </button>

      <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-lg p-10 w-full max-w-2xl mx-auto">
        <div className="mb-12">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        {currentStep === 1 && (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Redefinir Senha
              </h1>
              <p className="text-base text-gray-600 dark:text-fontSec leading-relaxed">
                Informe seu email para receber o código de verificação
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleEnviarEmail}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[15px] font-semibold text-gray-700 dark:text-fontMain">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3.5 px-4 text-base border-2 border-gray-300 dark:border-dark-component rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-500 rounded-xl text-blue-900">
                <i className="bi bi-info-circle text-2xl text-blue-500"></i>
                <p className="text-[15px] leading-relaxed m-0">
                  Você receberá um código de 5 dígitos no email informado.
                </p>
              </div>

              <button
                type="submit"
                className="w-full p-4 bg-blue-500 text-white rounded-xl text-base font-semibold hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 transition-all duration-300"
              >
                Enviar código de verificação
              </button>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Código de Verificação
              </h1>
              <p className="text-base text-gray-600 dark:text-fontSec leading-relaxed">
                Confira sua caixa de entrada e informe o código recebido
              </p>
            </div>

            <p className="text-center text-green-600 text-[15px] py-3.5 bg-green-50 rounded-xl border border-green-600 m-0">
              ✓ Código enviado para{" "}
              <strong className="font-semibold">{email}</strong>
            </p>

            <div className="flex justify-center gap-4 my-6">
              {codigo.map((valor, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={valor}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-dark-component rounded-xl outline-none transition-all duration-300 uppercase font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 [&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown)]:bg-green-50"
                />
              ))}
            </div>

            <button
              onClick={confirmarCodigo}
              className="w-full p-4 bg-blue-500 text-white rounded-xl text-base font-semibold hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 transition-all duration-300"
            >
              Confirmar código
            </button>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={reenviarCodigo}
                disabled={isResending}
                className="bg-transparent border-none text-blue-500 text-[15px] font-semibold cursor-pointer py-2 px-4 hover:text-blue-600 hover:underline transition-all disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
              >
                {isResending ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Criar Nova Senha
              </h1>
              <p className="text-base text-gray-600 dark:text-fontSec leading-relaxed">
                Por favor, crie uma nova senha segura para sua conta
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleRedefinirSenha}>
              <div className="flex flex-col gap-2">
                <label htmlFor="password1" className="text-[15px] font-semibold text-gray-700 dark:text-fontMain">
                  Nova Senha
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword1 ? "text" : "password"}
                    id="password1"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    className="w-full py-3.5 px-4 pr-12 text-base border-2 border-gray-300 dark:border-dark-component rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="absolute right-4 bg-transparent border-none text-gray-500 cursor-pointer p-2 flex items-center justify-center transition-colors hover:text-gray-700 dark:text-fontMain"
                    onClick={() => setShowPassword1(!showPassword1)}
                    aria-label={showPassword1 ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword1 ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password2" className="text-[15px] font-semibold text-gray-700 dark:text-fontMain">
                  Confirmar Nova Senha
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    id="password2"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full py-3.5 px-4 pr-12 text-base border-2 border-gray-300 dark:border-dark-component rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="absolute right-4 bg-transparent border-none text-gray-500 cursor-pointer p-2 flex items-center justify-center transition-colors hover:text-gray-700 dark:text-fontMain"
                    onClick={() => setShowPassword2(!showPassword2)}
                    aria-label={showPassword2 ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword2 ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-dark-secondary rounded-xl border border-gray-300 dark:border-dark-component">
                <h4 className="text-sm font-bold text-gray-700 dark:text-fontMain mb-4">
                  A senha deve conter:
                </h4>
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  <li
                    className="text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ color: rules.length ? "#22c55e" : "#ef4444" }}
                  >
                    {rules.length ? "✓" : "○"} Mínimo de 10 caracteres
                  </li>
                  <li
                    className="text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ color: rules.uppercase ? "#22c55e" : "#ef4444" }}
                  >
                    {rules.uppercase ? "✓" : "○"} Uma letra maiúscula
                  </li>
                  <li
                    className="text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ color: rules.lowercase ? "#22c55e" : "#ef4444" }}
                  >
                    {rules.lowercase ? "✓" : "○"} Uma letra minúscula
                  </li>
                  <li
                    className="text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ color: rules.number ? "#22c55e" : "#ef4444" }}
                  >
                    {rules.number ? "✓" : "○"} Um número
                  </li>
                  <li
                    className="text-sm font-semibold flex items-center gap-2 transition-all"
                    style={{ color: rules.special ? "#22c55e" : "#ef4444" }}
                  >
                    {rules.special ? "✓" : "○"} Um caractere especial (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full p-4 bg-blue-500 text-white rounded-xl text-base font-semibold hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 transition-all duration-300"
              >
                Redefinir Senha
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

