import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { executivesApi } from "../../api";

const emptyForm = { name: "", position: "", bio: "", image_url: "", order_index: 0 };

export default function AdminExecutives() {
  const [execs, setExecs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    executivesApi.list().then(setExecs).catch(() => {});
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setEditing({});
  }

  function openEdit(ex) {
    setForm({
      name: ex.name,
      position: ex.position,
      bio: ex.bio || "",
      image_url: ex.image_url || "",
      order_index: ex.order_index || 0,
    });
    setEditing(ex);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await executivesApi.update(editing.id, form);
      } else {
        await executivesApi.create(form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this executive?")) return;
    await executivesApi.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">Executives</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> Add executive
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {execs.map((ex) => (
            <div key={ex.id} className="flex items-center gap-4 p-4">
              {ex.image_url ? (
                <img src={ex.image_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy truncate">{ex.name}</p>
                <p className="text-sm text-gray-500 truncate">{ex.position}</p>
                <p className="text-xs text-gray-400 truncate mt-1">{ex.bio}</p>
              </div>
              <button onClick={() => openEdit(ex)} className="p-2 text-gray-400 hover:text-navy">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(ex.id)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!execs.length && <p className="p-6 text-gray-400 text-sm">No executives listed yet.</p>}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">{editing?.id ? "Edit executive" : "Add executive"}</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Position *</label>
              <input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="SRC President, Vice President…" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Display order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <ImageUploadField label="Photo" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save executive"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
