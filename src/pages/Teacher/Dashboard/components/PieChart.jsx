import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ title, data }) => {
  const chartOptions = {
    chart: { type: 'pie', height: 400 },
    title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '0%',
        dataLabels: {
          enabled: true,
          format: '{point.name}<br>{point.percentage:.1f}%',
          style: { fontSize: '12px' },
        },
      },
    },
    colors: ['#FF6B35', '#FF8C42', '#FFA94D', '#FFB74D'],
    accessibility: { enabled: false },
    series: [{ name: 'Porcentagem', data }],
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

export default PieChart;
