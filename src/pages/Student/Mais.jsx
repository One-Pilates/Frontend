import { Link, useOutletContext } from 'react-router-dom';
import { FiBell, FiChevronRight, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { Card, Titulo } from './ui';

function ItemMenu({ to, icone, titulo, descricao, selo }) {
  const Icone = icone;
  return (
    <Link to={to} className="flex items-center gap-3 py-3">
      <span
        className="inline-flex items-center justify-center rounded-xl w-11 h-11 shrink-0"
        style={{ background: '#ffe3d1', color: 'var(--laranja-principal)' }}
      >
        <Icone size={20} aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-[15px]">{titulo}</span>
        <span className="block text-xs" style={{ color: 'var(--text-cinza)' }}>
          {descricao}
        </span>
      </span>
      {selo > 0 && (
        <span
          className="min-w-[20px] h-5 px-1.5 rounded-full text-[11px] leading-5 text-center text-white font-bold"
          style={{ background: 'var(--laranja-principal)' }}
        >
          {selo}
        </span>
      )}
      <FiChevronRight style={{ color: 'var(--text-cinza)' }} />
    </Link>
  );
}

export default function Mais() {
  const { logout } = useAuth();
  const { notificacoes } = useOutletContext();

  return (
    <>
      <Titulo subtitulo="Gestão e configurações">Mais</Titulo>

      <Card className="!py-1">
        <ItemMenu
          to="/aluno/perfil"
          icone={FiUser}
          titulo="Perfil"
          descricao="Seus dados e preferências"
        />
        <ItemMenu
          to="/aluno/notificacoes"
          icone={FiBell}
          titulo="Notificação"
          descricao="Mensagens"
          selo={notificacoes.naoLidas}
        />
      </Card>

      <button
        type="button"
        onClick={logout}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold"
        style={{ background: '#fdecec', color: '#b91c1c', border: '1px solid #f5b5b5' }}
      >
        <FiLogOut size={18} aria-hidden="true" />
        Sair da Conta
      </button>
    </>
  );
}
