import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    // PieLabel,
    // PieLabelRenderProps,
} from "recharts";
import { ScoreDistribution } from "../../types/apiResponse";

interface Props {
    summary: ScoreDistribution[];
}

const COLORS = ['#003f5c', "#444e86", "#dd5182", "#ff6e54" ]; // yellow & blue

const ExamStatusPieChart = ({ summary }: Props) => {
    if (!summary || summary.length === 0) {
        return <p className="text-gray-500">No data available</p>;
    }

    // Aggregate totals for each status
    const firstCat = summary
        .filter((s) => s.score_range === '1-30')
        .reduce((sum, s) => sum + +s.total_candidates, 0);

    const secondCat = summary
        .filter((s) => s.score_range === '31-60')
        .reduce((sum, s) => sum + +s.total_candidates, 0);

    const thirdCat = summary
        .filter((s) => s.score_range === '61-90')
        .reduce((sum, s) => sum + +s.total_candidates, 0);

    const fourthCat = summary
        .filter((s) => s.score_range === '91-100')
        .reduce((sum, s) => sum + +s.total_candidates, 0);

    const data = [
        { name: '0-30', value: firstCat },
        { name: "31-60", value: secondCat },
        { name: "61-90", value: thirdCat },
        { name: "91-100", value: fourthCat },
    ];

    return (
        <div className="bg-white dark:bg-[#1A1B1F] rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Exam Status Overview
            </h3>

            <ResponsiveContainer width="100%" height={600}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // label={({ name, percent }: { name: PieLabel | undefined; percent: number }) =>
                        //     `${name}: ${(percent * 100).toFixed(0)}%`
                        // }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip formatter={(value: number) => `${value} candidates`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExamStatusPieChart;
