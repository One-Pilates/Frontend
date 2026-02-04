import { FaEdit } from "react-icons/fa";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import Botao from "../../../shared/components/Button";

const ViewStudio = ({
  especialidades,
  salas,
  activeTab,
  setActiveTab,
  handleDeleteEspecialidade,
  showEspModal,
  setShowEspModal,
  editingEsp,
  formEsp,
  setFormEsp,
  handleAddEsp,
  handleEditEsp,
  handleSaveEsp,
  showSalaModal,
  setShowSalaModal,
  editingSala,
  formSala,
  setFormSala,
  handleAddSala,
  handleEditSala,
  handleSaveSala,
  handleDeleteSala,
}) => {
  return (
    <div className="flex flex-col gap-6 py-6 px-16 h-full mx-auto ml-auto">
      <div className="flex flex-row w-full items-center">
        <h1 className="text-3xl font-bold dark:text-fontMain">Configurações do Studio</h1>
      </div>
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow mt-4 w-full h-auto py-6 px-24">
        {/* Tabs */}
        <div className="border-b-2 dark:border-dark-component">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("especialidades")}
              className={`px-6 py-4 text-base font-medium border-b-4 transition-colors 
                ${
                  activeTab === "especialidades"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 dark:text-fontSec hover:text-gray-700 dark:hover:text-fontMain hover:border-gray-300 dark:hover:border-dark-component"
                }
                `}
            >
              Especialidades
            </button>
            <button
              onClick={() => setActiveTab("salas")}
              className={`px-6 py-4 text-base font-medium border-b-4 transition-colors
                ${
                  activeTab === "salas"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 dark:text-fontSec hover:text-gray-700 dark:hover:text-fontMain hover:border-gray-300 dark:hover:border-dark-component"
                }`}
            >
              Salas
            </button>
          </nav>
        </div>
        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto pb-4">
          {activeTab === "especialidades" ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-fontMain">
                  Especialidades Cadastradas
                </h2>
                <Botao
                  onClick={handleAddEsp}
                  cor="bg-blue-500"
                  texto={"Nova Especialidade"}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {especialidades.map((esp) => (
                  <div
                    key={esp.id}
                    className="border border-gray-200 dark:border-dark-component rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-dark-component">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-orange-600 text-lg">{esp.nome}</h3>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                          <FiEdit
                            onClick={() => handleEditEsp(esp)}
                            size={18}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteEspecialidade(esp.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-fontMain">
                  Salas Cadastradas
                </h2>
                <Botao
                  onClick={handleAddSala}
                 cor="bg-blue-500" texto={"Nova Sala"} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {salas.map((sala) => (
                  <div
                    key={sala.id}
                    className="border border-gray-200 dark:border-dark-component rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-dark-component">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-orange-600 text-lg">
                          {sala.nome}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-fontSec">
                          Capacidade: até{" "}
                          <span className="font-semibold">
                            {sala.quantidadeMaximaAlunos}
                          </span>{" "}
                          alunos
                        </p>
                        <p className="text-sm text-gray-600 dark:text-fontSec">
                          Equipamentos PCD:{" "}
                          <span className="font-semibold">
                            {sala.quantidadeEquipamentosPCD}
                          </span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {sala.especialidades &&
                          sala.especialidades.length > 0 ? (
                            sala.especialidades.map((esp, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium"
                              >
                                {esp}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-fontSec">
                              Sem especialidades
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                          <FiEdit
                          onClick={() => handleEditSala(sala)}
                          size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                          <FiTrash2
                          onClick={() => handleDeleteSala(sala.id)}
                          size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal de Especialidade */}
      {showEspModal && (
        <div className="modal-overlay animate-slideUp">
          <div className="bg-white dark:bg-dark-secondary rounded-lg max-w-md w-full py-6 px-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-fontMain">
                {editingEsp ? "Editar Especialidade" : "Nova Especialidade"}
              </h3>
              <button
                onClick={() => setShowEspModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-fontSec dark:hover:text-fontMain"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-fontMain mb-2">
                Nome da Especialidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formEsp}
                onChange={(e) => setFormEsp(e.target.value)}
                placeholder="Ex: Fisioterapia"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-component dark:bg-dark-component dark:text-fontMain rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Botao
                onClick={() => setShowEspModal(false)}
                cor="bg-gray-500"
                texto="Cancelar"
              />
              <Botao onClick={handleSaveEsp} cor="bg-blue-600" texto="Salvar" />
            </div>
          </div>
        </div>
      )}
      {/*Modal de Sala */}
      {showSalaModal && (
        <div className="modal-overlay animate-slideUp">
          <div className="bg-white dark:bg-dark-secondary rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-fontMain">
                {editingSala ? 'Editar Sala' : 'Nova Sala'}
              </h3>
              <button onClick={() => setShowSalaModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-fontSec dark:hover:text-fontMain">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-fontMain mb-2">
                  Nome da Sala <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formSala.nome}
                  onChange={(e) => setFormSala({...formSala, nome: e.target.value})}
                  placeholder="Ex: Sala Reformer"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-component dark:bg-dark-component dark:text-fontMain rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-fontMain mb-2">
                    Capacidade Máxima <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formSala.quantidadeMaximaAlunos}
                    onChange={(e) => setFormSala({...formSala, quantidadeMaximaAlunos: e.target.value})}
                    placeholder="Ex: 8"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-component dark:bg-dark-component dark:text-fontMain rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-fontMain mb-2">
                    Equipamentos PCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formSala.quantidadeEquipamentosPCD}
                    onChange={(e) => setFormSala({...formSala, quantidadeEquipamentosPCD: e.target.value})}
                    placeholder="Ex: 2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-component dark:bg-dark-component dark:text-fontMain rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-fontMain mb-3">
                  Especialidades da Sala
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-gray-200 dark:border-dark-component rounded-lg bg-gray-50 dark:bg-dark-component">
                  {especialidades.map((esp) => (
                    <label
                      key={esp.id}
                      className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-dark-secondary rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formSala.especialidades?.includes(esp.nome) || formSala.especialidadesIds?.includes(esp.id) || false}
                        onChange={(e) => {
                          const currentNomes = formSala.especialidades || [];
                          const currentIds = formSala.especialidadesIds || [];
                          
                          if (e.target.checked) {
                            setFormSala({
                              ...formSala,
                              especialidades: [...currentNomes, esp.nome],
                              especialidadesIds: [...currentIds, esp.id]
                            });
                          } else {
                            setFormSala({
                              ...formSala,
                              especialidades: currentNomes.filter(nome => nome !== esp.nome),
                              especialidadesIds: currentIds.filter(id => id !== esp.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-fontMain">{esp.nome}</span>
                    </label>
                  ))}
                  {especialidades.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-fontSec text-center py-2">
                      Nenhuma especialidade cadastrada
                    </p>
                  )}
                </div>
                <p className="text-xs text-center text-orange-600 mt-2">
                  Selecione as especialidades que podem ser praticadas nesta sala
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Botao
                onClick={() => setShowSalaModal(false)}
                cor="bg-gray-500"
                texto="Cancelar"
              />
              <Botao
                onClick={handleSaveSala}
                cor="bg-blue-600"
                texto="Salvar"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudio;
