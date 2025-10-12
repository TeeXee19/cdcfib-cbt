import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import { Transition } from "@headlessui/react";

type AuditRecord = {
  id: number;
  user: string;
  action: string;
  status: string;
  ip: string;
  date: string;
};

const dummyAuditData: AuditRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  user: `User${(i % 5) + 1}`,
  action: ["Login", "Logout", "Update", "Delete"][i % 4],
  status: ["Success", "Failed"][i % 2],
  ip: `192.168.0.${i + 1}`,
  date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split("T")[0],
}));

const filterColors: Record<string, string> = {
  user: "blue",
  action: "purple",
  status: "green",
  ip: "orange",
  startDate: "teal",
  endDate: "teal",
  global: "gray",
};

export default function AuditTab() {
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    status: "",
    ip: "",
    startDate: "",
    endDate: "",
    global: "",
  });
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    return dummyAuditData.filter((record) => {
      const recordDate = new Date(record.date);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const matches =
        (!filters.user || record.user.toLowerCase().includes(filters.user.toLowerCase())) &&
        (!filters.action || record.action === filters.action) &&
        (!filters.status || record.status === filters.status) &&
        (!filters.ip || record.ip.includes(filters.ip)) &&
        (!filters.global ||
          Object.values(record)
            .join(" ")
            .toLowerCase()
            .includes(filters.global.toLowerCase())) &&
        (!start || recordDate >= start) &&
        (!end || recordDate <= end);
      return matches;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: "" });
  };

  const clearAllFilters = () => {
    setFilters({
      user: "",
      action: "",
      status: "",
      ip: "",
      startDate: "",
      endDate: "",
      global: "",
    });
  };

  const appliedFilters = Object.entries(filters).filter(([_, value]) => value);

  const handleChipClick = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-4">
      {/* Global Search & CSV */}
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center mb-2">
        <input
          type="text"
          placeholder="Global Search"
          name="global"
          value={filters.global}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <CSVLink
          data={filteredData}
          filename="audit_records.csv"
          className="bg-[#006838] text-white px-4 py-2 rounded hover:bg-[#005f30] transition"
        >
          Download CSV
        </CSVLink>
        <button
          className="px-4 py-2 rounded bg-black hover:bg-black/60 text-white transition"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </button>
      </div>

      {/* Applied Filter Chips */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {appliedFilters.map(([key, value]) => (
            <span
              key={key}
              onClick={() => handleChipClick(key as keyof typeof filters, value as string)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer bg-${filterColors[key] || "gray"}-100 text-${filterColors[key] || "gray"}-800 hover:bg-${filterColors[key] || "gray"}-200 transition`}
              title={`Click to reapply ${key} filter`}
            >
              {key}: {value}
              <button
                className="ml-1 font-bold hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(key as keyof typeof filters);
                }}
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Advanced Filters */}
      <Transition
        show={showAdvanced}
        enter="transition-all duration-300 ease-out"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-96 opacity-100"
        leave="transition-all duration-300 ease-in"
        leaveFrom="max-h-96 opacity-100"
        leaveTo="max-h-0 opacity-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 sm:gap-4 p-4 bg-gray-50 rounded shadow-inner mb-4 overflow-hidden">
          <input
            type="text"
            placeholder="Search User"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All Actions</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            type="text"
            placeholder="Search IP"
            name="ip"
            value={filters.ip}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
        </div>
      </Transition>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left">ID</th>
              <th className="p-3 border-b text-left">User</th>
              <th className="p-3 border-b text-left">Action</th>
              <th className="p-3 border-b text-left">Status</th>
              <th className="p-3 border-b text-left">IP</th>
              <th className="p-3 border-b text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((record) => (
              <tr
                key={record.id}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="p-2">{record.id}</td>
                <td className="p-2 font-medium">{record.user}</td>
                <td className="p-2">{record.action}</td>
                <td
                  className={`p-2 font-medium ${
                    record.status === "Success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {record.status}
                </td>
                <td className="p-2">{record.ip}</td>
                <td className="p-2">{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
