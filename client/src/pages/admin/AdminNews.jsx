import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { newsApi } from "../../api";

const emptyForm = { title: "", excerpt: "", content: "", image_url: "", category: "", featured: false };

export default function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    newsApi.list().then(setArticles).catch(() => {});
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setEditing({});
  }

  function openEdit(article) {
    setForm({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image_url: article.image_url || "",
      category: article.category || "",
      featured: article.featured,
    });
    setEditing(article);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await newsApi.update(editing.id, form);
      } else {
        await newsApi.create(form);
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
    if (!confirm("Delete this article?")) return;
    await newsApi.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">News</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> New article
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              {a.image_url ? (
                <img src={a.image_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy truncate flex items-center gap-2">
                  {a.title} {a.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                </p>
                <p className="text-sm text-gray-500 truncate">{a.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {a.category} · {new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <button onClick={() => openEdit(a)} className="p-2 text-gray-400 hover:text-navy">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!articles.length && <p className="p-6 text-gray-400 text-sm">No articles yet.</p>}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">{editing?.id ? "Edit article" : "New article"}</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Events, Welfare, Notice, Campus Life…" className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Content</label>
              <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <ImageUploadField value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save article"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
