import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { alunoApi } from '../../services/aluno';
import { useCarregar } from './useCarregar';
import { Card, ChipsPeriodo, EstadoCarregando, EstadoErro, Selo, Titulo } from './ui';
import {
  formatarHora,
  paraISODate,
  primeiroNome,
  rotuloDia,
  situacaoDaAula,
  somarDias,
  textoSaldo,
} from './studentUtils';

const PERIODOS = [
  { valor: 7, rotulo: '7 dias' },
  { valor: 30, rotulo: '30 dias' },
  { valor: 90, rotulo: '90 dias' },
];

function Kpi({ valor, rotulo, dica }) {
  return (
    <Card className="!p-3.5">
      <p className="text-2xl font-bold" style={{ color: 'var(--laranja-principal)' }}>
        {valor}
      </p>
      <p className="text-xs font-semibold mt-0.5">{rotulo}</p>
      {dica && (
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-cinza)' }}>
          {dica}
        </p>
      )}
    </Card>
  );
}

function BarrasPorEspecialidade({ itens }) {
  const maximo = Math.max(...itens.map((i) => i.quantidade), 1);
  return (
    <ul className="space-y-2.5">
      {itens.map((i) => (
        <li key={i.nome}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">{i.nome}</span>
            <span style={{ color: 'var(--text-cinza)' }}>{i.quantidade}</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--cor-borda)' }}>
            <div
              className="h-2 rounded-full"
              style={{
                width: `${(i.quantidade / maximo) * 100}%`,
                background: 'var(--laranja-principal)',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [dias, setDias] = useState(30);
  const { dados, carregando, erro, recarregar } = useCarregar(() => {
    const hoje = new Date();
    return alunoApi.dashboard(paraISODate(somarDias(hoje, -(dias - 1))), paraISODate(hoje));
  }, [dias]);

  const pacotesComSaldo = (dados?.pacotes || []).filter((p) => p.saldo !== 0);
  const excedido = (dados?.saldoTotal ?? 0) < 0;

  return (
    <>
      <Titulo subtitulo="Veja como estão o seu pacote e as suas aulas">
        Olá, {primeiroNome(user?.nome) || 'aluno'}
      </Titulo>

      {carregando && !dados && <EstadoCarregando />}
      {erro && <EstadoErro mensagem={erro} onTentar={recarregar} />}

      {dados && (
        <div className="space-y-4">
          <Card>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-cinza)' }}
            >
              Aulas no pacote
            </p>
            <p
              className="text-4xl font-bold mt-1"
              style={{ color: excedido ? '#b91c1c' : 'var(--laranja-principal)' }}
            >
              {dados.saldoTotal}
            </p>
            {excedido && (
              <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>
                Você está com {textoSaldo(dados.saldoTotal)}. Fale com a secretaria.
              </p>
            )}
            {pacotesComSaldo.length > 0 ? (
              <ul className="mt-3 divide-y" style={{ borderColor: 'var(--cor-borda)' }}>
                {pacotesComSaldo.map((p) => (
                  <li key={p.especialidadeId} className="flex justify-between py-2 text-sm">
                    <span>{p.especialidade}</span>
                    <span
                      className="font-semibold"
                      style={{ color: p.saldo < 0 ? '#b91c1c' : undefined }}
                    >
                      {p.saldo}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs mt-2" style={{ color: 'var(--text-cinza)' }}>
                Nenhuma aula no pacote. A secretaria define quantas aulas você tem em cada
                especialidade.
              </p>
            )}
          </Card>

          {dados.proximaAula && (
            <Link to={`/aluno/aulas/${dados.proximaAula.agendamentoId}`} className="block">
              <Card className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-cinza)' }}
                  >
                    Próxima aula
                  </p>
                  <p className="font-semibold mt-0.5 truncate">{dados.proximaAula.especialidade}</p>
                  <p className="text-sm" style={{ color: 'var(--text-cinza)' }}>
                    {rotuloDia(dados.proximaAula.dataHora)} às{' '}
                    {formatarHora(dados.proximaAula.dataHora)} · {dados.proximaAula.sala}
                  </p>
                </div>
                <Selo tom={situacaoDaAula(dados.proximaAula).tom}>
                  {situacaoDaAula(dados.proximaAula).rotulo}
                </Selo>
                <FiChevronRight style={{ color: 'var(--text-cinza)' }} />
              </Card>
            </Link>
          )}

          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-sm">Resumo do período</h2>
            <ChipsPeriodo
              opcoes={PERIODOS}
              valor={dias}
              onChange={setDias}
              rotuloGrupo="Período do resumo"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Kpi valor={dados.aulasRealizadas} rotulo="Aulas realizadas" />
            <Kpi valor={dados.aulasAgendadas} rotulo="Aulas agendadas" dica="daqui para frente" />
            <Kpi valor={dados.aulasCanceladas} rotulo="Canceladas" />
            <Kpi
              valor={dados.aulasPerdidas}
              rotulo="Descontadas"
              dica="canceladas com menos de 24h"
            />
          </div>

          <Card>
            <h3 className="font-semibold text-sm mb-3">Mais frequentes</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs" style={{ color: 'var(--text-cinza)' }}>
                  Especialidade
                </dt>
                <dd className="font-semibold">{dados.especialidadeMaisFrequente || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: 'var(--text-cinza)' }}>
                  Dia da semana
                </dt>
                <dd className="font-semibold capitalize">{dados.diaSemanaMaisFrequente || '—'}</dd>
              </div>
            </dl>
          </Card>

          {dados.aulasPorEspecialidade.length > 0 && (
            <Card>
              <h3 className="font-semibold text-sm mb-3">Aulas por especialidade</h3>
              <BarrasPorEspecialidade itens={dados.aulasPorEspecialidade} />
            </Card>
          )}

          {dados.aulasRealizadas === 0 && (
            <p className="text-xs text-center" style={{ color: 'var(--text-cinza)' }}>
              Você ainda não fez aulas neste período.
            </p>
          )}
        </div>
      )}
    </>
  );
}
