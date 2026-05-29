// src/services/mockData.js

// Mock data centralizado para testes e desenvolvimento do frontend.
// As chaves mais longas e específicas devem vir ANTES das mais curtas
// para que o Object.keys().find(...) do api.js faça o match corretamente.

export const MOCK_DATA = {
  // ---------------------------------------------------------
  // DASHBOARD SECRETARIA
  // ---------------------------------------------------------
  'api/secretarias/qtdUltimosDias': {
    qtdDeAlunosAtendidos: 145,
    qtdSessoesPorProfessor: [
      { nomeProfessor: 'Ana Silva', totalAgendamentosPorProfessor: 45 },
      { nomeProfessor: 'João Souza', totalAgendamentosPorProfessor: 30 },
      { nomeProfessor: 'Beatriz Costa', totalAgendamentosPorProfessor: 25 },
      { nomeProfessor: 'Ricardo Lima', totalAgendamentosPorProfessor: 10 }
    ],
    agendamentosPorDias: [
      { diaSemana: 'monday', totalAgendamentos: 20 },
      { diaSemana: 'tuesday', totalAgendamentos: 25 },
      { diaSemana: 'wednesday', totalAgendamentos: 30 },
      { diaSemana: 'thursday', totalAgendamentos: 22 },
      { diaSemana: 'friday', totalAgendamentos: 18 },
      { diaSemana: 'saturday', totalAgendamentos: 10 },
      { diaSemana: 'sunday', totalAgendamentos: 0 }
    ]
  },

  // ---------------------------------------------------------
  // DASHBOARD PROFESSOR (Deve vir antes de 'api/professores')
  // ---------------------------------------------------------
  'api/professores/1/': {
    kpisProfessorDTO: {
      qtdTotalSessoesRealizadas: 85,
      qtdAlunosAtendidos: 42,
      diaSemanaComMaiorAtendimento: 'Quarta-feira',
      especialidadeMaisRequisitada: 'Pilates Clínico'
    },
    agendamentosPorDiasDTO: [
      { diaSemana: 'monday', totalAgendamentos: 12 },
      { diaSemana: 'tuesday', totalAgendamentos: 15 },
      { diaSemana: 'wednesday', totalAgendamentos: 20 },
      { diaSemana: 'thursday', totalAgendamentos: 14 },
      { diaSemana: 'friday', totalAgendamentos: 10 },
      { diaSemana: 'saturday', totalAgendamentos: 5 },
      { diaSemana: 'sunday', totalAgendamentos: 0 }
    ],
    aulasPorEspecialidadesDTO: [
      { especialidade: 'Pilates Solo', percentualAulas: 40 },
      { especialidade: 'Reformer', percentualAulas: 35 },
      { especialidade: 'Pilates Clínico', percentualAulas: 25 }
    ]
  },

  // ---------------------------------------------------------
  // PAGINAÇÃO
  // ---------------------------------------------------------
  'api/alunos/paginacao': {
    alunos: [
      { id: 1, nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 98888-8888', status: true, cpf: '123.456.789-00', dataNascimento: '1990-05-15', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
      { id: 2, nome: 'Mariana Santos', email: 'mariana@email.com', telefone: '(11) 97777-7777', status: true, cpf: '987.654.321-00', dataNascimento: '1985-10-20', notificacaoAtiva: false, alunoComLimitacoesFisicas: true },
      { id: 3, nome: 'Roberto Firmino', email: 'roberto@email.com', telefone: '(11) 96666-6666', status: false, cpf: '456.789.123-11', dataNascimento: '1995-02-10', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
      { id: 4, nome: 'Juliana Paes', email: 'juliana@email.com', telefone: '(11) 95555-5555', status: true, cpf: '321.654.987-22', dataNascimento: '1988-12-05', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
      { id: 5, nome: 'Lucas Silva', email: 'lucas@email.com', telefone: '(11) 94444-4444', status: true, cpf: '789.123.456-33', dataNascimento: '2000-01-01', notificacaoAtiva: false, alunoComLimitacoesFisicas: true },
      { id: 6, nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(11) 93333-3333', status: true, cpf: '111.222.333-44', dataNascimento: '1992-07-22', notificacaoAtiva: true, alunoComLimitacoesFisicas: false }
    ],
    totalPaginas: 1,
    totalRegistros: 6
  },
  'api/professores/paginacao': {
    professores: [
      { id: 1, nome: 'Ana Silva', email: 'ana@onepilates.com', role: 'PROFESSOR', status: true, telefone: '(11) 98888-7777', cargo: 'Fisioterapeuta', especialidades: [{ id: 1, nome: 'Pilates Clínico' }, { id: 2, nome: 'Solo' }], notificacaoAtiva: true },
      { id: 2, nome: 'João Souza', email: 'joao@onepilates.com', role: 'PROFESSOR', status: true, telefone: '(11) 97777-6666', cargo: 'Educador Físico', especialidades: [{ id: 2, nome: 'Solo' }, { id: 3, nome: 'Aparelhos' }], notificacaoAtiva: false },
      { id: 3, nome: 'Beatriz Costa', email: 'beatriz@onepilates.com', role: 'PROFESSOR', status: true, telefone: '(11) 96666-5555', cargo: 'Fisioterapeuta', especialidades: [{ id: 4, nome: 'Reabilitação' }], notificacaoAtiva: true },
      { id: 4, nome: 'Ricardo Lima', email: 'ricardo@onepilates.com', role: 'PROFESSOR', status: false, telefone: '(11) 95555-4444', cargo: 'Educador Físico', especialidades: [{ id: 5, nome: 'Pilates Fitness' }], notificacaoAtiva: true }
    ],
    totalPaginas: 1,
    totalRegistros: 4
  },

  // ---------------------------------------------------------
  // AGENDAMENTOS FILTRADOS
  // ---------------------------------------------------------
  'api/agendamentos/professorId': [
    {
      id: 201,
      especialidade: 'Pilates Clínico',
      professorNome: 'Ana Silva',
      dataHora: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
      alunoNome: 'Carlos Oliveira',
      salaNome: 'Sala 1 - Aparelhos'
    },
    {
      id: 202,
      especialidade: 'Solo',
      professorNome: 'Ana Silva',
      dataHora: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      alunoNome: 'Mariana Santos',
      salaNome: 'Sala 2 - Solo'
    },
    {
      id: 203,
      especialidade: 'Reabilitação',
      professorNome: 'Beatriz Costa',
      dataHora: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)).toISOString(),
      alunoNome: 'Lucas Silva',
      salaNome: 'Sala 2 - Solo'
    }
  ],
  'api/agendamentos/sala': [
    {
      id: 301,
      especialidade: 'Aparelhos',
      professorNome: 'João Souza',
      dataHora: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
      alunoNome: 'Roberto Firmino',
      salaNome: 'Sala VIP'
    }
  ],

  // ---------------------------------------------------------
  // ESPECIALIDADES FILTRADAS
  // ---------------------------------------------------------
  'api/especialidades/salas': [
    { id: 1, nome: 'Sala Principal - Reformer', capacidade: 5, status: 'ATIVO' },
    { id: 3, nome: 'Sala de Solo / Mat', capacidade: 10, status: 'ATIVO' }
  ],
  'api/especialidades/professores': [
    { id: 1, nome: 'Ana Silva', email: 'ana@onepilates.com', status: true, cargo: 'Fisioterapeuta' },
    { id: 2, nome: 'João Souza', email: 'joao@onepilates.com', status: true, cargo: 'Educador Físico' }
  ],

  // ---------------------------------------------------------
  // AUSÊNCIAS
  // ---------------------------------------------------------
  'api/ausencias/professor': [
    {
      id: 1,
      motivo: 'Consulta Médica',
      dataInicio: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      dataFim: new Date(new Date().setHours(14, 0, 0, 0)).toISOString()
    }
  ],

  // ---------------------------------------------------------
  // PERFIS INDIVIDUAIS
  // ---------------------------------------------------------
  'api/professores/1': { id: 1, nome: 'Ana Silva', email: 'ana@onepilates.com', status: true, telefone: '(11) 98888-7777', cargo: 'Fisioterapeuta', especialidades: [{ id: 1, nome: 'Pilates Clínico' }, { id: 2, nome: 'Solo' }], notificacaoAtiva: true },
  'api/professores/2': { id: 2, nome: 'João Souza', email: 'joao@onepilates.com', status: true, telefone: '(11) 97777-6666', cargo: 'Educador Físico', especialidades: [{ id: 2, nome: 'Solo' }, { id: 3, nome: 'Aparelhos' }], notificacaoAtiva: false },
  'api/alunos/1': { id: 1, nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 98888-8888', status: true, cpf: '123.456.789-00', dataNascimento: '1990-05-15', notificacaoAtiva: true, alunoComLimitacoesFisicas: false, observacao: 'Nenhuma limitação aparente.' },
  'api/alunos/2': { id: 2, nome: 'Mariana Santos', email: 'mariana@email.com', telefone: '(11) 97777-7777', status: true, cpf: '987.654.321-00', dataNascimento: '1985-10-20', notificacaoAtiva: false, alunoComLimitacoesFisicas: true, observacao: 'Lombalgia crônica. Requer cuidados extras.' },
  'api/alunos/3': { id: 3, nome: 'Roberto Firmino', email: 'roberto@email.com', telefone: '(11) 96666-6666', status: false, cpf: '456.789.123-11', dataNascimento: '1995-02-10', notificacaoAtiva: true, alunoComLimitacoesFisicas: false, observacao: '' },
  'api/secretarias/1': { id: 1, nome: 'Marta Lima', email: 'marta@onepilates.com', status: true, telefone: '(11) 92222-1111', cargo: 'Secretária', notificacaoAtiva: true },

  // ---------------------------------------------------------
  // LISTAGENS GERAIS
  // ---------------------------------------------------------
  'api/agendamentos': [
    {
      id: 101,
      especialidade: 'Pilates Clínico',
      professorNome: 'Ana Silva',
      dataHora: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
      alunoNome: 'Carlos Oliveira',
      salaNome: 'Sala Principal - Reformer'
    },
    {
      id: 102,
      especialidade: 'Aparelhos',
      professorNome: 'João Souza',
      dataHora: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      alunoNome: 'Mariana Santos',
      salaNome: 'Sala VIP - Individual'
    },
    {
      id: 103,
      especialidade: 'Solo',
      professorNome: 'Beatriz Costa',
      dataHora: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(14, 0, 0, 0)).toISOString(),
      alunoNome: 'Juliana Paes',
      salaNome: 'Sala de Solo / Mat'
    }
  ],
  'api/professores': [
    { id: 1, nome: 'Ana Silva', email: 'ana@onepilates.com', status: true, cargo: 'Fisioterapeuta', especialidades: [{ id: 1, nome: 'Pilates Clínico' }, { id: 2, nome: 'Solo' }] },
    { id: 2, nome: 'João Souza', email: 'joao@onepilates.com', status: true, cargo: 'Educador Físico', especialidades: [{ id: 2, nome: 'Solo' }, { id: 3, nome: 'Aparelhos' }] },
    { id: 3, nome: 'Beatriz Costa', email: 'beatriz@onepilates.com', status: true, cargo: 'Fisioterapeuta', especialidades: [{ id: 4, nome: 'Reabilitação' }] },
    { id: 4, nome: 'Ricardo Lima', email: 'ricardo@onepilates.com', status: false, cargo: 'Educador Físico', especialidades: [{ id: 5, nome: 'Pilates Fitness' }] }
  ],
  'api/alunos': [
    { id: 1, nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(11) 98888-8888', status: true, cpf: '123.456.789-00', dataNascimento: '1990-05-15', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
    { id: 2, nome: 'Mariana Santos', email: 'mariana@email.com', telefone: '(11) 97777-7777', status: true, cpf: '987.654.321-00', dataNascimento: '1985-10-20', notificacaoAtiva: false, alunoComLimitacoesFisicas: true },
    { id: 3, nome: 'Roberto Firmino', email: 'roberto@email.com', telefone: '(11) 96666-6666', status: false, cpf: '456.789.123-11', dataNascimento: '1995-02-10', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
    { id: 4, nome: 'Juliana Paes', email: 'juliana@email.com', telefone: '(11) 95555-5555', status: true, cpf: '321.654.987-22', dataNascimento: '1988-12-05', notificacaoAtiva: true, alunoComLimitacoesFisicas: false },
    { id: 5, nome: 'Lucas Silva', email: 'lucas@email.com', telefone: '(11) 94444-4444', status: true, cpf: '789.123.456-33', dataNascimento: '2000-01-01', notificacaoAtiva: false, alunoComLimitacoesFisicas: true },
    { id: 6, nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(11) 93333-3333', status: true, cpf: '111.222.333-44', dataNascimento: '1992-07-22', notificacaoAtiva: true, alunoComLimitacoesFisicas: false }
  ],
  'api/secretarias': [
    { id: 1, nome: 'Marta Lima', email: 'marta@onepilates.com', status: true, telefone: '(11) 92222-1111', cargo: 'Secretária' },
    { id: 2, nome: 'Sônia Maria', email: 'sonia@onepilates.com', status: true, telefone: '(11) 91111-2222', cargo: 'Recepcionista' }
  ],
  'api/salas': [
    { id: 1, nome: 'Sala Principal - Reformer', capacidade: 5, status: 'ATIVO' },
    { id: 2, nome: 'Sala VIP - Individual', capacidade: 1, status: 'ATIVO' },
    { id: 3, nome: 'Sala de Solo / Mat', capacidade: 10, status: 'ATIVO' }
  ],
  'api/especialidades': [
    { id: 1, nome: 'Solo' },
    { id: 2, nome: 'Aparelhos' },
    { id: 3, nome: 'Pilates Clínico' },
    { id: 4, nome: 'Gestantes' },
    { id: 5, nome: 'Reabilitação' }
  ],

  // ---------------------------------------------------------
  // AUTENTICAÇÃO E PERFIL LOGADO
  // ---------------------------------------------------------
  '/auth/login': {
    funcionario: {
      id: 1,
      nome: 'Administrador Supremo',
      email: 'admin@onepilates.com',
      role: 'ADMINISTRADOR',
      primeiroAcesso: false,
      foto: null
    },
    token: 'mock-jwt-token-12345'
  },
  '/funcionario/perfil': {
    id: 1,
    nome: 'Administrador Supremo',
    email: 'admin@onepilates.com',
    role: 'ADMINISTRADOR',
    telefone: '(11) 99999-9999',
    cargo: 'Gerência'
  }
};
