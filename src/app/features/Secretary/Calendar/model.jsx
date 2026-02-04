import { useState, useEffect, useRef} from "react";
import api from "../../../../provider/api";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export const useCalendarSecretaryModel = () => {
  const [salas, setSalas] = useState([]);
  const [professores, setProfessores] = useState([]);
  
  const [idSala, setIdSala] = useState("");
  const [idProfessor, setIdProfessor] = useState("");
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jaBuscou, setJaBuscou] = useState(false);
  
  // ESTADOS DO MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.idProfessor) {
      setIdProfessor(location.state.idProfessor);
    }
    if (location.state?.idSala) {
      setIdSala(location.state.idSala);
    }
  }, [location.state]);

  useEffect(() => {
    if ((idProfessor || idSala) && location.state?.autoCarregar) {
      fetchAgendamentosFiltro();
    }
  }, [idProfessor, idSala, location.state?.autoCarregar]);

  const especialidadeCores = {
    Pilates: "#ff6600",
    Fisioterapia: "#4CAF50",
    Osteopatia: "#2196F3",
    RPG: "#009688",
    Microfisioterapia: "#9C27B0",
    Shiatsu: "#673AB7",
    "Drenagem Linfática": "#03A9F4",
    Acupuntura: "#E91E63",
  };

  const getColorForEspecialidade = (esp) => {
    const backgroundColor = especialidadeCores[esp] || "#3788d8";
    const textColor = [
      "#ff6600",
      "#4CAF50",
      "#2196F3",
      "#9C27B0",
      "#673AB7",
      "#E91E63",
      "#009688",
      "#03A9F4",
    ].includes(backgroundColor)
      ? "#fff"
      : "#000";
    return { backgroundColor, textColor };
  };

  async function fetchFiltros() {
    try {
      setErrorMessage("");
      const [respSalas, respProfs] = await Promise.all([
        api.get("/api/salas").catch(() => ({ data: [] })),
        api.get("/api/professores").catch(() => ({ data: [] })),
      ]);
      setSalas(Array.isArray(respSalas.data) ? respSalas.data : []);
      setProfessores(Array.isArray(respProfs.data) ? respProfs.data : []);
    } catch (err) {
      console.error("Erro ao carregar filtros:", err);
      setErrorMessage("Erro ao carregar filtros. Tente novamente.");
    }
  }

  async function fetchAgendamentosFiltro() {
    if (!idSala && !idProfessor) {
      setErrorMessage("Selecione pelo menos uma sala ou um professor");
      setJaBuscou(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setJaBuscou(true);

      let url = "";
      if (idSala && idProfessor) {
        url = `/api/agendamentos/${idSala}/${idProfessor}`;
      } else if (idProfessor) {
        url = `/api/agendamentos/professorId/${idProfessor}`;
      } else if (idSala) {
        url = `/api/agendamentos/sala/${idSala}`;
      }

      const response = await api.get(url);
      const dados = Array.isArray(response.data) ? response.data : [];
      setAgendamentos(dados);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setErrorMessage("Erro ao buscar agendamentos.");
      setAgendamentos([]);
    } finally {
      setIsLoading(false);
    }
  }

  function limparFiltros() {
    setIdSala("");
    setIdProfessor("");
    setAgendamentos([]);
    setErrorMessage("");
    setJaBuscou(false);
    setModalOpen(false);
    setAgendamentoSelecionado(null);

    if (calendarInstance.current) {
      calendarInstance.current.destroy();
      calendarInstance.current = null;
    }
  }

  function calcularDuracao(dataHora) {
    const inicio = new Date(dataHora);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
    return fim.toISOString();
  }

  function initCalendar() {
    if (!calendarRef.current) return;

    if (calendarInstance.current) {
      calendarInstance.current.destroy();
    }

    const eventos = agendamentos.map((aula) => {
      const { backgroundColor, textColor } = getColorForEspecialidade(
        aula.especialidade
      );

      return {
        id: String(aula.id),
        title: `${aula.especialidade} - ${
          aula.professorNome || "Professor"
        } - ${new Date(aula.dataHora).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        start: aula.dataHora,
        end: calcularDuracao(aula.dataHora),
        backgroundColor,
        borderColor: backgroundColor,
        textColor,
        extendedProps: aula,
      };
    });

    const calendar = new window.FullCalendar.Calendar(calendarRef.current, {
      initialView: "timeGridWeek",
      locale: "pt-br",
      height: "auto",
      slotMinTime: "07:00:00",
      slotMaxTime: "22:00:00",
      allDaySlot: false,
      expandRows: true,
      slotDuration: "00:30:00",
      headerToolbar: { left: "", center: "title", right: "prev,next" },
      events: eventos,
      eventClick: (info) => {
        setAgendamentoSelecionado(info.event.extendedProps);
        setModalOpen(true);
      },
      eventDidMount: (info) => {
        info.el.style.cursor = "pointer";
      },
    });

    calendar.render();
    calendarInstance.current = calendar;
  }

  useEffect(() => {
    if (!window.FullCalendar) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js";
      script.onload = () => fetchFiltros();
      document.body.appendChild(script);
    } else {
      fetchFiltros();
    }

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.FullCalendar && agendamentos.length > 0) {
      initCalendar();
    }
  }, [agendamentos]);

  async function deletarAgendamento(id) {
    const result = await Swal.fire({
      title: 'Deletar aula?',
      text: 'Tem certeza que deseja deletar esta aula? Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/agendamentos/${id}`);
        Swal.fire('Deletado!', 'A aula foi deletada com sucesso.', 'success');
        setModalOpen(false);
        setAgendamentoSelecionado(null);
        fetchAgendamentosFiltro();
      } catch (error) {
        console.error('Erro ao deletar aula:', error);
        Swal.fire('Erro!', 'Não foi possível deletar a aula. Tente novamente.', 'error');
      }
    }
  }

  return {
    salas,
    professores,
    idSala,
    setIdSala,
    idProfessor,
    setIdProfessor,
    fetchAgendamentosFiltro,
    limparFiltros,
    isLoading,
    calendarRef,
    calendarInstance,
    errorMessage,
    agendamentos,
    jaBuscou,
    modalOpen,
    setModalOpen,
    agendamentoSelecionado,
    deletarAgendamento,
  };
};
