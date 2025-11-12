import { useState } from "react";
import { useDashboardQuery } from "../../hooks/dashboard.hooks";
import { useSpring, animated } from "@react-spring/web";
import ExamDistributionChart from "../../components/compounds/ExamDistributionChart";

const AnimatedNumber = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value || 0,
    config: { tension: 170, friction: 26 },
  });
  return <animated.span>{number.to((n) => Math.floor(n))}</animated.span>;
};

const ExamSummaryDashboard = () => {
  const [dayFilter, setDayfilter] = useState("2025-11-11");
  const { data: summary } = useDashboardQuery(dayFilter);
  // const [selectedDate, setSelectedDate] = useState<string>("All");
  // const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("All");

  const examDates = ["All", "2025-11-12", "2025-11-13", "2025-11-14", "2025-11-15", "2025-11-17", "2025-11-18", "2025-11-19"];
  // const timeSlots = [
  //   "All",
  //   "Session 1: 8:00 AM - 9:30 AM",
  //   "Session 2: 9:30 AM - 11:00 AM",
  //   "Session 3: 11:00 AM - 12:30 PM",
  //   "Session 4: 12:30 PM - 2:00 PM",
  //   "Session 5: 2:00 PM - 3:30 PM",
  //   "Session 6: 3:30 PM - 5:00 PM",
  //   "Session 7: 5:00 PM - 6:30 PM",
  // ];

  // 🧮 Transform summary data for the chart
  // const chartData = useMemo(() => {
  //   if (!summary?.summary) return [];

  //   // Example input:
  //   // [{ section: '09:00AM - 10:00AM', status: 'EXAM_ONGOING', count: 3 }, ...]

  //   const grouped = summary.summary.reduce((acc: any, item: any) => {
  //     const section = item.section;
  //     if (!acc[section]) acc[section] = { name: section };
  //     acc[section][item.status ?? "UNKNOWN"] = item.count;
  //     return acc;
  //   }, {});

  //   return Object.values(grouped);
  // }, [summary]);

  const examStats = [
    {
      label: "Registered Candidates",
      value: summary?.totalApplicants,
      icon: "🧑‍🎓",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Exam Completed",
      value:
        summary?.summary
          ?.filter((r) => r.status === "EXAM_COMPLETED")
          ?.reduce((acc, s) => acc + s.count, 0) || 0,
      icon: "📤",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Exam Ongoing",
      value:
        summary?.summary
          ?.filter((r) => r.status === "EXAM_ONGOING")
          ?.reduce((acc, s) => acc + s.count, 0) || 0,
      icon: "🟢",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-[#101110] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        📊 CBT Exam Dashboard
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Exam Date
          </label>
          <select
            value={dayFilter}
            onChange={(e) => setDayfilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-[#1A1B1F]"
          >
            {examDates.map((date) => (
              <option key={date}>{date}</option>
            ))}
          </select>
        </div>
{/* 
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Time Slot
          </label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-[#1A1B1F]"
          >
            {timeSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
        {examStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl shadow-md py-3 px-4 flex items-center gap-4 ${stat.color}`}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-xl font-bold">
                <AnimatedNumber value={stat.value || 0} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div>
        <ExamDistributionChart summary={summary?.summary || []} />
      </div>
    </div>
  );
};

export default ExamSummaryDashboard;
