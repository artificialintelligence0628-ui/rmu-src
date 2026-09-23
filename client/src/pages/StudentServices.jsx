import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { settingsApi } from "../api";

export default function StudentServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    settingsApi.services.list().then(setServices).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Student Services</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-10">Here to support every student.</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((s) => {
          const Icon = Icons[s.icon] || Icons.HelpCircle;
          return (
            <div key={s.id} className="bg-white rounded-2xl border p-6">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-navy" />
              </div>
              <h3 className="font-serif text-lg text-navy mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
            </div>
          );
        })}
        {!services.length && <p className="text-gray-400">No services listed yet.</p>}
      </div>
    </section>
  );
}
