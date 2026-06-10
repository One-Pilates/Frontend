import React from 'react';
import { FiUserPlus, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { FaWheelchair } from 'react-icons/fa';

export default function Etapa3Alunos({
  alunos,
  alunosDisponiveis,
  erros,
  handleAdicionarAluno,
  handleRemoverAluno,
}) {
  const [filtroAluno, setFiltroAluno] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alunosOrdenados = [...(alunosDisponiveis || [])].sort((a, b) =>
    (a?.nome || '').localeCompare(b?.nome || '', 'pt-BR', { sensitivity: 'base' }),
  );

  const getInitials = (nome) => {
    const partes = nome?.trim().split(' ') || [];
    if (partes.length === 1) return partes[0][0]?.toUpperCase() || '?';
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div className="etapa-content">
      <div className="etapa-header">
        <div className="etapa-icon">
          <FiUserPlus size={22} />
        </div>
        <div className="etapa-title-group">
          <h2>Quais alunos participarão?</h2>
          <p>Selecione os alunos na lista em ordem alfabética</p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="select-aluno">
          Selecionar Aluno <span className="required">*</span>
        </label>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: dropdownOpen ? '1px solid var(--laranja-principal, #ea580c)' : '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px 12px',
            background: '#fff',
            boxShadow: dropdownOpen ? '0 0 0 3px rgba(234, 88, 12, 0.15)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            <input
              type="text"
              placeholder="Buscar ou selecionar aluno..."
              value={filtroAluno}
              onChange={(e) => {
                setFiltroAluno(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent',
                fontSize: '0.9rem',
                color: 'var(--text-escuro, #1e293b)'
              }}
            />
            <FiChevronDown style={{ color: dropdownOpen ? 'var(--laranja-principal, #ea580c)' : '#94a3b8', transition: 'all 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', cursor: 'pointer', marginLeft: '8px' }} onClick={() => setDropdownOpen(!dropdownOpen)} />
          </div>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              zIndex: 50,
              maxHeight: '220px',
              overflowY: 'auto',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              padding: '6px 0',
            }}>
              {alunosOrdenados.filter(a => a.nome.toLowerCase().includes(filtroAluno.toLowerCase())).length === 0 ? (
                <div style={{ padding: '8px 12px', color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>Nenhum aluno encontrado</div>
              ) : (
                alunosOrdenados.filter(a => a.nome.toLowerCase().includes(filtroAluno.toLowerCase())).map(aluno => (
                  <div
                    key={aluno.id}
                    onClick={() => {
                      handleAdicionarAluno(aluno);
                      setFiltroAluno('');
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: 'var(--text-escuro, #1e293b)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {aluno.nome}
                      {aluno.alunoComLimitacoesFisicas && (
                        <span title="Aluno PCD">♿</span>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {erros.alunos && <span className="error-message">{erros.alunos}</span>}
      </div>

      <div className={`alunos-selecionados${alunos.length > 0 ? ' tem-alunos' : ''}`}>
        <div className="alunos-header">
          <h3>Alunos Selecionados</h3>
          {alunos.length > 0 && (
            <span className="alunos-counter">{alunos.length}</span>
          )}
        </div>

        {alunos.length > 0 ? (
          <div className="alunos-list">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="aluno-card">
                <div className="aluno-info">
                  <div className="aluno-avatar">{getInitials(aluno.nome)}</div>
                  <div>
                    <span className="aluno-nome">{aluno.nome}</span>
                    {aluno.alunoComLimitacoesFisicas && (
                      <div className="pcd-badge" title="Aluno PCD">
                        ♿
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="btn-remove-aluno"
                  onClick={() => handleRemoverAluno(aluno.id)}
                  title="Remover aluno"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-alunos">Nenhum aluno adicionado ainda</p>
        )}
      </div>
    </div>
  );
}
