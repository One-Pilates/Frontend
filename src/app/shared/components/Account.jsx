import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaCog, FaKey, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth.jsx";
import ContactAdm from "./ContactAdm.jsx";
import api from "../../../provider/api";
import userIconImg from "/user-icon.png";

function Account() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(() => localStorage.getItem('theme') === 'dark');
  const { user } = useAuth() || {};

  const toggleModoEscuro = () => {
    const newValue = !modoEscuro;
    setModoEscuro(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const openAdminModal = () => {
    setMenuAberto(false);
    setIsAdminModalOpen(true);
  };

  const nome = user?.nome || user?.name || "Usuário";
  const roleRaw = user?.role || user?.cargo || "";
  const papel = (() => {
    if (!roleRaw) return "";
    const r = roleRaw.toString().toUpperCase();
    if (r.includes("PROF")) return "Professor(a)";
    if (r.includes("SECRET")) return "Secretaria";
    if (r.includes("ADMIN")) return "Administrador";
    return roleRaw;
  })();

  return (
    <div className="relative">
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors"
        style={{ 
          color: 'var(--text-escuro)',
        }}
        aria-expanded={menuAberto}
        aria-haspopup="true"
      >
        {user && user.foto ? (
          <img
            src={`${api.defaults.baseURL}/api/imagens/${user.foto}?token=${localStorage.getItem('token')}`}
            alt={nome}
            className="w-10 h-10 rounded-full object-cover"
            style={{ outline: '2px solid var(--laranja-principal)' }}
          />
        ) : (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-claro)', color: 'var(--text-cinza)' }}
          >
            <FaUserCircle className="text-2xl" />
          </div>
        )}

        <div className="hidden md:block text-left">
          <p className="font-semibold leading-tight" style={{ color: 'var(--text-escuro)' }}>{nome}</p>
          <p className="text-xs" style={{ color: 'var(--text-cinza)' }}>{papel}</p>
        </div>

        <FaChevronDown 
          className="transition-transform"
          style={{ color: 'var(--text-cinza)' }}
        />
      </button>

      {menuAberto && (
        <>
          <div 
            onClick={() => setMenuAberto(false)}
            className="fixed inset-0 z-40"
          />

          <div 
            className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 overflow-hidden"
            style={{ 
              backgroundColor: 'var(--branco)',
              borderColor: 'var(--cor-borda)',
              borderWidth: '1px'
            }}
          >
            <div className="p-4" style={{ background: `linear-gradient(to right, var(--laranja-principal), #E85D25)` }}>
              <div className="flex items-center gap-3">
                <img
                  src={user?.foto ? `${api.defaults.baseURL}/api/imagens/${user.foto}?token=${localStorage.getItem('token')}` : userIconImg}
                  alt={nome}
                  className="w-14 h-14 rounded-full ring-2 ring-white object-cover"
                />
                <div className="text-white">
                  <p className="font-bold text-lg leading-tight">{nome}</p>
                  <p className="text-sm opacity-90">{papel}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button 
                onClick={openAdminModal}
                className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3"
                style={{ 
                  backgroundColor: 'var(--branco)',
                  color: 'var(--text-escuro)'
                }}
              >
                <FaCog style={{ color: 'var(--text-cinza)' }} />
                <span>Configurações</span>
              </button>

              <button
                onClick={() => navigate("/redifinir-senha")}
                className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3"
                style={{ 
                  backgroundColor: 'var(--branco)',
                  color: 'var(--text-escuro)'
                }}
              >
                <FaKey style={{ color: 'var(--text-cinza)' }} />
                <span>Senhas</span>
              </button>

              <button 
                onClick={toggleModoEscuro}
                className="w-full px-4 py-3 text-left transition-colors flex items-center justify-between"
                style={{ 
                  backgroundColor: 'var(--branco)',
                  color: 'var(--text-escuro)'
                }}
              >
                <div className="flex items-center gap-3">
                  {modoEscuro ? (
                    <FaSun className="text-yellow-500" />
                  ) : (
                    <FaMoon style={{ color: 'var(--text-cinza)' }} />
                  )}
                  <span>Modo Escuro</span>
                </div>
                <div className="w-11 h-6 rounded-full transition-colors" style={{ backgroundColor: modoEscuro ? 'var(--laranja-principal)' : 'var(--cor-borda)' }}>
                  <div className="w-4 h-4 rounded-full bg-white mt-1 transition-transform" style={{ transform: modoEscuro ? 'translateX(24px) translateX(4px)' : 'translateX(4px)' }}></div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      <ContactAdm isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
}

export default Account;

