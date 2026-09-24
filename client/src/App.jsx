import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Executives from "./pages/Executives";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Events from "./pages/Events";
import Marketplace from "./pages/Marketplace";
import StudentServices from "./pages/StudentServices";
import Constitution from "./pages/Constitution";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminExecutives from "./pages/admin/AdminExecutives";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminPartners from "./pages/admin/AdminPartners";

export default function App() {
  const location = useLocation();
  const isAdminAuthPage = location.pathname.startsWith("/admin/login") ||
    location.pathname.startsWith("/admin/forgot-password") ||
    location.pathname.startsWith("/admin/reset-password");
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">
      {!isAdminArea && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/executives" element={<Executives />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/services" element={<StudentServices />} />
        <Route path="/constitution" element={<Constitution />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/executives"
          element={
            <ProtectedRoute>
              <AdminExecutives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/marketplace"
          element={
            <ProtectedRoute>
              <AdminMarketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute>
              <AdminPartners />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminArea && <Footer />}
    </div>
  );
}
