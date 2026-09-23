import { useState } from "react";
import { authApi } from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await authApi.forgotPassword(email);
    setMessage(res.message);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 max-w-sm w-full space-y-4">
        <h1 className="font-serif text-2xl text-navy mb-2">Reset admin password</h1>
        {message && <p className="text-sm text-green-600 bg-green-50 rounded-lg p-3">{message}</p>}
        <input
          required
          type="email"
          placeholder="admin@rmu.edu.gh"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <button className="w-full bg-navy text-white rounded-full py-3 font-medium">Send reset link</button>
      </form>
    </div>
  );
}
