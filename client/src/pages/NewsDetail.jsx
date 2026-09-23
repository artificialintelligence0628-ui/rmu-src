import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { newsApi } from "../api";

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsApi.get(slug).then(setArticle).catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <p className="max-w-3xl mx-auto px-6 py-16 text-gray-500">Article not found.</p>;
  if (!article) return <p className="max-w-3xl mx-auto px-6 py-16 text-gray-400">Loading…</p>;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/news" className="inline-flex items-center gap-2 text-navy text-sm mb-6">
        <ArrowLeft size={16} /> Back to news
      </Link>
      {article.image_url && <img src={article.image_url} alt={article.title} className="rounded-2xl mb-6 w-full object-cover max-h-96" />}
      <p className="text-xs text-gray-400 mb-2">
        {new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-navy mb-6">{article.title}</h1>
      <div className="prose max-w-none text-gray-700 whitespace-pre-line">{article.content}</div>
    </article>
  );
}
