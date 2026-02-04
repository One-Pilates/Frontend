import "./style.scss";
import KPICard from "./components/KPICard";
import FrequenciaChart from "./components/FrequenciaChart";
import PieChart from "./components/PieChart";
import Filter from "./components/Filter";
import NoDataAlert from "./components/NoDataAlert";

const DashboardView = ({
  kpis,
  frequencia,
  pie,
  selectedPeriod,
  onFilterChange,
  hasData,
}) => {
  return (
    <div className="overview-teacher">
      <div className="overview-header">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-escuro)' }}>Visão Geral</h1>
        <Filter value={selectedPeriod} onChange={onFilterChange} />
      </div>

      {!hasData && <NoDataAlert selectedPeriod={selectedPeriod} />}

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

export default DashboardView;
