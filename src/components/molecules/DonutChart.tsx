import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    ChartOptions,
    ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNationalityountQuery } from "../../hooks/dashboard.hooks";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface DonutChartProps {
    title?: string;
}

interface Nationality {
    name: string;
    count: number;
}

// Even lighter dark palette
const COLORS = ["#93b8e0", "#5fb8de", "#8ca0e8"];

const DonutChart: React.FC<DonutChartProps> = ({ title = "Top 3 Nationalities" }) => {
    const { data: nationality, isPending } = useNationalityountQuery();

    const chartData: ChartData<"doughnut"> = useMemo(() => {
        if (!nationality) return { labels: [], datasets: [] };

        return {
            labels: nationality.map((n: Nationality) => n.name),
            datasets: [
                {
                    label: "Population",
                    data: nationality.map((n: Nationality) => Number(n.count)),
                    backgroundColor: COLORS,
                    borderColor: "#232d4550", // subtle border
                    borderWidth:  2,
                    hoverOffset: 15,
                    datalabels: {
                        display: false,
                        color: "#111",
                        font: { weight: "bold", size: 14 },
                        formatter: (_value, context) => {
                            const dataset = context.chart.data.datasets[0];
                            const dataArr = dataset.data as number[];
                            const total = dataArr.reduce((sum, val) => sum + (val ?? 0), 0);
                            const currentValue = dataArr[context.dataIndex] ?? 0;
                            const percentage =
                                total > 0 ? ((currentValue / total) * 100).toFixed(1) : "0";
                            return `${percentage}%`;
                        },
                    },
                },
            ],
        };
    }, [nationality]);

    const options: ChartOptions<"doughnut"> = useMemo(
        () => ({
            responsive: true,
            cutout: "60%",
            plugins: {
               legend: {
    display: true,
    position: "bottom",
    labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 16,
        font: { size: 14, weight: 600 },
        color: "#fff",
        generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            const data = dataset.data as number[];
            const total = data.reduce((sum, val) => sum + (val ?? 0), 0);

            return chart.data.labels!.map((label, index) => {
                const value = data[index] ?? 0;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                return {
                    text: `${label}: ${percentage}%`,
                    fillStyle: (dataset.backgroundColor as string[])[index],
                    strokeStyle: "#000",
                    lineWidth: 1,
                    hidden: false,
                    index: index,
                };
            });
        },
    },
},

                title: {
                    display: true,
                    text: title,
                    font: { size: 16, weight: 600 },
                    color: "#111",
                },
                tooltip: {
                    backgroundColor: "#4a5a78", // lighter tooltip
                    titleColor: "#fff",
                    bodyColor: "#fff",
                    callbacks: {
                        label: (context) => {
                            const value = context.raw as number;
                            const total = (context.chart.data.datasets[0].data as number[]).reduce(
                                (sum, val) => sum + val,
                                0
                            );
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        },
                    },
                },
            },
            animation: {
                animateRotate: true,
                animateScale: true,
            },
        }),
        [title]
    );

    if (isPending) return <>Loading...</>;

    return (
    <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-boxdark ">
     <Doughnut data={chartData} options={options} />
    </div>
);
};

export default DonutChart;
