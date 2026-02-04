import React from "react";
import "./input.scss";

// Funções de máscara
const aplicarMascaraCPF = (valor) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const aplicarMascaraTelefone = (valor) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const aplicarMascaraCEP = (valor) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  required = false,
  disabled = false,
  maxLength,
  erro,
  mask,
  ...props
}) {
  const handleChange = (e) => {
    let valorFormatado = e.target.value;

    if (mask === "cpf") {
      valorFormatado = aplicarMascaraCPF(valorFormatado);
    } else if (mask === "telefone") {
      valorFormatado = aplicarMascaraTelefone(valorFormatado);
    } else if (mask === "cep") {
      valorFormatado = aplicarMascaraCEP(valorFormatado);
    }

    onChange({ target: { value: valorFormatado } });
  };

  return (
    <div className="input-container">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={`input-field ${erro ? "input-error" : ""}`}
        {...props}
      />
      {erro && <span className="input-error-message">{erro}</span>}
    </div>
  );
}