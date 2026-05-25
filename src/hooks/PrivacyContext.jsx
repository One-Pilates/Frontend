import { createContext, useContext, useState, useEffect } from 'react';

const PrivacyContext = createContext();

export function PrivacyProvider({ children }) {
  // Inicializa com base no localStorage ou padrão false
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    const saved = localStorage.getItem('privacyMode');
    return saved === 'true';
  });

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const newState = !prev;
      localStorage.setItem('privacyMode', String(newState));
      return newState;
    });
  };

  useEffect(() => {
    // Aplica uma classe na raiz do documento para ajudar em estilizações globais se necessário
    if (isPrivacyMode) {
      document.documentElement.classList.add('privacy-mode-active');
    } else {
      document.documentElement.classList.remove('privacy-mode-active');
    }
  }, [isPrivacyMode]);

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy deve ser usado dentro de um PrivacyProvider');
  }
  return context;
}
