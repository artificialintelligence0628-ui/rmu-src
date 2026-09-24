import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Plus, Trash2, X, HelpCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { settingsApi } from "../../api";

const iconOptions = [
  { value: "BookOpen", label: "Academic support" },
  { value: "HeartHandshake", label: "Counselling / welfare" },
  { value: "Wallet", label: "Financial aid" },
  { value: "Shield", label: "Safety & security" },
  { value: "GraduationCap", label: "Careers & scholarships" },
  { value: "Home", label: "Housing" },
  { value: "Stethoscope", label: "Health services" },
  { value: "Users", label: "Community / clubs" },
];

const emptyForm = { title: "", description: "", icon: "BookOpen", image_url: "", link: "" };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    settingsApi.services.list().then(setServices).catch(() => {});
  }

  useEffect(load, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await settingsApi.services.create(form);
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
    if (!confirm("Remove this service?")) return;
    await settingsApi.services.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">Student Services</h1>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> New service
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {services.map((s) => {
            const Icon = LucideIcons[s.icon] || HelpCircle;
            return (
              <div key={s.id} className="flex items-center gap-4 p-4">
                {s.image_url ? (
                  <img src={s.image_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-navy" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy truncate">{s.title}</p>
                  <p className="text-sm text-gray-500 truncate">{s.description}</p>
                  {s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{s.link}</a>}
                </div>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {!services.length && <p className="p-6 text-gray-400 text-sm">No services yet.</p>}
        </div>
      </div>

      {adding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">New service</h2>
              <button type="button" onClick={() => setAdding(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Academic Counselling" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <ImageUploadField label="Image (optional)" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            <div>
              <label className="text-xs font-semibold text-gray-500">Link (optional)</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://… or mailto:office@rmu.edu.gh" className="w-full border rounded-lg px-3 py-2 mt-1" />
              <p className="text-xs text-gray-400 mt-1">
                Where a student goes to actually access this service — a form, webpage, or email.
              </p>
            </div>

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save service"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
