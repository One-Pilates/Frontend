import { FaClipboardList } from 'react-icons/fa';
import Input from '../components/Input';
import './informacoesAlunos.scss';

export default function InformacoesAlunoScreen({
  dados,
  atualizar,
  erros = {},
  pacotes = [],
  atualizarPacote = () => {},
}) {
  return (
    <div className="informacoes-aluno-screen etapa-content">
      <div className="etapa-header">
        <div className="etapa-icon">
          <FaClipboardList size={18} />
        </div>
        <div className="etapa-title-group">
          <h2>Informações do Aluno</h2>
          <p>Dados de saúde e observações</p>
        </div>
      </div>
      <div className="aluno-content">
        <div className="checkbox-item">
          <label className="checkbox-toggle-label">
            <input
              type="checkbox"
              checked={dados.problemasMobilidade || false}
              onChange={(e) => atualizar({ problemasMobilidade: e.target.checked })}
              className="checkbox-toggle-input"
            />
            <span className="checkbox-toggle-text">Problema de mobilidade</span>
          </label>
        </div>

        <div className="checkbox-item">
          <label className="checkbox-toggle-label">
            <input
              type="checkbox"
              checked={dados.notificacaoAtiva ?? true}
              onChange={(e) => atualizar({ notificacaoAtiva: e.target.checked })}
              className="checkbox-toggle-input"
            />
            <span className="checkbox-toggle-text">Ativar notificações por e-mail</span>
          </label>
        </div>

        <div className="pacote-section">
          <label className="textarea-label">Pacote de aulas</label>
          <p className="pacote-ajuda">
            Quantas aulas o aluno tem em cada especialidade. A aula é descontada ao agendar; o
            sistema avisa quando o aluno passa do pacote, mas não bloqueia o agendamento.
          </p>
          {pacotes.length === 0 ? (
            <p className="pacote-ajuda">Nenhuma especialidade cadastrada.</p>
          ) : (
            <div className="pacote-grid">
              {pacotes.map((p) => (
                <label key={p.especialidadeId} className="pacote-item">
                  <span className="pacote-nome">{p.especialidade}</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={p.saldo}
                    onChange={(e) => atualizarPacote(p.especialidadeId, e.target.value)}
                    className="pacote-input"
                    aria-label={`Aulas de ${p.especialidade}`}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="textarea-section">
          <label className="textarea-label">Observações</label>
          <textarea
            placeholder="Digite observações sobre o aluno..."
            value={dados.observacao || ''}
            onChange={(e) => atualizar({ observacao: e.target.value })}
            className={`textarea-field ${erros.observacao ? 'textarea-error' : ''}`}
            rows={6}
          />
          {erros.observacao && <span className="error-message">{erros.observacao}</span>}
        </div>
      </div>
    </div>
  );
}
