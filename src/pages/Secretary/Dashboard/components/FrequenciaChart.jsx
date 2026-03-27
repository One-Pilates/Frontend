import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FrequenciaChart = ({ title, data = [], period = 30 }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const mapDias = {
    sunday: 'Dom',
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sáb',
  };

  const categorias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const valores = categorias.map((dia) => {
    const item = data.find((f) => mapDias[(f.diaSemana || '').toLowerCase()] === dia);
    return item ? item.totalAgendamentos : 0;
  });

  const periodText =
    {
      7: 'últimos 7 dias',
      30: 'últimos 30 dias',
      90: 'últimos 90 dias',
    }[period] || `últimos ${period} dias`;

  const labelColor = isDark ? '#FAFBFC' : '#111827';
  const gridColor = isDark ? '#21262D' : '#e0e0e0';

  const chartOptions = {
    chart: { type: 'column', height: 400, backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: categorias,
      title: { text: null },
      labels: { style: { color: labelColor } },
      lineColor: gridColor,
      tickColor: gridColor,
    },
    yAxis: {
      title: { text: `Agendamentos (${periodText})`, style: { color: labelColor } },
      allowDecimals: false,
      labels: { style: { color: labelColor } },
      gridLineColor: gridColor,
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        colorByPoint: true,
        dataLabels: { enabled: true, format: '{point.y}', style: { color: labelColor } },
      },
    },
    legend: { enabled: false },
    colors: ['#FF6B35', '#FF8C42', '#FFA94D', '#FFB74D'],
    series: [{ name: 'Agendamentos', data: valores }],
    credits: { enabled: false },
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-body">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default FrequenciaChart;
