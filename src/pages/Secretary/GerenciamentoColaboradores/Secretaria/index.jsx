import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import api from '../../../../services/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { FiSearch, FiPhone, FiMail, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import userIconImg from '/user-icon.png';

export default function GerenciamentoSecretaria() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user?.role === 'ADMINISTRADOR' ? '/admin' : '/secretaria';
  const [secretarias, setSecretarias] = useState([]);
  const [secretariasOriginais, setSecretariasOriginais] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  const fetchSecretarias = useCallback(async () => {
    try {
      const response = await api.get('api/secretarias');
      const data = response.data || [];
      const listaSecretarias = Array.isArray(data) ? data : data.secretarias || [];

      setSecretariasOriginais(listaSecretarias);
      setSecretarias(listaSecretarias);
    } catch (error) {
      console.error('Erro ao buscar secretarias:', error);
      toast.error('Não foi possível carregar as secretarias.');
    }
  }, []);

  useEffect(() => {
    fetchSecretarias();
  }, [fetchSecretarias]);

  useEffect(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) {
      setSecretarias(secretariasOriginais);
      return;
    }

    const filtradas = secretariasOriginais.filter((secretaria) =>
      (secretaria.nome || '').toLowerCase().includes(termo),
    );
    setSecretarias(filtradas);
  }, [secretariasOriginais, termoBusca]);

  const deletarSecretaria = async (secretariaId) => {
    let tempoRestante = 6;
    let intervaloContagem;

    Swal.fire({
      title: 'Excluir secretaria?',
      text: 'Ao excluir esta secretaria, todos os agendamentos (passados e futuros) vinculados a ela também serão removidos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Excluir (${tempoRestante}s)`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      didOpen: () => {
        const botaoConfirmar = Swal.getConfirmButton();
        if (!botaoConfirmar) return;

        botaoConfirmar.disabled = true;

        intervaloContagem = setInterval(() => {
          tempoRestante -= 1;

          if (tempoRestante > 0) {
            botaoConfirmar.textContent = `Excluir (${tempoRestante}s)`;
            return;
          }

          botaoConfirmar.disabled = false;
          botaoConfirmar.textContent = 'Excluir';
          clearInterval(intervaloContagem);
        }, 1000);
      },
      willClose: () => {
        if (intervaloContagem) clearInterval(intervaloContagem);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`api/secretarias/${secretariaId}`);
          toast.success('Secretaria deletada com sucesso.');
          setSecretarias((prev) => prev.filter((s) => s.id !== secretariaId));
          setSecretariasOriginais((prev) => prev.filter((s) => s.id !== secretariaId));
        } catch (error) {
          console.error('Erro ao deletar secretaria:', error);
          toast.error('Não foi possível deletar a secretaria.');
        }
      }
    });
  };

  const alterarStatusSecretaria = async (secretariaId, statusAtual) => {
    const novoStatus = !statusAtual;
    const acao = novoStatus ? 'ativar' : 'desativar';

    Swal.fire({
      title: 'Alterar status?',
      text: `Deseja realmente ${acao} esta secretaria?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: novoStatus ? '#10b981' : '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sim, ${acao}!`,
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`api/secretarias/${secretariaId}`, { status: novoStatus });
          toast.success(`Secretaria ${novoStatus ? 'ativada' : 'desativada'} com sucesso.`);
          setSecretarias((prev) =>
            prev.map((s) => (s.id === secretariaId ? { ...s, status: novoStatus } : s)),
          );
          setSecretariasOriginais((prev) =>
            prev.map((s) => (s.id === secretariaId ? { ...s, status: novoStatus } : s)),
          );
        } catch (error) {
          console.error('Erro ao alterar status:', error);
          toast.error('Não foi possível alterar o status da secretaria.');
        }
      }
    });
  };

  const filterByNome = (event) => {
    setTermoBusca(event.target.value);
  };

  return (
    <div className="flex flex-col gap-6 py-6 px-4 md:px-8 lg:px-16 h-full mx-auto ml-auto bg-slate-50/20">
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Gerenciamento de Secretarias
        </h1>
        {user && user.role === 'ADMINISTRADOR' && (
          <button
            onClick={() => navigate(`${basePath}/secretaria/cadastrar`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            + Adicionar Secretaria
          </button>
        )}
      </div>

      <div className="relative w-full sm:w-96 group">
        <FiSearch
          className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-orange-500"
          size={18}
          style={{ color: '#94a3b8', pointerEvents: 'none' }}
        />
        <input
          type="text"
          placeholder="Buscar por nome..."
          onChange={filterByNome}
          className="w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none transition-all duration-200 shadow-sm border-2 border-slate-100 bg-white"
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--laranja-principal)';
            e.target.style.boxShadow = '0 0 0 4px rgba(247, 116, 51, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#f1f5f9';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div className="mt-2 w-full h-auto pb-4 space-y-6">
        {secretarias && secretarias.length > 0 ? (
          secretarias.map((secretaria) => (
            <div
              key={secretaria.id}
              className="flex flex-col rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 bg-white hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <img
                    src={
                      secretaria.foto
                        ? `${api.defaults.baseURL}/api/imagens/${secretaria.foto}?token=${localStorage.getItem('token')}`
                        : userIconImg
                    }
                    alt={secretaria.nome}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover transition-all duration-300 border-2 border-slate-50"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                        {secretaria.nome}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${secretaria.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}
                      >
                        {secretaria.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                      {secretaria.cargo || 'Secretaria'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pt-5 border-t border-slate-50 gap-4">
                <div className="flex flex-col gap-4 w-full lg:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 flex-wrap">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                        <FiPhone size={14} />
                      </div>
                      <span className="text-sm font-medium">
                        {secretaria.telefone || 'Sem telefone'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                        <FiMail size={14} />
                      </div>
                      <span className="text-sm font-medium">{secretaria.email}</span>
                    </div>
                  </div>
                </div>

                {user && user.role === 'ADMINISTRADOR' && (
                  <div className="flex gap-3 self-end lg:self-auto">
                    <button
                      onClick={() => alterarStatusSecretaria(secretaria.id, secretaria.status)}
                      className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 border ${
                        secretaria.status
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100'
                      }`}
                      title={secretaria.status ? 'Desativar Secretaria' : 'Ativar Secretaria'}
                    >
                      {secretaria.status ? <FiUserCheck size={20} /> : <FiUserX size={20} />}
                    </button>
                    <button
                      onClick={() => deletarSecretaria(secretaria.id)}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition-all hover:scale-110 active:scale-95"
                      title="Deletar Secretaria"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-40 text-slate-400 font-medium">
            Nenhuma secretaria encontrada
          </div>
        )}
      </div>
    </div>
  );
}
