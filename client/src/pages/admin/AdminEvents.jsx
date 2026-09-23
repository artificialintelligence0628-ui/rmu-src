import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { eventsApi } from "../../api";

const emptyForm = {
  title: "", description: "", event_date: "", start_time: "", end_time: "",
  location: "", image_url: "", register_url: "", featured: false,
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    eventsApi.list().then(setEvents).catch(() => {});
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setEditing({});
  }

  function openEdit(ev) {
    setForm({
      title: ev.title,
      description: ev.description || "",
      event_date: ev.event_date ? ev.event_date.slice(0, 10) : "",
      start_time: ev.start_time || "",
      end_time: ev.end_time || "",
      location: ev.location || "",
      image_url: ev.image_url || "",
      register_url: ev.register_url || "",
      featured: ev.featured,
    });
    setEditing(ev);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (!form.image_url) {
      setError("Please upload an image for this event.");
      setSaving(false);
      return;
    }
    try {
      if (editing?.id) {
        await eventsApi.update(editing.id, form);
      } else {
        await eventsApi.create(form);
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
    if (!confirm("Delete this event?")) return;
    await eventsApi.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">Events</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> New event
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-center gap-4 p-4">
              {ev.image_url ? (
                <img src={ev.image_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy truncate flex items-center gap-2">
                  {ev.title} {ev.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                </p>
                <p className="text-sm text-gray-500 truncate">{ev.location}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(ev.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  {ev.start_time && ` · ${ev.start_time}–${ev.end_time}`}
                </p>
              </div>
              <button onClick={() => openEdit(ev)} className="p-2 text-gray-400 hover:text-navy">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(ev.id)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!events.length && <p className="p-6 text-gray-400 text-sm">No events yet.</p>}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">{editing?.id ? "Edit event" : "New event"}</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Date *</label>
                <input required type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Start time</label>
                <input placeholder="9:00 AM" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">End time</label>
                <input placeholder="4:00 PM" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Registration link</label>
              <input value={form.register_url} onChange={(e) => setForm({ ...form, register_url: e.target.value })} placeholder="https://…" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <ImageUploadField label="Image *" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save event"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
