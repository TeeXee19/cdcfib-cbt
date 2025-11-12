import React, { useRef, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface LineChartProps {
  labels: string[];
  datasets: LineChartDataset[];
  title?: string;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  labels = [],
  datasets = [],
  title = "Line Chart",
  showLegend = true,
}) => {
  const chartRef = useRef<any>(null);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasets.map((ds, index) => ({
        label: ds.label,
        data: ds.data,
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        borderColor:
          ds.borderColor ||
          (index === 0 ? "rgba(59,130,246,1)" : "rgba(34,197,94,1)"),
        backgroundColor:
          ds.backgroundColor ||
          (index === 0 ? "rgba(59,130,246,0.15)" : "rgba(239,68,68,0.15)"),
      })),
    }),
    [labels, datasets]
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: showLegend },
      title: {
        display: false,
        text: title,
        font: { size: 16, weight: 600 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "rgba(200,200,200,0.08)" },
        beginAtZero: true,
      },
    },
  };

  // apply gradient backgrounds for datasets
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset: any, i: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);

      if (i === 0) {
        // Blue gradient for Arrivals
        gradient.addColorStop(0, "rgba(59,130,246,0.95)");   // blue-500
        gradient.addColorStop(0.5, "rgba(59,130,246,0.5)");
        gradient.addColorStop(1, "rgba(59,130,246,0.05)");
      } else {
        // Green gradient for Departures
        gradient.addColorStop(0, "rgba(34,197,94,0.95)");    // green-500
        gradient.addColorStop(0.5, "rgba(34,197,94,0.5)");
        gradient.addColorStop(1, "rgba(34,197,94,0.05)");
      }


      dataset.backgroundColor = gradient;
    });

    chart.update();
  }, [labels, datasets]);

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default LineChart;
