import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * AssocDashboardNavbar.jsx
 *
 * USED ON: All association dashboard pages (edit profile, manage campaigns, manage events)
 * This is a SEPARATE navbar from the public Navbar.jsx
 *
 * CONTAINS:
 * - Logo (right, RTL) → links to public homepage "/"
 * - Three dashboard tabs (always visible):
 *     ملف الجمعية      → /dashboard/association/profile   (active on this page)
 *     إدارة الحملات   → /dashboard/association/campaigns
 *     إدارة الفعاليات → /dashboard/association/events
 * - Avatar / profile icon (left, RTL) → dropdown with logout
 *
 * ACTIVE TAB: detected via useLocation().pathname matching
 * The active tab gets a green underline + white text.
 */

const dashboardTabs = [
  { label: "ملف الجمعية",     path: "/dashboard/association/profile" },
  { label: "إدارة الحملات",   path: "/dashboard/association/campaigns" },
  { label: "إدارة الفعاليات", path: "/dashboard/association/events" },
];

export default function AssocDashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleLogout = async () => {
    setAvatarOpen(false);
    await logout();
    navigate("/assoc_sign_in");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-950/98 backdrop-blur-sm border-b border-green-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* LEFT (RTL: right visually) — Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="w-9 h-9 rounded-xl bg-green-700 hover:bg-green-600 border border-green-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-green-900/40"
              aria-label="حساب الجمعية"
            >
              ج
            </button>

            {/* Avatar dropdown */}
            {avatarOpen && (
              <div className="absolute left-0 top-12 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-xl py-1 text-right">
                <Link
                  to="/dashboard/association/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setAvatarOpen(false)}
                >
                  ملف الجمعية
                </Link>
                <Link
                  to="/associations/1"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setAvatarOpen(false)}
                >
                  عرض الصفحة العامة
                </Link>
                <div className="h-px bg-gray-800 my-1" />
                <button
                  className="w-full text-right px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>

          {/* CENTER — Dashboard Tabs */}
          <div className="flex items-center gap-1">
            {dashboardTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.label}
                  to={tab.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                    ${isActive
                      ? "text-white bg-green-900/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT (RTL: left visually) — Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-white font-bold text-base">
              إحسان <span className="text-green-400">الجزائر</span>
            </span>
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/50">
              <span className="text-white text-xs font-bold">إ</span>
            </div>
          </Link>

        </div>
      </div>
    </nav>
  );
}
