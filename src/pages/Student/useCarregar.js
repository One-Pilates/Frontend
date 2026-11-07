import { useCallback, useEffect, useRef, useState } from 'react';
import { mensagemDeErro } from '../../services/aluno';

/**
 * Carrega dados de uma chamada assíncrona e refaz a chamada quando `deps` mudam.
 * Ignora respostas atrasadas (se o usuário trocou o filtro enquanto a anterior ainda carregava).
 */
export function useCarregar(carregar, deps = []) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null });
  const versao = useRef(0);
  const carregarRef = useRef(carregar);
  carregarRef.current = carregar;

  const executar = useCallback(() => {
    const minhaVersao = ++versao.current;
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }));
    return Promise.resolve()
      .then(() => carregarRef.current())
      .then((dados) => {
        if (versao.current === minhaVersao) setEstado({ dados, carregando: false, erro: null });
      })
      .catch((error) => {
        if (versao.current === minhaVersao) {
          setEstado({
            dados: null,
            carregando: false,
            erro: mensagemDeErro(error, 'Não foi possível carregar. Tente novamente.'),
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    executar();
  }, [executar]);

  return { ...estado, recarregar: executar };
}
