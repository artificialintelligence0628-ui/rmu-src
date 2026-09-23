import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../../api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await authApi.resetPassword(token, password);
      setMessage(res.message);
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="font-serif text-2xl text-navy mb-2">Choose a new password</h1>
        {message && <p className="text-sm text-green-600 bg-green-50 rounded-lg p-3">{message}</p>}
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
        <input
          required
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <button className="w-full bg-navy text-white rounded-full py-3 font-medium">Update password</button>
      </form>
    </div>
  );
}
