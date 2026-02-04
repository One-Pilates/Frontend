import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleClick}
        aria-label="Conversar pelo WhatsApp"
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-[#25D366] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200 z-50 active:scale-95"
      >
        <FaWhatsapp className="text-2xl sm:text-3xl md:text-4xl" />
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={handleCancel}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Deseja conversar com a secretaria?
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
              Você será redirecionado para o WhatsApp da nossa secretaria
              para agendar sua aula experimental.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#1ebe5d] transition-colors duration-200 shadow-md active:scale-95"
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
