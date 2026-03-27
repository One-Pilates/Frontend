import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { FaWheelchair } from 'react-icons/fa';

export default function Etapa4Confirmacao(props) {
  const {
    dataHora,
    professor,
    sala,
    especialidade,
    alunos,
    todosAlunos = [],
    professores,
    salas,
    especialidades,
    irParaEtapa,
  } = props;

  const professoresMap = professores.find((p) => p.id === parseInt(professor));
  const salasMap = salas.find((s) => s.id === parseInt(sala));
  const especialidadesMap = especialidades.find((e) => e.id === parseInt(especialidade));

  const getAlunoCompleto = (aluno) => {
    const completo = todosAlunos.find((a) => a.id === aluno.id);
    return completo || aluno;
  };

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
            {irParaEtapa && (
              <button className="btn-edit-mini" onClick={() => irParaEtapa(1)} title="Editar">
                <FiEdit2 size={14} />
              </button>
            )}
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
            {irParaEtapa && (
              <button className="btn-edit-mini" onClick={() => irParaEtapa(2)} title="Editar">
                <FiEdit2 size={14} />
              </button>
            )}
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
                {alunos.map((aluno) => {
                  const alunoCompleto = getAlunoCompleto(aluno);
                  return (
                    <div
                      key={aluno.id}
                      className="aluno-confirmation"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {aluno.nome}
                      {alunoCompleto.alunoComLimitacoesFisicas && (
                        <FaWheelchair
                          size={13}
                          style={{ color: '#0066cc' }}
                          title="Limitação física"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {irParaEtapa && (
                <button className="btn-edit-mini" onClick={() => irParaEtapa(3)} title="Editar">
                  <FiEdit2 size={14} /> Editar alunos
                </button>
              )}
            </>
          ) : (
            <p>Nenhum aluno selecionado</p>
          )}
        </div>
      </div>
    </div>
  );
}
