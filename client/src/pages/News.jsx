import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newsApi } from "../api";

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    newsApi.list().then(setArticles).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">News & Announcements</p>
      <h1 className="font-serif text-4xl md:text-5xl text-navy mb-10">Latest from the council.</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {articles.map((n) => (
          <article key={n.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
            {n.image_url && <img src={n.image_url} alt={n.title} className="h-40 w-full object-cover" />}
            <div className="p-5">
              {n.category && <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded-full">{n.category}</span>}
              <p className="text-xs text-gray-400 mt-2 mb-1">
                {new Date(n.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <h3 className="font-serif text-lg text-navy mb-2">{n.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{n.excerpt}</p>
              <Link to={`/news/${n.slug}`} className="text-navy text-sm font-medium">Read more →</Link>
            </div>
          </article>
        ))}
        {!articles.length && <p className="text-gray-400">No articles published yet.</p>}
      </div>
    </section>
  );
}
