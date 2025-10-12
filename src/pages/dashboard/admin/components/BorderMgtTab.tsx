import React, { useEffect, useState } from "react";

type Border = {
  id: string;
  location: string;
  code?: string;
  state?: string;
  point?: string;
  pointCode?: string;
};

type FormState = {
  location: string;
  code: string;
  state: string;
  point: string;
  pointCode?: string;
};

const emptyForm = (): FormState => ({ location: "", code: "", state: "", point: "", pointCode: "" });

const BorderMgtTab: React.FC = () => {
  const [borders] = useState<Border[]>([]);
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

  // fetch borders
  const fetchBorders = async () => {
    setLoading(true);
    setError(null);
    // TODO: API call
    setLoading(false);
  };

  useEffect(() => {
    fetchBorders();
  }, []);

  // create
  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!createForm.location.trim()) {
      setError("Border location is required.");
      return;
    }
    setCreating(true);
    setError(null);

    // TODO: API call
    setCreateForm(emptyForm());
    setCreating(false);
  };

  // edit
  const openEdit = (border: Border) => {
    setEditId(border.id);
    setEditForm({ location: border.location, code: border.code ?? "", state: border.state ?? "", point: border.point ?? "", pointCode: border.pointCode ?? "" });
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
    if (!editForm.location.trim()) {
      setError("Border location is required.");
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
    if (!confirm("Delete this border? This action cannot be undone.")) return;
    setDeletingId(id);
    setError(null);

    // TODO: API call
    setDeletingId(null);
  };

  return (
    <div className="p-4 font-sans">
      {/* Create form */}
      <section className="mb-6  rounded-xl shadow-lg bg-white">
        <h3 className="border-b px-4 py-2 font-semibold text-gray-800 bg-gray rounded-t-xl">
          Create Border
        </h3>
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap gap-4 p-4"
        >
           <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>

            <select name="state" id="state" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setCreateForm(s => ({...s, state: e.target.value}))} value={createForm.state}>
              <option value="">Select State</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Rivers">Rivers</option>
            </select>
          </div>

          <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Location
            </label>
            <input
              value={createForm.location}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, location: e.target.value }))
              }
              placeholder="Border Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Location Code
            </label>
            <input
              value={createForm.code}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, code: e.target.value }))
              }
              placeholder="Border Location Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
         
          <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Point
            </label>
            <input
              value={createForm.point}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, point: e.target.value }))
              }
              placeholder="Border Point"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-[2] min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Point Code
            </label>
            <input
              value={createForm.pointCode}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, pointCode: e.target.value }))
              }
              placeholder="Border Point code"
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
      <section className="space-y-4 rounded-xl shadow-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All borders</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading…" : `${borders.length} total`}
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
            <thead className="bg-gray">
              <tr>
                <th className="text-left px-4 py-2 border-b">Border Location</th>
                <th className="text-left px-4 py-2 border-b">Border Location Code</th>
                <th className="text-left px-4 py-2 border-b">State</th>
                <th className="text-left px-4 py-2 border-b">Border Point</th>
                <th className="text-left px-4 py-2 border-b">Border Point Code</th>
                <th className="px-4 py-2 border-b w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {borders.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    No borders yet.
                  </td>
                </tr>
              )}
              {borders.map((border) => (
                <tr key={border.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <code className="bg-gray-100 px-2 py-1 rounded text-blue-700">
                      {border.location}
                    </code>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {border.code || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {border.state || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {border.point || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {border.pointCode || "-"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(border)}
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(border.id)}
                        disabled={deletingId === border.id}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === border.id ? "Deleting…" : "Delete"}
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
            <h3 className="text-lg font-semibold mb-4">Edit Border</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Border Location
                </label>
                <input
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, location: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Code
                </label>
                <input
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, code: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Location Code
                </label>
                <input
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, code: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Point
                </label>
                <input
                  value={editForm.point}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, point: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Point Code
                </label>
                <input
                  value={editForm.pointCode}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, pointCode: e.target.value }))
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

export default BorderMgtTab;
