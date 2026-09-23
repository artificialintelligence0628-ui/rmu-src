import { useEffect, useState } from "react";
import { executivesApi } from "../api";

export default function Executives() {
  const [execs, setExecs] = useState([]);

  useEffect(() => {
    executivesApi.list().then(setExecs).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">SRC Executives</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-10">The leadership team serving you.</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {execs.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
            <div className="relative">
              {e.image_url ? (
                <img src={e.image_url} alt={e.name} className="h-56 w-full object-cover" />
              ) : (
                <div className="h-56 w-full bg-gray-100" />
              )}
              <span className="absolute top-3 left-3 bg-navy text-white text-xs px-3 py-1 rounded-full">
                {e.position}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-navy">{e.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{e.position}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{e.bio}</p>
            </div>
          </div>
        ))}
        {!execs.length && <p className="text-gray-400">No executives listed yet.</p>}
      </div>
    </section>
  );
}
