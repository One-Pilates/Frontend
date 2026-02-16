import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Button from './Components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import AgendamentoModal from './Components/AulaModal';
import { getColorForEspecialidade } from '../../../utils/utils';
import './styles/Calendar.scss';
import './styles/Filtros.scss';

export default function CalendarSecretary() {
  const navigate = useNavigate();
  const location = useLocation();

  const [salas, setSalas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [idSala, setIdSala] = useState('');
  const [idProfessor, setIdProfessor] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jaBuscou, setJaBuscou] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [activeView, setActiveView] = useState('timeGridWeek');
  const [showLoading, setShowLoading] = useState(false);

  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);

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

  async function fetchFiltros() {
    try {
      setErrorMessage('');
      const [respSalas, respProfs] = await Promise.all([
        api.get('/api/salas').catch(() => ({ data: [] })),
        api.get('/api/professores').catch(() => ({ data: [] })),
      ]);
      setSalas(Array.isArray(respSalas.data) ? respSalas.data : []);
      setProfessores(Array.isArray(respProfs.data) ? respProfs.data : []);
    } catch (err) {
      console.error('Erro ao carregar filtros:', err);
      setErrorMessage('Erro ao carregar filtros. Tente novamente.');
    }
  }

  async function fetchAgendamentosFiltro() {
    if (!idSala && !idProfessor) {
      setErrorMessage('Selecione pelo menos uma sala ou um professor');
      setJaBuscou(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setJaBuscou(true);

      let url = '';
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
      console.error('Erro ao buscar:', err);
      setErrorMessage('Erro ao buscar agendamentos.');
      setAgendamentos([]);
    } finally {
      setIsLoading(false);
    }
  }

  function limparFiltros() {
    setIdSala('');
    setIdProfessor('');
    setAgendamentos([]);
    setErrorMessage('');
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
      const { backgroundColor, textColor } = getColorForEspecialidade(aula.especialidade);

      return {
        id: String(aula.id),
        title: `${aula.especialidade} - ${aula.professorNome || 'Professor'} - ${new Date(
          aula.dataHora,
        ).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
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
      initialView: 'timeGridWeek',
      locale: 'pt-br',
      height: 'auto',
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00',
      allDaySlot: false,
      expandRows: true,
      slotDuration: '00:30:00',
      headerToolbar: { left: '', center: 'title', right: 'prev,next' },
      events: eventos,
      eventClick: (info) => {
        setAgendamentoSelecionado(info.event.extendedProps);
        setModalOpen(true);
      },
      eventDidMount: (info) => {
        info.el.style.cursor = 'pointer';
      },
    });

    calendar.render();
    calendarInstance.current = calendar;
  }

  const handleChangeView = (viewName) => {
    if (calendarInstance.current) {
      calendarInstance.current.changeView(viewName);
      setActiveView(viewName);
    }
  };

  useEffect(() => {
    if (calendarInstance.current) {
      setActiveView(calendarInstance.current.view?.type || 'timeGridWeek');
    }
  }, [calendarInstance]);

  useEffect(() => {
    const timeout = isLoading ? null : setTimeout(() => setShowLoading(false), 400);
    if (isLoading) setShowLoading(true);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    if (!window.FullCalendar) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js';
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
      reverseButtons: true,
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

  const isFiltroValido = idSala || idProfessor;
  const hasAgendamentos = agendamentos.length > 0;

  return (
    <div className="calendar-container">
      <div className="calendar-header-top">
        <h1 className="text-2xl md:text-3xl">Agenda</h1>
        <button
          className="btn-criar-aula"
          onClick={() => navigate('/secretaria/agendamento/criar')}
          title="Criar nova aula"
        >
          <span className="hidden sm:inline">+ Criar Aula</span>
          <span className="sm:hidden">+ Aula</span>
        </button>
      </div>

      <main className="calendar-main">
        <div className="calendar-header-info">
          <div className="calendar-view-buttons">
            <button
              className={`filter-button ${activeView === 'dayGridMonth' ? 'active' : ''}`}
              onClick={() => handleChangeView('dayGridMonth')}
            >
              <span className="hidden sm:inline">Mês</span>
              <span className="sm:hidden">M</span>
            </button>
            <button
              className={`filter-button ${activeView === 'timeGridWeek' ? 'active' : ''}`}
              onClick={() => handleChangeView('timeGridWeek')}
            >
              <span className="hidden sm:inline">Semana</span>
              <span className="sm:hidden">S</span>
            </button>
            <button
              className={`filter-button ${activeView === 'timeGridDay' ? 'active' : ''}`}
              onClick={() => handleChangeView('timeGridDay')}
            >
              <span className="hidden sm:inline">Dia</span>
              <span className="sm:hidden">D</span>
            </button>
          </div>

          <div className="filtros-inline">
            <div className="filtro-item">
              <label htmlFor="filtro-sala" className="hidden md:inline">
                Sala:
              </label>
              <select
                id="filtro-sala"
                value={idSala}
                onChange={(e) => setIdSala(e.target.value)}
                className="filtro-select-inline"
                disabled={isLoading}
              >
                <option value="">Todas</option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-item">
              <label htmlFor="filtro-professor" className="hidden md:inline">
                Professor:
              </label>
              <select
                id="filtro-professor"
                value={idProfessor}
                onChange={(e) => setIdProfessor(e.target.value)}
                className="filtro-select-inline"
                disabled={isLoading}
              >
                <option value="0">Todos</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={fetchAgendamentosFiltro}
              disabled={!isFiltroValido || isLoading}
              className="btn-aplicar"
            >
              {isLoading ? 'Carregando...' : 'Aplicar'}
            </Button>

            {(hasAgendamentos || errorMessage || jaBuscou) && (
              <Button onClick={limparFiltros} disabled={isLoading} className="btn-limpar">
                Limpar
              </Button>
            )}
          </div>
        </div>

        {!isFiltroValido && !jaBuscou && (
          <div className="aviso-info">
            <span className="text-sm md:text-base">
              Selecione pelo menos uma sala ou um professor
            </span>
          </div>
        )}

        {jaBuscou && !hasAgendamentos && !isLoading && (
          <div className="aviso-vazio">
            <p className="text-sm md:text-base">
              Nenhum agendamento encontrado para os filtros selecionados.
            </p>
          </div>
        )}

        {hasAgendamentos && (
          <div className="calendar-wrapper">
            <div className={`loading-container ${showLoading ? 'show' : ''}`}>
              <LoadingSpinner message={'Carregando calendário...'} />
            </div>
            <div
              ref={calendarRef}
              className="fullcalendar"
              style={{ opacity: showLoading ? 0 : 1, transition: 'opacity 0.4s ease' }}
            />
          </div>
        )}

        <AgendamentoModal
          isOpen={modalOpen}
          agendamento={agendamentoSelecionado}
          onClose={() => setModalOpen(false)}
          onDelete={deletarAgendamento}
        />
      </main>
    </div>
  );
}
