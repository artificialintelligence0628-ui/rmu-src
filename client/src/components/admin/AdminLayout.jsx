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
} from "lucide-react";
import { setToken } from "../../api";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/executives", label: "Executives", icon: Users },
  { to: "/admin/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/admin/partners", label: "Partners", icon: Ship },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    setToken(null);
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 shrink-0 bg-navy text-white flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Anchor size={18} />
          </span>
          <div>
            <p className="font-serif text-lg leading-none">RMU SRC</p>
            <p className="text-xs text-white/50">Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
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

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
