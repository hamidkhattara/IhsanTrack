/**
 * AssocStatsBar.jsx
 *
 * USED ON: AssocProfilePage only
 *
 * CONTAINS:
 * Four key metrics for the association, displayed horizontally:
 *   - 15K  → متابع   (Followers)
 *   - 89   → مشروع   (Projects completed)
 *   - 350+ → متطوع   (Volunteers)
 *   - 12   → سنة نشاط (Years of activity)
 *
 * These numbers come from the assoc data object.
 * Values animate in on mount (CSS transition on border-opacity).
 *
 * Props: assoc (association object)
 */
export default function AssocStatsBar({ assoc }) {
  const stats = [
    {
      value: assoc.followers,
      label: "متابع",
      icon: "👥",
      color: "text-green-400",
    },
    {
      value: assoc.projects,
      label: "مشروع",
      icon: "📋",
      color: "text-blue-400",
    },
    {
      value: assoc.volunteers,
      label: "متطوع",
      icon: "🤝",
      color: "text-yellow-400",
    },
    {
      value: assoc.yearsActive,
      label: "سنة نشاط",
      icon: "🏆",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 hover:border-green-800/60 rounded-2xl px-5 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-extrabold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-xs mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
