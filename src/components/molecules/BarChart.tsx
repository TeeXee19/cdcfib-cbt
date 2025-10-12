import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
}

interface BorderPostBarChartProps {
  labels: string[];
  datasets: Dataset[];
  stacked?: boolean;
}

const BorderPostBarChart: React.FC<BorderPostBarChartProps> = ({
  labels,
  datasets,
  stacked = false,
}) => {
  const data: ChartData<"bar"> = {
    labels,
    datasets,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: false,
        text: "Top 10 Busiest Border Posts by Mode of Entry",
      },
    },
    scales: {
      x: { stacked },
      y: { stacked, beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BorderPostBarChart;
