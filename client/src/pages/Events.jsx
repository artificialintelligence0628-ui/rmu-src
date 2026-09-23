import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { eventsApi } from "../api";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventsApi.list().then(setEvents).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Upcoming Events</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-10">What's happening on campus.</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {events.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
            <div className="relative h-40 w-full bg-gray-100">
              <img src={e.image_url} alt={e.title} className="h-40 w-full object-cover" />
              <span className="absolute top-3 left-3 bg-navy text-white text-xs px-3 py-1 rounded-full">
                {new Date(e.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-lg text-navy mb-2">{e.title}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <Clock size={14} /> {e.start_time} – {e.end_time}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin size={14} /> {e.location}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{e.description}</p>
              {e.register_url ? (
                <a href={e.register_url} target="_blank" rel="noreferrer" className="w-full block text-center bg-navy text-white rounded-full py-2 text-sm font-medium">
                  Register →
                </a>
              ) : (
                <button className="w-full text-center bg-navy text-white rounded-full py-2 text-sm font-medium">
                  Register →
                </button>
              )}
            </div>
          </div>
        ))}
        {!events.length && <p className="text-gray-400">No events scheduled yet.</p>}
      </div>
    </section>
  );
}
