import React from 'react';

export default function Etapa2Turma(props) {
  const {
    professor,
    setProfessor,
    sala,
    setSala,
    especialidade,
    setEspecialidade,
    professores,
    salas,
    especialidades,
    erros,
  } = props;

  return (
    <div className="etapa-content">
      <h2>Qual é a turma?</h2>

      <div className="form-group">
        <label htmlFor="especialidade">Especialidade *</label>
        <select
          id="especialidade"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          className={erros.especialidade ? 'input-error' : ''}
        >
          <option value="">Selecione uma especialidade</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nome}
            </option>
          ))}
        </select>
        {erros.especialidade && <span className="error-message">{erros.especialidade}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="sala">Sala *</label>
        <select
          id="sala"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
          className={`${erros.sala ? 'input-error' : ''} ${!especialidade ? 'input-disabled-warning' : ''}`}
          disabled={!especialidade}
        >
          <option value="">
            {!especialidade ? 'Selecione uma especialidade primeiro' : 'Selecione uma sala'}
          </option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
        {erros.sala && <span className="error-message">{erros.sala}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="professor">Professor *</label>
        <select
          id="professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          className={`${erros.professor ? 'input-error' : ''} ${!especialidade || !sala ? 'input-disabled-warning' : ''}`}
          disabled={!especialidade || !sala}
        >
          <option value="">
            {!especialidade
              ? 'Selecione uma especialidade primeiro'
              : !sala
                ? 'Selecione uma sala primeiro'
                : 'Selecione um professor'}
          </option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
        {erros.professor && <span className="error-message">{erros.professor}</span>}
      </div>
    </div>
  );
}
