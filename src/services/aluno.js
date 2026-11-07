import api from './api';

/**
 * Portal do aluno (`/api/aluno/**`). O backend identifica o aluno pelo token: nenhuma chamada
 * envia id de aluno. Datas dos filtros no formato "YYYY-MM-DD".
 */
export const alunoApi = {
  aulas: (de, ate) => api.get('/api/aluno/aulas', { params: { de, ate } }).then((r) => r.data),

  aula: (agendamentoId) => api.get(`/api/aluno/aulas/${agendamentoId}`).then((r) => r.data),

  confirmarPresenca: (agendamentoId) =>
    api.patch(`/api/aluno/aulas/${agendamentoId}/presenca`).then((r) => r.data),

  /** Devolve { aulaDevolvida, foraDoPrazo, mensagem }. */
  cancelarAula: (agendamentoId) =>
    api.delete(`/api/aluno/aulas/${agendamentoId}`).then((r) => r.data),

  dashboard: (de, ate) =>
    api.get('/api/aluno/dashboard', { params: { de, ate } }).then((r) => r.data),

  pacotes: () => api.get('/api/aluno/pacotes').then((r) => r.data),

  perfil: () => api.get('/api/aluno/perfil').then((r) => r.data),

  atualizarPerfil: (dados) => api.patch('/api/aluno/perfil', dados).then((r) => r.data),
};

/** Mensagem de erro do backend (`erro`/`message`) ou um texto padrão. */
export function mensagemDeErro(error, padrao = 'Não foi possível concluir. Tente novamente.') {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  return data?.erro || data?.message || padrao;
}
