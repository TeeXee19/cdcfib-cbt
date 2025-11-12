import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ExamSectionStat } from "../../types/apiResponse";

// interface SummaryItem {
//   session: string; // like "Session 1", "Session 2", etc.
//   status: string; // "EXAM_COMPLETED" or "EXAM_ONGOING"
//   count: number;
// }

interface Props {
  summary: ExamSectionStat[];
}

const ExamDistributionChart = ({ summary }: Props) => {
  if (!summary || summary.length === 0) {
    return <p className="text-gray-500">No data available</p>;
  }

  // Get all unique sessions (7 sessions)
  const sessions = [
    '09:00AM - 10:00AM',
    '10:00AM - 11:00AM',
    '11:00AM - 12:00PM',
    '12:00PM - 01:00PM',
    '01:00PM - 02:00PM',
    '02:00PM - 03:00PM',
    '03:00PM - 04:00PM',
  ];

  // Transform API data into chart-friendly format
  const chartData = sessions.map((session) => {
    const ongoing = summary.find(
      (s) => s.section === session && s.status === "EXAM_ONGOING"
    )?.count || 0;

    const completed = summary.find(
      (s) => s.section === session && s.status === "EXAM_COMPLETED"
    )?.count || 0;

    return {
      session,
      "Exam Ongoing": ongoing,
      "Exam Completed": completed,
    };
  });

  return (
    <div className="bg-white dark:bg-[#1A1B1F] rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Exam Distribution by Session
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <Bar dataKey="Exam Ongoing" fill="#facc15" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Exam Completed" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          <XAxis
            dataKey="session"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamDistributionChart;
