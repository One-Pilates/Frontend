import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    window.open(
      'https://api.whatsapp.com/send/?phone=551130514139&text=Olá%2C+consegui+o+contato+através+do+site+e+gostaria+de+conversar+com+a+secretaria+para+agendar+uma+aula+experimental.&type=phone_number&app_absent=0',
      '_blank'
    );
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={handleClick}
        aria-label="Conversar pelo WhatsApp"
        className="
          fixed bottom-5 right-5
          bg-[#25D366]
          text-white
          rounded-full
          w-14 h-14
          flex items-center justify-center
          shadow-lg
          hover:scale-110 hover:shadow-xl
          transition-transform duration-200
          z-50
        "
      >
        <FaWhatsapp size={28} />
      </button>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-2xl p-6 max-w-sm w-[90%] text-center animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Deseja conversar com a secretaria?
            </h2>
            <p className="text-gray-600 dark:text-fontSec mb-6 text-sm">
              Você será redirecionado para o WhatsApp da nossa secretaria
              para agendar sua aula experimental.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-component text-gray-700 dark:text-fontMain hover:bg-white dark:bg-dark transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1ebe5d] transition"
              >
                Sim, abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


