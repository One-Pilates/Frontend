import React from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export default function Etapa3Alunos(props) {
  const {
    alunos,
    searchAluno,
    setSearchAluno,
    mostrarListaAlunos,
    setMostrarListaAlunos,
    alunosDisponiveis,
    erros,
    handleAdicionarAluno,
    handleRemoverAluno,
  } = props;

  return (
    <div className="etapa-content">
      <h2>Quais alunos participarão?</h2>

      <div className="form-group search-group">
        <label htmlFor="search-aluno">Pesquisar Aluno *</label>
        <div className="search-container">
          <input
            type="text"
            id="search-aluno"
            className="search-input"
            placeholder="Pesquisar aluno por nome..."
            value={searchAluno}
            onChange={(e) => {
              setSearchAluno(e.target.value);
              setMostrarListaAlunos(true);
            }}
            onFocus={() => setMostrarListaAlunos(true)}
          />
          {mostrarListaAlunos && (
            <div className="search-results">
              {alunosDisponiveis
                .filter((aluno) => aluno.nome.toLowerCase().includes(searchAluno.toLowerCase()))
                .slice(0, 10)
                .map((aluno) => (
                  <div
                    key={aluno.id}
                    className="search-result-item"
                    onClick={() => handleAdicionarAluno(aluno)}
                  >
                    <FiPlus size={16} /> {aluno.nome}
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

      <div className="alunos-selecionados">
        <h3>Alunos Selecionados ({alunos.length})</h3>
        {alunos.length > 0 ? (
          <div className="alunos-list">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="aluno-card">
                <span className="aluno-nome">{aluno.nome}</span>
                <button
                  className="btn-remove-aluno"
                  onClick={() => handleRemoverAluno(aluno.id)}
                  title="Remover aluno"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-alunos">Nenhum aluno selecionado</p>
        )}
        {erros.alunos && <span className="error-message">{erros.alunos}</span>}
      </div>
    </div>
  );
}
