import { Link } from "react-router-dom";
import { Anchor, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Anchor size={18} />
            </span>
            <span className="font-serif text-xl font-bold">RMU SRC</span>
          </div>
          <p className="text-white/70 max-w-sm">
            The Students' Representative Council of Regional Maritime University — representing
            students, building community, and shaping the future of maritime education.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-white/80">
          <Link to="/about" className="hover:text-white">About SRC</Link>
          <Link to="/executives" className="hover:text-white">Executives</Link>
          <Link to="/news" className="hover:text-white">News</Link>
          <Link to="/events" className="hover:text-white">Events</Link>
          <Link to="/marketplace" className="hover:text-white">Marketplace</Link>
          <Link to="/constitution" className="hover:text-white">Constitution</Link>
          <Link to="/services" className="hover:text-white">Student Services</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">SRC Office</h4>
            <p className="text-white/70 text-sm">Regional Maritime University, Nungua, Accra, Ghana</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Get in touch</h4>
            <p className="text-white/70 text-sm">src@rmu.edu.gh</p>
            <p className="text-white/70 text-sm">+233 30 271 4070</p>
          </div>
          <div className="flex gap-3 pt-2">
            {[Facebook, Instagram, Twitter, Linkedin, MessageCircle].map((Icon, i) => (
              <span key={i} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <Icon size={16} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-white/50 text-sm">
        © {new Date().getFullYear()} RMU Students' Representative Council. All rights reserved.
      </div>
    </footer>
  );
}
