import React, { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

type ModeData = {
  mode: string;
  count: number;
  icon: React.ElementType;
};

type Props = {
  modes: ModeData[];
};

export default function HorizontalBarChart({ modes }: Props) {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);
  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"
  ];

  const maxCount = Math.max(...modes.map((m) => m.count));

  const data = useMemo(() => ({
    labels: modes.map((m) => m.mode),
    datasets: [
      {
        label: "Count",
        data: modes.map((m) => m.count),
        backgroundColor: modes.map((_, i) => colors[i % colors.length]),
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  }), [modes]);

  const options: ChartOptions<"bar"> = useMemo(() => ({
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => context.raw.toLocaleString(),
        },
      },
      datalabels: {
        anchor: "start",
        align: "start",
        color: "#fff",
        font: { weight: "bold" },
        formatter: (value: number) => value.toLocaleString(),
        offset: function(context: any) {
          const barValue = context.raw;
          return barValue / maxCount * 40 + 28;
        },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { display: false }, ticks: { color: "#6B7280" } },
      y: { ticks: { autoSkip: false, color: "#6B7280" }, grid: { display: false } },
    },
    maintainAspectRatio: false,
  }), [modes, maxCount]);

  return (
    <div className="p-6 bg-white dark:bg-boxdark rounded-2xl shadow-md flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Count By Mode of Entry
      </h3>

      {/* Custom Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <div key={mode.mode} className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{mode.mode}</span>
            </div>
          );
        })}
      </div>

      {/* Chart with dynamically positioned icons */}
      <div style={{ height: modes.length * 60 }} className="w-full relative">
        <Bar ref={chartRef} data={data} options={options} plugins={[ChartDataLabels]} />
        {/* <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            const barRatio = mode.count / maxCount;
            const leftOffset = Math.max(labelWidth + 8, barRatio * 300 * 0.05);
            return (
              <div
                key={mode.mode}
                className="absolute flex items-center"
                style={{
                  top: index * 60 + 17,
                  left: leftOffset,
                }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}
