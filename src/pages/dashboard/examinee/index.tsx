import  { useState } from "react";
import { useExamineeListQuery } from "../../../hooks/useExamineeHooks";
import { formatDate } from "../../../helpers/utils";

const CandidateExamStatus = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  // const [typeFilter, setTypeFilter] = useState("all");
  // const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // const rowsPerPage = 5;

  const {data:examinee} = useExamineeListQuery(0, 20, '', 'id', 'desc')

  // const [data] = useState([
  //   {
  //     candidate: "210045",
  //     exam: "Recruitment Test",
  //     status: "Active",
  //     timeLeft: "32:14",
  //     lastSync: "09:45 AM",
  //     type: "Commissioned",
  //   },
  //   {
  //     candidate: "210076",
  //     exam: "ICT Test",
  //     status: "Submitted",
  //     timeLeft: "-",
  //     lastSync: "09:42 AM",
  //     type: "Non-commissioned",
  //   },
  //   {
  //     candidate: "210099",
  //     exam: "Security Clearance",
  //     status: "Banned",
  //     timeLeft: "-",
  //     lastSync: "-",
  //     type: "Commissioned",
  //   },
  //   {
  //     candidate: "210088",
  //     exam: "Technical Assessment",
  //     status: "Active",
  //     timeLeft: "15:22",
  //     lastSync: "09:50 AM",
  //     type: "Non-commissioned",
  //   },
  // ]);

  // const filtered = data
  //   .filter((row) => {
  //     const matchesSearch =
  //       row.candidate.includes(searchTerm) ||
  //       row.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       row.status.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus = statusFilter === "all" || row.status === statusFilter;
  //     const matchesType = typeFilter === "all" || row.type === typeFilter;

  //     return matchesSearch && matchesStatus && matchesType;
  //   })
  //   .sort((a, b) => {
  //     if (!sortField) return 0;
  //     const valA = a[sortField as keyof typeof a].toString().toLowerCase();
  //     const valB = b[sortField as keyof typeof b].toString().toLowerCase();
  //     if (valA < valB) return sortOrder === "asc" ? -1 : 1;
  //     if (valA > valB) return sortOrder === "asc" ? 1 : -1;
  //     return 0;
  //   });

  // const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  // const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#101110] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🧑‍💻 Candidate Exam Status</h2>

      {/* Filters */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by candidate, exam, or status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border dark:bg-[#1A1B1F] dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border dark:bg-[#1A1B1F] dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Submitted">Submitted</option>
          <option value="Banned">Banned</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded-lg border dark:bg-[#1A1B1F] dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="Commissioned">Commissioned</option>
          <option value="Non-commissioned">Non-commissioned</option>
        </select>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-[#1A1B1F] rounded-lg shadow-lg ">
          <thead>
            <tr className="bg-[gray] dark:bg-[gray] text-gray-700 dark:text-white rounded-t-lg">
              {["candidate", "exam", "status", "timeLeft", "lastSync", "type"].map((field) => (
                <th
                  key={field}
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort(field)}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field && (
                    <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examinee?.data.map((row, index) => (
              <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                <td className="px-4 py-3 text-gray-800 dark:text-white">{row.candidate_number}{}</td>
                <td className="px-4 py-3 text-gray-800 dark:text-white">{row.candidate_type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      row.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : row.status === "Submitted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-white">{row.time_left || 0}</td>
                <td className="px-4 py-3 text-gray-800 dark:text-white">{formatDate(new Date(row.created_at))}</td>
                <td className="px-4 py-3 text-gray-800 dark:text-white">{row.candidate_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginated.length} of {filtered.length} candidates
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default CandidateExamStatus;