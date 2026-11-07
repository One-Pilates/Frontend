import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { alunoApi } from '../../services/aluno';
import { useCarregar } from './useCarregar';
import CartaoAula from './CartaoAula';
import { ChipsPeriodo, EstadoCarregando, EstadoErro, EstadoVazio, Titulo } from './ui';
import { agruparPorDia, paraISODate, somarDias } from './studentUtils';

const PERIODOS = [
  { valor: 30, rotulo: 'Próximos 30 dias' },
  { valor: 60, rotulo: '60 dias' },
  { valor: 90, rotulo: '90 dias' },
];

/** Próximas aulas do aluno (as ainda não realizadas), agrupadas por dia. */
export default function Agenda() {
  const [dias, setDias] = useState(30);
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const hoje = new Date();
    const aulas = await alunoApi.aulas(paraISODate(hoje), paraISODate(somarDias(hoje, dias)));
    // o intervalo começa hoje: tira o que já passou (horários de hoje antes de agora)
    return aulas.filter((a) => a.situacao === 'AGENDADA');
  }, [dias]);

  const grupos = dados ? agruparPorDia(dados) : [];

  return (
    <>
      <Titulo subtitulo="Suas próximas aulas">Agenda</Titulo>

      <div className="mb-4">
        <ChipsPeriodo
          opcoes={PERIODOS}
          valor={dias}
          onChange={setDias}
          rotuloGrupo="Período da agenda"
        />
      </div>

      {carregando && !dados && <EstadoCarregando />}
      {erro && <EstadoErro mensagem={erro} onTentar={recarregar} />}

      {dados && grupos.length === 0 && (
        <EstadoVazio
          icone={FiCalendar}
          titulo="Nenhuma aula agendada"
          texto="Quando a secretaria marcar uma aula para você, ela aparece aqui."
        />
      )}

      {grupos.map((grupo) => (
        <section key={grupo.chave} className="mb-5" aria-label={grupo.rotulo}>
          <h2
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: 'var(--text-cinza)' }}
          >
            {grupo.rotulo}
          </h2>
          <ul className="space-y-3">
            {grupo.aulas.map((aula) => (
              <CartaoAula key={aula.agendamentoId} aula={aula} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
