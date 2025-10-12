import React, { useState } from "react";
import { ICreateRole } from "../../../../types/apiResponse";
import { handleInputChange, handleSubmitForm } from "../../../../helpers/utils";
import { useCreateRole, useRoleListQuery } from "../../../../hooks/useRoleHooks";
import { TablePagination } from "@mui/material";

// Dummy roles data
type Role = {
  id: number;
  name: string;
  description: string;
  permissions?: string[];
};

// const dummyRoles: Role[] = [
//   { id: 1, name: "System Administrator", description: "Full access to all dashboards and reports." },
//   { id: 2, name: "HQ Analyst", description: "View all border records and generate/export reports." },
//   { id: 3, name: "Border Officer", description: "Restricted to records from their assigned border." },
// ];

export default function RBACTab() {
  // const [roles, setRoles] = useState<Role[]>(dummyRoles);
  const [query, setQuery] = useState({
    page: 1,
    size: 20,
    search: "",
    sortBy: "updatedAt",
    sortDirection: "DESC" as "ASC" | "DESC",
  });
  const { data: roles, isLoading:fetchingroles} = useRoleListQuery(
    query.page, query.size, query.search, query.sortBy, query.sortDirection
  )
  // const pageSize = 5;

  const [formData, setFormData] = useState<ICreateRole>({
    name: "",
    description: ""
  });

  const { mutate: Createrole } = useCreateRole()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  // Pagination
  // const totalPages = Math.ceil(roles.length / pageSize);
  // const currentRoles = useMemo(() => roles.slice((page - 1) * pageSize, page * pageSize), [roles, page]);


  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setPermissions(role.permissions || []);
  };

  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setQuery({ ...query, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuery({ ...query, page: 1, size: +event.target.value });
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    // setRoles(
    //   roles.map((r) =>
    //     r.id === selectedRole.id ? { ...r, permissions } : r
    //   )
    // );
    setSelectedRole(null);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg space-y-6">
      {/* Role Creation Form */}
      <div className="bg-gray-50 p-4 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Create New Role</h3>
        <form onSubmit={(e) => handleSubmitForm(Createrole)(e, formData)} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Role Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, setFormData, formData)}
            className="w-full border rounded px-3 py-2 w-[40%] focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange(e, setFormData, formData)}
            className="w-full border rounded px-3 py-2 w-[40%] focus:outline-none focus:ring-2 focus:ring-blue-400 *:focus:ring-blue-400  "
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 w-[20%] rounded hover:bg-blue-700 transition shadow-lg"
          >
            Add Role
          </button>
        </form>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-collapse text-sm items-center">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="p-3 border-b text-left">ID</th> */}
              <th className="p-3 border-b text-center">Role Name</th>
              <th className="p-3 border-b text-center">Description</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!fetchingroles && roles?.result?.map((role) => (
              <tr key={role.id} className="border-t hover:bg-gray-50 transition cursor-pointer ">
                {/* <td className="p-2">{role.id}</td> */}
                <td className="p-2 font-medium text-center">{role.name}</td>
                <td className="p-2 text-center">{role.description || "-"}</td>
                <td className="p-2 space-x-2 text-center">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    onClick={() => handleViewRole(role)}
                  >
                    View
                  </button>
                  <button
                    className="bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {fetchingroles && (
              <tr>
                Loading ...
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        {/* <p>
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
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
        </div> */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={roles?.totalItems || 10}
          rowsPerPage={query.size}
          page={
            roles?.currentPage ? roles?.currentPage - 1 : 0
          }
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* View / Assign Permissions Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 space-y-4">
            <h3 className="text-lg font-semibold">
              Role: {selectedRole.name}
            </h3>
            <p className="text-sm text-gray-600">{selectedRole.description}</p>

            {/* Permissions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["View Dashboard", "Edit Users", "Export Reports", "View Border Records", "Manage Roles"].map((perm) => (
                <label key={perm} className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => handleTogglePermission(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                onClick={() => setSelectedRole(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleSavePermissions}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
