import { useState } from "react";
import { X } from "lucide-react";
import { ordersApi } from "../api";

// Loads the Paystack inline script once, on demand.
function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function CheckoutModal({ item, onClose }) {
  const [form, setForm] = useState({ buyer_name: "", buyer_email: "", buyer_phone: "", quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const total = (Number(item.price_ghs) * Number(form.quantity || 1)).toFixed(2);

  async function handlePay(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { order, amount_kobo } = await ordersApi.init({ item_id: item.id, ...form });
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.buyer_email,
        amount: amount_kobo,
        currency: "GHS",
        ref: `RMU-${order.id}-${Date.now()}`,
        callback: (response) => {
          ordersApi
            .verify({ order_id: order.id, reference: response.reference })
            .then((res) => {
              setStatus(res.verified ? "success" : "error");
              if (!res.verified) setErrorMsg("Payment could not be verified. Please contact the SRC.");
            })
            .catch((err) => {
              setStatus("error");
              setErrorMsg(err.message);
            });
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err) {
      setLoading(false);
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <h3 className="font-serif text-2xl text-navy mb-2">Order confirmed!</h3>
            <p className="text-gray-600 mb-6">
              A confirmation email is on its way to {form.buyer_email}. The seller will reach out to arrange delivery.
            </p>
            <button onClick={onClose} className="bg-navy text-white rounded-full px-6 py-2.5">Close</button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            <h3 className="font-serif text-2xl text-navy mb-1">Buy {item.name}</h3>
            <p className="text-gray-500 text-sm mb-4">GH₵ {item.price_ghs} each</p>

            {status === "error" && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{errorMsg}</p>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500">Full name</label>
              <input
                required
                value={form.buyer_name}
                onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Email</label>
              <input
                required
                type="email"
                value={form.buyer_email}
                onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <input
                value={form.buyer_phone}
                onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Quantity</label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="font-semibold text-navy text-lg">GH₵ {total}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white rounded-full py-3 font-medium disabled:opacity-60"
            >
              {loading ? "Processing…" : "Pay with Paystack"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
