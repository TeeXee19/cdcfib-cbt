import React, { useEffect, useState } from "react";
import { useRPermissionListQuery } from "../../../../hooks/useRoleHooks";

type FormState = {
  name: string;
  description: string;
};

const emptyForm = (): FormState => ({ name: "", description: "" });

const PermissionTab: React.FC = () => {
  // const [permissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // create form state
  const [createForm, setCreateForm] = useState<FormState>(emptyForm());
  const [creating, setCreating] = useState(false);

  // edit modal state
  const [editing, setEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm());
  const [savingEdit, setSavingEdit] = useState(false);

  // delete progress state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {data:permissions, } = useRPermissionListQuery()

  // fetch permissions
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    // TODO: API call
    setLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // create
  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!createForm.name.trim()) {
      setError("Permission name is required.");
      return;
    }
    setCreating(true);
    setError(null);

    // TODO: API call
    setCreateForm(emptyForm());
    setCreating(false);
  };

  // edit
  const openEdit = (perm: any) => {
    setEditId(perm.id);
    setEditForm({ name: perm.name, description: perm.description ?? "" });
    setEditing(true);
  };

  const closeEdit = () => {
    setEditing(false);
    setEditId(null);
    setEditForm(emptyForm());
    setError(null);
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editId) return;
    if (!editForm.name.trim()) {
      setError("Permission name is required.");
      return;
    }
    setSavingEdit(true);
    setError(null);

    // TODO: API call
    setSavingEdit(false);
    closeEdit();
  };

  // delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this permission? This action cannot be undone.")) return;
    setDeletingId(id);
    setError(null);

    // TODO: API call
    setDeletingId(null);
  };

  return (
    <div className="p-4 font-sans">
      {/* Create form */}
      <section className="mb-6 border rounded-xl shadow-sm bg-white">
        <h3 className="border-b px-4 py-2 font-semibold text-gray-800">
          Create Permission
        </h3>
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap gap-4 p-4"
        >
          {/* Name */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="e.g. manage_users"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Optional description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <div className="self-end">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Permissions</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading…" : `${permissions?.length} total`}
          </div>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
            Error: {error}
            <button
              onClick={() => setError(null)}
              className="text-xs text-blue-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-3 overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 border-b">Name</th>
                <th className="text-left px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions?.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    No permissions yet.
                  </td>
                </tr>
              )}
              {permissions?.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <code className="bg-gray-100 px-2 py-1 rounded text-blue-700">
                      {perm.name}
                    </code>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {perm.description || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(perm)}
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(perm.id)}
                        disabled={deletingId === perm.id}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === perm.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      {editing && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeEdit}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-w-[95%]"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Permission</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingEdit ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionTab;
