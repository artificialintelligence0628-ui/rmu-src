import { Link } from "react-router-dom";

export default function NewsTicker({ items = [] }) {
  if (!items.length) return null;

  // Duplicate the list so the marquee loop is seamless.
  const loop = [...items, ...items];

  return (
    <div className="bg-navy text-white overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-3">
        {loop.map((n, i) => (
          <div key={i} className="flex items-center gap-4 px-6">
            <Link to={`/news/${n.slug}`} className="hover:underline">
              {n.title}
            </Link>
            <span className="bg-white text-navy text-xs font-semibold px-3 py-1 rounded-full">
              SRC NEWS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
