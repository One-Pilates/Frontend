import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Botao from "../../../components/Button";

export default function StudioView() {
  const [activeTab, setActiveTab] = useState("especialidades");

  // Especialidades States
  const [especialidades, setEspecialidades] = useState([]);
  // Modal Especialidades States
  const [showEspModal, setShowEspModal] = useState(false);
  const [editingEsp, setEditingEsp] = useState(null);
  const [formEsp, setFormEsp] = useState("");

  // Salas States
  const [salas, setSalas] = useState([]);
  // Modal Salas States
  const [showSalaModal, setShowSalaModal] = useState(false);
  const [editingSala, setEditingSala] = useState(null);
  const [formSala, setFormSala] = useState({
    nome: "",
    quantidadeMaximaAlunos: "",
    quantidadeEquipamentosPCD: "",
    especialidades: [],
    especialidadesIds: [],
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Função para buscar dados conforme a aba ativa
  const fetchData = async () => {
    if (activeTab === "especialidades") {
      try {
        const response = await api.get(`api/especialidades`);
        const data = response.data;
        setEspecialidades(data);
      } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
      }
    } else if (activeTab === "salas") {
      try {
        const response = await api.get(`api/salas`);
        const data = response.data;
        setSalas(data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
      }
    }
  };

  // Funções Especialidades
  const handleAddEsp = () => {
    console.log("Adicionar Especialidade");
    setEditingEsp(null);
    setFormEsp("");
    setShowEspModal(true);
  };

  const handleEditEsp = (esp) => {
    setEditingEsp(esp);
    setFormEsp(esp.nome);
    setShowEspModal(true);
  };

  const handleSaveEsp = async () => {
    if (!formEsp.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "O nome da especialidade não pode estar vazio.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (editingEsp) {
      try {
        const newName = {
          nome: formEsp,
        };
        const response = await api.patch(
          `api/especialidades/${editingEsp.id}`,
          newName
        );
        console.log("Especialidade atualizada:", response.data);
        setEspecialidades(
          especialidades.map((e) =>
            e.id === editingEsp.id ? { ...e, nome: formEsp } : e
          )
        );
        Swal.fire({
          icon: "success",
          title: "Atualizado!",
          text: "A especialidade foi atualizada com sucesso.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Erro ao atualizar especialidade:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao atualizar a especialidade.",
          confirmButtonText: "OK",
        });
      }
    } else {
      try {
        const newName = {
          nome: formEsp,
        };
        const response = await api.post(`api/especialidades`, newName);
        console.log("Especialidade criada:", response.data);
        Swal.fire({
          icon: "success",
          title: "Criado!",
          text: "A especialidade foi criada com sucesso.",
          confirmButtonText: "OK",
        });
        setEspecialidades([...especialidades, response.data]);
      } catch (error) {
        console.error("Erro ao criar especialidade:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao criar a especialidade.",
          confirmButtonText: "OK",
        });
      }
    }
    setShowEspModal(false);
  };

  const handleDeleteEspecialidade = async (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`api/especialidades/${id}`);
          console.log("Especialidade deletada:", response.data);
          setEspecialidades(especialidades.filter((esp) => esp.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deletado!",
            text: "A especialidade foi deletada com sucesso.",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Erro ao deletar especialidade:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Ocorreu um erro ao deletar a especialidade.",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  // Funções Salas
  const handleAddSala = () => {
    setEditingSala(null);
    setFormSala({
      nome: "",
      quantidadeMaximaAlunos: "",
      quantidadeEquipamentosPCD: "",
      especialidades: [],
      especialidadesIds: [],
    });
    setShowSalaModal(true);
  };

  const handleEditSala = (sala) => {
    // Converte os nomes das especialidades para IDs
    const especialidadesIds = (sala.especialidades || [])
      .map((nomeEsp) => {
        const esp = especialidades.find((e) => e.nome === nomeEsp);
        return esp ? esp.id : null;
      })
      .filter((id) => id !== null);

    setEditingSala(sala);
    setFormSala({
      nome: sala.nome,
      quantidadeMaximaAlunos: sala.quantidadeMaximaAlunos,
      quantidadeEquipamentosPCD: sala.quantidadeEquipamentosPCD,
      especialidades: sala.especialidades || [],
      especialidadesIds: especialidadesIds,
    });
    setShowSalaModal(true);
  };

  const handleSaveSala = async () => {
    if (!formSala.nome.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "O nome da sala não pode estar vazio.",
        confirmButtonText: "OK",
      });
      return;
    } else if (
      !formSala.quantidadeMaximaAlunos ||
      isNaN(formSala.quantidadeMaximaAlunos)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "A quantidade máxima de alunos deve ser um número válido.",
        confirmButtonText: "OK",
      });
      return;
    } else if (
      !formSala.quantidadeEquipamentosPCD ||
      isNaN(formSala.quantidadeEquipamentosPCD)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "A quantidade de equipamentos para PCD deve ser um número válido.",
        confirmButtonText: "OK",
      });
      return;
    } else if (formSala.especialidades.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Selecione pelo menos uma especialidade.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (editingSala) {
      const salaEdit = {
        nome: formSala.nome,
        especialidadeIds: formSala.especialidadesIds,
        quantidadeMaximaAlunos: Number(formSala.quantidadeMaximaAlunos),
        quantidadeEquipamentosPCD: Number(formSala.quantidadeEquipamentosPCD),
      };
      console.log("Novo objeto sala:", salaEdit);

      try {
        const response = await api.patch(
          `api/salas/${editingSala.id}`,
          salaEdit
        );
        const data = response.data;
        console.log("sala edidata:", data);
        Swal.fire({
          icon: "success",
          title: "Atualizado!",
          text: "A sala foi atualizada com sucesso.",
          confirmButtonText: "OK",
        });
        setSalas(
          salas.map((s) => (s.id === editingSala.id ? { ...s, ...data } : s))
        );
        Swal.fire({
          icon: "success",
          title: "Atualizado!",
          text: "A sala foi atualizada com sucesso.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Erro ao atualizar sala:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao atualizar a sala.",
          confirmButtonText: "OK",
        });
      }
    } else {
      try {
        const newSala = {
          nome: formSala.nome,
          especialidadeIds: formSala.especialidadesIds,
          quantidadeMaximaAlunos: Number(formSala.quantidadeMaximaAlunos),
          quantidadeEquipamentosPCD: Number(formSala.quantidadeEquipamentosPCD),
        };
        console.log("Novo objeto sala:", newSala);

        const response = await api.post("api/salas", newSala);
        console.log("Sala criada:", response.data);
        Swal.fire({
          icon: "success",
          title: "Criado!",
          text: "A sala foi criada com sucesso.",
          confirmButtonText: "OK",
        });
        setSalas([...salas, response.data]);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao criar a sala.",
          confirmButtonText: "OK",
        });
      }
    }
    setShowSalaModal(false);
  };

  const handleDeleteSala = (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`api/salas/${id}`);
          console.log("Sala deletada:", response.data);
          setSalas(salas.filter((s) => s.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deletado!",
            text: "A sala foi deletada com sucesso.",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Erro ao deletar sala:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Ocorreu um erro ao deletar a sala.",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 px-4 sm:px-6 md:px-8 lg:px-16 h-full mx-auto ml-auto">
      <div className="flex flex-row w-full items-center">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-fontMain">Configurações do Studio</h1>
      </div>
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow mt-2 sm:mt-4 w-full h-auto py-4 sm:py-6 px-4 sm:px-6 md:px-12 lg:px-24">
        {/* Tabs */}
        <div className="border-b-2 dark:border-dark-component">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("especialidades")}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-4 transition-colors flex-1 sm:flex-none
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
              className={`px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-4 transition-colors flex-1 sm:flex-none
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
        <div className="p-3 sm:p-6 max-h-96 overflow-y-auto pb-4">
          {activeTab === "especialidades" ? (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-fontMain">
                  Especialidades Cadastradas
                </h2>
                <Botao
                  onClick={handleAddEsp}
                  cor="bg-blue-500"
                  texto={"Nova Especialidade"}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {especialidades.map((esp) => (
                  <div
                    key={esp.id}
                    className="border border-gray-200 dark:border-dark-component rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow dark:bg-dark-component">
                    <div className="flex justify-between items-center gap-3">
                      <h3 className="font-medium text-orange-600 text-base sm:text-lg">{esp.nome}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                          <FiEdit
                            onClick={() => handleEditEsp(esp)}
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteEspecialidade(esp.id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                        >
                          <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-fontMain">
                  Salas Cadastradas
                </h2>
                <Botao
                  onClick={handleAddSala}
                 cor="bg-blue-500" texto={"Nova Sala"} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {salas.map((sala) => (
                  <div
                    key={sala.id}
                    className="border border-gray-200 dark:border-dark-component rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow dark:bg-dark-component">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex flex-col gap-2 flex-1">
                        <h3 className="font-medium text-orange-600 text-base sm:text-lg">
                          {sala.nome}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-fontSec">
                          Capacidade: até{" "}
                          <span className="font-semibold">
                            {sala.quantidadeMaximaAlunos}
                          </span>{" "}
                          alunos
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-fontSec">
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
                                className="px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs sm:text-sm font-medium"
                              >
                                {esp}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-fontSec">
                              Sem especialidades
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition">
                          <FiEdit
                          onClick={() => handleEditSala(sala)}
                          size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                          <FiTrash2
                          onClick={() => handleDeleteSala(sala.id)}
                          size={16} className="sm:w-[18px] sm:h-[18px]" />
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
          <div className="bg-white dark:bg-dark-secondary rounded-lg max-w-md w-[90%] sm:w-full py-4 sm:py-6 px-4 sm:px-8">
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
          <div className="bg-white dark:bg-dark-secondary rounded-lg max-w-lg w-[90%] sm:w-full p-4 sm:p-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
}
