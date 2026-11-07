import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMenu, FiPieChart } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNotificacoes } from './useNotificacoes';

const ABAS = [
  { chave: 'inicio', rotulo: 'Início', caminho: '/aluno/inicio', icone: FiPieChart },
  { chave: 'agenda', rotulo: 'Agenda', caminho: '/aluno/agenda', icone: FiCalendar },
  { chave: 'historico', rotulo: 'Histórico', caminho: '/aluno/historico', icone: FiClock },
  { chave: 'mais', rotulo: 'Mais', caminho: '/aluno/mais', icone: FiMenu },
];

/** Título do cabeçalho, botão de voltar e aba destacada para cada tela. */
function configuracaoDaTela(pathname) {
  if (pathname.startsWith('/aluno/aulas/')) {
    return { titulo: 'Detalhes da Aula', voltar: '/aluno/agenda', aba: 'agenda' };
  }
  if (pathname.startsWith('/aluno/notificacoes')) {
    return { titulo: 'Notificações', voltar: '/aluno/mais', aba: 'mais' };
  }
  if (pathname.startsWith('/aluno/perfil')) {
    return { titulo: 'onepilates', voltar: '/aluno/mais', aba: 'mais' };
  }
  const aba = ABAS.find((a) => pathname.startsWith(a.caminho))?.chave ?? 'inicio';
  return { titulo: 'onepilates', voltar: null, aba };
}

export default function Student() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notificacoes = useNotificacoes(user?.id);
  const tela = configuracaoDaTela(location.pathname);

  const voltar = () => {
    // se a pessoa chegou aqui por um link direto, não há histórico para voltar
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(tela.voltar);
  };

  return (
    <div
      className="min-h-dvh flex justify-center sm:items-center"
      style={{ background: 'var(--bg-claro)' }}
    >
      <div
        className="relative flex flex-col w-full max-w-[430px] h-dvh sm:h-[min(100dvh-2rem,860px)] sm:rounded-[28px] overflow-hidden sm:shadow-2xl"
        style={{ background: 'var(--bg-claro)', border: '1px solid var(--cor-borda)' }}
      >
        <header
          className="relative flex items-center justify-center px-4 py-3.5 text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #f77433 0%, #f9964f 100%)' }}
        >
          {tela.voltar && (
            <button
              type="button"
              onClick={voltar}
              aria-label="Voltar"
              className="absolute left-2 p-2 rounded-full active:scale-95"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <h2
            className={`font-semibold ${tela.titulo === 'onepilates' ? 'tracking-wide' : 'text-[15px]'}`}
          >
            {tela.titulo}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
          <div key={location.pathname} className="page-fade-in">
            <Outlet context={{ notificacoes }} />
          </div>
        </main>

        <nav
          aria-label="Navegação principal"
          className="grid grid-cols-4 shrink-0 border-t"
          style={{ background: 'var(--branco)', borderColor: 'var(--cor-borda)' }}
        >
          {ABAS.map(({ chave, rotulo, caminho, icone }) => {
            const Icone = icone;
            const ativa = tela.aba === chave;
            return (
              <NavLink
                key={chave}
                to={caminho}
                aria-current={ativa ? 'page' : undefined}
                className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
                style={{ color: ativa ? 'var(--laranja-principal)' : 'var(--text-cinza)' }}
              >
                <span className="relative">
                  <Icone size={21} />
                  {chave === 'mais' && notificacoes.naoLidas > 0 && (
                    <span
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] leading-4 text-center text-white font-bold"
                      style={{ background: 'var(--laranja-principal)' }}
                      aria-label={`${notificacoes.naoLidas} notificações não lidas`}
                    >
                      {notificacoes.naoLidas}
                    </span>
                  )}
                </span>
                {rotulo}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
