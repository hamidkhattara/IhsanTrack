import { Link } from "react-router-dom";

/**
 * AssociationCTA.jsx
 *
 * USED ON: HomePage only
 *
 * CONTAINS:
 * A full-width green banner targeting associations and companies.
 * - Left side (RTL right): promotional images / illustration area
 * - Right side (RTL left): text copy + two CTA buttons
 *
 * CTA BUTTONS:
 *   "سجّل جمعيتك" (Register your association) → /register?type=association
 *   "اعرف أكثر"   (Learn more)                  → /about
 *
 * AUDIENCE: This section is specifically for associations and NGOs.
 * The design mirrors the green banner seen in the original homepage screenshot.
 *
 * IMAGES: The placeholder boxes represent association member photos.
 * Replace with real association/people images in production:
 *   <img src="/images/association-members.jpg" ... />
 */

export default function AssociationCTA() {
  return (
    <section className="py-0 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-green-900 via-green-800 to-green-950 border border-green-700/40">

          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-400/5 rounded-full blur-2xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[340px]">

            {/* LEFT SIDE (RTL: right) — Images placeholder */}
            <div className="relative flex items-end justify-center gap-3 px-8 pt-8 pb-0 lg:pb-0 overflow-hidden">
              {/* Person image 1 */}
              <div className="w-28 h-36 sm:w-36 sm:h-44 bg-green-800/60 rounded-t-2xl border border-green-600/30 flex items-end justify-center pb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                <span className="text-5xl relative z-10">🧕</span>
              </div>
              {/* Person image 2 (taller) */}
              <div className="w-32 h-44 sm:w-40 sm:h-52 bg-green-700/50 rounded-t-2xl border border-green-500/30 flex items-end justify-center pb-3 overflow-hidden relative mb-0">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                <span className="text-5xl relative z-10">👨‍💼</span>
              </div>
              {/* Person image 3 */}
              <div className="w-28 h-36 sm:w-36 sm:h-44 bg-green-800/60 rounded-t-2xl border border-green-600/30 flex items-end justify-center pb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                <span className="text-5xl relative z-10">👩‍🔬</span>
              </div>

              {/* Floating stat badge */}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-right">
                <div className="text-white font-black text-xl">+850</div>
                <div className="text-green-200 text-xs">جمعية انضمت</div>
              </div>
            </div>

            {/* RIGHT SIDE (RTL: left) — Text content */}
            <div className="flex flex-col justify-center p-8 lg:p-12 text-right">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-green-200 text-xs font-medium w-fit mr-auto mb-4">
                🏛️ للجمعيات والمؤسسات
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                هل أنتَ جمعية خيرية؟
              </h2>

              {/* Body */}
              <p className="text-green-100/80 text-sm sm:text-base leading-relaxed mb-6">
                انضم إلى منصة إحسان الجزائر وابدأ حملاتك التبرعية بسهولة. نوفر لك أدوات إدارة متكاملة، متابعة مباشرة للتبرعات، وتقارير شفافة لمتبرعيك.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
                <Link
                  to="/about"
                  className="px-5 py-2.5 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  اعرف أكثر
                </Link>
                <Link
                  to="/register?type=association"
                  className="px-6 py-2.5 bg-white text-green-800 hover:bg-green-50 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
                >
                  سجّل جمعيتك الآن
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
