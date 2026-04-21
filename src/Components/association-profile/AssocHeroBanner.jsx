import { Link, useNavigate } from "react-router-dom";

/**
 * AssocHeroBanner.jsx
 *
 * USED ON: AssocProfilePage only
 *
 * CONTAINS:
 * - Full-width cover image area (360px tall)
 *   → In production replace the gradient bg with: <img src={assoc.coverImage} />
 * - "VOLUNTEERS" large text overlay (matches the screenshot)
 * - Illustrated volunteer figures (emoji placeholders for the illustration)
 * - Back arrow button (top-right in RTL) → navigates to /associations list
 * - Green overlay gradient for readability
 *
 * Props: assoc (association object)
 */
export default function AssocHeroBanner({ assoc }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden bg-green-900">

      {/* Cover image — replace gradient with real image */}
      {assoc.coverImage ? (
        <img
          src={assoc.coverImage}
          alt={assoc.name}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Placeholder cover: green gradient with illustration text */
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-950">
          {/* Decorative circles */}
          <div className="absolute top-6 left-16 w-32 h-32 bg-green-600/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500/20 rounded-full blur-3xl" />

          {/* VOLUNTEERS big text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span
              className="text-5xl sm:text-7xl font-black tracking-widest text-white/20 uppercase"
              style={{ letterSpacing: "0.15em" }}
            >
              VOLUNTEERS
            </span>
          </div>

          {/* Illustrated people (emoji stand-ins for the SVG illustration) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-4 pb-0">
            <span className="text-5xl sm:text-6xl drop-shadow-lg" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>🧕</span>
            <span className="text-6xl sm:text-7xl drop-shadow-lg" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>👨‍🌾</span>
          </div>

          {/* Clock icon badge */}
          <div className="absolute top-8 left-1/2 ml-16 bg-green-600/80 backdrop-blur-sm border border-green-400/30 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <span className="text-xl">⏰</span>
          </div>
        </div>
      )}

      {/* Dark overlay at bottom for text legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" />

      {/* Back button — top right (RTL: top left visually) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200"
        aria-label="العودة"
      >
        <span>→</span>
        <span className="hidden sm:inline">العودة</span>
      </button>

      {/* Breadcrumb optional */}
      <div className="absolute top-4 left-4 text-xs text-white/50">
        <Link to="/" className="hover:text-white/80 transition-colors">الرئيسية</Link>
        <span className="mx-1">/</span>
        <Link to="/associations" className="hover:text-white/80 transition-colors">الجمعيات</Link>
      </div>

    </div>
  );
}
