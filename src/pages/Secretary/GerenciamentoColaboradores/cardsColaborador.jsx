import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaUserTie } from 'react-icons/fa';
import { LiaDumbbellSolid } from 'react-icons/lia';
import { useAuth } from '../../../hooks/useAuth';

const cards = [
  {
    key: 'professores',
    Icon: LiaDumbbellSolid,
    badge: 'Colaboradores',
    title: 'Professores',
    meta: 'Lista completa cadastrada no estúdio',
    description: 'Visualize e gerencie todos os professores ativos registrados.',
    label: 'Ver professores',
    getPath: (base) => `${base}/professor`,
  },
  {
    key: 'secretarios',
    Icon: FaUserTie,
    badge: 'Colaboradores',
    title: 'Secretárias',
    meta: 'Lista completa cadastrada no estúdio',
    description: 'Visualize e gerencie todos os secretárias ativos registrados.',
    label: 'Ver secretárias',
    getPath: (base) => `${base}/secretaria`,
  },
];
export default function CardsColaborador() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user?.role === 'ADMINISTRADOR' ? '/admin' : '/secretaria';
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Escolha a listagem</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Selecione qual lista de colaboradores deseja visualizar.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 ">
        {cards.map(({ key, Icon, badge, title, meta, description, label, getPath }) => (
          <div
            key={key}
            className="group relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-7 shadow-md transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg sm:p-8"
          >
            {/* acento decorativo no canto */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-[0.07]"
              style={{ backgroundColor: 'var(--laranja-principal)' }}
            />

            {/* ícone */}
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: '#fff4ee', color: '#c94d0e' }}
            >
              <Icon size={24} />
            </div>

            {/* badge */}
            <span
              className="mb-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: '#fff4ee', color: '#a33a05' }}
            >
              {badge}
            </span>

            <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>

            <p className="mt-1 text-xs text-slate-400">{meta}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>

            <div className="my-4 border-t border-slate-100" />

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shadow-orange-100"
              style={{ backgroundColor: 'var(--laranja-principal)' }}
              onClick={() => navigate(getPath(basePath))}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
