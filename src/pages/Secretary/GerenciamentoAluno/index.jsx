import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import {
  FiArrowLeft,
  FiArrowRight,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiDownload,
  FiEdit2,
  FiChevronDown
} from 'react-icons/fi';
import Botao from '../../../components/Button';
import { abrirModalDownload } from './components/Export';

export default function GerenciamentoAluno() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user?.role === 'ADMINISTRADOR' ? '/admin' : '/secretaria';
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = async (page = 1) => {
    try {
      const pageIndex = Math.max(0, page - 1);
      const params = {
        page: pageIndex,
        size: studentsPerPage,
        sort: 'id,asc',
      };

      if (nameFilter.trim()) params.nome = nameFilter.trim();
      if (statusFilter !== 'todos') params.status = statusFilter === 'ativo';

      const response = await api.get('api/alunos/paginacao', { params });
      const data = response.data || {};

      setStudents(data.alunos || []);
      setTotalPages(data.totalPaginas || 1);
      setTotalRecords(data.totalRegistros || (data.alunos ? data.alunos.length : 0));
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, nameFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, statusFilter]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const deleteStudent = async (alunoId) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`api/alunos/${alunoId}`);
          const nextPage = students.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
          setCurrentPage(nextPage);
          await fetchStudents(nextPage);
          toast.success('Aluno deletado com sucesso.');
        } catch (error) {
          console.error('Erro ao deletar aluno:', error);
          toast.error('Não foi possível deletar o aluno.');
        }
      }
    });
  };

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = Math.min(startIndex + students.length, totalRecords);

  return (
    <div className="flex flex-col gap-6 py-6 px-4 md:px-8 lg:px-16 h-full mx-auto ml-auto bg-slate-50/20">
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gerenciamento de Aluno</h1>
        <button
          onClick={() => navigate(`${basePath}/aluno/cadastrar`)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          + Adicionar Aluno
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full items-stretch md:items-center gap-4 justify-between">
        <div className="relative w-full md:w-96 group">
          <FiSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-orange-500"
            size={18}
            style={{ color: '#94a3b8', pointerEvents: 'none' }}
          />
          <input
            type="text"
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Buscar por nome..."
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => abrirModalDownload(students, calculateAge)}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-orange-100"
            style={{
              backgroundColor: 'var(--laranja-principal)',
            }}
          >
            <FiDownload size={18} />
            <span className="text-sm">Exportar</span>
          </button>

          <div className="relative flex-1 sm:flex-none">
            <FiFilter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
            />
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl focus:outline-none transition-all duration-200 shadow-sm appearance-none text-sm font-bold cursor-pointer border-2 border-slate-100 bg-white"
              onFocus={(e) => (e.target.style.borderColor = 'var(--laranja-principal)')}
              onBlur={(e) => (e.target.style.borderColor = '#f1f5f9')}
            >
              <option value="todos">Status: Todos</option>
              <option value="ativo">Status: Ativo</option>
              <option value="inativo">Status: Inativo</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      <div
        className="rounded-[2rem] shadow-sm flex flex-col overflow-hidden border border-slate-100 bg-white"
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full table-auto min-w-160">
            <thead
              className="text-xs font-bold uppercase tracking-widest bg-slate-50/50 border-b border-slate-100"
            >
              <tr>
                <th className="px-6 py-5 text-left text-slate-500">Nome do Aluno</th>
                <th className="hidden lg:table-cell px-6 py-5 text-left text-slate-500">Email</th>
                <th className="hidden md:table-cell px-6 py-5 text-left text-slate-500">CPF</th>
                <th className="hidden sm:table-cell px-6 py-5 text-left text-slate-500 text-center">Idade</th>
                <th className="px-6 py-5 text-left text-slate-500">Status</th>
                <th className="hidden xl:table-cell px-6 py-5 text-left text-slate-500">Limitações</th>
                <th className="px-6 py-5 text-center text-slate-500">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {students && students.length > 0 ? (
                students.map((aluno) => (
                  <tr
                    key={aluno.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/30"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`${basePath}/perfil/aluno/${aluno.id}`)}
                        className="text-left hover:text-orange-600 font-bold text-slate-700 transition-colors"
                      >
                        {aluno.nome}
                      </button>
                    </td>

                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-slate-500 font-medium">
                      {aluno.email}
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                      {aluno.cpf}
                    </td>

                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-slate-500 font-bold text-center">
                      {calculateAge(aluno.dataNascimento)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          aluno.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {aluno.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="hidden xl:table-cell px-6 py-4">
                      {aluno.alunoComLimitacoesFisicas ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                          Sim
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          Não
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`${basePath}/aluno/editar/${aluno.id}`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                          title="Editar aluno"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteStudent(aluno.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all hover:scale-110"
                          title="Excluir aluno"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm font-medium text-slate-400"
                  >
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {students && students.length > 0 && (
          <div
            className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white"
          >
            <div
              className="text-xs font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1"
            >
              Mostrando {startIndex + 1} a {endIndex} de {totalRecords} alunos
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl transition-all border border-slate-100 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiArrowLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {(() => {
                  const pages = [];
                  const total = totalPages;

                  const renderPage = (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
                        currentPage === p 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  );

                  pages.push(renderPage(1));

                  if (currentPage > 3) {
                    pages.push(<span key="dots1" className="px-1 text-slate-300">…</span>);
                  }

                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(total - 1, currentPage + 1);

                  for (let p = start; p <= end; p++) {
                    pages.push(renderPage(p));
                  }

                  if (currentPage < total - 2) {
                    pages.push(<span key="dots2" className="px-1 text-slate-300">…</span>);
                  }

                  if (total > 1) pages.push(renderPage(total));

                  return pages;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl transition-all border border-slate-100 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
