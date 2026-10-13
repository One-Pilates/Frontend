import { useEffect, useRef, useState } from 'react';
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { conversarComAgente } from '../services/ia';
import './AgenteIAChat.scss';

const BOAS_VINDAS = {
  role: 'ia',
  text: 'Olá! Sou o assistente da One Pilates. Escreva pedidos completos, pois não lembro das mensagens anteriores (ex.: "Quais aulas tem amanhã?").',
};

/** Revela o texto aos poucos (a resposta inteira em ~2,5s no máximo). Renderiza como texto puro. */
function TextoDigitando({ text, onTick }) {
  const [qtd, setQtd] = useState(0);

  useEffect(() => {
    const passo = Math.max(2, Math.ceil(text.length / 120));
    const id = setInterval(() => {
      setQtd((n) => {
        const prox = Math.min(text.length, n + passo);
        if (prox >= text.length) clearInterval(id);
        return prox;
      });
    }, 20);
    return () => clearInterval(id);
  }, [text]);

  useEffect(() => {
    onTick?.();
  }, [qtd, onTick]);

  return <>{text.slice(0, qtd)}</>;
}

/** Lista de passos: check ao concluir, spinner enquanto executa, alerta se falhou. */
function ListaPassos({ passos }) {
  return (
    <ol className="agente-ia-passos">
      {passos.map((p, i) => {
        const emAndamento = p.status === 'EM_ANDAMENTO';
        const falhou = p.status === 'ERRO';
        return (
          <li key={i} className={emAndamento ? 'andamento' : falhou ? 'falha' : 'feito'}>
            <span className="agente-ia-passo-icone">
              {emAndamento ? (
                <span className="agente-ia-spinner" />
              ) : falhou ? (
                <FiAlertCircle />
              ) : (
                <FiCheck />
              )}
            </span>
            <span className="agente-ia-passo-texto">{p.texto}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function AgenteIAChat() {
  const { user } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([BOAS_VINDAS]);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [passos, setPassos] = useState([]);
  const fimRef = useRef(null);
  const inputRef = useRef(null);
  const novaConversaRef = useRef(false);

  const rolarParaOFim = () => fimRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    rolarParaOFim();
  }, [mensagens, carregando, passos, aberto]);

  useEffect(() => {
    if (aberto && !carregando) inputRef.current?.focus();
  }, [aberto, carregando]);

  if (!user) return null;

  const enviar = async () => {
    const mensagem = texto.trim();
    if (!mensagem || carregando) return;

    setMensagens((prev) => [...prev, { role: 'user', text: mensagem }]);
    setTexto('');
    setPassos([]);
    setCarregando(true);

    let ultimosPassos = [];
    try {
      const resposta = await conversarComAgente({
        usuarioId: user.id,
        mensagem,
        token: localStorage.getItem('token'),
        novaConversa: novaConversaRef.current,
        onProgresso: (lista) => {
          ultimosPassos = lista;
          setPassos(lista);
        },
      });
      novaConversaRef.current = false;
      setMensagens((prev) => [
        ...prev,
        {
          role: 'ia',
          text: resposta || 'O assistente não retornou resposta.',
          passos: ultimosPassos,
          animar: true,
        },
      ]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        { role: 'ia', text: err.message, erro: true, passos: ultimosPassos },
      ]);
    } finally {
      setCarregando(false);
      setPassos([]);
    }
  };

  const aoTeclar = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      enviar();
    }
  };

  const ultimoIndice = mensagens.length - 1;

  return (
    <>
      {aberto && (
        <section className="agente-ia-painel" role="dialog" aria-label="Assistente de IA">
          <header className="agente-ia-header">
            <span className="agente-ia-titulo">Assistente One</span>
            <div className="agente-ia-acoes">
              <button
                type="button"
                onClick={() => {
                  setMensagens([BOAS_VINDAS]);
                  novaConversaRef.current = true;
                }}
                disabled={carregando}
                title="Limpar conversa"
                aria-label="Limpar conversa"
              >
                <FiTrash2 />
              </button>
              <button
                type="button"
                onClick={() => setAberto(false)}
                title="Fechar"
                aria-label="Fechar assistente"
              >
                <FiX />
              </button>
            </div>
          </header>

          <div className="agente-ia-mensagens" aria-live="polite">
            {mensagens.map((m, i) => (
              <div key={i} className={`agente-ia-bloco ${m.role}`}>
                {m.passos?.length > 0 && (
                  <details className="agente-ia-resumo-passos">
                    <summary>
                      <FiChevronDown /> {m.passos.length}{' '}
                      {m.passos.length === 1 ? 'passo executado' : 'passos executados'}
                    </summary>
                    <ListaPassos passos={m.passos} />
                  </details>
                )}
                <div className={`agente-ia-balao ${m.role}${m.erro ? ' erro' : ''}`}>
                  {m.animar && i === ultimoIndice ? (
                    <TextoDigitando text={m.text} onTick={rolarParaOFim} />
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}

            {carregando && (
              <div className="agente-ia-bloco ia">
                <div className="agente-ia-balao ia" aria-label="O assistente está trabalhando">
                  {passos.length > 0 ? (
                    <ListaPassos passos={passos} />
                  ) : (
                    <span className="agente-ia-digitando">
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <footer className="agente-ia-rodape">
            <textarea
              ref={inputRef}
              rows={1}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={aoTeclar}
              placeholder="Escreva sua mensagem…"
              disabled={carregando}
            />
            <button
              type="button"
              className="agente-ia-enviar"
              onClick={enviar}
              disabled={carregando || !texto.trim()}
              aria-label="Enviar"
            >
              <FiSend />
            </button>
          </footer>
        </section>
      )}

      <button
        type="button"
        className="agente-ia-fab"
        onClick={() => setAberto((v) => !v)}
        aria-label={aberto ? 'Fechar assistente' : 'Abrir assistente'}
        aria-expanded={aberto}
      >
        {aberto ? <FiX /> : <FiMessageCircle />}
      </button>
    </>
  );
}
