import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Botao from '../../../components/Button';
import { getColorForEspecialidade } from '../../../utils/utils';

export default function StudioView() {
  const [activeTab, setActiveTab] = useState('especialidades');

  // Especialidades States
  const [especialidades, setEspecialidades] = useState([]);
  // Modal Especialidades States
  const [showEspModal, setShowEspModal] = useState(false);
  const [editingEsp, setEditingEsp] = useState(null);
  const [formEsp, setFormEsp] = useState('');

  // Salas States
  const [salas, setSalas] = useState([]);
  // Modal Salas States
  const [showSalaModal, setShowSalaModal] = useState(false);
  const [editingSala, setEditingSala] = useState(null);
  const [formSala, setFormSala] = useState({
    nome: '',
    quantidadeMaximaAlunos: '',
    quantidadeEquipamentosPCD: '',
    especialidades: [],
    especialidadesIds: [],
  });

  // Função para buscar dados conforme a aba ativa
  const fetchData = async () => {
    if (activeTab === 'especialidades') {
      try {
        const response = await api.get(`api/especialidades`);
        const data = response.data;
        setEspecialidades(data);
      } catch (error) {
        console.error('Erro ao buscar especialidades:', error);
      }
    } else if (activeTab === 'salas') {
      try {
        const response = await api.get(`api/salas`);
        const data = response.data;
        setSalas(data);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Funções Especialidades
  const handleAddEsp = () => {
    console.log('Adicionar Especialidade');
    setEditingEsp(null);
    setFormEsp('');
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
        icon: 'warning',
        title: 'Atenção',
        text: 'O nome da especialidade não pode estar vazio.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (editingEsp) {
      try {
        const newName = {
          nome: formEsp,
        };
        const response = await api.patch(`api/especialidades/${editingEsp.id}`, newName);
        console.log('Especialidade atualizada:', response.data);
        setEspecialidades(
          especialidades.map((e) => (e.id === editingEsp.id ? { ...e, nome: formEsp } : e)),
        );
        Swal.fire({
          icon: 'success',
          title: 'Atualizado!',
          text: 'A especialidade foi atualizada com sucesso.',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Erro ao atualizar especialidade:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao atualizar a especialidade.',
          confirmButtonText: 'OK',
        });
      }
    } else {
      try {
        const newName = {
          nome: formEsp,
        };
        const response = await api.post(`api/especialidades`, newName);
        console.log('Especialidade criada:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Criado!',
          text: 'A especialidade foi criada com sucesso.',
          confirmButtonText: 'OK',
        });
        setEspecialidades([...especialidades, response.data]);
      } catch (error) {
        console.error('Erro ao criar especialidade:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao criar a especialidade.',
          confirmButtonText: 'OK',
        });
      }
    }
    setShowEspModal(false);
  };

  const handleDeleteEspecialidade = async (id) => {
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
          const response = await api.delete(`api/especialidades/${id}`);
          console.log('Especialidade deletada:', response.data);
          setEspecialidades(especialidades.filter((esp) => esp.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deletado!',
            text: 'A especialidade foi deletada com sucesso.',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Erro ao deletar especialidade:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao deletar a especialidade.',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  // Funções Salas
  const handleAddSala = () => {
    setEditingSala(null);
    setFormSala({
      nome: '',
      quantidadeMaximaAlunos: '',
      quantidadeEquipamentosPCD: '',
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
        icon: 'warning',
        title: 'Atenção',
        text: 'O nome da sala não pode estar vazio.',
        confirmButtonText: 'OK',
      });
      return;
    } else if (!formSala.quantidadeMaximaAlunos || isNaN(formSala.quantidadeMaximaAlunos)) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'A quantidade máxima de alunos deve ser um número válido.',
        confirmButtonText: 'OK',
      });
      return;
    } else if (!formSala.quantidadeEquipamentosPCD || isNaN(formSala.quantidadeEquipamentosPCD)) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'A quantidade de equipamentos para PCD deve ser um número válido.',
        confirmButtonText: 'OK',
      });
      return;
    } else if (formSala.especialidades.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Selecione pelo menos uma especialidade.',
        confirmButtonText: 'OK',
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
      console.log('Novo objeto sala:', salaEdit);

      try {
        const response = await api.patch(`api/salas/${editingSala.id}`, salaEdit);
        const data = response.data;
        console.log('sala edidata:', data);
        Swal.fire({
          icon: 'success',
          title: 'Atualizado!',
          text: 'A sala foi atualizada com sucesso.',
          confirmButtonText: 'OK',
        });
        setSalas(salas.map((s) => (s.id === editingSala.id ? { ...s, ...data } : s)));
        Swal.fire({
          icon: 'success',
          title: 'Atualizado!',
          text: 'A sala foi atualizada com sucesso.',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Erro ao atualizar sala:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao atualizar a sala.',
          confirmButtonText: 'OK',
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
        console.log('Novo objeto sala:', newSala);

        const response = await api.post('api/salas', newSala);
        console.log('Sala criada:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Criado!',
          text: 'A sala foi criada com sucesso.',
          confirmButtonText: 'OK',
        });
        setSalas([...salas, response.data]);
      } catch (error) {
        console.error('Erro ao criar sala:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao criar a sala.',
          confirmButtonText: 'OK',
        });
      }
    }
    setShowSalaModal(false);
  };

  const handleDeleteSala = (id) => {
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
          const response = await api.delete(`api/salas/${id}`);
          console.log('Sala deletada:', response.data);
          setSalas(salas.filter((s) => s.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deletado!',
            text: 'A sala foi deletada com sucesso.',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error('Erro ao deletar sala:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao deletar a sala.',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 py-2 sm:py-3 px-4 sm:px-6 md:px-8 lg:px-16 h-full mx-auto ml-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-escuro)' }}>
          Configurações do Studio
        </h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 sm:gap-4 border-b-2" style={{ borderColor: 'var(--cor-borda)' }}>
        <button
          onClick={() => setActiveTab('especialidades')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold border-b-4 transition-all duration-200 ${
            activeTab === 'especialidades'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent hover:border-gray-300'
          }`}
          style={activeTab !== 'especialidades' ? { color: 'var(--text-cinza)' } : {}}
        >
          Especialidades
        </button>
        <button
          onClick={() => setActiveTab('salas')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold border-b-4 transition-all duration-200 ${
            activeTab === 'salas'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent hover:border-gray-300'
          }`}
          style={activeTab !== 'salas' ? { color: 'var(--text-cinza)' } : {}}
        >
          Salas
        </button>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === 'especialidades' ? (
          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: 'var(--laranja-principal)' }}
                >
                  Especialidades Cadastradas
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-cinza)' }}>
                  {especialidades.length}{' '}
                  {especialidades.length === 1 ? 'especialidade' : 'especialidades'}{' '}
                  {especialidades.length === 1 ? 'cadastrada' : 'cadastradas'}
                </p>
              </div>
              <Botao onClick={handleAddEsp} cor="bg-blue-500" texto={'+ Nova Especialidade'} />
            </div>

            {/* List */}
            {especialidades.length > 0 ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                {especialidades.map((esp) => {
                  const { backgroundColor } = getColorForEspecialidade(esp.nome);
                  return (
                    <div
                      key={esp.id}
                      className="rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 border"
                      style={{
                        backgroundColor: 'var(--branco)',
                        borderColor: 'var(--cor-borda)',
                      }}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor }}
                          />
                          <h3
                            className="font-semibold text-base sm:text-lg wrap-break-word"
                            style={{ color: 'var(--text-escuro)' }}
                          >
                            {esp.nome}
                          </h3>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditEsp(esp)}
                            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
                            style={{ color: '#3b82f6' }}
                            title="Editar"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEspecialidade(esp.id)}
                            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
                            style={{ color: '#ef4444' }}
                            title="Deletar"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  backgroundColor: 'var(--branco)',
                  borderColor: 'var(--cor-borda)',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                }}
              >
                <p className="text-base sm:text-lg" style={{ color: 'var(--text-cinza)' }}>
                  Nenhuma especialidade cadastrada ainda
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: 'var(--laranja-principal)' }}
                >
                  Salas Cadastradas
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-cinza)' }}>
                  {salas.length} {salas.length === 1 ? 'sala cadastrada' : 'salas cadastradas'}
                </p>
              </div>
              <Botao onClick={handleAddSala} cor="bg-blue-500" texto={'+ Nova Sala'} />
            </div>

            {/* List */}
            {salas.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {salas.map((sala) => (
                  <div
                    key={sala.id}
                    className="rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border"
                    style={{
                      backgroundColor: 'var(--branco)',
                      borderColor: 'var(--cor-borda)',
                    }}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex flex-col gap-3 flex-1 w-full">
                        <h3
                          className="font-bold text-lg sm:text-xl"
                          style={{ color: 'var(--laranja-principal)' }}
                        >
                          {sala.nome}
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs sm:text-sm font-medium"
                              style={{ color: 'var(--text-cinza)' }}
                            >
                              Capacidade:
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold"
                              style={{
                                backgroundColor: '#e0f2fe',
                                color: '#0284c7',
                              }}
                            >
                              {sala.quantidadeMaximaAlunos} alunos
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs sm:text-sm font-medium"
                              style={{ color: 'var(--text-cinza)' }}
                            >
                              Equipamentos PCD:
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold"
                              style={{
                                backgroundColor: '#ddd6fe',
                                color: '#7c3aed',
                              }}
                            >
                              {sala.quantidadeEquipamentosPCD}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span
                            className="text-xs sm:text-sm font-medium"
                            style={{ color: 'var(--text-cinza)' }}
                          >
                            Especialidades:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {sala.especialidades && sala.especialidades.length > 0 ? (
                              sala.especialidades.map((esp, index) => {
                                const { backgroundColor, textColor } =
                                  getColorForEspecialidade(esp);
                                return (
                                  <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm"
                                    style={{
                                      backgroundColor,
                                      color: textColor,
                                    }}
                                  >
                                    {esp}
                                  </span>
                                );
                              })
                            ) : (
                              <span
                                className="text-xs sm:text-sm italic"
                                style={{ color: 'var(--text-cinza)' }}
                              >
                                Nenhuma especialidade vinculada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleEditSala(sala)}
                          className="p-2.5 rounded-lg transition-all hover:scale-110 active:scale-95"
                          style={{ color: '#3b82f6' }}
                          title="Editar"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteSala(sala.id)}
                          className="p-2.5 rounded-lg transition-all hover:scale-110 active:scale-95"
                          style={{ color: '#ef4444' }}
                          title="Deletar"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  backgroundColor: 'var(--branco)',
                  borderColor: 'var(--cor-borda)',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                }}
              >
                <p className="text-base sm:text-lg" style={{ color: 'var(--text-cinza)' }}>
                  Nenhuma sala cadastrada ainda
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal de Especialidade */}
      {showEspModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-backdropFadeIn"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="rounded-xl max-w-md w-full py-6 px-6 sm:px-8 shadow-2xl animate-slideUp"
            style={{ backgroundColor: 'var(--branco)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{ color: 'var(--laranja-principal)' }}
              >
                {editingEsp ? 'Editar Especialidade' : 'Nova Especialidade'}
              </h3>
              <button
                onClick={() => setShowEspModal(false)}
                className="p-1 rounded-lg transition-all hover:scale-110 active:scale-95"
                style={{ color: 'var(--text-cinza)' }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--text-escuro)' }}
              >
                Nome da Especialidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formEsp}
                onChange={(e) => setFormEsp(e.target.value)}
                placeholder="Ex: Fisioterapia"
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{
                  borderColor: 'var(--cor-borda)',
                  borderWidth: '1px',
                  backgroundColor: 'var(--branco)',
                  color: 'var(--text-escuro)',
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Botao onClick={() => setShowEspModal(false)} cor="bg-gray-500" texto="Cancelar" />
              <Botao onClick={handleSaveEsp} cor="bg-blue-600" texto="Salvar" />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sala */}
      {showSalaModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto animate-backdropFadeIn"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="rounded-xl max-w-2xl w-full my-8 py-6 px-6 sm:px-8 shadow-2xl animate-slideUp"
            style={{ backgroundColor: 'var(--branco)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{ color: 'var(--laranja-principal)' }}
              >
                {editingSala ? 'Editar Sala' : 'Nova Sala'}
              </h3>
              <button
                onClick={() => setShowSalaModal(false)}
                className="p-1 rounded-lg transition-all hover:scale-110 active:scale-95"
                style={{ color: 'var(--text-cinza)' }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--text-escuro)' }}
                >
                  Nome da Sala <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formSala.nome}
                  onChange={(e) => setFormSala({ ...formSala, nome: e.target.value })}
                  placeholder="Ex: Sala Reformer"
                  className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-all"
                  style={{
                    borderColor: 'var(--cor-borda)',
                    borderWidth: '1px',
                    backgroundColor: 'var(--branco)',
                    color: 'var(--text-escuro)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-escuro)' }}
                  >
                    Capacidade Máxima <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formSala.quantidadeMaximaAlunos}
                    onChange={(e) =>
                      setFormSala({ ...formSala, quantidadeMaximaAlunos: e.target.value })
                    }
                    placeholder="Ex: 8"
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--cor-borda)',
                      borderWidth: '1px',
                      backgroundColor: 'var(--branco)',
                      color: 'var(--text-escuro)',
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-escuro)' }}
                  >
                    Equipamentos PCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formSala.quantidadeEquipamentosPCD}
                    onChange={(e) =>
                      setFormSala({ ...formSala, quantidadeEquipamentosPCD: e.target.value })
                    }
                    placeholder="Ex: 2"
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-all"
                    style={{
                      borderColor: 'var(--cor-borda)',
                      borderWidth: '1px',
                      backgroundColor: 'var(--branco)',
                      color: 'var(--text-escuro)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--text-escuro)' }}
                >
                  Especialidades da Sala <span className="text-red-500">*</span>
                </label>
                <div
                  className="space-y-2 max-h-48 overflow-y-auto p-4 rounded-lg"
                  style={{
                    borderColor: 'var(--cor-borda)',
                    borderWidth: '1px',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  {especialidades.map((esp) => (
                    <label
                      key={esp.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm"
                      style={{ backgroundColor: 'var(--branco)' }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          formSala.especialidades?.includes(esp.nome) ||
                          formSala.especialidadesIds?.includes(esp.id) ||
                          false
                        }
                        onChange={(e) => {
                          const currentNomes = formSala.especialidades || [];
                          const currentIds = formSala.especialidadesIds || [];

                          if (e.target.checked) {
                            setFormSala({
                              ...formSala,
                              especialidades: [...currentNomes, esp.nome],
                              especialidadesIds: [...currentIds, esp.id],
                            });
                          } else {
                            setFormSala({
                              ...formSala,
                              especialidades: currentNomes.filter((nome) => nome !== esp.nome),
                              especialidadesIds: currentIds.filter((id) => id !== esp.id),
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-escuro)' }}>
                        {esp.nome}
                      </span>
                    </label>
                  ))}
                  {especialidades.length === 0 && (
                    <p className="text-sm text-center py-4" style={{ color: 'var(--text-cinza)' }}>
                      Nenhuma especialidade cadastrada
                    </p>
                  )}
                </div>
                <p className="text-xs text-center mt-2" style={{ color: 'var(--text-cinza)' }}>
                  Selecione as especialidades que podem ser praticadas nesta sala
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Botao onClick={() => setShowSalaModal(false)} cor="bg-gray-500" texto="Cancelar" />
              <Botao onClick={handleSaveSala} cor="bg-blue-600" texto="Salvar" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
