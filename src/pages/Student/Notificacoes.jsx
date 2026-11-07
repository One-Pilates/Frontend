import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiBell, FiCalendar, FiCheckCircle, FiPackage, FiXCircle } from 'react-icons/fi';
import { EstadoCarregando, EstadoVazio } from './ui';

const ICONES = {
  lembrete: FiBell,
  confirmada: FiCheckCircle,
  cancelamento: FiXCircle,
  pacote: FiPackage,
};

export default function Notificacoes() {
  const navigate = useNavigate();
  const { notificacoes } = useOutletContext();
  const { itens, naoLidas, carregando, marcarComoLida, marcarTodasComoLidas } = notificacoes;

  if (carregando && itens.length === 0) return <EstadoCarregando />;

  const abrir = (n) => {
    marcarComoLida(n.id);
    if (n.agendamentoId) navigate(`/aluno/aulas/${n.agendamentoId}`);
  };

  return (
    <>
      {itens.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm" style={{ color: 'var(--text-cinza)' }}>
            {naoLidas === 0 ? 'Tudo lido' : naoLidas === 1 ? '1 não lida' : `${naoLidas} não lidas`}
          </p>
          {naoLidas > 0 && (
            <button
              type="button"
              onClick={marcarTodasComoLidas}
              className="text-xs font-semibold"
              style={{ color: 'var(--laranja-principal)' }}
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
      )}

      {itens.length === 0 ? (
        <EstadoVazio
          icone={FiCalendar}
          titulo="Nenhuma notificação"
          texto="Lembretes de aula, confirmações e avisos do seu pacote aparecem aqui."
        />
      ) : (
        <ul className="space-y-3">
          {itens.map((n) => {
            const Icone = ICONES[n.tipo] || FiBell;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => abrir(n)}
                  className="w-full flex items-start gap-3 rounded-2xl p-3.5 text-left"
                  style={{
                    background: n.lida ? 'var(--branco)' : '#fff3ea',
                    color: n.lida ? 'var(--text-escuro)' : '#1a1a1a',
                    boxShadow: n.lida
                      ? '0 1px 2px rgba(0,0,0,0.06)'
                      : '0 1px 4px rgba(247,116,51,0.25)',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center rounded-xl w-10 h-10 shrink-0"
                    style={{
                      background: n.lida ? 'var(--bg-claro)' : '#ffe3d1',
                      color: n.lida ? 'var(--text-cinza)' : 'var(--laranja-principal)',
                    }}
                  >
                    <Icone size={18} aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm">{n.titulo}</span>
                      {!n.lida && (
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ background: 'var(--laranja-principal)' }}
                          aria-label="Não lida"
                        />
                      )}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: n.lida ? 'var(--text-cinza)' : '#555' }}
                    >
                      {n.texto}
                    </span>
                    <span className="block text-[11px] mt-1" style={{ color: 'var(--text-cinza)' }}>
                      {n.meta}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
