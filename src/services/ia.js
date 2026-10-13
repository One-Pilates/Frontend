import api, { normalizeToken } from './api';

const INTERVALO_MS = 2000;
const LIMITE_MS = 120000;

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Envia o pedido para a fila de IA (POST) e acompanha a tarefa (GET) até terminar.
 * Retorna o texto da resposta. Lança erro se a tarefa falhar ou passar do tempo limite.
 */
export async function solicitarRecomendacaoIA(
  dados,
  { cliente = api, intervaloMs = INTERVALO_MS, limiteMs = LIMITE_MS } = {},
) {
  const { data: tarefa } = await cliente.post('/api/ia/analises', dados);
  const idTarefa = tarefa?.idTarefa;
  if (!idTarefa) throw new Error('O serviço de IA não retornou o identificador da tarefa.');

  const inicio = Date.now();
  while (Date.now() - inicio < limiteMs) {
    await esperar(intervaloMs);
    const { data: andamento } = await cliente.get(`/api/ia/analises/${idTarefa}`);

    if (andamento?.status === 'CONCLUIDA') return andamento.resultado;
    if (andamento?.status === 'FALHA') {
      throw new Error(andamento.erro || 'A IA não conseguiu concluir a análise.');
    }
  }
  throw new Error('A IA demorou mais que o esperado para responder.');
}

function extrairMensagemErro(data) {
  if (!data) return '';
  if (typeof data === 'string') return data.trim();
  return String(data.message || data.erro || data.error || '').trim();
}

function traduzirErro(err) {
  const status = err?.response?.status;
  const erro = new Error();
  erro.status = status;
  if (status === 401 || status === 403) {
    erro.sessaoExpirada = true;
    erro.message =
      extrairMensagemErro(err.response.data) ||
      'Sua sessão pode ter expirado. Se persistir, faça login novamente.';
  } else if (err?.response) {
    erro.message =
      extrairMensagemErro(err.response.data) || 'O assistente não conseguiu processar o pedido.';
  } else {
    erro.message = 'Não foi possível falar com o assistente.';
  }
  return erro;
}

/**
 * Converte o andamento (GET /api/ia/realizacoes/{id}) em passos { texto, status }, onde status é
 * EM_ANDAMENTO, CONCLUIDA ou ERRO. Usa `acoes` do backend e acrescenta passos de espera
 * ("Na fila", "Analisando", "Preparando a resposta") enquanto o pedido ainda está em andamento.
 */
function extrairPassos(andamento) {
  const passos = (andamento?.acoes ?? [])
    .map((a) => ({ texto: String(a?.descricao ?? '').trim(), status: a?.status ?? 'CONCLUIDA' }))
    .filter((p) => p.texto);

  const statusPedido = String(andamento?.status || '').toUpperCase();
  const algumAtivo = passos.some((p) => p.status === 'EM_ANDAMENTO');
  if (statusPedido === 'PENDENTE') {
    passos.push({ texto: 'Aguardando na fila', status: 'EM_ANDAMENTO' });
  } else if (statusPedido === 'PROCESSANDO' && !algumAtivo) {
    passos.push({
      texto: passos.length ? 'Preparando a resposta' : 'Analisando seu pedido',
      status: 'EM_ANDAMENTO',
    });
  }
  return passos;
}

const AGENTE_INTERVALO_MS = 1500;
const AGENTE_LIMITE_MS = 180000;
const AGENTE_MAX_FALHAS_REDE = 3;

/**
 * Envia uma mensagem ao agente de IA: POST /api/ia/agente (202 + realizacaoId) e consulta
 * GET /api/ia/realizacoes/{id} até o status ser CONCLUIDO ou ERRO. Retorna o texto da resposta.
 * `onProgresso(passos)` é chamado quando os passos mudam (lista de { texto, status }).
 * Lança Error com `.status` e mensagem amigável; `.sessaoExpirada` indica 401/403.
 * O JWT vai somente no header Authorization, nunca é exibido nem logado.
 * Não há reenvio automático do POST (evita duplicar ações); só o GET é repetido.
 */
export async function conversarComAgente({
  usuarioId,
  mensagem,
  token,
  novaConversa = false,
  onProgresso,
}) {
  const jwt = normalizeToken(token);
  const dataRequisicao = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19);
  // skipAuthRedirect: erros do agente (ex.: limite de tokens do provedor) não devem deslogar
  const opcoes = { headers: { Authorization: `Bearer ${jwt}` }, skipAuthRedirect: true };

  let realizacaoId;
  try {
    const { data } = await api.post(
      '/api/ia/agente',
      { usuarioId, dataRequisicao, mensagem, novaConversa },
      { ...opcoes, timeout: 30000 },
    );
    realizacaoId = data?.realizacaoId;
  } catch (err) {
    throw traduzirErro(err);
  }
  if (realizacaoId === undefined || realizacaoId === null) {
    throw new Error('O assistente não retornou o identificador da solicitação.');
  }

  const inicio = Date.now();
  let falhasRede = 0;
  let passosJson = '';
  while (Date.now() - inicio < AGENTE_LIMITE_MS) {
    await esperar(AGENTE_INTERVALO_MS);

    let andamento;
    try {
      ({ data: andamento } = await api.get(`/api/ia/realizacoes/${realizacaoId}`, {
        ...opcoes,
        timeout: 15000,
      }));
      falhasRede = 0;
    } catch (err) {
      // Falha de conexão pontual no acompanhamento: tenta de novo sem reenviar o POST
      if (!err?.response && ++falhasRede < AGENTE_MAX_FALHAS_REDE) continue;
      throw traduzirErro(err);
    }

    const passos = extrairPassos(andamento);
    const json = JSON.stringify(passos);
    if (json !== passosJson) {
      passosJson = json;
      onProgresso?.(passos);
    }

    const status = String(andamento?.status || '').toUpperCase();
    if (status === 'CONCLUIDO') return andamento.resposta ?? andamento.resultado ?? '';
    if (status === 'ERRO') {
      throw new Error(
        extrairMensagemErro({
          message: andamento.mensagemErro ?? andamento.erro ?? andamento.message,
        }) || 'O assistente não conseguiu concluir o pedido.',
      );
    }
  }
  throw new Error('O assistente demorou mais que o esperado. Confira antes de reenviar o pedido.');
}
