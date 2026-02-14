import Input from "../components/Input";
import "./informacoesAlunos.scss";

export default function InformacoesAlunoScreen({
  dados,
  atualizar,
  erros = {},
}) {
  return (
    <div className="informacoes-aluno-screen">
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

        <div className="textarea-section">
          <label className="textarea-label">
            Observações
          </label>
          <textarea
            placeholder="Digite observações sobre o aluno..."
            value={dados.observacoes || ""}
            onChange={(e) => atualizar({ observacoes: e.target.value })}
            className={`textarea-field ${erros.observacoes ? "textarea-error" : ""}`}
            rows={6}
          />
          {erros.observacoes && (
            <span className="error-message">{erros.observacoes}</span>
          )}
        </div>
      </div>
    </div>
  );
}