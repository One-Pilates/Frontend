import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FiCalendar, FiClock, FiEdit3, FiMapPin } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { alunoApi, mensagemDeErro } from '../../services/aluno';
import { useCarregar } from './useCarregar';
import { Avatar, Card, EstadoCarregando, EstadoErro, Selo } from './ui';
import {
  ORIENTACAO_PADRAO,
  avisoDeCancelamento,
  formatarDataLonga,
  formatarHora,
  situacaoDaAula,
} from './studentUtils';

function Linha({ icone, rotulo, children }) {
  const Icone = icone;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Icone size={16} style={{ color: 'var(--laranja-principal)' }} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px]" style={{ color: 'var(--text-cinza)' }}>
          {rotulo}
        </p>
        <div className="text-sm font-semibold">{children}</div>
      </div>
    </div>
  );
}

export default function AulaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificacoes } = useOutletContext();
  const { dados: aula, carregando, erro, recarregar } = useCarregar(() => alunoApi.aula(id), [id]);
  const [enviando, setEnviando] = useState(false);

  if (carregando && !aula) return <EstadoCarregando />;
  if (erro) return <EstadoErro mensagem={erro} onTentar={recarregar} />;
  if (!aula) return null;

  const selo = situacaoDaAula(aula);
  const agendada = aula.situacao === 'AGENDADA';

  const confirmarPresenca = async () => {
    setEnviando(true);
    try {
      await alunoApi.confirmarPresenca(aula.agendamentoId);
      toast.success('Presença confirmada!');
      await Promise.all([recarregar(), notificacoes.recarregar()]);
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Não foi possível confirmar a presença.'));
    } finally {
      setEnviando(false);
    }
  };

  const cancelarAula = async () => {
    const decisao = await Swal.fire({
      icon: aula.cancelamentoSemPerda ? 'question' : 'warning',
      title: 'Cancelar esta aula?',
      text: avisoDeCancelamento(aula),
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar aula',
      cancelButtonText: 'Manter aula',
      confirmButtonColor: '#dc2626',
      focusCancel: true,
    });
    if (!decisao.isConfirmed) return;

    setEnviando(true);
    try {
      const resultado = await alunoApi.cancelarAula(aula.agendamentoId);
      if (resultado.foraDoPrazo) toast.warning(resultado.mensagem, { duration: 8000 });
      else toast.success(resultado.mensagem);
      notificacoes.recarregar();
      navigate('/aluno/agenda', { replace: true });
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Não foi possível cancelar a aula.'));
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div
          className="flex items-center justify-between gap-3 pb-3 mb-1 border-b"
          style={{ borderColor: 'var(--cor-borda)' }}
        >
          <h1 className="text-xl font-bold">{aula.especialidade}</h1>
          <Selo tom={selo.tom}>{selo.rotulo}</Selo>
        </div>

        <Linha icone={FiCalendar} rotulo="Data">
          {formatarDataLonga(aula.dataHora)}
        </Linha>
        <Linha icone={FiClock} rotulo="Horário">
          {formatarHora(aula.dataHora)} • {aula.duracaoMinutos} min
        </Linha>
        <div className="flex items-center gap-3 py-2.5">
          <Avatar
            nome={aula.professor}
            professorId={aula.professorId}
            comFoto={!!aula.professorFoto}
            tamanho={22}
          />
          <div className="min-w-0">
            <p className="text-[11px]" style={{ color: 'var(--text-cinza)' }}>
              Professor(a)
            </p>
            <p className="text-sm font-semibold">{aula.professor}</p>
          </div>
        </div>
        <Linha icone={FiMapPin} rotulo="Sala">
          {aula.sala}
        </Linha>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 text-sm font-semibold mb-1.5">
          <FiEdit3 size={15} style={{ color: 'var(--laranja-principal)' }} aria-hidden="true" />
          Orientações
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-cinza)' }}>
          {ORIENTACAO_PADRAO}
        </p>
      </Card>

      {agendada && (
        <div className="space-y-3 pt-1">
          {aula.presencaConfirmada ? (
            <p
              className="rounded-2xl py-3 text-center text-sm font-semibold"
              style={{ background: '#e7f6ec', color: '#15803d', border: '1px solid #86d3a3' }}
              role="status"
            >
              Presença confirmada
            </p>
          ) : (
            <button
              type="button"
              onClick={confirmarPresenca}
              disabled={enviando}
              className="w-full rounded-2xl py-3 text-sm font-semibold disabled:opacity-60"
              style={{ background: '#e7f6ec', color: '#15803d', border: '1px solid #86d3a3' }}
            >
              {enviando ? 'Enviando...' : 'Confirmar Presença'}
            </button>
          )}

          {aula.podeCancelar && (
            <button
              type="button"
              onClick={cancelarAula}
              disabled={enviando}
              className="w-full rounded-2xl py-3 text-sm font-semibold disabled:opacity-60"
              style={{ background: '#fdecec', color: '#b91c1c', border: '1px solid #f5b5b5' }}
            >
              Cancelar aula
            </button>
          )}
          {aula.podeCancelar && (
            <p className="text-[11px] text-center" style={{ color: 'var(--text-cinza)' }}>
              {aula.cancelamentoSemPerda
                ? 'Cancelando agora, a aula volta para o seu pacote.'
                : 'Faltam menos de 24h: se cancelar, a aula é descontada do seu pacote.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
