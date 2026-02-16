import React, { useState, useEffect } from 'react';
import { FiEdit2, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import AlunoItem from './AlunoItem';
import api from '../../../../services/api';
import Swal from 'sweetalert2';
import { getColorForEspecialidade } from '../../../../utils/utils';
import '../Styles/Modal.scss';

const AgendamentoModal = ({ isOpen, agendamento, onClose, onDelete }) => {
  const [activeTab, setActiveTab] = useState('informacoes');
  const [editFields, setEditFields] = useState({});
  const [professores, setProfessores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [salas, setSalas] = useState([]);
  const [todosAlunos, setTodosAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [searchAluno, setSearchAluno] = useState('');
  const [mostrarListaAlunos, setMostrarListaAlunos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (editFields.professor !== undefined) {
      api.get('/api/professores').then((res) => setProfessores(res.data || []));
    }
    if (editFields.especialidade !== undefined) {
      api.get('/api/especialidades').then((res) => setEspecialidades(res.data || []));
    }
    if (editFields.sala !== undefined) {
      api.get('/api/salas').then((res) => setSalas(res.data || []));
    }
  }, [editFields]);

  useEffect(() => {
    if (activeTab === 'alunos' && todosAlunos.length === 0) {
      api
        .get('/api/alunos')
        .then((res) => setTodosAlunos(res.data || []))
        .catch((err) => console.error('Erro ao carregar alunos:', err));
    }
  }, [activeTab, todosAlunos.length]);

  useEffect(() => {
    if (agendamento?.alunos) {
      setAlunosSelecionados(
        agendamento.alunos.map((a) => ({
          id: a.id || 0,
          nome: a.nome,
        })),
      );
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
    setAlunosSelecionados(
      agendamento?.alunos?.map((a) => ({
        id: a.id || 0,
        nome: a.nome,
      })) || [],
    );
    setSearchAluno('');
    setMostrarListaAlunos(false);
    onClose();
  };

  const handleAdicionarAluno = (aluno) => {
    if (aluno && !alunosSelecionados.find((a) => a.id === aluno.id)) {
      setAlunosSelecionados([
        ...alunosSelecionados,
        {
          id: aluno.id,
          nome: aluno.nome,
        },
      ]);
      setSearchAluno('');
      setMostrarListaAlunos(false);
    }
  };

  const handleRemoverAluno = (alunoId) => {
    setAlunosSelecionados(alunosSelecionados.filter((a) => a.id !== alunoId));
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: 'Confirmar alteração?',
      text: 'Tem certeza que deseja salvar estas alterações?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, salvar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const patchData = {};

      // Sempre enviar todos os campos necessários para validação
      // (data/hora, sala, professor, especialidade e alunos)

      if (editFields.horario !== undefined) {
        const dataAtual = new Date(agendamento.dataHora);
        const [horas, minutos] = editFields.horario.split(':');
        dataAtual.setHours(parseInt(horas), parseInt(minutos));
        patchData.dataHora = dataAtual.toISOString();
      } else {
        // Se não está editando horário, enviar o horário original
        patchData.dataHora = agendamento.dataHora;
      }

      if (editFields.professor !== undefined) {
        const prof = professores.find((p) => p.nome === editFields.professor);
        if (prof) patchData.professorId = prof.id;
      } else {
        // Se não está editando professor, enviar o ID original
        patchData.professorId = agendamento.professorId;
      }

      if (editFields.sala !== undefined) {
        const sala = salas.find((s) => s.nome === editFields.sala);
        if (sala) patchData.salaId = sala.id;
      } else {
        // Se não está editando sala, enviar o ID original
        patchData.salaId = agendamento.salaId;
      }

      if (editFields.especialidade !== undefined) {
        const esp = especialidades.find((e) => e.nome === editFields.especialidade);
        if (esp) patchData.especialidadeId = esp.id;
      } else {
        // Se não está editando especialidade, enviar o ID original
        patchData.especialidadeId = agendamento.especialidadeId;
      }

      if (editFields.observacoes !== undefined) {
        patchData.observacoes = editFields.observacoes;
      }

      const alunosOriginais = agendamento.alunos?.map((a) => a.id) || [];
      const alunosAtuais = alunosSelecionados.map((a) => a.id);

      const alunosMudaram =
        alunosOriginais.length !== alunosAtuais.length ||
        !alunosOriginais.every((id) => alunosAtuais.includes(id));

      if (alunosMudaram) {
        patchData.alunoIds = alunosSelecionados.map((a) => a.id);
      } else {
        // Se alunos não mudaram, enviar os IDs originais
        patchData.alunoIds = alunosOriginais;
      }

      console.log('PATCH enviado para o backend:', patchData);

      try {
        setCarregando(true);
        await api.patch(`/api/agendamentos/${agendamento.id}`, patchData);
        setEditFields({});
        Swal.fire('Alteração salva!', '', 'success');
        window.location.reload();
      } catch (e) {
        setCarregando(false);
        console.error('Erro ao salvar:', e);
        if (e.response) {
          console.error('Resposta do backend:', e.response);
          const errorMsg =
            e.response.data && typeof e.response.data === 'object'
              ? JSON.stringify(e.response.data)
              : e.response.data;
          Swal.fire('Erro ao salvar', `Erro do backend: ${errorMsg}`, 'error');
        } else {
          Swal.fire('Erro ao salvar', 'Tente novamente', 'error');
        }
      }
    }
  };

  const handleCancel = () => {
    setEditFields({});
    setAlunosSelecionados(
      agendamento?.alunos?.map((a) => ({
        id: a.id || 0,
        nome: a.nome,
      })) || [],
    );
    setSearchAluno('');
    setMostrarListaAlunos(false);
  };

  const alunosDisponiveis = todosAlunos.filter(
    (aluno) => !alunosSelecionados.find((a) => a.id === aluno.id),
  );

  const alunosMudaram =
    (agendamento.alunos?.length || 0) !== alunosSelecionados.length ||
    !agendamento.alunos?.every((a) => alunosSelecionados.find((s) => s.id === a.id));

  const temMudancas = Object.keys(editFields).length > 0 || alunosMudaram;

  if (!isOpen || !agendamento) return null;

  // Obtém a cor da especialidade
  const modalColor = getColorForEspecialidade(agendamento.especialidade).backgroundColor;

  return (
    <div 
      className="modal-overlay animate-backdropFadeIn" 
      onClick={handleClose}
      style={{
        backgroundColor: `${modalColor}15`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div 
        className="modal-content animate-slideUp" 
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 60px ${modalColor}40, 0 20px 40px rgba(0,0,0,0.15)`,
        }}
      >
        <div className="modal-header" style={{ borderBottomColor: `${modalColor}30` }}>
          <h2 style={{ color: modalColor }}>
            {agendamento.especialidade} - {formatTime(agendamento.dataHora)}h
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              className="btn-delete-aula"
              onClick={() => onDelete && onDelete(agendamento.id)}
              title="Deletar aula"
            >
              <FiTrash2 size={20} />
            </button>
            <button className="modal-close" onClick={handleClose}>
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'informacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('informacoes')}
            style={
              activeTab === 'informacoes'
                ? {
                    borderBottomColor: modalColor,
                    color: modalColor,
                  }
                : {}
            }
          >
            Informações
          </button>
          <button
            className={`modal-tab ${activeTab === 'alunos' ? 'active' : ''}`}
            onClick={() => setActiveTab('alunos')}
            style={
              activeTab === 'alunos'
                ? {
                    borderBottomColor: modalColor,
                    color: modalColor,
                  }
                : {}
            }
          >
            Alunos ({alunosSelecionados.length})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'informacoes' && (
            <div className="info-section">
              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Professor:</span>
                  <div className="info-content">
                    {editFields.professor !== undefined ? (
                      <select
                        className="info-edit-input"
                        value={editFields.professor}
                        onChange={(e) =>
                          setEditFields((fields) => ({ ...fields, professor: e.target.value }))
                        }
                        style={{
                          borderColor: modalColor,
                          accentColor: modalColor,
                        }}
                      >
                        <option value="">Selecione</option>
                        {professores.map((p) => (
                          <option key={p.id} value={p.nome}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <span className="info-value">{agendamento.professor}</span>
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setEditFields((fields) => ({
                              ...fields,
                              professor: agendamento.professor || '',
                            }))
                          }
                          title="Editar Professor"
                          style={{ color: modalColor }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Horário:</span>
                  <div className="info-content">
                    {editFields.horario !== undefined ? (
                      <input
                        type="time"
                        className="info-edit-input"
                        value={editFields.horario}
                        onChange={(e) =>
                          setEditFields((fields) => ({ ...fields, horario: e.target.value }))
                        }
                        style={{
                          borderColor: modalColor,
                          accentColor: modalColor,
                        }}
                      />
                    ) : (
                      <>
                        <span className="info-value">{formatTime(agendamento.dataHora)}</span>
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setEditFields((fields) => ({
                              ...fields,
                              horario: agendamento.dataHora
                                ? agendamento.dataHora.substring(11, 16)
                                : '',
                            }))
                          }
                          title="Editar Horário"
                          style={{ color: modalColor }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Sala:</span>
                  <div className="info-content">
                    {editFields.sala !== undefined ? (
                      <select
                        className="info-edit-input"
                        value={editFields.sala}
                        onChange={(e) =>
                          setEditFields((fields) => ({ ...fields, sala: e.target.value }))
                        }
                        style={{
                          borderColor: modalColor,
                          accentColor: modalColor,
                        }}
                      >
                        <option value="">Selecione</option>
                        {salas.map((s) => (
                          <option key={s.id} value={s.nome}>
                            {s.nome}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <span className="info-value">{agendamento.sala}</span>
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setEditFields((fields) => ({ ...fields, sala: agendamento.sala || '' }))
                          }
                          title="Editar Sala"
                          style={{ color: modalColor }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Especialidade:</span>
                  <div className="info-content">
                    {editFields.especialidade !== undefined ? (
                      <select
                        className="info-edit-input"
                        value={editFields.especialidade}
                        onChange={(e) =>
                          setEditFields((fields) => ({ ...fields, especialidade: e.target.value }))
                        }
                        style={{
                          borderColor: modalColor,
                          accentColor: modalColor,
                        }}
                      >
                        <option value="">Selecione</option>
                        {especialidades.map((e) => (
                          <option key={e.id} value={e.nome}>
                            {e.nome}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <span className="info-value">{agendamento.especialidade}</span>
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setEditFields((fields) => ({
                              ...fields,
                              especialidade: agendamento.especialidade || '',
                            }))
                          }
                          title="Editar Especialidade"
                          style={{ color: modalColor }}
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {temMudancas && (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={handleCancel} disabled={carregando}>
                    Cancelar
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={handleSave} 
                    disabled={carregando}
                    style={{ backgroundColor: modalColor }}
                  >
                    {carregando ? '⏳ Salvando...' : 'Salvar Alteração'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alunos' && (
            <div className="alunos-section">
              <div className="adicionar-aluno-box">
                <div className="adicionar-aluno-label">Adicionar Aluno</div>
                <div className="adicionar-aluno-form">
                  <div className="search-container">
                    <input
                      type="text"
                      className="aluno-search"
                      placeholder="Pesquisar aluno..."
                      value={searchAluno}
                      onChange={(e) => {
                        setSearchAluno(e.target.value);
                        setMostrarListaAlunos(true);
                      }}
                      onFocus={() => setMostrarListaAlunos(true)}
                      style={{
                        borderColor: modalColor,
                        accentColor: modalColor,
                      }}
                    />
                    {mostrarListaAlunos && (
                      <div className="search-results">
                        {alunosDisponiveis
                          .filter((aluno) =>
                            aluno.nome.toLowerCase().includes(searchAluno.toLowerCase()),
                          )
                          .slice(0, 10)
                          .map((aluno) => (
                            <div
                              key={aluno.id}
                              className="search-result-item"
                              onClick={() => handleAdicionarAluno(aluno)}
                            >
                              {aluno.nome}
                            </div>
                          ))}
                        {alunosDisponiveis.filter((aluno) =>
                          aluno.nome.toLowerCase().includes(searchAluno.toLowerCase()),
                        ).length === 0 &&
                          searchAluno && (
                            <div className="search-result-item empty">Nenhum aluno encontrado</div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lista-alunos-label">Alunos na Aula ({alunosSelecionados.length})</div>
              {alunosSelecionados.length > 0 ? (
                <div className="lista-alunos">
                  {alunosSelecionados.map((aluno) => (
                    <div key={aluno.id} className="aluno-item-wrapper">
                      <AlunoItem nome={aluno.nome} />
                      <button
                        className="btn-remover-aluno"
                        onClick={() => handleRemoverAluno(aluno.id)}
                        title="Remover aluno"
                        style={{ 
                          color: modalColor,
                          borderColor: modalColor,
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  Nenhum aluno neste agendamento.
                </p>
              )}

              <div className="info-item" style={{ marginTop: '1.5rem' }}>
                <span className="info-label">Observações sobre a aula:</span>
                <div className="info-content">
                  {editFields.observacoes !== undefined ? (
                    <textarea
                      className="info-edit-input"
                      value={editFields.observacoes}
                      onChange={(e) =>
                        setEditFields((fields) => ({ ...fields, observacoes: e.target.value }))
                      }
                      rows={3}
                      placeholder="Ex: Aluno com problemas de mobilidade no joelho direito..."
                      style={{
                        borderColor: modalColor,
                        accentColor: modalColor,
                      }}
                    />
                  ) : (
                    <>
                      <span className="info-value">
                        {agendamento.observacoes && agendamento.observacoes.trim() !== ''
                          ? agendamento.observacoes
                          : 'Nenhuma observação registrada.'}
                      </span>
                      <button
                        className="icon-btn"
                        onClick={() =>
                          setEditFields((fields) => ({
                            ...fields,
                            observacoes: agendamento.observacoes || '',
                          }))
                        }
                        title="Editar Observações"
                        style={{ color: modalColor }}
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {(alunosMudaram || editFields.observacoes !== undefined) && (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={handleCancel} disabled={carregando}>
                    Cancelar
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={handleSave} 
                    disabled={carregando}
                    style={{ backgroundColor: modalColor }}
                  >
                    {carregando ? '⏳ Salvando...' : 'Salvar Alteração'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgendamentoModal;
