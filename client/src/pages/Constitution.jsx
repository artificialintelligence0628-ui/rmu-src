import { useEffect, useState } from "react";
import { BookOpen, Download, Anchor } from "lucide-react";
import { settingsApi } from "../api";

export default function Constitution() {
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    settingsApi.constitution.current().then(setDoc).catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div className="bg-navy rounded-2xl aspect-[3/4] flex flex-col items-center justify-center text-white text-center p-8 border-l-8 border-blue-400">
        <Anchor size={40} className="mb-6 opacity-80" />
        <h2 className="font-serif text-3xl mb-1">SRC Constitution</h2>
        <p className="text-white/60 text-xs tracking-widest mt-2">REGIONAL MARITIME UNIVERSITY</p>
      </div>

      <div>
        <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Governance</p>
        <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6">SRC Constitution</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The Constitution is the foundation of the Students' Representative Council — defining
          our purpose, structure, and the principles that guide our service to every student.
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          {doc?.pdf_url ? (
            <>
              <a href={doc.pdf_url} target="_blank" rel="noreferrer" className="bg-navy text-white rounded-full px-6 py-3 font-medium flex items-center gap-2">
                <BookOpen size={18} /> Read the Constitution
              </a>
              <a href={doc.pdf_url} download className="border border-navy text-navy rounded-full px-6 py-3 font-medium flex items-center gap-2">
                <Download size={18} /> Download Constitution
              </a>
            </>
          ) : (
            <p className="text-gray-400">The constitution has not been uploaded yet.</p>
          )}
        </div>
        {doc?.updated_at && (
          <p className="text-sm text-gray-400">
            Last updated: {new Date(doc.updated_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        )}
      </div>
    </section>
  );
}
