import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import "./NoDataAlert.scss";

const NoDataAlert = ({ selectedPeriod }) => {
  const periodText =
    {
      7: "últimos 7 dias",
      30: "últimos 30 dias",
      90: "últimos 90 dias",
    }[selectedPeriod] || "período selecionado";

  return (
    <div className="no-data-alert">
      <FiAlertCircle className="alert-icon" />
      <div className="alert-content">
        <h3>Nenhuma aula agendada</h3>
        <p>Você não possui aulas agendadas nos {periodText}.</p>
      </div>
    </div>
  );
};

export default NoDataAlert;
