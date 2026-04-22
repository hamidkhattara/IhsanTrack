const MAX_ITEMS = 4;

function formatDate(value) {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "غير محدد";

  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ar-DZ").format(Number(value || 0));
}

export default function AssociationActivityPanel({ donations = [], requests = [] }) {
  const donationItems = [...donations]
    .sort((left, right) => new Date(right.date || right.createdAt || 0) - new Date(left.date || left.createdAt || 0))
    .slice(0, MAX_ITEMS)
    .map((donation) => ({
      id: `donation-${donation.id}`,
      type: "donation",
      title: donation.projectTitle || donation.donationProject?.title || "حملة تبرع",
      name: donation.donorName || donation.donor?.full_name || donation.donor?.email || "متبرع",
      amount: donation.amount,
      date: donation.date || donation.createdAt,
      meta: donation.payment_method || "غير محدد",
    }));

  const requestItems = [...requests]
    .sort((left, right) => new Date(right.registered_at || right.joinedAt || 0) - new Date(left.registered_at || left.joinedAt || 0))
    .slice(0, MAX_ITEMS)
    .map((request) => ({
      id: `request-${request.id}`,
      type: "request",
      title: request.eventTitle || request.event?.title || "فعالية تطوعية",
      name: request.name || request.full_name || request.user?.full_name || request.user?.email || "مشارك",
      amount: null,
      date: request.registered_at || request.joinedAt,
      meta: request.status || "pending",
    }));

  const items = [...donationItems, ...requestItems]
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0))
    .slice(0, MAX_ITEMS);

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between gap-3">
        <div className="text-right">
          <h3 className="text-white font-extrabold text-lg">آخر التنبيهات</h3>
          <p className="text-gray-400 text-xs mt-0.5">تبرعات جديدة وطلبات مشاركة واردة حديثاً</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          مباشر من قاعدة البيانات
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            لا توجد تنبيهات حديثة بعد.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="text-right flex-1 min-w-0">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${
                      item.type === "donation"
                        ? "text-green-300 bg-green-900/20 border-green-800/50"
                        : "text-blue-300 bg-blue-900/20 border-blue-800/50"
                    }`}
                  >
                    {item.type === "donation" ? "تبرع" : "مشاركة"}
                  </span>
                  <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                </div>
                <p className="text-gray-300 text-sm truncate">
                  {item.type === "donation" ? `من ${item.name} • ${formatCurrency(item.amount)} دج` : `من ${item.name}`}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatDate(item.date)} • {item.meta}
                </p>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-lg">
                {item.type === "donation" ? "💚" : "🤝"}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
