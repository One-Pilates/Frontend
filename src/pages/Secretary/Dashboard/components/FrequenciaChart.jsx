import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FrequenciaChart = ({ title, data = [], period = 30 }) => {
  const mapDias = {
    Sunday: 'Dom',
    Monday: 'Seg',
    Tuesday: 'Ter',
    Wednesday: 'Qua',
    Thursday: 'Qui',
    Friday: 'Sex',
    Saturday: 'Sáb',
  };

  const categorias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const valores = categorias.map((dia) => {
    const item = data.find((f) => mapDias[f.diaSemana] === dia);
    return item ? item.totalAgendamentos : 0;
  });

  const periodText =
    {
      7: 'últimos 7 dias',
      30: 'últimos 30 dias',
      90: 'últimos 90 dias',
    }[period] || `últimos ${period} dias`;

  const chartOptions = {
    chart: { type: 'column', height: 400 },
    title: { text: null },
    xAxis: { categories: categorias, title: { text: null } },
    yAxis: {
      title: { text: `Agendamentos (${periodText})` },
      allowDecimals: false,
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        colorByPoint: true,
        dataLabels: { enabled: true, format: '{point.y}' },
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
