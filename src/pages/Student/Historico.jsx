import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { alunoApi } from '../../services/aluno';
import { useCarregar } from './useCarregar';
import CartaoAula from './CartaoAula';
import { Card, ChipsPeriodo, EstadoCarregando, EstadoErro, EstadoVazio, Titulo } from './ui';
import { agruparPorDia, paraISODate, somarDias } from './studentUtils';

const PRESETS = [
  { valor: 7, rotulo: '7 dias' },
  { valor: 30, rotulo: '30 dias' },
  { valor: 90, rotulo: '90 dias' },
];

/** Aulas já realizadas (e canceladas) em um intervalo de datas escolhido pelo aluno. */
export default function Historico() {
  const hoje = paraISODate(new Date());
  const [de, setDe] = useState(paraISODate(somarDias(new Date(), -29)));
  const [ate, setAte] = useState(hoje);

  const intervaloInvalido = !de || !ate || de > ate;
  const presetAtivo = PRESETS.find(
    (p) => ate === hoje && de === paraISODate(somarDias(new Date(), -(p.valor - 1))),
  )?.valor;

  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    if (intervaloInvalido) return [];
    const aulas = await alunoApi.aulas(de, ate);
    // mais recentes primeiro; aulas futuras ficam na Agenda
    return aulas.filter((a) => a.situacao !== 'AGENDADA').reverse();
  }, [de, ate]);

  const realizadas = (dados || []).filter((a) => a.situacao === 'REALIZADA').length;
  const grupos = dados ? agruparPorDia(dados) : [];

  const escolherPreset = (dias) => {
    setAte(paraISODate(new Date()));
    setDe(paraISODate(somarDias(new Date(), -(dias - 1))));
  };

  const estiloCampo = {
    background: 'var(--branco)',
    color: 'var(--text-escuro)',
    border: '1px solid var(--cor-borda)',
  };

  return (
    <>
      <Titulo subtitulo="Aulas que você já fez, por período">Histórico</Titulo>

      <Card className="mb-4 space-y-3">
        <ChipsPeriodo
          opcoes={PRESETS}
          valor={presetAtivo}
          onChange={escolherPreset}
          rotuloGrupo="Atalhos de período"
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold flex flex-col gap-1">
            De
            <input
              type="date"
              value={de}
              max={ate || hoje}
              onChange={(e) => setDe(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm font-normal"
              style={estiloCampo}
            />
          </label>
          <label className="text-xs font-semibold flex flex-col gap-1">
            Até
            <input
              type="date"
              value={ate}
              min={de}
              max={hoje}
              onChange={(e) => setAte(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm font-normal"
              style={estiloCampo}
            />
          </label>
        </div>
        {intervaloInvalido && (
          <p className="text-xs" role="alert" style={{ color: '#b91c1c' }}>
            A data inicial precisa ser igual ou anterior à data final.
          </p>
        )}
      </Card>

      {carregando && !dados && <EstadoCarregando />}
      {erro && <EstadoErro mensagem={erro} onTentar={recarregar} />}

      {dados && !intervaloInvalido && (
        <p className="text-sm mb-3" style={{ color: 'var(--text-cinza)' }}>
          {realizadas === 1 ? '1 aula realizada' : `${realizadas} aulas realizadas`} no período
        </p>
      )}

      {dados && !intervaloInvalido && grupos.length === 0 && (
        <EstadoVazio
          icone={FiClock}
          titulo="Nenhuma aula neste período"
          texto="Tente um intervalo maior."
        />
      )}

      {!intervaloInvalido &&
        grupos.map((grupo) => (
          <section key={grupo.chave} className="mb-5" aria-label={grupo.rotulo}>
            <h2
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--text-cinza)' }}
            >
              {grupo.rotulo}
            </h2>
            <ul className="space-y-3">
              {grupo.aulas.map((aula) => (
                <CartaoAula key={`${aula.agendamentoId}-${aula.situacao}`} aula={aula} />
              ))}
            </ul>
          </section>
        ))}
    </>
  );
}
