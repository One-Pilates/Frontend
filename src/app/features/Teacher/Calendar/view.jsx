import React, { useState, useEffect } from 'react';
import Button from './Components/Button';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import AgendamentoModal from './Components/AulaModal';
import DefinirAusenciaModal from './Components/DefinirAusenciaModal';
import './Styles/calendar.scss';

const CalendarView = ({
  selectedAgendamento,
  setSelectedAgendamento,
  isAgendamentoModalOpen,
  setIsAgendamentoModalOpen,
  isAusenciaModalOpen,
  setIsAusenciaModalOpen,
  isLoading,
  calendarRef,
  calendarInstance
}) => {
  const [activeView, setActiveView] = useState('timeGridWeek');
  const [showLoading, setShowLoading] = useState(false);

  const handleChangeView = (viewName) => {
    const calendar = calendarInstance.current;
    if (calendar) {
      calendar.changeView(viewName);
      setActiveView(viewName);
    }
  };

  useEffect(() => {
    if (calendarInstance.current) {
      setActiveView(calendarInstance.current.view?.type || 'timeGridWeek');
    }
  }, [calendarInstance]);


  useEffect(() => {
    let timeout;
    if (isLoading) {
      setShowLoading(true);
    } else {
      timeout = setTimeout(() => setShowLoading(false), 400);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <>
    <div className="calendar-container"> 
    <h1 className="text-2xl md:text-3xl font-semibold mb-4">Agenda</h1>
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

          <Button onClick={() => setIsAusenciaModalOpen(true)} disabled={isLoading}>
            <span className="hidden sm:inline">Definir Ausência</span>
            <span className="sm:hidden">Ausência</span>
          </Button>
        </div>

        <div className="calendar-wrapper">
          <div className={`loading-container ${showLoading ? 'show' : ''}`}>
            <LoadingSpinner message={'Carregando calendário...'} />
          </div>


          <div
            ref={calendarRef}
            className="fullcalendar"
            style={{
              opacity: showLoading ? 0 : 1,
              transition: 'opacity 0.4s ease'
            }}
          />
        </div>
      </main>

      <AgendamentoModal
        isOpen={isAgendamentoModalOpen}
        agendamento={selectedAgendamento}
        onClose={() => {
          setIsAgendamentoModalOpen(false);
          setSelectedAgendamento(null);
        }}
      />

      <DefinirAusenciaModal
        isOpen={isAusenciaModalOpen}
        onClose={() => setIsAusenciaModalOpen(false)}
      />
    </div>
    </>
  );
};

export default CalendarView;
