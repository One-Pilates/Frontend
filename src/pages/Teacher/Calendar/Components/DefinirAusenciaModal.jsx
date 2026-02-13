import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from './Button';
import api from '../../../../services/api';
import Swal from 'sweetalert2';
import '../Styles/Modal.scss';

const DefinirAusenciaModal = ({ isOpen, onClose }) => {
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [motivo, setMotivo] = useState('');

  const [tipo, setTipo] = useState('TEMPORARIA');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const professorId = user.id;

    if (!motivo || !motivo.trim()) {
      await Swal.fire('Motivo obrigatório', 'Por favor informe o motivo da ausência.', 'warning');
      return;
    }

    if (!dataInicio || !horaInicio || !dataFim || !horaFim) {
      await Swal.fire('Datas inválidas', 'Preencha data e hora de início e fim.', 'warning');
      return;
    }

    const inicioStr = `${dataInicio}T${horaInicio}:00`;
    const fimStr = `${dataFim}T${horaFim}:00`;

    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr) return null;
      const [hh, mm] = timeStr.split(':').map((v) => Number(v));
      return hh * 60 + (mm || 0);
    };

    const inicioMinutes = parseTimeToMinutes(horaInicio);
    const fimMinutes = parseTimeToMinutes(horaFim);
    const minAllowed = 7 * 60; // 07:00
    const maxAllowed = 22 * 60; // 22:00 (inclusive)

    if (
      inicioMinutes === null ||
      fimMinutes === null ||
      inicioMinutes < minAllowed ||
      inicioMinutes > maxAllowed ||
      fimMinutes < minAllowed ||
      fimMinutes > maxAllowed
    ) {
      await Swal.fire('Horário inválido', 'As ausências só podem ser definidas entre 07:00 e 22:00.', 'warning');
      return;
    }

    const mapDiaSemana = (localIso) => {
      if (!localIso) return '';
      const d = new Date(localIso);
      const map = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'];
      return map[d.getDay()];
    };

    const payload = {
      professorId: Number(professorId),
      dataInicio: inicioStr,
      dataFim: fimStr,
      diaSemanaInicio: mapDiaSemana(inicioStr),
      diaSemanaFim: mapDiaSemana(fimStr),
      motivo
    };

    try {
      try {
        const respExist = await api.get(`/api/ausencias/professor/${professorId}`);
        const existentes = Array.isArray(respExist.data) ? respExist.data : [];
        const novoInicio = new Date(inicioStr);
        const novoFim = new Date(fimStr);
        const sobrepoe = existentes.some((ex) => {
          const exInicio = new Date(ex.dataInicio);
          const exFim = new Date(ex.dataFim);
          return !(novoFim <= exInicio || novoInicio >= exFim);
        });
        if (sobrepoe) {
          await Swal.fire('Conflito de ausência', 'Já existe uma ausência registrada que sobrepõe esse período. Ajuste as datas.', 'warning');
          return;
        }
      } catch (err) {
        console.warn('Não foi possível verificar ausências existentes:', err);
      }

      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Deseja realmente definir essa ausência?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444'
      });

      if (!confirm.isConfirmed) return;

      const response = await api.post(`/api/ausencias`, payload);

      const created = response.data || {};

      const bgEvent = {
        id: created.id || `aus-${Date.now()}`,
        title: 'Ausência',
        start: created.dataInicio || inicioStr,
        end: created.dataFim || fimStr,
        backgroundColor: '#e7e7e7',
        borderColor: '#868686',
        textColor: '#ffffff',
        classNames: ['ausencia-event'],
        extendedProps: { isAusencia: true }
      };

      window.dispatchEvent(new CustomEvent('ausencia:create', { detail: bgEvent }));

      await Swal.fire({
        title: 'Ausência definida',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });

      setDataInicio('');
      setHoraInicio('');
      setDataFim('');
      setHoraFim('');
      setMotivo('');
      setTipo('TEMPORARIA');
      onClose();
    } catch (error) {
      console.error('Erro ao criar ausência:', error);
      if (error.request && !error.response) {
        Swal.fire('Erro de conexão', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.', 'error');
      } else if (error.response) {
        const serverMsg = error.response.data && (error.response.data.message || JSON.stringify(error.response.data));
        Swal.fire('Erro', serverMsg || 'Erro ao definir ausência. Verifique os dados e tente novamente.', 'error');
      } else {
        Swal.fire('Erro', 'Erro ao definir ausência. Tente novamente.', 'error');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content ausencia-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Definir Ausência</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ausencia-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataInicio">Data de Início</label>
              <input
                type="date"
                id="dataInicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaInicio">Hora de Saída</label>
              <input
                type="time"
                id="horaInicio"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataFim">Data de Retorno</label>
              <input
                type="date"
                id="dataFim"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaFim">Hora de Retorno</label>
              <input
                type="time"
                id="horaFim"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="motivo">Motivo (opcional)</label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows="3"
              placeholder="Descreva o motivo da ausência..."
            />
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Ausência
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefinirAusenciaModal;
