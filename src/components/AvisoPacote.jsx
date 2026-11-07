import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Aviso (não bloqueante) mostrado a quem agenda: alunos que ficarão além do pacote de aulas.
 * `avisos` é a lista de { alunoId, aluno, saldoAtual, mensagem } devolvida por
 * GET /api/agendamentos/verificar-pacote, já filtrada para quem excede.
 */
export default function AvisoPacote({ avisos = [] }) {
  if (!avisos.length) return null;

  return (
    <div
      role="alert"
      style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        border: '1px solid #fcd34d',
        background: '#fffbeb',
        color: '#92400e',
        fontSize: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <FiAlertTriangle size={16} aria-hidden="true" />
        Aluno sem aulas disponíveis no pacote
      </div>
      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
        {avisos.map((a) => (
          <li key={a.alunoId}>{a.mensagem}</li>
        ))}
      </ul>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
        Você ainda pode agendar: a aula fica além do pacote até a secretaria ajustar o saldo.
      </p>
    </div>
  );
}
