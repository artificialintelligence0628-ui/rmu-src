import { useState } from "react";
import { MapPin, Mail, Phone, MessageCircle, Send } from "lucide-react";
import { contactApi } from "../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await contactApi.send(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Contact</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-10">Get in touch with the council.</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: "SRC Office", body: "Regional Maritime University, Nungua, Accra, Ghana" },
            { icon: Mail, title: "Email", body: "src@rmu.edu.gh" },
            { icon: Phone, title: "Phone", body: "+233 30 271 4070" },
            { icon: MessageCircle, title: "WhatsApp", body: "Chat with the SRC" },
          ].map((c, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 flex gap-4 items-start">
              <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <c.icon size={18} className="text-navy" />
              </span>
              <div>
                <p className="font-semibold text-navy">{c.title}</p>
                <p className="text-gray-500 text-sm">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Your name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="How can we help?"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500">Message *</label>
            <textarea
              required
              maxLength={500}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us how we can help…"
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            <p className="text-xs text-gray-400 text-right">{form.message.length}/500</p>
          </div>

          {status === "sent" && <p className="text-green-600 text-sm">Message sent — thank you!</p>}
          {status === "error" && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}

          <button
            disabled={status === "sending"}
            className="w-full bg-navy text-white rounded-full py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"} <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
