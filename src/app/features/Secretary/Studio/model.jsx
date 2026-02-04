import { useEffect, useState } from "react";
import api from "../../../../provider/api";
import Swal from "sweetalert2";

export const useStudioModel = () => {
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

  return {
    especialidades,
    setEspecialidades,
    salas,
    setSalas,
    activeTab,
    setActiveTab,
    handleDeleteEspecialidade,
    showEspModal,
    setShowEspModal,
    editingEsp,
    setEditingEsp,
    formEsp,
    setFormEsp,
    handleAddEsp,
    handleEditEsp,
    handleSaveEsp,
    showSalaModal,
    setShowSalaModal,
    editingSala,
    setEditingSala,
    formSala,
    setFormSala,
    handleAddSala,
    handleEditSala,
    handleSaveSala,
    handleDeleteSala,
  };
};
