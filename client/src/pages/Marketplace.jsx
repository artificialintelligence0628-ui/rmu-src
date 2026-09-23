import { useEffect, useState } from "react";
import { marketplaceApi } from "../api";
import CheckoutModal from "../components/CheckoutModal";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    marketplaceApi.list().then(setItems).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">SRC Marketplace</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-2">Student merchandise &amp; essentials.</h1>
      <p className="text-gray-500 mb-10 max-w-xl">
        Official SRC merchandise and selected student products. Pay securely online and the seller
        will arrange delivery or pickup on campus.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
            <div className="relative">
              {item.image_url && <img src={item.image_url} alt={item.name} className="h-56 w-full object-cover" />}
              {item.featured && (
                <span className="absolute top-3 left-3 bg-navy text-white text-xs px-3 py-1 rounded-full">Featured</span>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg text-navy">{item.name}</h3>
                <span className="font-semibold text-navy whitespace-nowrap ml-2">GH₵ {item.price_ghs}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <p className="text-xs text-gray-400 mb-3">
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </p>
              <button
                disabled={item.stock <= 0}
                onClick={() => setSelected(item)}
                className="w-full border border-navy text-navy rounded-full py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-navy hover:text-white transition"
              >
                {item.stock > 0 ? "Buy now" : "Out of stock"}
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-gray-400">No items listed yet.</p>}
      </div>

      {selected && <CheckoutModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
