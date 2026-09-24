import { useEffect, useState } from "react";
import { Plus, Trash2, X, Ship } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { settingsApi } from "../../api";

const emptyForm = { name: "", partner_type: "" };

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    settingsApi.partners.list().then(setPartners).catch(() => {});
  }

  useEffect(load, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await settingsApi.partners.create(form);
      setForm(emptyForm);
      setAdding(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this partner?")) return;
    await settingsApi.partners.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">Industry Partners</h1>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> New partner
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {partners.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Ship size={16} className="text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy truncate">{p.name}</p>
                <p className="text-sm text-gray-500 truncate">{p.partner_type}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!partners.length && <p className="p-6 text-gray-400 text-sm">No partners yet.</p>}
        </div>
      </div>

      {adding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">New partner</h2>
              <button type="button" onClick={() => setAdding(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Maersk" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Connection type</label>
              <input value={form.partner_type} onChange={(e) => setForm({ ...form, partner_type: e.target.value })} placeholder="e.g. Industry connection, Regional partner" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save partner"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
