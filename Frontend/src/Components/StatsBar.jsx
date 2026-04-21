/**
 * StatsBar.jsx
 *
 * USED ON: HomePage only (placed right below HeroSection)
 *
 * CONTAINS:
 * Four key platform metrics displayed in a horizontal strip:
 *   - 0%     → عمولة (Commission — platform takes 0%)
 *   - 24/7   → دعم متواصل (Continuous support)
 *   - 58     → ولاية (Wilayas / provinces covered)
 *   - 100%   → شفافية (Transparency)
 *
 * DESIGN: Dark card strip with green accent dividers. Each metric has
 * a large number, a unit/label, and a short description line.
 *
 * TO ANIMATE: You can add a CountUp animation on scroll using
 * react-intersection-observer + a simple counter hook.
 */

const stats = [
  {
    value: "0%",
    label: "عمولة",
    desc: "لا نأخذ أي عمولة على التبرعات",
    icon: "🤝",
  },
  {
    value: "24/7",
    label: "دعم متواصل",
    desc: "فريق الدعم متاح على مدار الساعة",
    icon: "🕐",
  },
  {
    value: "58",
    label: "ولاية",
    desc: "نغطي كامل الولايات الجزائرية",
    icon: "📍",
  },
  {
    value: "100%",
    label: "شفافية",
    desc: "تتبع كل تبرع من المصدر للهدف",
    icon: "✅",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-gray-900 border-y border-green-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-green-900/30">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="py-8 px-6 text-center group hover:bg-green-950/30 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="text-2xl mb-2">{stat.icon}</div>

              {/* Big value */}
              <div className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-1 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-white font-bold text-sm mb-1">{stat.label}</div>

              {/* Description */}
              <div className="text-gray-500 text-xs leading-relaxed">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
