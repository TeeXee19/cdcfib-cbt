import React, { useMemo } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMovementBorderCountQuery } from "../../../hooks/dashboard.hooks";
import { BorderPointData } from "../../../types/apiResponse";
import { Bar } from "react-chartjs-2";

// Register Chart.js components and datalabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface BorderPostsCardProps {
  chartType?: "grouped" | "combo" | "horizontal";
}

const BorderPostsCard: React.FC<BorderPostsCardProps> = ({ chartType = "grouped" }) => {
  const { data, isLoading, error } = useMovementBorderCountQuery();

  // Memoize chart data
  const { labels, arrivals, departures } = useMemo(() => {
    if (!data) return { labels: [], arrivals: [], departures: [] };

    const labels = data.map((post: BorderPointData) => post.borderPointId);

    const arrivals = data.map((post: BorderPointData) =>
      Number(post.directions.find((d) => d.movementDirectionId === "Entry")?.count ?? 0)
    );

    const departures = data.map((post: BorderPointData) =>
      Number(post.directions.find((d) => d.movementDirectionId === "Exit")?.count ?? 0)
    );

    return { labels, arrivals, departures };
  }, [data]);

  // Handle loading, error, empty states
  if (isLoading) return <CardMessage message="Loading border post data..." />;
  if (error) return <CardMessage message="Failed to load border post data" isError />;
  if (!data || data.length === 0) return <CardMessage message="No border post data available" />;

  // Build datasets based on chart type
  let chartData: ChartData<"bar" >;
  let options: ChartOptions<"bar">;

  switch (chartType) {
    case "grouped":
      chartData = {
        labels,
        datasets: [
          { label: "Arrivals", data: arrivals, backgroundColor: "#4E79A7", borderRadius: 20,  maxBarThickness: 40  },
          { label: "Departures", data: departures, backgroundColor: "#8ca0e8", borderRadius: 20,  maxBarThickness: 40 },
        ],
      };
      options = {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#111", font: { size: 14, weight: "bold" } } },
          title: {
            display: true,
            text: "Arrivals vs Departures per Border Post",
            color: "#111",
            font: { size: 16, weight: "bold" },
          },
          tooltip: { titleColor: "#fff", bodyColor: "#fff" },
          datalabels: {
            display: false,
            color: "#111",
            font: { weight: "bold", size: 14 },
            formatter: (value: number) => value.toLocaleString(),
          },
        },
        scales: {
          x: { stacked: false, ticks: { color: "#111", font: { weight: 600 } } },
          y: { stacked: false, ticks: { color: "#111", font: { weight: 600 } } },
        },
      };
      break;

   
    case "horizontal":
      chartData = {
        labels,
        datasets: [
          { label: "Arrivals", data: arrivals, backgroundColor: "#4E79A7", borderRadius: 4 },
          { label: "Departures", data: departures, backgroundColor: "#F28E2B", borderRadius: 4 },
        ],
      };
      options = {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { labels: { color: "#111", font: { size: 14, weight: "bold" } } },
          title: {
            display: true,
            text: "Top 10 Busiest Border Posts",
            color: "#111",
            font: { size: 16, weight: "bold" },
          },
          tooltip: { titleColor: "#111", bodyColor: "#111" },
          datalabels: {
            color: "#111",
            font: { weight: "bold", size: 14 },
            formatter: (value: number) => value.toLocaleString(),
          },
        },
        scales: {
          x: { stacked: true, ticks: { color: "#111", font: { weight: 600 } } },
          y: { stacked: true, ticks: { color: "#111", font: { weight: 600 } } },
        },
      };
      break;

    default:
      chartData = { labels: [], datasets: [] };
      options = {};
  }

  return (
    <div className="p-6 bg-white dark:bg-boxdark rounded-2xl shadow-md">
      {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Border Post Traffic</h1> */}
      <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

// Reusable card message component
const CardMessage: React.FC<{ message: string; isError?: boolean }> = ({ message, isError }) => (
  <div className="p-6 bg-white dark:bg-boxdark rounded-2xl shadow-md">
    <p className={isError ? "text-red-500" : "text-gray-600 dark:text-gray-300"}>{message}</p>
  </div>
);

export default BorderPostsCard;
