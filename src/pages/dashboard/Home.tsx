import { useState } from "react";

const initialExams = [
  { id: 1, title: "Commissioned Test", date: "Oct 15, 2025", time: "10:00 AM", status: "scheduled" },
  { id: 2, title: "Non-Commissioned Test", date: "Oct 17, 2025", time: "2:00 PM", status: "active" },
  { id: 3, title: "General Knowledge", date: "Oct 20, 2025", time: "9:00 AM", status: "completed" },
];

const categoryBreakdown = [
  { category: "Commissioned", count: 2 },
  { category: "Non-Commissioned", count: 1 },
];

const ExamSummaryDashboard = () => {
  const [exams, setExams] = useState(initialExams);
  const [confirmModal, setConfirmModal] = useState<any>({ show: false, action: "", examId: null });

  const handleConfirm = (action: string, examId: number) => {
    setConfirmModal({ show: true, action, examId });
  };

  const executeAction = () => {
    const { action, examId } = confirmModal;
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId ? { ...exam, status: action === "start" ? "active" : "completed" } : exam
      )
    );
    setConfirmModal({ show: false, action: "", examId: null });
  };

  const totalExams = exams.length;
  const activeExams = exams.filter((e) => e.status === "active").length;
  const completedExams = exams.filter((e) => e.status === "completed").length;

  const examStats = [
    { label: "Total Exams", value: totalExams, icon: "📚", color: "bg-blue-100 text-blue-800" },
    { label: "Registered Candidates", value: 250, icon: "🧑‍🎓", color: "bg-green-100 text-green-800" },
    { label: "Active Exams", value: activeExams, icon: "🟢", color: "bg-yellow-100 text-yellow-800" },
    { label: "Results Synced", value: "80%", icon: "✅", color: "bg-purple-100 text-purple-800" },
    { label: "Completed Exams", value: completedExams, icon: "📦", color: "bg-indigo-100 text-indigo-800" },
    { label: "Pending Submissions", value: 12, icon: "⏳", color: "bg-red-100 text-red-800" },
    // { label: "Pass Rate", value: "72%", icon: "📈", color: "bg-teal-100 text-teal-800" },
    { label: "Avg Completion Time", value: "42 min", icon: "⏱️", color: "bg-gray-100 text-gray-800" },
  ];

  const statusColors = {
    scheduled: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-[#101110] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">📊 Exam Summary Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {examStats.map((stat) => (
          <div key={stat.label} className={`rounded-xl shadow-md p-6 flex items-center gap-4 ${stat.color}`}>
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exam List */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">📋 Exam List</h3>
        <ul className="space-y-4">
          {exams.map((exam) => (
            <li key={exam.id} className="bg-white dark:bg-[#1A1B1F] p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{exam.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.date} • {exam.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[exam.status as keyof typeof statusColors]}`}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
                {exam.status === "scheduled" && (
                  <button
                    onClick={() => handleConfirm("start", exam.id)}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Start
                  </button>
                )}
                {exam.status === "active" && (
                  <button
                    onClick={() => handleConfirm("end", exam.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    End
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🗂️ Exam Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category} className="bg-white dark:bg-[#1A1B1F] p-4 rounded-lg shadow-sm text-center">
              <h4 className="font-semibold text-gray-800 dark:text-white">{cat.category}</h4>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Confirm Action</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to <strong>{confirmModal.action === "start" ? "start" : "end"}</strong> this exam?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={executeAction}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Yes, Confirm
              </button>
              <button
                onClick={() => setConfirmModal({ show: false, action: "", examId: null })}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSummaryDashboard;