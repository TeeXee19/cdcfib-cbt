import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateExam, useExamListQuery } from "../../../hooks/useExam";
import { handleInputChange, handleSubmitForm } from "../../../helpers/utils";
import { ExamPayload } from "../../../types/exam.dto";

const ExamDashboard = () => {

  const [formData, setFormData] = useState<ExamPayload>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: 0,
    status: 'scheduled',
  });

  const { data: exams } = useExamListQuery(0, 10, '', 'id', 'asc')

  const { mutate: CreateExam } = useCreateExam();

  // const [exams, setExams] = useState([
  //   {
  //     id: 1,
  //     title: "Math Aptitude Test",
  //     duration: 60,
  //     start_time: "2025-10-15T10:00",
  //     end_time: "2025-10-15T11:00",
  //     status: "scheduled",
  //   },
  //   {
  //     id: 2,
  //     title: "English Proficiency",
  //     duration: 45,
  //     start_time: "2025-10-17T14:00",
  //     end_time: "2025-10-17T14:45",
  //     status: "active",
  //   },
  // ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editExam, setEditExam] = useState<any>(null);
  const [editErrors, setEditErrors] = useState<any>({});
  const [editFile, setEditFile] = useState<File | null>(null);



  // const handleEdit = (id: number) => {
  //   const exam = exams.find((e) => e.id === id);
  //   if (exam) {
  //     setEditExam({ ...exam });
  //     setShowEditModal(true);
  //     setEditErrors({});
  //     setEditFile(null);
  //   }
  // };

  // const handleDelete = (id: number) => {
  //   if (confirm("Are you sure you want to delete this exam?")) {
  //     // setExams((prev) => prev.filter((e) => e.id !== id));
  //     toast.success("Exam deleted.");
  //   }
  // };

  // const filteredExams = exams.filter(
  //   (exam) =>
  //     exam.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (statusFilter === "all" || exam.status === statusFilter)
  // );

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-[#101110] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Created Exams</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            // setQuestionFile(null);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "Hide Form" : "Create New Exam"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg border dark:bg-[#1A1B1F] dark:text-white w-full sm:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg border dark:bg-[#1A1B1F] dark:text-white w-full sm:w-1/3"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Exam List */}
      <ul className="space-y-4 mb-10">
        {exams?.data?.map((exam) => (
          <li key={exam.id} className="bg-white dark:bg-[#1A1B1F] p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{exam.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Duration: {exam.duration} min • {exam.start_date} → {exam.end_date}
            </p>
            <div className="flex gap-2 mt-2 items-center">
              {/* <span className={ exam.status = "text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800"} clas> */}
              <span className={exam.status === "scheduled" ? "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 capitalize font-bold" :
                exam.status === 'ongoing' ? "text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 capitalize font-bold" :
                  "text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 capitalize"
              }>
                {exam.status}
              </span>
              {/* <button
                onClick={() => handleEdit(exam.id)}
                className="text-blue-600 hover:underline text-xs border px-3 py-1 rounded-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exam.id)}
                className="text-red-600 hover:underline text-xs border px-3 py-1 rounded-full"
              >
                Delete
              </button> */}
            </div>
          </li>
        ))}
      </ul>

      {/* Exam Creation Form */}
      {showForm && (
        <form onSubmit={(e) => handleSubmitForm(CreateExam)(e, formData)} className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {editingId ? "✏️ Edit Exam" : "📝 Create New Exam"}
          </h3>
          {/* <form onSubmit={(e) => handleSubmitForm(CreateExam)(e, formData)}>

          </form> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Exam Title */}
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                🏷️ Exam Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter exam title"
                value={formData.title}
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1A1B1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Exam Type */}
            <div className="w-full">
              <label htmlFor="exam_type" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                📝 Exam Type
              </label>
              <select
                id="exam_type"
                name="exam_type"
                // value={formData.exam_type}
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1A1B1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="commissioned">Commissioned</option>
                <option value="non_commissioned">Non Commissioned</option>
              </select>
            </div>

            {/* Duration */}
            <div className="w-full">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                ⏳ Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                placeholder="e.g. 60"
                value={formData.duration}
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1A1B1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Date */}
            <div className="w-full">
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                📅 Start Date
              </label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1A1B1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div className="w-full">
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                ⏰ End Date
              </label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1A1B1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Questions File */}
            <div className="w-full">
              <label htmlFor="question_file" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                📤 Questions File
              </label>
              <input
                type="file"
                id="question_file"
                name="question_file"
                accept=".csv,.xlsx"
                onChange={(e) => handleInputChange(e, setFormData, formData)}
                className="p-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#2A2B2F] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              // onClick={handleSubmit}
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {editingId ? "Update Exam" : "Create Exam"}
            </button>
          </div>
        </form>
      )}

      {/* Modal Edit Form */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">✏️ Edit Exam</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Exam Title"
                value={editExam.title}
                onChange={(e) => setEditExam({ ...editExam, title: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
              />
              {editErrors.title && <p className="text-red-500 text-sm">{editErrors.title}</p>}

              <input
                type="number"
                placeholder="Duration (minutes)"
                value={editExam.duration}
                onChange={(e) => setEditExam({ ...editExam, duration: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
              />
              {editErrors.duration && <p className="text-red-500 text-sm">{editErrors.duration}</p>}

              <input
                type="datetime-local"
                value={editExam.start_time}
                onChange={(e) => setEditExam({ ...editExam, start_time: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
              />
              <input
                type="datetime-local"
                value={editExam.end_time}
                onChange={(e) => setEditExam({ ...editExam, end_time: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
              />
              {editErrors.time && <p className="text-red-500 text-sm">{editErrors.time}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  📤 Replace Questions File (optional)
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
                />
                {editFile && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    Selected: <strong>{editFile.name}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const errors: any = {};
                  if (!editExam.title.trim()) errors.title = "Title is required";
                  if (!editExam.duration || editExam.duration <= 0) errors.duration = "Duration must be positive";
                  if (new Date(editExam.start_time) >= new Date(editExam.end_time)) {
                    errors.time = "Start time must be before end time";
                  }

                  if (Object.keys(errors).length > 0) {
                    setEditErrors(errors);
                    return;
                  }

                  const formData = new FormData();
                  formData.append("title", editExam.title);
                  formData.append("duration", editExam.duration.toString());
                  formData.append("start_time", editExam.start_time);
                  formData.append("end_time", editExam.end_time);
                  if (editFile) {
                    formData.append("questions_file", editFile);
                  }

                  try {
                    await fetch(`/api/exams/${editExam.id}`, {
                      method: "PATCH",
                      body: formData,
                    });
                    toast.success("Exam updated.");
                  } catch (err) {
                    toast.error("Failed to update exam.");
                  }

                  // setExams((prev) =>
                  //   prev.map((e) => (e.id === editExam.id ? editExam : e))
                  // );
                  setShowEditModal(false);
                  setEditFile(null);
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ExamDashboard;