import { useEffect, useState } from "react";
import { Users, Flag, Globe } from "lucide-react";
import { settingsApi } from "../api";
import JourneySection from "../components/JourneySection";

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

export default function About() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    settingsApi.get().then(setSettings).catch(() => {});
  }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <p className="text-blue-700 uppercase text-sm tracking-wide font-semibold mb-2">About the SRC</p>
        <h1 className="font-serif text-4xl md:text-5xl text-navy max-w-3xl">
          The voice of every student, working for the whole community.
        </h1>
      </section>

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
                <p className="text-white/80 max-w-md">{p.body}</p>
              </div>
              <div className="h-72 rounded-2xl bg-white/10" />
            </div>
          </section>
        ))}
      </div>

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

      <JourneySection />
    </div>
  );
}
