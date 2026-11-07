// Rodar com: node --test src/pages/Student/studentUtils.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  agruparPorDia,
  avisoDeCancelamento,
  derivarNotificacoes,
  descricaoCancelamento,
  diaEmFrase,
  formatarDataLonga,
  formatarDiaCurto,
  formatarHora,
  formatarHoraCurta,
  iniciais,
  paraISODate,
  rotuloDia,
  situacaoDaAula,
  somarDias,
  tempoRelativo,
  textoSaldo,
} from './studentUtils.js';

// segunda-feira, 9 de novembro de 2026, 10h (horário local)
const AGORA = new Date(2026, 10, 9, 10, 0, 0);

const aula = (extra = {}) => ({
  agendamentoId: 1,
  dataHora: '2026-11-10T09:00:00',
  especialidade: 'Pilates',
  professor: 'Mariana Costa',
  situacao: 'AGENDADA',
  presencaConfirmada: false,
  ...extra,
});

test('formata hora, data longa e dia curto como no protótipo', () => {
  assert.equal(formatarHora('2026-10-14T09:00:00'), '09:00');
  assert.equal(formatarHoraCurta('2026-10-14T09:05:00'), '09h05');
  assert.equal(formatarDataLonga('2025-10-14T09:00:00'), '14 de Outubro de 2025');
  assert.equal(formatarDiaCurto('2026-11-12T09:00:00'), 'qui, 12 de nov');
});

test('rotuloDia e diaEmFrase usam hoje, amanhã e o dia da semana', () => {
  assert.equal(rotuloDia('2026-11-09T18:00:00', AGORA), 'Hoje');
  assert.equal(rotuloDia('2026-11-10T08:00:00', AGORA), 'Amanhã');
  assert.equal(rotuloDia('2026-11-12T08:00:00', AGORA), 'qui, 12 de nov');
  assert.equal(diaEmFrase('2026-11-09T18:00:00', AGORA), 'hoje');
  assert.equal(diaEmFrase('2026-11-10T08:00:00', AGORA), 'amanhã');
  assert.equal(diaEmFrase('2026-11-13T08:00:00', AGORA), 'sexta-feira');
});

test('paraISODate usa a data local e somarDias atravessa o mês', () => {
  assert.equal(paraISODate(new Date(2026, 10, 9, 23, 59)), '2026-11-09');
  assert.equal(paraISODate(somarDias(new Date(2026, 10, 28), 5)), '2026-12-03');
  assert.equal(paraISODate(somarDias(new Date(2026, 10, 9), -30)), '2026-10-10');
});

test('iniciais lida com nomes vazios, simples e compostos', () => {
  assert.equal(iniciais('Maria Alice Souza'), 'MS');
  assert.equal(iniciais('Aluno'), 'A');
  assert.equal(iniciais('  '), '?');
  assert.equal(iniciais(undefined), '?');
});

test('agruparPorDia junta as aulas do mesmo dia e mantém a ordem', () => {
  const grupos = agruparPorDia(
    [
      aula({ agendamentoId: 1, dataHora: '2026-11-09T11:00:00' }),
      aula({ agendamentoId: 2, dataHora: '2026-11-09T15:00:00' }),
      aula({ agendamentoId: 3, dataHora: '2026-11-10T09:00:00' }),
    ],
    AGORA,
  );
  assert.equal(grupos.length, 2);
  assert.equal(grupos[0].rotulo, 'Hoje');
  assert.deepEqual(
    grupos[0].aulas.map((a) => a.agendamentoId),
    [1, 2],
  );
  assert.equal(grupos[1].rotulo, 'Amanhã');
});

test('situacaoDaAula distingue agendada, confirmada, realizada e cancelada', () => {
  assert.deepEqual(situacaoDaAula(aula()), { rotulo: 'Agendada', tom: 'laranja' });
  assert.deepEqual(situacaoDaAula(aula({ presencaConfirmada: true })), {
    rotulo: 'Confirmada',
    tom: 'verde',
  });
  assert.deepEqual(situacaoDaAula(aula({ situacao: 'REALIZADA' })), {
    rotulo: 'Realizada',
    tom: 'cinza',
  });
  assert.deepEqual(situacaoDaAula(aula({ situacao: 'CANCELADA' })), {
    rotulo: 'Cancelada',
    tom: 'vermelho',
  });
});

test('descricaoCancelamento diz se a aula voltou ou foi descontada', () => {
  assert.match(descricaoCancelamento({ aulaDevolvida: true }), /voltou para o seu pacote/);
  assert.match(
    descricaoCancelamento({ aulaDevolvida: false, foraDoPrazo: true }),
    /menos de 24h.*descontada/,
  );
  assert.equal(
    descricaoCancelamento({ aulaDevolvida: false, foraDoPrazo: false }),
    'Aula cancelada.',
  );
});

test('avisoDeCancelamento muda conforme o prazo de 24h', () => {
  assert.match(avisoDeCancelamento({ cancelamentoSemPerda: true }), /volta para o seu pacote/);
  assert.match(avisoDeCancelamento({ cancelamentoSemPerda: false }), /descontada do seu pacote/);
});

test('textoSaldo trata singular, plural e excedente', () => {
  assert.equal(textoSaldo(1), '1 aula');
  assert.equal(textoSaldo(8), '8 aulas');
  assert.equal(textoSaldo(0), '0 aulas');
  assert.equal(textoSaldo(-2), '2 aulas além do pacote');
  assert.equal(textoSaldo(-1), '1 aula além do pacote');
});

test('tempoRelativo', () => {
  assert.equal(tempoRelativo(new Date(2026, 10, 9, 9, 59, 40), AGORA), 'agora');
  assert.equal(tempoRelativo(new Date(2026, 10, 9, 9, 30), AGORA), 'há 30 min');
  assert.equal(tempoRelativo(new Date(2026, 10, 9, 5, 0), AGORA), 'há 5 h');
  assert.equal(tempoRelativo(new Date(2026, 10, 8, 9, 0), AGORA), 'ontem');
  assert.equal(tempoRelativo(new Date(2026, 10, 6, 9, 0), AGORA), 'há 3 dias');
});

test('lembrete: aula em até 48h sem confirmação gera notificação', () => {
  const itens = derivarNotificacoes({ aulas: [aula()], agora: AGORA });
  assert.equal(itens.length, 1);
  assert.equal(itens[0].tipo, 'lembrete');
  assert.equal(itens[0].id, 'lembrete-1');
  assert.match(itens[0].texto, /aula de Pilates amanhã às 09h00/);
  assert.match(itens[0].texto, /Confirme sua presença/);
});

test('aula a mais de 48h e não confirmada ainda não gera lembrete', () => {
  const itens = derivarNotificacoes({
    aulas: [aula({ dataHora: '2026-11-13T09:00:00' })],
    agora: AGORA,
  });
  assert.equal(itens.length, 0);
});

test('aula confirmada vira "Aula confirmada" e deixa de pedir confirmação', () => {
  const itens = derivarNotificacoes({ aulas: [aula({ presencaConfirmada: true })], agora: AGORA });
  assert.equal(itens.length, 1);
  assert.equal(itens[0].tipo, 'confirmada');
  assert.equal(itens[0].titulo, 'Aula confirmada');
});

test('cancelamento recente aparece com o que houve com o pacote; antigo não', () => {
  const recente = aula({
    agendamentoId: 5,
    situacao: 'CANCELADA',
    aulaDevolvida: true,
    foraDoPrazo: false,
    canceladoEm: '2026-11-07T15:00:00',
  });
  const antigo = aula({
    agendamentoId: 6,
    situacao: 'CANCELADA',
    aulaDevolvida: false,
    foraDoPrazo: true,
    canceladoEm: '2026-10-01T15:00:00',
  });
  const itens = derivarNotificacoes({ aulas: [recente, antigo], agora: AGORA });
  assert.equal(itens.length, 1);
  assert.equal(itens[0].titulo, 'Cancelamento confirmado');
  assert.match(itens[0].texto, /voltou para o seu pacote/);
});

test('aulas realizadas não geram notificação', () => {
  const itens = derivarNotificacoes({
    aulas: [aula({ situacao: 'REALIZADA', dataHora: '2026-11-05T09:00:00' })],
    agora: AGORA,
  });
  assert.equal(itens.length, 0);
});

test('pacote: avisa quando está acabando ou excedido, e fica quieto com 0 ou saldo folgado', () => {
  const pacotes = [
    { especialidadeId: 1, especialidade: 'Pilates', saldo: 2 },
    { especialidadeId: 2, especialidade: 'Fisioterapia', saldo: -1 },
    { especialidadeId: 3, especialidade: 'RPG', saldo: 0 },
    { especialidadeId: 4, especialidade: 'Yoga', saldo: 10 },
  ];
  const itens = derivarNotificacoes({ aulas: [], pacotes, agora: AGORA });
  assert.deepEqual(itens.map((i) => i.titulo).sort(), ['Pacote acabando', 'Pacote excedido']);
  assert.ok(itens.find((i) => i.texto.includes('1 aula além do pacote')));
});

test('o id da notificação de pacote muda com o saldo, voltando a ficar "não lida"', () => {
  const antes = derivarNotificacoes({
    pacotes: [{ especialidadeId: 1, especialidade: 'Pilates', saldo: 2 }],
    agora: AGORA,
  });
  const depois = derivarNotificacoes({
    pacotes: [{ especialidadeId: 1, especialidade: 'Pilates', saldo: 1 }],
    agora: AGORA,
  });
  assert.notEqual(antes[0].id, depois[0].id);
});

test('ordem: lembretes primeiro, depois pacote, confirmadas e cancelamentos', () => {
  const itens = derivarNotificacoes({
    aulas: [
      aula({ agendamentoId: 1, presencaConfirmada: true }),
      aula({ agendamentoId: 2, dataHora: '2026-11-09T18:00:00' }),
      aula({
        agendamentoId: 3,
        situacao: 'CANCELADA',
        aulaDevolvida: true,
        canceladoEm: '2026-11-08T10:00:00',
      }),
    ],
    pacotes: [{ especialidadeId: 1, especialidade: 'Pilates', saldo: 1 }],
    agora: AGORA,
  });
  assert.deepEqual(
    itens.map((i) => i.tipo),
    ['lembrete', 'pacote', 'confirmada', 'cancelamento'],
  );
});
