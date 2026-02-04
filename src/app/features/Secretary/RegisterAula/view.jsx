import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import StepIndicator from "../../../shared/components/StepIndicator";
import Etapa1DataHora from "./screens/Etapa1DataHora";
import Etapa2Turma from "./screens/Etapa2Turma";
import Etapa3Alunos from "./screens/Etapa3Alunos";
import Etapa4Confirmacao from "./screens/Etapa4Confirmacao";
import "./style.scss";

export default function RegisterAulaView(props) {
  const navigate = useNavigate();
  const { etapaAtual, etapas, irParaEtapa, etapaAnterior, proximaEtapa, cancelar, carregando } = props;

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return <Etapa1DataHora {...props} />;
      case 2:
        return <Etapa2Turma {...props} />;
      case 3:
        return <Etapa3Alunos {...props} />;
      case 4:
        return <Etapa4Confirmacao {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <button
          className="back-button"
          onClick={() => navigate("/secretaria/agendamento")}
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h1 className="main-title">Criar Nova Aula</h1>
      </div>

      <div className="register-content">
        <StepIndicator
          steps={etapas}
          currentStep={etapaAtual}
          onStepClick={irParaEtapa}
        />

        <div className="register-card">
          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            {renderEtapa()}
          </form>
        </div>

        <div className="form-actions">
          <button
            className="btn-cancel"
            onClick={cancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
          {etapaAtual > 1 && (
            <button
              className="btn-back"
              onClick={etapaAnterior}
              disabled={carregando}
            >
              Voltar
            </button>
          )}
          {etapaAtual < 4 && (
            <button
              className="btn-next"
              onClick={proximaEtapa}
              disabled={carregando}
            >
              Próximo
            </button>
          )}
          {etapaAtual === 4 && (
            <button
              className="btn-finish"
              onClick={props.criarAula}
              disabled={carregando}
            >
              {carregando ? "⏳ Criando..." : "Confirmar e Criar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
