import axios from 'axios';
import { MOCK_DATA } from './mockData';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Adaptador customizado para MOCK
  adapter: useMocks ? async (config) => {
    console.log(`[MOCK] Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Procura por um mock que combine com a URL
    const url = config.url.replace(config.baseURL || '', '');
    
    // Caso especial para imagens
    if (url.includes('api/imagens/')) {
      return {
        data: 'https://avatar.iran.liara.run/public/30', // Placeholder de avatar
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'image/png' },
        config,
        request: {}
      };
    }

    // Tenta match exato ou parcial na MOCK_DATA
    const mockKey = Object.keys(MOCK_DATA).find(key => url.includes(key));
    const responseData = mockKey ? MOCK_DATA[mockKey] : { message: 'Mock data not found', url };

    // Simula atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    };
  } : undefined
});

function normalizeToken(rawToken) {
  if (!rawToken) return '';

  const semAspas = rawToken.trim().replace(/^"|"$/g, '');
  if (!semAspas) return '';

  return semAspas.toLowerCase().startsWith('bearer ')
    ? semAspas.substring(7).trim()
    : semAspas;
}

function isAuthenticationFailure(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const msg = typeof data === 'string' ? data : data?.message || data?.erro || '';

  if (status === 401) return true;
  if (status === 400 && /authentication failed|unauthorized|token/i.test(String(msg))) return true;
  return false;
}

function clearSessionAndRedirect() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    console.warn('Falha ao limpar localStorage:', e);
  }
  console.error('Sessão inválida ou expirada. Redirecionando para a raiz...');
  window.location.href = '/';
}

// Adiciona o token de autenticação a cada requisição, se disponível
api.interceptors.request.use((config) => {
  const token = normalizeToken(localStorage.getItem('token'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta respostas para lidar com erros globais,
// caso o token expire ou seja inválido desloga o usuário
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthenticationFailure(error)) {
      clearSessionAndRedirect();
    }
    return Promise.reject(error);
  },
);

export default api;
