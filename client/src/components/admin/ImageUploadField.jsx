import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { uploadApi } from "../../api";

// Controlled field: value is the image URL string, onChange(url) updates the parent form.
export default function ImageUploadField({ label = "Image", value, onChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const { url } = await uploadApi.file(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg border border-dashed flex items-center justify-center text-gray-300 shrink-0">
            <UploadCloud size={20} />
          </div>
        )}
        <label className="text-sm border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
          {loading ? "Uploading…" : "Choose file"}
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} disabled={loading} />
        </label>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
