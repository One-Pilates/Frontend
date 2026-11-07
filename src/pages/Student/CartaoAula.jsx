import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Avatar, Card, Selo } from './ui';
import { descricaoCancelamento, formatarHora, situacaoDaAula } from './studentUtils';

/** Cartão de aula usado na Agenda e no Histórico. Aulas canceladas não têm detalhe para abrir. */
export default function CartaoAula({ aula }) {
  const selo = situacaoDaAula(aula);
  const cancelada = aula.situacao === 'CANCELADA';

  const conteudo = (
    <Card className="flex items-center gap-3">
      <div className="text-center shrink-0 w-14">
        <p className="text-lg font-bold leading-tight">{formatarHora(aula.dataHora)}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-cinza)' }}>
          {aula.duracaoMinutos} min
        </p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold truncate">{aula.especialidade}</p>
          <Selo tom={selo.tom}>{selo.rotulo}</Selo>
        </div>
        <div
          className="flex items-center gap-1.5 mt-1 text-xs"
          style={{ color: 'var(--text-cinza)' }}
        >
          <Avatar
            nome={aula.professor}
            professorId={aula.professorId}
            comFoto={!!aula.professorFoto}
            tamanho={20}
          />
          <span className="truncate">
            {aula.professor} · {aula.sala}
          </span>
        </div>
        {cancelada && (
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-cinza)' }}>
            {descricaoCancelamento(aula)}
          </p>
        )}
      </div>
      {!cancelada && <FiChevronRight style={{ color: 'var(--text-cinza)' }} />}
    </Card>
  );

  if (cancelada) return <li>{conteudo}</li>;
  return (
    <li>
      <Link to={`/aluno/aulas/${aula.agendamentoId}`} className="block">
        {conteudo}
      </Link>
    </li>
  );
}
