import { useEffect, useState } from "react";
import { Mail, ShoppingBag } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { contactApi, ordersApi } from "../../api";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    contactApi.list().then(setMessages).catch(() => {});
    ordersApi.list().then(setOrders).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-serif text-3xl text-navy mb-8">Overview</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
            <Mail size={18} /> Contact messages ({messages.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`border rounded-lg p-3 text-sm ${m.is_read ? "opacity-60" : ""}`}>
                <p className="font-medium">{m.name} <span className="text-gray-400 font-normal">— {m.email}</span></p>
                <p className="text-gray-600">{m.subject}</p>
                <p className="text-gray-500 mt-1">{m.message}</p>
                {!m.is_read && (
                  <button
                    onClick={() => contactApi.markRead(m.id).then(() => contactApi.list().then(setMessages))}
                    className="text-xs text-navy mt-2"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
            {!messages.length && <p className="text-gray-400 text-sm">No messages yet.</p>}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
            <ShoppingBag size={18} /> Marketplace orders ({orders.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {orders.map((o) => (
              <div key={o.id} className="border rounded-lg p-3 text-sm">
                <p className="font-medium">{o.buyer_name} <span className="text-gray-400 font-normal">— {o.buyer_email}</span></p>
                <p className="text-gray-600">{o.item_name} × {o.quantity}</p>
                <p className="text-gray-500">GH₵ {o.total_amount_ghs} — <span className={o.status === "paid" ? "text-green-600" : "text-amber-600"}>{o.status}</span></p>
              </div>
            ))}
            {!orders.length && <p className="text-gray-400 text-sm">No orders yet.</p>}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
