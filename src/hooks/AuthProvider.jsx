import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsCheckingAuth(false);
  }, []);

  async function login(email, senha) {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, senha });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.funcionario));

      setUser(data.funcionario);

      const role = data.funcionario.role;
      const nome = data.funcionario.nome;
      const primeiroAcesso = data.funcionario.primeiroAcesso;

      const rotas = {
        PROFESSOR: {
          path: "/professora/agenda",
          msg: `Bem-vindo à sua agenda, ${nome}!`,
        },
        SECRETARIA: {
          path: "/secretaria/dashboard",
          msg: `Bem-vindo ao painel da One Pilates, ${nome}!`,
        },
        ADMINISTRADOR: {
          path: "/secretaria/dashboard",
          msg: `Bem-vindo ao painel da One Pilates, ${nome}!`,
        },
      };

      let destino = rotas[role];

      if (primeiroAcesso) {
        destino = {
          path: "/nova-senha",
          msg: `Por favor, defina sua senha, ${nome}!`,
        };
      }

      if (!destino) {
        Swal.fire({
          icon: "error",
          title: "Função desconhecida",
          text: "Contate o administrador.",
        });
        return false;
      }

      Swal.fire({
        icon: "success",
        title: "Login bem-sucedido",
        text: destino.msg,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setTimeout(() => navigate(destino.path), 3000);

      return true;
    } catch (error) {
      const status = error.response?.status;
      const msg =
        status === 401
          ? "Email ou senha incorretos."
          : "Ocorreu um erro inesperado. Tente novamente mais tarde.";

      Swal.fire({
        icon: "error",
        title: "Erro ao fazer login",
        text: msg,
        confirmButtonColor: "#d33",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    Swal.fire({
      title: "Tem certeza que deseja sair?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isCheckingAuth,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
