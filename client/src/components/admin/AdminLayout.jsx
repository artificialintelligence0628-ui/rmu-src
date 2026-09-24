import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Users,
  ShoppingBag,
  LogOut,
  Anchor,
  Ship,
  HeartHandshake,
  Menu,
  X,
} from "lucide-react";
import { setToken } from "../../api";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/executives", label: "Executives", icon: Users },
  { to: "/admin/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/admin/partners", label: "Partners", icon: Ship },
  { to: "/admin/services", label: "Student Services", icon: HeartHandshake },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function logout() {
    setToken(null);
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-navy text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Anchor size={16} />
          </span>
          <p className="font-serif text-base leading-none">RMU SRC Admin</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay behind the mobile sidebar */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-64 shrink-0 bg-navy text-white flex flex-col fixed md:static inset-y-0 left-0 z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Anchor size={18} />
          </span>
          <div>
            <p className="font-serif text-lg leading-none">RMU SRC</p>
            <p className="text-xs text-white/50">Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive ? "bg-white/15 font-medium" : "text-white/70 hover:bg-white/10"
                }`
              }
            >
              <l.icon size={17} /> {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-white/70 hover:text-white border-t border-white/10"
        >
          <LogOut size={16} /> Log out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 w-full">{children}</main>
    </div>
  );
}
