import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Back = ({ className = '', wrapperClassName = '', onClick, label = 'Voltar' }) => {
  const navigate = useNavigate();
  const baseClassName =
    'flex items-center gap-[0.45rem] bg-transparent border border-(--cor-borda) text-(--text-escuro) cursor-pointer font-semibold text-[0.8rem] transition-all duration-200 px-[0.92rem] py-[0.48rem] rounded-[30px] shrink-0 hover:border-[rgba(247,116,51,0.45)] hover:text-(--laranja-principal) hover:bg-[rgba(247,116,51,0.06)] hover:-translate-x-0.5';
  const buttonClassName = className ? `${baseClassName} ${className}` : baseClassName;
  const handleClick = onClick || (() => navigate(-1));

  const button = (
    <button type="button" onClick={handleClick} className={buttonClassName} aria-label={label}>
      <FaArrowLeft className="text-sm" />
      <span>{label}</span>
    </button>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{button}</div>;
  }

  return button;
};

export default Back;
