import React from 'react';

function Botao({ cor, icone: Icone, texto, onClick, disabled = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${cor} text-white font-semibold flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      {Icone && <Icone size={18} />}
      <span>{texto}</span>
    </button>
  );
}

export default Botao;
