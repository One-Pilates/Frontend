import { useCallback, useEffect, useMemo, useState } from 'react';
import { alunoApi } from '../../services/aluno';
import { derivarNotificacoes, paraISODate, somarDias } from './studentUtils';

const CINCO_MINUTOS = 5 * 60 * 1000;

function chaveDeLidas(usuarioId) {
  return `notificacoesLidas:${usuarioId ?? 'aluno'}`;
}

function lerLidas(usuarioId) {
  try {
    const bruto = localStorage.getItem(chaveDeLidas(usuarioId));
    return new Set(bruto ? JSON.parse(bruto) : []);
  } catch {
    return new Set();
  }
}

function gravarLidas(usuarioId, lidas) {
  try {
    // guarda só os últimos 200 ids para a lista não crescer para sempre
    localStorage.setItem(chaveDeLidas(usuarioId), JSON.stringify([...lidas].slice(-200)));
  } catch {
    // sem localStorage (modo privado): as notificações só voltam a aparecer como não lidas
  }
}

/**
 * Notificações do aluno, calculadas a partir da agenda e do pacote (o backend ainda não guarda
 * notificações). O que já foi lido fica no navegador.
 */
export function useNotificacoes(usuarioId) {
  const [fonte, setFonte] = useState({ aulas: [], pacotes: [] });
  const [lidas, setLidas] = useState(() => lerLidas(usuarioId));
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    const hoje = new Date();
    try {
      const [aulas, pacotes] = await Promise.all([
        alunoApi.aulas(paraISODate(somarDias(hoje, -14)), paraISODate(somarDias(hoje, 14))),
        alunoApi.pacotes(),
      ]);
      setFonte({ aulas, pacotes });
    } catch {
      // sem conexão ou sessão expirada: mantém o que já tinha (o interceptor trata a sessão)
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
    const intervalo = setInterval(recarregar, CINCO_MINUTOS);
    window.addEventListener('focus', recarregar);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener('focus', recarregar);
    };
  }, [recarregar]);

  const itens = useMemo(
    () =>
      derivarNotificacoes({ aulas: fonte.aulas, pacotes: fonte.pacotes, agora: new Date() }).map(
        (n) => ({
          ...n,
          lida: lidas.has(n.id),
        }),
      ),
    [fonte, lidas],
  );

  const marcarComoLida = useCallback(
    (id) =>
      setLidas((anterior) => {
        if (anterior.has(id)) return anterior;
        const novo = new Set(anterior).add(id);
        gravarLidas(usuarioId, novo);
        return novo;
      }),
    [usuarioId],
  );

  const marcarTodasComoLidas = useCallback(
    () =>
      setLidas((anterior) => {
        const novo = new Set(anterior);
        itens.forEach((n) => novo.add(n.id));
        gravarLidas(usuarioId, novo);
        return novo;
      }),
    [itens, usuarioId],
  );

  return {
    itens,
    naoLidas: itens.filter((n) => !n.lida).length,
    carregando,
    recarregar,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
