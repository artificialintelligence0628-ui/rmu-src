import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi, setToken } from "../../api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await authApi.login(form.email, form.password);
      setToken(token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="font-serif text-2xl text-navy mb-2">SRC Admin Login</h1>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
        <div>
          <label className="text-xs font-semibold text-gray-500">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
        <button disabled={loading} className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/admin/forgot-password" className="block text-center text-sm text-navy">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
