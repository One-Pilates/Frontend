import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ title, data }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const labelColor = isDark ? '#FAFBFC' : '#111827';

  const chartOptions = {
    chart: { type: 'pie', height: 400, backgroundColor: 'transparent' },
    title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '0%',
        dataLabels: {
          enabled: true,
          format: '{point.name}<br>{point.percentage:.1f}%',
          style: { fontSize: '12px', color: labelColor },
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
