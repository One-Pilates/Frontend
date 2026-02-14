import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

export default function Etapa4Confirmacao(props) {
  const {
    dataHora,
    professor,
    sala,
    especialidade,
    observacoes,
    setObservacoes,
    alunos,
    professores,
    salas,
    especialidades,
    irParaEtapa,
  } = props;

  const professoresMap = professores.find((p) => p.id === parseInt(professor));
  const salasMap = salas.find((s) => s.id === parseInt(sala));
  const especialidadesMap = especialidades.find((e) => e.id === parseInt(especialidade));

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="etapa-content">
      <h2>Confirme os dados</h2>

      <div className="confirmation-card">
        <div className="confirmation-section">
          <h3>Data e Hora</h3>
          <div className="confirmation-item">
            <span className="label">Data:</span>
            <span className="value">{formatarData(dataHora.data)}</span>
            <button className="btn-edit-mini" onClick={() => irParaEtapa(1)} title="Editar">
              <FiEdit2 size={14} />
            </button>
          </div>
          <div className="confirmation-item">
            <span className="label">Horário:</span>
            <span className="value">{dataHora.horario}</span>
          </div>
        </div>

        <div className="confirmation-section">
          <h3>Turma</h3>
          <div className="confirmation-item">
            <span className="label">Professor:</span>
            <span className="value">{professoresMap?.nome}</span>
            <button className="btn-edit-mini" onClick={() => irParaEtapa(2)} title="Editar">
              <FiEdit2 size={14} />
            </button>
          </div>
          <div className="confirmation-item">
            <span className="label">Sala:</span>
            <span className="value">{salasMap?.nome}</span>
          </div>
          <div className="confirmation-item">
            <span className="label">Especialidade:</span>
            <span className="value">{especialidadesMap?.nome}</span>
          </div>
        </div>

        <div className="confirmation-section">
          <h3>Alunos ({alunos.length})</h3>
          {alunos.length > 0 ? (
            <>
              <div className="alunos-confirmation">
                {alunos.map((aluno) => (
                  <div key={aluno.id} className="aluno-confirmation">
                    {aluno.nome}
                  </div>
                ))}
              </div>
              <button className="btn-edit-mini" onClick={() => irParaEtapa(3)} title="Editar">
                <FiEdit2 size={14} /> Editar alunos
              </button>
            </>
          ) : (
            <p>Nenhum aluno selecionado</p>
          )}
        </div>

        <div className="confirmation-section">
          <h3>Observações</h3>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicionar observações (opcional)"
            className="textarea-observacoes"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
