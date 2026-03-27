import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import AlunoItem from './AlunoItem';
import api from '../../../../services/api';
import { toast } from 'sonner';
import '../Styles/Modal.scss';

const AgendamentoModal = ({ isOpen, agendamento, onClose }) => {
  const [activeTab, setActiveTab] = useState('informacoes');
  const [carregando, setCarregando] = useState(false);
  const [observacoesExpandidas, setObservacoesExpandidas] = useState({});
  const [observacoesAlunos, setObservacoesAlunos] = useState({});
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    if (agendamento?.alunos) {
      const obsMap = {};
      agendamento.alunos.forEach((a) => {
        if (a.observacao) obsMap[a.id] = a.observacao;
      });
      setObservacoesAlunos(obsMap);
    } else {
      setObservacoesAlunos({});
    }
  }, [agendamento]);

  if (!isOpen || !agendamento) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleClose = () => {
    setActiveTab('informacoes');
    setEditFields({});
    setObservacoesExpandidas({});
    onClose();
  };

  const handleSalvarObservacao = async (alunoId) => {
    const observacao = editFields[`observacao_${alunoId}`] || '';
    try {
      setCarregando(true);
      await api.patch(`/api/agendamentos/${agendamento.id}/alunos/${alunoId}/observacao`, {
        observacao: observacao || null,
      });
      setObservacoesAlunos((prev) => ({ ...prev, [alunoId]: observacao || null }));
      setEditFields((fields) => {
        const next = { ...fields };
        delete next[`observacao_${alunoId}`];
        return next;
      });
      setCarregando(false);
      toast.success('Observação salva com sucesso!');
    } catch (e) {
      setCarregando(false);
      console.error('Erro ao salvar observação:', e);
      const msg =
        e.response?.data && typeof e.response.data === 'object'
          ? JSON.stringify(e.response.data)
          : e.response?.data || 'Tente novamente.';
      toast.error(`Erro ao salvar: ${msg}`);
    }
  };

  return (
    <div className="modal-overlay animate-backdropFadeIn" onClick={handleClose}>
      <div className="modal-content animate-slideUp" onClick={(e) => e.stopPropagation()}>
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
            className={`modal-tab ${activeTab === 'informacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('informacoes')}
          >
            Informações
          </button>
          <button
            className={`modal-tab ${activeTab === 'alunos' ? 'active' : ''}`}
            onClick={() => setActiveTab('alunos')}
          >
            Alunos ({agendamento.alunos?.length || 0})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'informacoes' && (
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
                  <span className="info-value">{formatTime(agendamento.dataHora)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alunos' && (
            <div className="alunos-section">
              {agendamento.alunos && agendamento.alunos.length > 0 ? (
                agendamento.alunos.map((aluno) => {
                  const observacaoAtual =
                    observacoesAlunos[aluno.id] !== undefined
                      ? observacoesAlunos[aluno.id]
                      : aluno.observacao || '';
                  const editando = editFields[`observacao_${aluno.id}`] !== undefined;
                  const expandido = observacoesExpandidas[aluno.id] || false;
                  const temPCD = aluno.alunoComLimitacoesFisicas ?? false;

                  return (
                    <div
                      key={aluno.id}
                      style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        border: '1px solid var(--cor-borda, #e0e0e0)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <AlunoItem
                          nome={aluno.nome}
                          status={aluno.status}
                          alunoComLimitacoesFisicas={temPCD}
                        />
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setObservacoesExpandidas((prev) => ({
                              ...prev,
                              [aluno.id]: !prev[aluno.id],
                            }))
                          }
                          title={expandido ? 'Ocultar observações' : 'Mostrar observações'}
                          style={{ marginLeft: 'auto' }}
                        >
                          {expandido ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {expandido && (
                        <div className="info-item" style={{ marginTop: '0.5rem' }}>
                          <span className="info-label">Observação — {aluno.nome}:</span>
                          <div
                            className="info-content"
                            style={{ flexDirection: 'column', alignItems: 'stretch' }}
                          >
                            {editando ? (
                              <div style={{ marginTop: '0.5rem', width: '100%' }}>
                                <textarea
                                  className="info-edit-input"
                                  value={editFields[`observacao_${aluno.id}`]}
                                  onChange={(e) =>
                                    setEditFields((f) => ({
                                      ...f,
                                      [`observacao_${aluno.id}`]: e.target.value,
                                    }))
                                  }
                                  rows={3}
                                  placeholder="Ex: Aluno com limitações no joelho direito..."
                                  style={{ width: '100%' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <button
                                    className="icon-btn"
                                    onClick={() =>
                                      setEditFields((f) => {
                                        const next = { ...f };
                                        delete next[`observacao_${aluno.id}`];
                                        return next;
                                      })
                                    }
                                    title="Cancelar"
                                  >
                                    <FiX size={16} />
                                  </button>
                                  <button
                                    className="icon-btn"
                                    onClick={() => handleSalvarObservacao(aluno.id)}
                                    title="Salvar observação"
                                    disabled={carregando}
                                    style={{ color: '#FF6600' }}
                                  >
                                    <FiSave size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span
                                  className="info-value"
                                  style={{ display: 'block', marginTop: '0.5rem' }}
                                >
                                  {observacaoAtual && observacaoAtual.trim() !== ''
                                    ? observacaoAtual
                                    : 'Nenhuma observação registrada.'}
                                </span>
                                <button
                                  className="icon-btn"
                                  onClick={() =>
                                    setEditFields((f) => ({
                                      ...f,
                                      [`observacao_${aluno.id}`]: observacaoAtual || '',
                                    }))
                                  }
                                  title="Editar observação"
                                  style={{ marginTop: '0.5rem' }}
                                >
                                  <FiEdit2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>
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
