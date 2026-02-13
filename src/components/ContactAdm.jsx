import React from "react";
import { FaEnvelope } from "react-icons/fa";

export default function ContactAdm({ isOpen, onClose }) {
  if (!isOpen) return null;

  const contactLink = "mailto:admin@onepilates.com";

  const handleConfirm = () => {
    try {
      if (contactLink.startsWith("mailto:")) {
        window.location.href = contactLink;
      } else {
        window.open(contactLink, "_blank");
      }
    } catch (e) {
      console.error("Erro ao abrir link de contato:", e);
    }
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl p-6 max-w-sm w-[90%] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Está com algum problema?</h2>
        <p className="text-gray-600 dark:text-fontSec mb-6 text-sm">Deseja contatar o administrador para relatar um problema?</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-component text-gray-700 dark:text-fontMain hover:bg-white dark:bg-dark transition"
          >
            Voltar
          </button>
          <button
            onClick={handleConfirm}
            className="px-2 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition flex items-center gap-2"
          >
            <FaEnvelope />
            <span>Sim, Contratar</span>
          </button>
        </div>
      </div>
    </div>
  );
}



