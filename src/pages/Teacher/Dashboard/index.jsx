import React, { useState, useEffect, useCallback } from 'react';
import { FiActivity, FiUserX, FiUserCheck, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import './style.scss';
import KPICard from './components/KPICard';
import FrequenciaChart from './components/FrequenciaChart';
import PieChart from './components/PieChart';
import Filter from './components/Filter';
import NoDataAlert from './components/NoDataAlert';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [kpis, setKpis] = useState([
    {
      title: 'Sessões Realizadas',
      value: '0',
      subtitle: '',
      iconBgColor: '#d8b4fe',
      icon: <FiActivity size={24} color="#fff" />,
    },
    {
      title: 'Alunos Atendidos',
      value: '0',
      subtitle: '',
      iconBgColor: '#fdba74',
      icon: <FiUserX size={24} color="#fff" />,
    },
    {
      title: 'Dia com Maior Atendimento',
      value: '',
      subtitle: '',
      iconBgColor: '#93c5fd',
      icon: <FiUserCheck size={24} color="#fff" />,
    },
    {
      title: 'Especialidade Mais Requisitada',
      value: '',
      subtitle: '',
      iconBgColor: '#fef08a',
      icon: <FiUsers size={24} color="#fff" />,
    },
  ]);

  const [pie, setPie] = useState([]);
  const [frequencia, setFrequencia] = useState([]);
  const [hasData, setHasData] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const dias = selectedPeriod || 30;
        const response = await api.get(`api/professores/${user.id}/${dias}`);
        const data = response.data;

        if (data.kpisProfessorDTO) {
          const kpisData = data.kpisProfessorDTO;
          const newKpis = [
            {
              title: 'Sessões Realizadas',
              value: kpisData.qtdTotalSessoesRealizadas || '0',
              subtitle: '',
              iconBgColor: '#d8b4fe',
              icon: <FiActivity size={24} color="#fff" />,
            },
            {
              title: 'Alunos Atendidos',
              value: kpisData.qtdAlunosAtendidos || '0',
              subtitle: '',
              iconBgColor: '#fdba74',
              icon: <FiUserX size={24} color="#fff" />,
            },
            {
              title: 'Dia com Maior Atendimento',
              value: kpisData.diaSemanaComMaiorAtendimento || '-',
              subtitle: '',
              iconBgColor: '#93c5fd',
              icon: <FiUserCheck size={24} color="#fff" />,
            },
            {
              title: 'Especialidade Mais Requisitada',
              value: kpisData.especialidadeMaisRequisitada || '-',
              subtitle: '',
              iconBgColor: '#fef08a',
              icon: <FiUsers size={24} color="#fff" />,
            },
          ];
          setKpis(newKpis);
        }

        const grafico1 = data.agendamentosPorDiasDTO || [];
        setFrequencia(grafico1);

        const grafico2 = data.aulasPorEspecialidadesDTO || [];
        const pieData = grafico2.map((item) => ({
          name: item.especialidade,
          y: item.percentualAulas || 0,
        }));
        setPie(pieData);

        const hasAnyData = grafico1.length > 0 || grafico2.length > 0;
        setHasData(hasAnyData);

        const total = grafico2.reduce((sum, item) => sum + (item.percentualAulas || 0), 0);
        setTotalAulas(total);

        const top = [...grafico2]
          .sort((a, b) => (b.percentualAulas || 0) - (a.percentualAulas || 0))
          .slice(0, 3)
          .map((item) => ({
            especialidade: item.especialidade,
            percentual: item.percentualAulas,
            totalEstimado: Math.round(((item.percentualAulas || 0) * total) / 100),
          }));
        setTop3(top);
      } catch (error) {
        console.error('Erro ao buscar dados do professor:', error);
        setPie([]);
        setFrequencia([]);
        setTotalAulas(0);
        setTop3([]);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, selectedPeriod]);

  const handleFilterChange = useCallback((newPeriod) => {
    setSelectedPeriod(newPeriod);
  }, []);

  return (
    <div className="overview-teacher px-3 sm:px-4 md:px-6 lg:px-8 py-2">
      <div className="overview-header flex-col sm:flex-row items-start sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-escuro)' }}>
          Visão Geral
        </h1>
        <Filter value={selectedPeriod} onChange={handleFilterChange} />
      </div>

      {!hasData && !loading && <NoDataAlert selectedPeriod={selectedPeriod} />}

      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      <div className="charts-grid">
        <FrequenciaChart
          title="Frequência por Dia da Semana"
          data={frequencia}
          period={selectedPeriod}
        />
        <PieChart title="TOP 3 Aulas mais Realizadas" data={pie} />
      </div>
    </div>
  );
};

export default Dashboard;
