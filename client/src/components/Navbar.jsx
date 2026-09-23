import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Anchor, ChevronDown, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About SRC" },
  { to: "/executives", label: "Executives" },
  { to: "/news", label: "News" },
  { to: "/events", label: "Events" },
  { to: "/marketplace", label: "Marketplace" },
];

const moreLinks = [
  { to: "/services", label: "Student Services" },
  { to: "/constitution", label: "Constitution" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    function onClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [moreOpen]);

  // On the home page the navbar floats over the hero as frosted glass; it turns solid once you scroll.
  const overHero = pathname === "/" && !scrolled;

  return (
    <header className="sticky top-4 z-50 mx-4">
      <nav className={`mx-auto max-w-7xl flex items-center justify-between backdrop-blur-md rounded-full shadow-lg px-6 py-3 transition-colors duration-300 ${
          overHero ? "bg-white/60" : "bg-white/95"
        }`}>
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white">
            <Anchor size={18} />
          </span>
          <span className="font-serif text-xl font-bold text-navy">RMU SRC</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[15px] text-gray-700">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-navy transition ${isActive ? "text-navy font-medium" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 hover:text-navy transition"
            >
              More <ChevronDown size={16} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2">
                {moreLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link
          to="/about"
          className="hidden lg:flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-navy-light transition"
        >
          Explore SRC <ArrowRight size={16} />
        </Link>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden mt-2 mx-auto max-w-7xl bg-white rounded-2xl shadow-lg p-4 space-y-1">
          {[...navLinks, ...moreLinks].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}