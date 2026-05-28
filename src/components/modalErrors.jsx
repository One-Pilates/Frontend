import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ModalErrors({
  erros = [],
  onCancel,
  onConfirm,
  titulo = 'Conflito de agendamento',
  subtitulo = 'Foram encontrados conflitos. Deseja continuar mesmo assim?',
}) {
  const listaErros = Array.isArray(erros) ? erros : erros ? [String(erros)] : [];

  if (!listaErros.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="conflitos-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
      >
        <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: '#fff4ee', color: '#c94d0e' }}
          >
            <FiAlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <span
              className="mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: '#fff4ee', color: '#a33a05' }}
            >
              Conflitos
            </span>
            <p id="conflitos-title" className="text-base font-bold tracking-tight text-slate-900">
              {titulo}
            </p>
            <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-transparent p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar modal"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="max-h-[300px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-3">
              {listaErros.map((erro, index) => (
                <div
                  key={`${index}-${erro}`}
                  className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/80 px-4 py-3"
                >
                  <span
                    className="mt-0.5 text-base font-semibold"
                    style={{ color: 'var(--laranja-principal)' }}
                  >
                    •
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed">{erro}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-orange-100 transition hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--laranja-principal)' }}
          >
            Confirmar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
}
