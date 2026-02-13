import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import AlunoItem from "./AlunoItem";
import "../Styles/Modal.scss";

const AgendamentoModal = ({ isOpen, agendamento, onClose }) => {
  const [activeTab, setActiveTab] = useState("informacoes");

  if (!isOpen || !agendamento) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleClose = () => {
    setActiveTab("informacoes");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {agendamento.especialidade} - {formatTime(agendamento.dataHora)}h
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === "informacoes" ? "active" : ""}`}
            onClick={() => setActiveTab("informacoes")}
          >
            Informações
          </button>
          <button
            className={`modal-tab ${activeTab === "alunos" ? "active" : ""}`}
            onClick={() => setActiveTab("alunos")}
          >
            Alunos ({agendamento.alunos?.length || 0})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "informacoes" && (
            <div className="info-section">
              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Especialidade:</span>
                  <span className="info-value">{agendamento.especialidade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Professor:</span>
                  <span className="info-value">{agendamento.professor}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sala:</span>
                  <span className="info-value">{agendamento.sala}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Horário:</span>
                  <span className="info-value">
                    {formatTime(agendamento.dataHora)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Observações:</span>
                  <span className="info-value">
                    {agendamento.observacoes && agendamento.observacoes.trim() !== ''
                      ? agendamento.observacoes
                      : 'Esse aula não possui observações.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alunos" && (
            <div className="alunos-section">
              {agendamento.alunos && agendamento.alunos.length > 0 ? (
                agendamento.alunos.map((aluno, i) => (
                  <AlunoItem key={i} nome={aluno.nome} status={aluno.status} />
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#888" }}>
                  Nenhum aluno neste agendamento.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendamentoModal;
