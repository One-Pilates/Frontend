import React from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiDownload
} from "react-icons/fi";
import Botao from "../../../shared/components/Button";
import { abrirModalDownload } from "./components/Export";

const GerenciamentoAlunoView = ({
  filteredStudents,
  currentStudents,
  setFilterByNome,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  calculateAge,
  deleteAluno,
  navigate,
}) => {
  return (
    <>
      <div className="flex flex-col gap-6 py-6 px-16 h-full mx-auto">

        <div className="flex w-full justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciamento de Aluno</h1>

          <Botao
            onClick={() => navigate("/secretaria/aluno/cadastrar")}
            cor="bg-blue-500"
            texto={"Adicionar Aluno"}
          />
        </div>


        <div className="flex w-full items-center gap-4 justify-between">
          <div className="relative w-80">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{ color: 'var(--laranja-principal)' }}
            />
            <input
              type="text"
              onChange={(e) => setFilterByNome(e.target.value)}
              placeholder="Buscar por nome"
              className="w-full pl-10 pr-8 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{
                borderColor: 'var(--cor-borda)',
                borderWidth: '1px',
                backgroundColor: 'var(--branco)',
                color: 'var(--text-escuro)'
              }}
            />
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => abrirModalDownload(filteredStudents, calculateAge)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--laranja-principal)', outlineColor: 'var(--laranja-principal)' }}
            >
              <FiDownload size={20} />
              <span>Exportar</span>
            </button>

            <div className="relative">
              <FiFilter
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-cinza)' }}
              />
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                style={{
                  borderColor: 'var(--cor-borda)',
                  borderWidth: '1px',
                  backgroundColor: 'var(--branco)',
                  color: 'var(--text-escuro)'
                }}
              >
                <option value="todos">Status: Todos</option>
                <option value="ativo">Status: Ativo</option>
                <option value="inativo">Status: Inativo</option>
              </select>
            </div>

          </div>



        </div>


        <div 
          className="rounded-xl shadow-md flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--branco)',
            borderColor: 'var(--cor-borda)',
            borderWidth: '1px'
          }}
        >
          <div className="overflow-x-auto flex-1">
            <table className="w-full table-fixed">
              <thead 
                className="border-b text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--branco)',
                  borderBottomColor: 'var(--cor-borda)'
                }}
              >
                <tr>
                  <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Nome do Aluno
                  </th>
                  <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Email
                  </th>
                  <th className="w-[12%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    CPF
                  </th>
                  <th className="w-[8%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Idade
                  </th>
                  <th className="w-[12%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Status
                  </th>
                  <th className="w-[12%] px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Limitações
                  </th>
                  <th className="w-[16%] px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-escuro)' }}>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody 
                className="divide-y"
                style={{ borderColor: 'var(--cor-borda)' }}
              >
                {currentStudents && currentStudents.length > 0 ? (
                  currentStudents.map((aluno) => (
                    <tr
                      key={aluno.id}
                      className="transition"
                      style={{ 
                        backgroundColor: 'var(--branco)',
                        color: 'var(--text-escuro)'
                      }}
                    >
                      <td className="px-6 py-4 text-sm">
                        <button
                        onClick={() => navigate(`/secretaria/perfil/aluno/${aluno.id}`)}>
                        {aluno.nome}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {aluno.email}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {aluno.cpf}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {calculateAge(aluno.dataNascimento)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${aluno.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {aluno.status ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {aluno.alunoComLimitacoesFisicas ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-dark text-gray-400">
                            Não
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => deleteAluno(aluno.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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
                      className="px-6 py-12 text-center text-sm"
                      style={{ color: 'var(--text-cinza)' }}
                    >
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {filteredStudents && filteredStudents.length > 0 && (
            <div 
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{
                backgroundColor: 'var(--branco)',
                borderTopColor: 'var(--cor-borda)'
              }}
            >
              <div className="text-sm" style={{ color: 'var(--text-cinza)' }}>
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredStudents.length)} de{" "}
                {filteredStudents.length} alunos
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--branco)',
                    color: currentPage === 1 ? 'var(--text-cinza)' : 'var(--text-escuro)',
                    borderColor: 'var(--cor-borda)',
                    borderWidth: '1px'
                  }}
                >
                  <FiArrowLeft size={18} />
                </button>


                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const total = totalPages;

                    const renderPage = (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className="w-10 h-10 rounded-full text-sm font-medium transition"
                        style={{
                          backgroundColor: currentPage === p ? 'var(--laranja-principal)' : 'var(--branco)',
                          color: currentPage === p ? '#fff' : 'var(--text-escuro)',
                          borderColor: 'var(--cor-borda)',
                          borderWidth: '1px'
                        }}
                      >
                        {p}
                      </button>
                    );


                    pages.push(renderPage(1));


                    if (currentPage > 3) {
                      pages.push(
                        <span key="dots1" className="px-2" style={{ color: 'var(--text-cinza)' }}>
                          …
                        </span>
                      );
                    }

                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(total - 1, currentPage + 1);

                    for (let p = start; p <= end; p++) {
                      pages.push(renderPage(p));
                    }


                    if (currentPage < total - 2) {
                      pages.push(
                        <span key="dots2" className="px-2" style={{ color: 'var(--text-cinza)' }}>
                          …
                        </span>
                      );
                    }

                    if (total > 1) pages.push(renderPage(total));

                    return pages;
                  })()}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--branco)',
                    color: currentPage === totalPages ? 'var(--text-cinza)' : 'var(--text-escuro)',
                    borderColor: 'var(--cor-borda)',
                    borderWidth: '1px'
                  }}
                >
                  <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GerenciamentoAlunoView;

