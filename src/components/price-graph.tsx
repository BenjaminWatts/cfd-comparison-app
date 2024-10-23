import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { LabelledPrice } from '../utils';

// Register the necessary components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceGraph: React.FC<{ data: LabelledPrice[] }> = (p) => {
  const data = {
    labels: p.data.map((x) => x.label),
    datasets: [
      {
        label: 'Renewables',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'green',
        borderColor: 'green',
        data: p.data.map((x) => x.cfd || 0),
      },
      {
        label: 'Fossil Fuels',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'grey',
        borderColor: 'grey',
        data: p.data.map((x) => x.midp || 0),
      },
    ],
  };
  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: '£/MWh', // y-axis label
        },
      },
    },
  };

  return <Line data={data} 
  options={options}
  />;
};

export default PriceGraph;
