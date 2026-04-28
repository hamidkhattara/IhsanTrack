import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiFilter, FiMapPin, FiSearch, FiSliders } from "react-icons/fi";
import Navbar from "../Components/Navbar";
import api from "../api/axios";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#10b981]/20 border-t-[#10b981]" />
  </div>
);

const activityOptions = [
  { id: "education", label: "التعليم" },
  { id: "relief", label: "الإغاثة" },
  { id: "health", label: "الصحة" },
  { id: "food", label: "الأمن الغذائي" },
  { id: "social", label: "الدعم الاجتماعي" },
];

const quickTags = ["الكل", "موثقة", "تعليم", "إغاثة", "صحة", "دعم اجتماعي"];

export default function Associations() {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activeQuickTag, setActiveQuickTag] = useState("الكل");

  useEffect(() => {
    let ignore = false;

    const loadAssociations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/associations");
        if (ignore) return;
        setAssociations(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.error || "تعذر تحميل بيانات الجمعيات.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadAssociations();

    return () => {
      ignore = true;
    };
  }, []);

  const cities = useMemo(
    () => Array.from(new Set((associations || []).map((item) => item?.wilaya).filter(Boolean))),
    [associations]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (associations || []).filter((association) => {
      const name = association?.name || "";
      const description = association?.description || "";
      const wilaya = association?.wilaya || "";
      const email = association?.user?.email || "";
      const social = JSON.stringify(association?.social_media_links || {}).toLowerCase();
      const matchesSearch = !q || [name, description, wilaya, email, social].some((field) => field.toLowerCase().includes(q));
      const matchesCity = city === "all" || wilaya === city;
      const matchesVerified = !verifiedOnly || Boolean(association?.user?.is_email_verified);
      const descriptionText = `${name} ${description} ${wilaya}`.toLowerCase();
      const matchesActivities =
        selectedActivities.length === 0 ||
        selectedActivities.every((activity) => descriptionText.includes(activity.toLowerCase()));
      const matchesQuickTag =
        activeQuickTag === "الكل" ||
        (activeQuickTag === "موثقة" ? Boolean(association?.user?.is_email_verified) : descriptionText.includes(activeQuickTag.toLowerCase()));

      return matchesSearch && matchesCity && matchesVerified && matchesActivities && matchesQuickTag;
    });
  }, [activeQuickTag, associations, city, search, selectedActivities, verifiedOnly]);

  return (
    <div className="min-h-screen bg-[#0a120f] text-white font-arabic" dir="rtl">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-[#20332b] bg-linear-to-br from-[#111a17] to-[#0d1512] px-5 py-8 shadow-2xl shadow-black/20 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#10b981]">Associations Directory</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">دليل الجمعيات</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#8aa298]">
              استعرض الجمعيات الموثقة، ابحث بالمدينة أو مجال النشاط، وافتح الملف الكامل لكل جمعية.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#22352d] bg-[#15201c] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <label className="flex items-center gap-3 rounded-2xl border border-[#2b3e36] bg-[#0f1714] px-4 py-3 text-sm text-[#d6e1db] lg:flex-1">
                <FiSearch className="shrink-0 text-[#10b981]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ابحث عن جمعية..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-[#74847c]"
                />
              </label>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10b981] px-6 py-3 font-bold text-white transition hover:bg-emerald-500"
              >
                <FiSearch />
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveQuickTag(tag)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    activeQuickTag === tag
                      ? "border-[#10b981] bg-[#10b981] text-white"
                      : "border-[#2b3e36] bg-[#0f1714] text-[#b5c4bd] hover:border-[#10b981]/50 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="mt-6 text-right text-red-400">{error}</p> : null}

        {!loading && !error && filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#22352d] bg-[#111a17] p-10 text-center text-[#9eb0a7]">
            لا توجد جمعيات مطابقة للبحث أو الفلاتر الحالية.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-6 lg:flex-row lg:items-start">
          <aside className="lg:sticky lg:top-24 lg:w-[25%]">
            <div className="rounded-[28px] border border-[#22352d] bg-[#111a17] p-5 shadow-xl shadow-black/20">
              <div className="mb-5 flex items-center gap-2 text-right">
                <FiFilter className="text-[#10b981]" />
                <h2 className="text-lg font-black">Filter Results</h2>
              </div>

              <div className="space-y-4 text-right">
                <label className="block text-sm text-[#9eb0a7]">
                  <span className="mb-2 block text-white">المدينة</span>
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-2xl border border-[#2b3e36] bg-[#0f1714] px-4 py-3 text-white outline-none"
                  >
                    <option value="all">كل المدن</option>
                    {cities.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => setVerifiedOnly((value) => !value)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                    verifiedOnly ? "border-[#10b981] bg-[#10352d] text-white" : "border-[#2b3e36] bg-[#0f1714] text-[#b5c4bd]"
                  }`}
                >
                  <span>Verified associations only</span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${verifiedOnly ? 'border-[#10b981] bg-[#10b981]' : 'border-[#41534b] bg-[#15201c]'}`}>
                    <FiCheck size={14} />
                  </span>
                </button>

                <div className="rounded-2xl border border-[#2b3e36] bg-[#0f1714] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <FiSliders className="text-[#10b981]" />
                    Field of Activity
                  </div>
                  <div className="space-y-3">
                    {activityOptions.map((option) => {
                      const checked = selectedActivities.includes(option.label);
                      const count = (associations || []).filter((association) =>
                        `${association?.name || ''} ${association?.description || ''}`.toLowerCase().includes(option.label.toLowerCase())
                      ).length;
                      return (
                        <label key={option.id} className="flex items-center justify-between gap-3 text-sm text-[#c7d3ce]">
                          <span>{option.label}</span>
                          <span className="flex items-center gap-3">
                            <span className="text-[#73837b]">{count}</span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setSelectedActivities((current) =>
                                  current.includes(option.label)
                                    ? current.filter((item) => item !== option.label)
                                    : [...current, option.label]
                                );
                              }}
                              className="h-4 w-4 rounded border-[#41534b] bg-[#15201c] text-[#10b981]"
                            />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-2xl bg-[#0f7a59] px-4 py-3 font-bold text-white transition hover:bg-[#10b981]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="lg:w-[75%]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((association) => {
                const verified = Boolean(association?.user?.is_email_verified);
                const categories = inferCategories(association);
                const lastActive = formatRelativeTime(association?.updatedAt || association?.createdAt);
                return (
                  <Link
                    key={association?.id}
                    to={`/associations/${association?.id}`}
                    className="group overflow-hidden rounded-[28px] border border-[#22352d] bg-[#111a17] transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/40 hover:shadow-2xl hover:shadow-black/20"
                  >
                    <div className="relative h-44 overflow-hidden bg-linear-to-br from-emerald-950 via-[#134035] to-slate-700">
                      {association?.cover_image_url ? (
                        <img
                          src={association.cover_image_url}
                          alt={association?.name || 'Association'}
                          className="h-full w-full object-cover opacity-90"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 right-0 p-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-[#0a120f] bg-[#0f1714] shadow-lg">
                          {association?.logo_url ? (
                            <img src={association.logo_url} alt={association?.name || 'Logo'} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl text-[#10b981]">🏛️</div>
                          )}
                        </div>
                      </div>
                      {verified ? (
                        <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-[#10b981] px-3 py-1 text-xs font-bold text-white">
                          Verified
                        </div>
                      ) : null}
                    </div>

                    <div className="p-5 text-right">
                      <h3 className="text-xl font-black text-white">{association?.name || 'جمعية'}</h3>
                      <p className="mt-2 text-sm text-[#8ca095]">{association?.wilaya || 'غير محدد'}</p>
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#c8d3ce]">
                        {association?.description || 'لا يوجد وصف متاح حالياً.'}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-[#123229] px-3 py-1 text-xs font-medium text-[#a8dbc8]"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 text-xs text-[#8ca095]">
                        <span className="text-[#10b981]">View Profile →</span>
                        <span>Last active: {lastActive}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function inferCategories(association) {
  const text = `${association?.name || ''} ${association?.description || ''}`.toLowerCase();
  const categories = [];
  if (text.includes('تعليم')) categories.push('تعليم');
  if (text.includes('إغاثة') || text.includes('اغاثة')) categories.push('إغاثة');
  if (text.includes('صحة')) categories.push('صحة');
  if (text.includes('غذاء') || text.includes('food')) categories.push('الأمن الغذائي');
  if (text.includes('اجتماعي')) categories.push('دعم اجتماعي');
  return categories.length > 0 ? categories : ['عام'];
}

function formatRelativeTime(value) {
  if (!value) return 'غير محدد';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير محدد';

  const diff = Date.now() - date.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  if (days <= 1) return 'اليوم';
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;
  return `منذ ${Math.floor(days / 30)} أشهر`;
}
