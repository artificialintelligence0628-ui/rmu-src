import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const countries = [
  {
    name: "Ghana",
    blurb: "Home to Regional Maritime University, and the largest share of our student community.",
    flag: (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116] flex items-center justify-center">
          <div className="w-3 h-3 bg-black" style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
        </div>
        <div className="flex-1 bg-[#006B3F]" />
      </div>
    ),
  },
  {
    name: "Nigeria",
    blurb: "A regional powerhouse whose students bring energy, ambition, and leadership to the RMU community.",
    flag: (
      <div className="w-full h-full flex">
        <div className="flex-1 bg-[#008751]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#008751]" />
      </div>
    ),
  },
  {
    name: "The Gambia",
    blurb: "Students from The Gambia add a strong voice to campus life and cross-border maritime dialogue.",
    flag: (
      <div className="w-full h-full flex flex-col">
        <div className="flex-[2] bg-[#CE1126]" />
        <div className="flex-[1] bg-white" />
        <div className="flex-[2] bg-[#0C1C8C]" />
        <div className="flex-[1] bg-white" />
        <div className="flex-[2] bg-[#3A7728]" />
      </div>
    ),
  },
  {
    name: "Sierra Leone",
    blurb: "Bringing a shared coastal heritage and deep ties to the region's shipping and trade industry.",
    flag: (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-[#1EB53A]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0072C6]" />
      </div>
    ),
  },
  {
    name: "Liberia",
    blurb: "One of the world's great maritime nations, represented proudly within our student body.",
    flag: (
      <div className="w-full h-full relative flex flex-col">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#BF0A30]" : "bg-white"}`} />
        ))}
        <div className="absolute top-0 left-0 w-2/5 h-1/2 bg-[#002868] flex items-center justify-center">
          <div className="w-2 h-2 bg-white" style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
        </div>
      </div>
    ),
  },
];

export default function CountriesCarousel() {
  const [index, setIndex] = useState(0);
  const country = countries[index];

  const prev = () => setIndex((i) => (i - 1 + countries.length) % countries.length);
  const next = () => setIndex((i) => (i + 1) % countries.length);

  return (
    <section className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-white/60 uppercase text-sm tracking-wide font-semibold mb-2">Our Community</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-12 max-w-xl">
          Countries represented in our community.
        </h2>

        <div className="grid md:grid-cols-[auto,1fr] gap-10 items-center">
          <div className="w-40 h-28 rounded-xl overflow-hidden shadow-lg">{country.flag}</div>

          <div>
            <p className="text-white/80 max-w-xl mb-2">{country.blurb}</p>
            <p className="font-serif text-2xl">{country.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button
            onClick={prev}
            aria-label="Previous country"
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next country"
            className="w-10 h-10 rounded-full bg-white text-navy flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
          <div className="flex items-center gap-2 ml-3">
            {countries.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${c.name}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
