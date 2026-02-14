import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../../services/api";
import StepIndicator from "../../../components/StepIndicator";
import Etapa1DataHora from "./screens/Etapa1DataHora";
import Etapa2Turma from "./screens/Etapa2Turma";
import Etapa3Alunos from "./screens/Etapa3Alunos";
import Etapa4Confirmacao from "./screens/Etapa4Confirmacao";
import "./style.scss";

export default function RegisterAula() {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  const [dataHora, setDataHora] = useState({
    data: "",
    horario: "",
  });

  const [professor, setProfessor] = useState("");
  const [sala, setSala] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [searchAluno, setSearchAluno] = useState("");

  const [professores, setProfessores] = useState([]);
  const [salas, setSalas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [todosAlunos, setTodosAlunos] = useState([]);
  const [mostrarListaAlunos, setMostrarListaAlunos] = useState(false);

  const etapas = [
    { label: "Data e Hora" },
    { label: "Turma" },
    { label: "Alunos" },
    { label: "Confirmação" },
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [profRes, salaRes, espRes, alunoRes] = await Promise.all([
          api.get("/api/professores"),
          api.get("/api/salas"),
          api.get("/api/especialidades"),
          api.get("/api/alunos"),
        ]);

        setProfessores(profRes.data || []);
        setSalas(salaRes.data || []);
        setEspecialidades(espRes.data || []);
        setTodosAlunos(alunoRes.data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Swal.fire(
          "Erro",
          "Não foi possível carregar os dados. Tente novamente.",
          "error"
        );
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (especialidade) {
      setSala("");
      setProfessor("");
      api.get(`/api/especialidades/salas/${especialidade}`)
        .then(res => setSalas(res.data || []))
        .catch(err => console.error("Erro ao carregar salas:", err));
    } else {
      setSalas([]);
    }
  }, [especialidade]);

  useEffect(() => {
    if (sala && especialidade) {
      setProfessor("");
      api.get(`/api/especialidades/professores/${especialidade}`)
        .then(res => setProfessores(res.data || []))
        .catch(err => console.error("Erro ao carregar professores:", err));
    } else if (!especialidade) {
      setProfessores([]);
    }
  }, [sala, especialidade]);

  const validarEtapa = () => {
    const novosErros = {};

    if (etapaAtual === 1) {
      if (!dataHora.data) {
        novosErros.data = "Data é obrigatória";
      }
      if (!dataHora.horario) {
        novosErros.horario = "Horário é obrigatório";
      }
    }

    if (etapaAtual === 2) {
      if (!professor) {
        novosErros.professor = "Professor é obrigatório";
      }
      if (!sala) {
        novosErros.sala = "Sala é obrigatória";
      }
      if (!especialidade) {
        novosErros.especialidade = "Especialidade é obrigatória";
      }
    }

    if (etapaAtual === 3) {
      if (alunos.length === 0) {
        novosErros.alunos = "Selecione pelo menos um aluno";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAdicionarAluno = (aluno) => {
    if (aluno && !alunos.find((a) => a.id === aluno.id)) {
      setAlunos([...alunos, aluno]);
      setSearchAluno("");
      setMostrarListaAlunos(false);
    }
  };

  const handleRemoverAluno = (alunoId) => {
    setAlunos(alunos.filter((a) => a.id !== alunoId));
  };

  const alunosDisponiveis = todosAlunos.filter(
    (aluno) => !alunos.find((a) => a.id === aluno.id)
  );

  const proximaEtapa = () => {
    if (validarEtapa()) {
      if (etapaAtual === 3) {
        finalizar();
      } else if (etapaAtual < 4) {
        setEtapaAtual(etapaAtual + 1);
      }
    } else {
      Swal.fire(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios.",
        "warning"
      );
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const irParaEtapa = (numeroEtapa) => {
    if (numeroEtapa <= etapaAtual && numeroEtapa >= 1) {
      setEtapaAtual(numeroEtapa);
    }
  };

  const finalizar = () => {
    setEtapaAtual(4);
  };

  const criarAula = async () => {
    setCarregando(true);

    try {
      const dataHoraString = `${dataHora.data}T${dataHora.horario}:00`;

      const payload = {
        dataHora: dataHoraString,
        professorId: parseInt(professor),
        salaId: parseInt(sala),
        especialidadeId: parseInt(especialidade),
        alunoIds: alunos.map((a) => a.id),
        observacoes: observacoes || "",
      };

      await api.post("/api/agendamentos", payload);

      Swal.fire("Sucesso!", "Aula criada com sucesso!", "success");
      
      navigate("/secretaria/agendamento", {
        state: {
          idProfessor: parseInt(professor),
          idSala: parseInt(sala),
          autoCarregar: true,
        },
      });
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      console.error("Detalhes do erro:", error.response?.data);

      let mensagem = "Erro ao criar aula. Tente novamente.";

      if (error.response?.data?.erro) {
        mensagem = error.response.data.erro;
      } else if (error.response?.data?.message) {
        mensagem = error.response.data.message;
      } else if (error.response?.data) {
        mensagem = JSON.stringify(error.response.data);
      }

      Swal.fire({
        icon: "error",
        title: "Erro ao criar aula",
        text: mensagem,
        confirmButtonColor: "#FF6B35",
      });
      setCarregando(false);
    }
  };

  const cancelar = () => {
    Swal.fire({
      title: "Cancelar cadastro?",
      text: "Tem certeza que deseja cancelar? Todos os dados serão perdidos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, cancelar",
      cancelButtonText: "Não, continuar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/secretaria/agendamento");
      }
    });
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return <Etapa1DataHora 
          dataHora={dataHora}
          setDataHora={setDataHora}
          erros={erros}
        />;
      case 2:
        return <Etapa2Turma 
          professor={professor}
          setProfessor={setProfessor}
          sala={sala}
          setSala={setSala}
          especialidade={especialidade}
          setEspecialidade={setEspecialidade}
          observacoes={observacoes}
          setObservacoes={setObservacoes}
          professores={professores}
          salas={salas}
          especialidades={especialidades}
          erros={erros}
        />;
      case 3:
        return <Etapa3Alunos 
          alunos={alunos}
          searchAluno={searchAluno}
          setSearchAluno={setSearchAluno}
          mostrarListaAlunos={mostrarListaAlunos}
          setMostrarListaAlunos={setMostrarListaAlunos}
          alunosDisponiveis={alunosDisponiveis}
          handleAdicionarAluno={handleAdicionarAluno}
          handleRemoverAluno={handleRemoverAluno}
          erros={erros}
        />;
      case 4:
        return <Etapa4Confirmacao 
          dataHora={dataHora}
          professor={professor}
          sala={sala}
          especialidade={especialidade}
          observacoes={observacoes}
          alunos={alunos}
          professores={professores}
          salas={salas}
          especialidades={especialidades}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <button
          className="back-button"
          onClick={() => navigate("/secretaria/agendamento")}
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>
        <h1 className="main-title">Criar Nova Aula</h1>
      </div>

      <div className="register-content">
        <StepIndicator
          steps={etapas}
          currentStep={etapaAtual}
          onStepClick={irParaEtapa}
        />

        <div className="register-card">
          <form className="register-form" onSubmit={(e) => e.preventDefault()}>
            {renderEtapa()}
          </form>
        </div>

        <div className="form-actions">
          <button
            className="btn-cancel"
            onClick={cancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
          {etapaAtual > 1 && (
            <button
              className="btn-back"
              onClick={etapaAnterior}
              disabled={carregando}
            >
              Voltar
            </button>
          )}
          {etapaAtual < 4 && (
            <button
              className="btn-next"
              onClick={proximaEtapa}
              disabled={carregando}
            >
              Próximo
            </button>
          )}
          {etapaAtual === 4 && (
            <button
              className="btn-finish"
              onClick={criarAula}
              disabled={carregando}
            >
              {carregando ? "⏳ Criando..." : "Confirmar e Criar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
