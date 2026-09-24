import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import {
  Anchor,
  ArrowRight,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  Flag,
  Globe,
  BookOpen,
  Download,
  Send,
} from "lucide-react";
import { newsApi, eventsApi, settingsApi, executivesApi, marketplaceApi } from "../api";
import JourneySection from "../components/JourneySection";
import NewsTicker from "../components/NewsTicker";
import CountriesCarousel from "../components/CountriesCarousel";

const pillars = [
  {
    step: "01 / 04 — STUDENT REPRESENTATION",
    title: "We Represent",
    body: "The SRC is the official voice of every student at Regional Maritime University. We carry student concerns to university leadership and ensure your perspective shapes the decisions that affect your academic journey.",
    bg: "bg-navy",
  },
  {
    step: "02 / 04 — STUDENT ADVOCACY",
    title: "We Advocate",
    body: "From academic policies to campus facilities, we champion the interests of students. The SRC works tirelessly to secure better resources, fairer processes, and stronger support for every member of our community.",
    bg: "bg-blue-800",
  },
  {
    step: "03 / 04 — STUDENT WELFARE",
    title: "We Support",
    body: "Student welfare is at the heart of what we do. From financial assistance and academic resources to wellbeing programmes, the SRC ensures no student is left behind when times get tough.",
    bg: "bg-navy-light",
  },
  {
    step: "04 / 04 — STUDENT LEADERSHIP",
    title: "We Lead",
    body: "Our elected executives provide leadership that connects students with university stakeholders and the wider maritime industry — opening doors, creating opportunity, and building a vibrant campus community.",
    bg: "bg-navy",
  },
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [settings, setSettings] = useState({});
  const [execs, setExecs] = useState([]);
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    newsApi.list({ limit: 6 }).then((data) => {
      const featured = data.find((n) => n.featured) || data[0] || null;
      setFeaturedNews(featured);
      setNews(data.filter((n) => n.id !== featured?.id).slice(0, 4));
    }).catch(() => {});
    eventsApi.list({ upcoming: "true" }).then((data) => setEvents(data.slice(0, 4))).catch(() => {});
    settingsApi.partners.list().then(setPartners).catch(() => {});
    settingsApi.get().then(setSettings).catch(() => {});
    executivesApi.list().then((data) => setExecs(data.slice(0, 4))).catch(() => {});
    marketplaceApi.list({ featured: "true" }).then((data) => setItems(data.slice(0, 3))).catch(() => {});
    settingsApi.services.list().then((data) => setServices(data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero: full-screen dusk sea, sits under the (glass) navbar */}
      <section className="relative -mt-16 flex min-h-[85vh] sm:min-h-screen items-center justify-center overflow-hidden bg-navy text-white">
  <img
  src="/hero-bg.jpg"
  alt=""
  aria-hidden="true"
  className="absolute inset-0 h-full w-full object-cover object-[20%_center] sm:object-center"
/>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/50" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-24 pt-28 text-center [text-shadow:0_2px_24px_rgba(10,12,50,0.35)]">
          <span className="mb-[3vh] inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm sm:text-xs sm:tracking-[0.3em]">
            <Anchor size={14} /> Students' Representative Council
          </span>

          <h1
            className="font-serif font-normal leading-[1.08] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, min(13vh, 7vw), 7rem)" }}
          >
            Regional Maritime University
          </h1>

          <p
            className="mt-[2.5vh] font-serif italic text-white/90"
            style={{ fontSize: "clamp(1.25rem, min(5.4vh, 3vw), 2.8rem)" }}
          >
            Students' Representative Council
          </p>

          <p
            className="mt-[2.5vh] max-w-[46rem] leading-relaxed text-white/80"
            style={{ fontSize: "clamp(1rem, min(2.65vh, 4.2vw), 1.375rem)" }}
          >
            Representing students. Building community. Shaping the future of maritime education in Ghana and across the region.
          </p>

          <div className="mt-[4.5vh] flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-full bg-[#27187c] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-navy-light sm:px-10 sm:py-5 sm:text-lg"
            >
              Explore SRC <ArrowRight size={18} />
            </Link>
            <Link
              to="/executives"
              className="rounded-full border border-white/30 bg-black/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-10 sm:py-5 sm:text-lg"
            >
              Meet the Executives
            </Link>
          </div>
        </div>

        {/* scroll cue */}
        <button
          type="button"
          aria-label="Scroll down"
          onClick={() => window.scrollBy({ top: window.innerHeight - 64, behavior: "smooth" })}
          className="absolute bottom-6 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-white/40 bg-white/5 text-white/80 backdrop-blur-sm transition hover:bg-white/15"
        >
          <ChevronDown size={20} />
        </button>
      </section>

      {/* About the SRC intro */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-6">
        <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">About the SRC</p>
        <h2 className="font-serif text-4xl md:text-5xl text-navy max-w-3xl">
          The voice of every student, working for the whole community.
        </h2>
      </section>

      {/* We Represent / Advocate / Support / Lead — stacked scroll effect.
          Wrapped in a container sized to exactly 4 viewport heights so the
          sticky panels are scoped to this block only — without this, the
          last panel has no containing block to unstick against and stays
          pinned all the way to the footer. */}
      <div className="relative" style={{ height: `${pillars.length * 100}vh` }}>
        {pillars.map((p, i) => (
          <section
            key={i}
            className={`${p.bg} text-white sticky top-0 h-screen flex items-center`}
            style={{ zIndex: 10 + i }}
          >
            <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center w-full">
              <div>
                <p className="text-xs tracking-widest text-white/60 mb-4">{p.step}</p>
                <h2 className="font-serif text-4xl md:text-5xl mb-6">{p.title}</h2>
                <p className="text-white/80 max-w-md mb-6">{p.body}</p>
                <Link to="/about" className="bg-white text-navy rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
              <div className="h-72 rounded-2xl bg-white/10" />
            </div>
          </section>
        ))}
      </div>


      {/* Our Impact */}
      <section className="relative z-20 bg-white max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-start">
        <div className="md:sticky md:top-32">
          <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Our Impact</p>
          <h2 className="font-serif text-4xl text-navy mb-4">A council that works, measured in real terms.</h2>
          <p className="text-gray-500 max-w-md">
            These numbers reflect the breadth of our community and the reach of our work —
            from representation and advocacy to welfare and campus life.
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-navy text-white rounded-2xl p-8 min-h-[380px] flex flex-col justify-center">
            <Users className="mb-4" />
            <p className="text-4xl font-bold mb-1">{settings.students_represented || "5,000+"}</p>
            <p className="font-semibold mb-1">Students represented</p>
            <p className="text-white/70 text-sm">Every student at Regional Maritime University has a voice through the SRC.</p>
          </div>
          <div className="bg-blue-800 text-white rounded-2xl p-8 min-h-[380px] flex flex-col justify-center">
            <Flag className="mb-4" />
            <p className="text-4xl font-bold mb-1">{settings.executive_portfolios || "7"}</p>
            <p className="font-semibold mb-1">Executive portfolios</p>
            <p className="text-white/70 text-sm">A dedicated leadership team covering welfare, finance, events and more.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 min-h-[380px] flex flex-col justify-center">
            <Globe className="mb-4 text-navy" />
            <p className="text-4xl font-bold mb-1 text-navy">{settings.countries_represented || "5"}</p>
            <p className="font-semibold mb-1 text-navy">Countries represented</p>
            <p className="text-gray-500 text-sm">A proudly regional community of students from across West Africa and beyond.</p>
          </div>
        </div>
      </section>

      {/* Executives preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">SRC Executives</p>
              <h2 className="font-serif text-4xl text-navy">The leadership team serving you.</h2>
            </div>
            <Link to="/executives" className="hidden md:inline-flex items-center gap-1 text-navy font-medium">
              Meet the team <ArrowRight size={16} />
            </Link>
          </div>
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
                  <p className="text-sm text-gray-500">{e.position}</p>
                </div>
              </div>
            ))}
            {!execs.length && <p className="text-gray-400">No executives listed yet.</p>}
          </div>
          <Link to="/executives" className="md:hidden mt-8 inline-flex items-center gap-1 text-navy font-medium">
            Meet the team <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Scrolling news ticker */}
      <NewsTicker items={featuredNews ? [featuredNews, ...news] : news} />

      {/* News preview: featured story + grid, static (no scroll effect) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">News & Announcements</p>
            <h2 className="font-serif text-4xl text-navy">Latest from the council.</h2>
          </div>
          <Link to="/news" className="hidden md:inline-flex items-center gap-1 text-navy font-medium">
            All news <ArrowRight size={16} />
          </Link>
        </div>

        {featuredNews && (
          <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border mb-6">
            <div className="relative h-64 md:h-auto">
              {featuredNews.image_url ? (
                <img src={featuredNews.image_url} alt={featuredNews.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
              <span className="absolute top-4 left-4 bg-navy text-white text-xs px-3 py-1 rounded-full">Featured</span>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <p className="text-sm text-gray-400 mb-2">
                {new Date(featuredNews.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {featuredNews.category ? ` · ${featuredNews.category}` : ""}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-navy mb-4">{featuredNews.title}</h3>
              <p className="text-gray-600 mb-6">{featuredNews.excerpt}</p>
              <Link to={`/news/${featuredNews.slug}`} className="text-navy font-medium inline-flex items-center gap-1">
                Read the full story <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {news.map((n) => (
            <article key={n.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              <div className="relative">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-gray-100" />
                )}
                {n.category && (
                  <span className="absolute top-3 left-3 bg-white text-navy text-xs px-3 py-1 rounded-full shadow-sm">
                    {n.category}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(n.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <h3 className="font-serif text-lg text-navy mb-2">{n.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{n.excerpt}</p>
                <Link to={`/news/${n.slug}`} className="text-navy text-sm font-medium inline-flex items-center gap-1">
                  Read more <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
          {!news.length && !featuredNews && <p className="text-gray-400">No articles published yet.</p>}
        </div>
      </section>

      {/* Industry partners */}
      {!!partners.length && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Maritime Industry</p>
            <h2 className="font-serif text-3xl text-navy mb-8">Industry connections across the maritime world.</h2>
            <div className="flex flex-wrap gap-4">
              {partners.map((p) => (
                <div key={p.id} className="bg-white rounded-xl px-5 py-4 shadow-sm flex items-center gap-3 min-w-[220px]">
                  <div>
                    <p className="font-semibold text-navy">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.partner_type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Journey: campus -> region -> industry */}
      <JourneySection />

      {/* Countries represented carousel */}
      <CountriesCarousel />

      {/* Events preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Upcoming Events</p>
            <h2 className="font-serif text-4xl text-navy">What's happening on campus.</h2>
          </div>
          <Link to="/events" className="hidden md:inline-flex items-center gap-1 text-navy font-medium">
            All events <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              {e.image_url && <img src={e.image_url} alt={e.title} className="h-40 w-full object-cover" />}
              <div className="p-5">
                <h3 className="font-serif text-lg text-navy mb-2">{e.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Clock size={14} /> {e.start_time} – {e.end_time}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin size={14} /> {e.location}
                </div>
                <Link
                  to="/events"
                  className="w-full block text-center bg-navy text-white rounded-full py-2 text-sm font-medium"
                >
                  Register →
                </Link>
              </div>
            </div>
          ))}
          {!events.length && <p className="text-gray-400">No upcoming events yet.</p>}
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">SRC Marketplace</p>
              <h2 className="font-serif text-4xl text-navy">Student merchandise & essentials.</h2>
            </div>
            <Link to="/marketplace" className="hidden md:inline-flex items-center gap-1 text-navy font-medium">
              Shop all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((it) => (
              <div key={it.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
                {it.image_url && <img src={it.image_url} alt={it.name} className="h-56 w-full object-cover" />}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg text-navy">{it.name}</h3>
                    <span className="text-navy font-semibold">GH₵ {Number(it.price_ghs).toFixed(0)}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{it.description}</p>
                </div>
              </div>
            ))}
            {!items.length && <p className="text-gray-400">No merchandise listed yet.</p>}
          </div>
          <Link to="/marketplace" className="md:hidden mt-8 inline-flex items-center gap-1 text-navy font-medium">
            Shop all <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Constitution callout */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-navy rounded-3xl p-10 h-64 flex flex-col items-center justify-center text-white text-center">
            <p className="text-xs tracking-widest text-white/60 mb-2">REGIONAL MARITIME UNIVERSITY</p>
            <p className="font-serif text-2xl">SRC Constitution</p>
          </div>
          <div>
            <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Governance</p>
            <h2 className="font-serif text-4xl text-navy mb-4">SRC Constitution</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              The Constitution is the foundation of the Students' Representative Council — defining
              our purpose, structure, and the principles that guide our service to every student.
            </p>
            <div className="flex gap-4">
              <Link to="/constitution" className="bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <BookOpen size={16} /> Read the Constitution
              </Link>
              <Link to="/constitution" className="border border-gray-300 text-navy rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <Download size={16} /> Download
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Student Services preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">Student Services</p>
              <h2 className="font-serif text-4xl text-navy">Here to support every student.</h2>
            </div>
            <Link to="/services" className="hidden md:inline-flex items-center gap-1 text-navy font-medium">
              All services <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = LucideIcons[s.icon] || LucideIcons.HelpCircle;
              return (
                <div key={s.id} className="bg-white border rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-blue-700" />
                  </div>
                  <h3 className="font-serif text-lg text-navy mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{s.description}</p>
                </div>
              );
            })}
            {!services.length && <p className="text-gray-400">No services listed yet.</p>}
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-navy rounded-3xl px-8 py-14 md:px-16 text-white text-center">
          <p className="text-white/60 uppercase text-sm tracking-wide font-semibold mb-2">Contact</p>
          <h2 className="font-serif text-4xl mb-4">Get in touch with the council.</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Have a question, concern, or idea for the SRC? Reach out and we'll get back to you.
          </p>
          <Link to="/contact" className="bg-white text-navy rounded-full px-6 py-3 font-medium inline-flex items-center gap-2">
            Send a message <Send size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
