import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUploadField from "../../components/admin/ImageUploadField";
import { marketplaceApi } from "../../api";

const emptyForm = { name: "", description: "", price_ghs: "", image_url: "", category: "", stock: 0, featured: false };

export default function AdminMarketplace() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    marketplaceApi.list().then(setItems).catch(() => {});
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setEditing({});
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      description: item.description || "",
      price_ghs: item.price_ghs,
      image_url: item.image_url || "",
      category: item.category || "",
      stock: item.stock,
      featured: item.featured,
    });
    setEditing(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await marketplaceApi.update(editing.id, form);
      } else {
        await marketplaceApi.create(form);
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
    if (!confirm("Remove this item from the marketplace?")) return;
    await marketplaceApi.remove(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-navy">Marketplace</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium">
            <Plus size={16} /> New item
          </button>
        </div>

        <div className="bg-white border rounded-2xl divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              {item.image_url ? (
                <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy truncate flex items-center gap-2">
                  {item.name} {item.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                </p>
                <p className="text-sm text-gray-500 truncate">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  GH₵ {item.price_ghs} · {item.stock} in stock{item.category ? ` · ${item.category}` : ""}
                </p>
              </div>
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-navy">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!items.length && <p className="p-6 text-gray-400 text-sm">No items listed yet.</p>}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-navy">{editing?.id ? "Edit item" : "New item"}</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div>
              <label className="text-xs font-semibold text-gray-500">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500">Price (GH₵) *</label>
                <input required type="number" step="0.01" min="0" value={form.price_ghs} onChange={(e) => setForm({ ...form, price_ghs: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
            </div>
            <ImageUploadField value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>

            <button disabled={saving} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
              {saving ? "Saving…" : "Save item"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
