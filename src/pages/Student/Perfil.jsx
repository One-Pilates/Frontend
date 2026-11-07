import { useEffect, useState } from 'react';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { toast } from 'sonner';
import { alunoApi, mensagemDeErro } from '../../services/aluno';
import { useCarregar } from './useCarregar';
import { Card, EstadoCarregando, EstadoErro, Selo } from './ui';
import { iniciais } from './studentUtils';

function CampoSomenteLeitura({ icone, rotulo, valor }) {
  const Icone = icone;
  return (
    <div>
      <p className="text-xs font-semibold mb-1">{rotulo}</p>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm"
        style={{
          background: 'var(--bg-claro)',
          border: '1px solid var(--cor-borda)',
          color: 'var(--text-cinza)',
        }}
      >
        <Icone size={15} aria-hidden="true" />
        <span className="truncate">{valor || '—'}</span>
      </div>
    </div>
  );
}

export default function Perfil() {
  const { dados: perfil, carregando, erro, recarregar } = useCarregar(() => alunoApi.perfil(), []);
  const [telefone, setTelefone] = useState('');
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (perfil) {
      setTelefone(perfil.telefone || '');
      setNotificacaoAtiva(perfil.notificacaoAtiva ?? false);
    }
  }, [perfil]);

  if (carregando && !perfil) return <EstadoCarregando />;
  if (erro) return <EstadoErro mensagem={erro} onTentar={recarregar} />;
  if (!perfil) return null;

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await alunoApi.atualizarPerfil({ telefone, notificacaoAtiva });
      toast.success('Perfil atualizado!');
      await recarregar();
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Não foi possível salvar as alterações.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={salvar}>
      <h1 className="text-2xl font-bold">Editar Perfil</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--text-cinza)' }}>
        Gerencie suas informações pessoais
      </p>

      <div className="flex flex-col items-center gap-2 mb-5">
        <span
          className="inline-flex items-center justify-center rounded-full w-20 h-20 text-3xl font-bold"
          style={{ background: '#ffe3d1', color: 'var(--laranja-principal)' }}
          aria-hidden="true"
        >
          {iniciais(perfil.nome)}
        </span>
        <p className="font-bold text-lg">{perfil.nome}</p>
        <Selo tom={perfil.status ? 'verde' : 'cinza'}>{perfil.status ? 'ATIVO' : 'INATIVO'}</Selo>
      </div>

      <Card className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FiUser size={15} style={{ color: 'var(--laranja-principal)' }} aria-hidden="true" />
          Informações Pessoais
        </h2>

        <CampoSomenteLeitura icone={FiUser} rotulo="Nome Completo" valor={perfil.nome} />
        <CampoSomenteLeitura icone={FiMail} rotulo="Email" valor={perfil.email} />

        <div>
          <label htmlFor="telefone" className="text-xs font-semibold mb-1 block">
            Telefone
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: 'var(--branco)', border: '1px solid var(--cor-borda)' }}
          >
            <FiPhone size={15} style={{ color: 'var(--text-cinza)' }} aria-hidden="true" />
            <input
              id="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 98765-4321"
              maxLength={20}
              className="w-full bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-escuro)' }}
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 text-sm cursor-pointer">
          <span>Receber e-mails sobre as minhas aulas</span>
          <input
            type="checkbox"
            checked={notificacaoAtiva}
            onChange={(e) => setNotificacaoAtiva(e.target.checked)}
            className="h-5 w-5 accent-[var(--laranja-principal)]"
          />
        </label>

        <p className="text-[11px]" style={{ color: 'var(--text-cinza)' }}>
          Nome e e-mail são alterados pela secretaria.
        </p>
      </Card>

      <button
        type="submit"
        disabled={salvando}
        className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #f77433 0%, #f9964f 100%)' }}
      >
        {salvando ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
}
