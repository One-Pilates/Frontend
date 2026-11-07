// Funções puras do portal do aluno: formatação de datas, agrupamento de aulas e notificações.
// Sem dependências (nem React, nem axios), para poderem ser testadas com `node --test`.

const DIAS_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];
const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export const ORIENTACAO_PADRAO = 'Chegue 10 minutos antes e use roupas confortáveis.';
export const HORAS_CANCELAMENTO_SEM_PERDA = 24;
const HORAS_LEMBRETE = 48;
const DIAS_NOTIFICACAO_CANCELAMENTO = 14;
const DIAS_NOTIFICACAO_CONFIRMADA = 7;

const dois = (n) => String(n).padStart(2, '0');
const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** "2026-11-12T09:00:00" (sem fuso, horário do estúdio) vira um Date local. */
export function parseDataHora(valor) {
  if (valor instanceof Date) return valor;
  return new Date(valor);
}

export function formatarHora(valor) {
  const d = parseDataHora(valor);
  return `${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

/** "09h00", como nas notificações do protótipo. */
export function formatarHoraCurta(valor) {
  const d = parseDataHora(valor);
  return `${dois(d.getHours())}h${dois(d.getMinutes())}`;
}

/** "12 de Novembro de 2026". */
export function formatarDataLonga(valor) {
  const d = parseDataHora(valor);
  return `${d.getDate()} de ${capitalizar(MESES[d.getMonth()])} de ${d.getFullYear()}`;
}

/** "qui, 12 de nov". */
export function formatarDiaCurto(valor) {
  const d = parseDataHora(valor);
  return `${DIAS_CURTOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].slice(0, 3)}`;
}

export function nomeDiaSemana(valor) {
  return DIAS_SEMANA[parseDataHora(valor).getDay()];
}

export function inicioDoDia(valor) {
  const d = new Date(parseDataHora(valor));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function somarDias(valor, dias) {
  const d = new Date(parseDataHora(valor));
  d.setDate(d.getDate() + dias);
  return d;
}

/** Data local no formato que o backend espera nos filtros: "YYYY-MM-DD". */
export function paraISODate(valor) {
  const d = parseDataHora(valor);
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

function diferencaEmDias(aula, agora) {
  return Math.round((inicioDoDia(aula) - inicioDoDia(agora)) / 86400000);
}

/** "Hoje", "Amanhã" ou "qui, 12 de nov". */
export function rotuloDia(valor, agora = new Date()) {
  const dif = diferencaEmDias(valor, agora);
  if (dif === 0) return 'Hoje';
  if (dif === 1) return 'Amanhã';
  return formatarDiaCurto(valor);
}

/** "hoje", "amanhã" ou "quinta-feira", para frases ("sua aula é amanhã às 09h00"). */
export function diaEmFrase(valor, agora = new Date()) {
  const dif = diferencaEmDias(valor, agora);
  if (dif === 0) return 'hoje';
  if (dif === 1) return 'amanhã';
  return nomeDiaSemana(valor);
}

export function iniciais(nome) {
  const partes = String(nome || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function primeiroNome(nome) {
  return (
    String(nome || '')
      .trim()
      .split(/\s+/)[0] || ''
  );
}

/** Agrupa aulas (já ordenadas) por dia, preservando a ordem recebida. */
export function agruparPorDia(aulas, agora = new Date()) {
  const grupos = [];
  const porChave = new Map();
  for (const aula of aulas) {
    const chave = paraISODate(aula.dataHora);
    if (!porChave.has(chave)) {
      const grupo = { chave, rotulo: rotuloDia(aula.dataHora, agora), aulas: [] };
      porChave.set(chave, grupo);
      grupos.push(grupo);
    }
    porChave.get(chave).aulas.push(aula);
  }
  return grupos;
}

/** Texto e tom do selo (badge) de uma aula. */
export function situacaoDaAula(aula) {
  if (aula.situacao === 'CANCELADA') return { rotulo: 'Cancelada', tom: 'vermelho' };
  if (aula.situacao === 'REALIZADA') return { rotulo: 'Realizada', tom: 'cinza' };
  if (aula.presencaConfirmada) return { rotulo: 'Confirmada', tom: 'verde' };
  return { rotulo: 'Agendada', tom: 'laranja' };
}

/** O que aconteceu com o pacote em uma aula cancelada pelo aluno. */
export function descricaoCancelamento(aula) {
  if (aula.aulaDevolvida) return 'A aula voltou para o seu pacote.';
  if (aula.foraDoPrazo) {
    return `Cancelada com menos de ${HORAS_CANCELAMENTO_SEM_PERDA}h de antecedência: a aula foi descontada do pacote.`;
  }
  return 'Aula cancelada.';
}

/** Frase para a janela de confirmação de cancelamento. */
export function avisoDeCancelamento(aula) {
  return aula.cancelamentoSemPerda
    ? 'Ao cancelar, a aula volta para o seu pacote.'
    : `Faltam menos de ${HORAS_CANCELAMENTO_SEM_PERDA} horas para a aula. Se você cancelar, ela será descontada do seu pacote do mesmo jeito.`;
}

/** "5 aulas", "1 aula", "2 aulas além do pacote". */
export function textoSaldo(saldo) {
  const n = Math.abs(saldo);
  const unidade = n === 1 ? 'aula' : 'aulas';
  return saldo < 0 ? `${n} ${unidade} além do pacote` : `${n} ${unidade}`;
}

export function tempoRelativo(quando, agora = new Date()) {
  const minutos = Math.round((parseDataHora(agora) - parseDataHora(quando)) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'ontem' : `há ${dias} dias`;
}

function tempoAte(quando, agora) {
  const minutos = Math.round((parseDataHora(quando) - parseDataHora(agora)) / 60000);
  if (minutos < 60) return `em ${Math.max(minutos, 1)} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `em ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'em 1 dia' : `em ${dias} dias`;
}

/**
 * Notificações do aluno, calculadas a partir da agenda e do pacote (o backend ainda não guarda
 * notificações). Cada item tem um `id` estável, usado para lembrar o que já foi lido.
 *
 * Tipos: lembrete (aula em até 48h sem confirmação), confirmada, cancelamento e pacote.
 */
export function derivarNotificacoes({ aulas = [], pacotes = [], agora = new Date() }) {
  const itens = [];
  const agoraMs = parseDataHora(agora).getTime();

  for (const aula of aulas) {
    const quando = parseDataHora(aula.dataHora);
    const hora = formatarHoraCurta(aula.dataHora);

    if (aula.situacao === 'AGENDADA') {
      const horasAte = (quando.getTime() - agoraMs) / 3600000;
      if (!aula.presencaConfirmada && horasAte <= HORAS_LEMBRETE) {
        itens.push({
          id: `lembrete-${aula.agendamentoId}`,
          tipo: 'lembrete',
          titulo: 'Lembrete de aula',
          texto: `Você tem aula de ${aula.especialidade} ${diaEmFrase(aula.dataHora, agora)} às ${hora}. Confirme sua presença.`,
          meta: `Aula ${tempoAte(quando, agora)}`,
          ordem: 0,
          instante: quando.getTime(),
          agendamentoId: aula.agendamentoId,
        });
      } else if (aula.presencaConfirmada && horasAte <= DIAS_NOTIFICACAO_CONFIRMADA * 24) {
        itens.push({
          id: `confirmada-${aula.agendamentoId}`,
          tipo: 'confirmada',
          titulo: 'Aula confirmada',
          texto: `Sua aula de ${aula.especialidade} foi marcada para ${diaEmFrase(aula.dataHora, agora)} às ${hora}.`,
          meta: `Aula ${tempoAte(quando, agora)}`,
          ordem: 2,
          instante: quando.getTime(),
          agendamentoId: aula.agendamentoId,
        });
      }
    }

    if (aula.situacao === 'CANCELADA' && aula.canceladoEm) {
      const canceladoEm = parseDataHora(aula.canceladoEm);
      const diasDesde = (agoraMs - canceladoEm.getTime()) / 86400000;
      if (diasDesde <= DIAS_NOTIFICACAO_CANCELAMENTO) {
        itens.push({
          id: `cancelamento-${aula.agendamentoId}-${canceladoEm.getTime()}`,
          tipo: 'cancelamento',
          titulo: 'Cancelamento confirmado',
          texto: `Sua aula de ${aula.especialidade} de ${formatarDiaCurto(aula.dataHora)} às ${hora} foi cancelada. ${descricaoCancelamento(aula)}`,
          meta: tempoRelativo(canceladoEm, agora),
          ordem: 3,
          instante: -canceladoEm.getTime(),
          agendamentoId: null,
        });
      }
    }
  }

  for (const pacote of pacotes) {
    if (pacote.saldo < 0) {
      itens.push({
        id: `pacote-${pacote.especialidadeId}-${pacote.saldo}`,
        tipo: 'pacote',
        titulo: 'Pacote excedido',
        texto: `Você está com ${textoSaldo(pacote.saldo)} em ${pacote.especialidade}. Fale com a secretaria para renovar.`,
        meta: 'Saldo do pacote',
        ordem: 1,
        instante: 0,
        agendamentoId: null,
      });
    } else if (pacote.saldo > 0 && pacote.saldo <= 2) {
      itens.push({
        id: `pacote-${pacote.especialidadeId}-${pacote.saldo}`,
        tipo: 'pacote',
        titulo: 'Pacote acabando',
        texto: `Restam ${textoSaldo(pacote.saldo)} no pacote de ${pacote.especialidade}.`,
        meta: 'Saldo do pacote',
        ordem: 1,
        instante: 0,
        agendamentoId: null,
      });
    }
  }

  return itens.sort((a, b) => a.ordem - b.ordem || a.instante - b.instante);
}
