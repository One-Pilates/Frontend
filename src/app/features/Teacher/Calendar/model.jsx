import { useState, useEffect, useRef } from 'react';
import api from '../../../../provider/api';

export const useCalendarModel = () => {
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [isAusenciaModalOpen, setIsAusenciaModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const [ausencias, setAusencias] = useState([]);

  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);


  const especialidadeCores = {
    'Pilates': '#ff6600',             
    'Fisioterapia': '#4CAF50',        
    'Osteopatia': '#2196F3',          
    'RPG': '#009688',                 
    'Microfisioterapia': '#9C27B0',   
    'Shiatsu': '#673AB7',             
    'Drenagem Linfática': '#03A9F4',  
    'Acupuntura': '#E91E63'           
  };

  const getColorForEspecialidade = (esp) => {
    const backgroundColor = especialidadeCores[esp] || '#3788d8';
    const textColor = ['#ff6600', '#4CAF50', '#2196F3', '#9C27B0', '#673AB7', '#E91E63', '#009688', '#03A9F4'].includes(backgroundColor)
      ? '#fff'
      : '#000';
    return { backgroundColor, textColor };
  };

  async function fetchAgendamentos() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/api/agendamentos/professorId/${user.id}`);
      setAgendamentos(Array.isArray(response.data) ? response.data : []);

      // buscar ausências do backend para este professor
      try {
        const respAus = await api.get(`/api/ausencias/professor/${user.id}`);
        setAusencias(Array.isArray(respAus.data) ? respAus.data : []);
      } catch (err) {
        console.warn('Não foi possível carregar ausências:', err);
        setAusencias([]);
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setIsLoading(false);
    }
  }

  function calcularDuracao(dataHora) {
    const inicio = new Date(dataHora);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
    return fim.toISOString();
  }

  function initCalendar() {
    if (!calendarRef.current) return;
    if (calendarInstance.current) calendarInstance.current.destroy();

    const eventosAulas = agendamentos.map((aula) => {
      const { backgroundColor, textColor } = getColorForEspecialidade(aula.especialidade);
      return {
        id: String(aula.id),
        title: `${aula.especialidade} - ${new Date(aula.dataHora).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        start: aula.dataHora,
        end: calcularDuracao(aula.dataHora),
        backgroundColor,
        borderColor: backgroundColor,
        textColor,
        extendedProps: aula
      };
    });

    const eventosAusencias = (ausencias || []).map((a) => {
      return {
        id: `aus-${a.id}`,
        title: 'Ausência',
        start: a.dataInicio,
        end: a.dataFim,
        backgroundColor: '#9d9d9e',
        borderColor: '#000000',
        textColor: '#111827',
        classNames: ['ausencia-event'],
        extendedProps: { isAusencia: true, motivo: a.motivo }
      };
    });

    const eventos = [...eventosAulas, ...eventosAusencias];
    const calendar = new window.FullCalendar.Calendar(calendarRef.current, {
      initialView: 'timeGridWeek',
      locale: 'pt-br',
      height: 'auto',
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00',
      allDaySlot: false,
      expandRows: true,
      slotDuration: '00:30:00',
      headerToolbar: {
        left: '',
        center: 'title',
        right: 'prev,next'
      },
      events: eventos,
      selectable: true,
      selectAllow: (selectInfo) => {
        const start = selectInfo.start;
        const end = selectInfo.end;
        const hasOverlap = calendar.getEvents().some((ev) => {
          if (!ev.start || !ev.end) return false;
          const isBlocked = ev.display === 'background' || (ev.extendedProps && ev.extendedProps.isAusencia);
          if (!isBlocked) return false;
          return !(end <= ev.start || start >= ev.end);
        });
        return !hasOverlap;
      },
      dateClick: (info) => {
        const clickDate = info.date;
        const tinyEnd = new Date(clickDate.getTime() + 1000);
        const blocked = calendar.getEvents().some((ev) => {
          if (!ev.start || !ev.end) return false;
          const isBlocked = ev.display === 'background' || (ev.extendedProps && ev.extendedProps.isAusencia);
          if (!isBlocked) return false;
          return !(tinyEnd <= ev.start || clickDate >= ev.end);
        });
        if (blocked) return;
      },
      eventClick: (info) => {
        const isBlocked = info.event.display === 'background' || (info.event.extendedProps && info.event.extendedProps.isAusencia);
        if (isBlocked) return;
        const agendamentoData = info.event.extendedProps;
        if (agendamentoData) {
          setSelectedAgendamento(agendamentoData);
          setIsAgendamentoModalOpen(true);
        }
      },
      eventDidMount: (info) => {
        const isBlocked = info.event.display === 'background' || (info.event.extendedProps && info.event.extendedProps.isAusencia);
        info.el.style.cursor = isBlocked ? 'not-allowed' : 'pointer';
      }
    });

    calendar.render();
    calendarInstance.current = calendar;
  }

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        if (!window.FullCalendar) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css';
          document.head.appendChild(link);

          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js';
          script.onload = async () => {
            await fetchAgendamentos();
          };
          document.body.appendChild(script);
        } else {
          await fetchAgendamentos();
        }
      } catch (error) {
        console.error('Erro ao carregar calendário:', error);
        setIsLoading(false);
      }
    };

    loadCalendar();

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.FullCalendar && !isLoading) {
      initCalendar();
    }
  }, [agendamentos, ausencias, isLoading]);

  useEffect(() => {
    const handleAusenciaCreate = (e) => {
      const ev = e.detail;
      if (calendarInstance.current && ev) {
        try {
          calendarInstance.current.addEvent(ev);
        } catch (err) {
          console.error('Erro ao adicionar evento de ausência no calendário:', err);
        }
      }
    };

    window.addEventListener('ausencia:create', handleAusenciaCreate);
    return () => window.removeEventListener('ausencia:create', handleAusenciaCreate);
  }, []);

  return {
    selectedAgendamento,
    setSelectedAgendamento,
    isAgendamentoModalOpen,
    setIsAgendamentoModalOpen,
    isAusenciaModalOpen,
    setIsAusenciaModalOpen,
    isLoading,
    calendarRef,
    calendarInstance
  };
};
