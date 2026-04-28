import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import EventJoinModal from '../Components/EventJoinModal'
import useEvents from '../hooks/useEvents'
import { FiCalendar, FiMapPin, FiSearch, FiArrowLeft } from 'react-icons/fi'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-12 h-12 rounded-full border-4 border-[#10b981]/20 border-t-[#10b981] animate-spin" />
  </div>
);

const formatDateTime = (dateValue) => {
  if (!dateValue) return 'غير محدد';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'غير محدد';

  return new Intl.DateTimeFormat('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'غير محدد';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'غير محدد';

  return new Intl.DateTimeFormat('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const Events = () => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState('all');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(true);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (events || []).filter((event) => {
      const titleMatch = event?.title?.toLowerCase().includes(query);
      const descriptionMatch = event?.description?.toLowerCase().includes(query);
      const associationMatch = event?.association?.name?.toLowerCase().includes(query);
      const matchesQuery = !query || titleMatch || descriptionMatch || associationMatch;
      const matchesCity = city === 'all' || (event?.location_wilaya || event?.location || '').toLowerCase().includes(city.toLowerCase());
      const matchesDate = !date || String(event?.start_date || '').startsWith(date);
      const seatsLeft = Math.max(0, Number(event?.max_participants || 0) - Number(event?.spots_taken || 0));
      const matchesOpen = !onlyOpen || seatsLeft > 0;
      return matchesQuery && matchesCity && matchesDate && matchesOpen;
    });
  }, [city, date, events, onlyOpen, search]);

  const cityOptions = useMemo(() => {
    const values = (events || [])
      .map((event) => event?.location_wilaya || event?.location)
      .filter(Boolean);
    return Array.from(new Set(values));
  }, [events]);

  useEffect(() => {
    const eventId = searchParams.get('id');
    if (!eventId || !events.length) return;

    const target = events.find((item) => Number(item?.id) === Number(eventId));
    if (target) setSelectedEvent(target);
  }, [events, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a120f] text-white font-arabic" dir="rtl">
      <Navbar/>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="rounded-[28px] border border-[#20332b] bg-linear-to-br from-[#111a17] to-[#0d1512] p-6 sm:p-8 mb-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white">الفعاليات وفرص التطوع</h1>
            <p className="text-[#8aa298] mt-3 max-w-2xl mx-auto">ابحث عن الفعالية المناسبة، تصفح الأماكن المفتوحة، وسجل مباشرة في الفرص المتاحة.</p>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-[#15201c] border border-[#22352d] p-4 lg:flex-row lg:items-center">
            <button
              type="button"
              onClick={() => setOnlyOpen((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${onlyOpen ? 'bg-[#10b981] text-white' : 'bg-[#111a17] text-[#9bb0a6] border border-[#2a3d35]'}`}
            >
              <span className="text-base">⚡</span>
              {onlyOpen ? 'Open only' : 'All events'}
            </button>

            <label className="flex items-center gap-2 rounded-2xl border border-[#2a3d35] bg-[#0f1714] px-4 py-3 text-sm text-[#d8e2dc] lg:w-52">
              <FiCalendar className="shrink-0 text-[#10b981]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-right text-white placeholder:text-[#74847c]"
              />
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-[#2a3d35] bg-[#0f1714] px-4 py-3 text-sm text-[#d8e2dc] lg:w-56">
              <FiMapPin className="shrink-0 text-[#10b981]" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent outline-none text-white"
              >
                <option value="all">كل المدن</option>
                {cityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-[#2a3d35] bg-[#0f1714] px-4 py-3 text-sm text-[#d8e2dc]">
              <FiSearch className="shrink-0 text-[#10b981]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن فعالية، جمعية، أو موقع..."
                className="w-full bg-transparent outline-none text-right text-white placeholder:text-[#74847c]"
              />
            </label>
          </div>
        </div>

        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="text-red-400 text-right">{error}</p> : null}

        {!loading && !error && filteredEvents.length === 0 ? (
          <div className="bg-[#111a17] border border-[#22352d] rounded-3xl p-10 text-center text-[#9eb0a7]">
            <h3 className="text-white text-lg font-bold">لا توجد فعاليات حالياً</h3>
            <p className="text-gray-400 text-sm mt-2">سيتم عرض الفعاليات هنا عند نشرها من طرف الجمعيات.</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const maxParticipants = Number(event.max_participants || 0);
            const spotsTaken = Number(event.spots_taken || 0);
            const seatsLeft = Math.max(0, maxParticipants - spotsTaken);
            const associationName = event.association?.name || event.association?.user?.full_name || 'جمعية غير محددة';
            const coverImage = event.image_url || event.coverImage || event.image;
            const location = event.location_wilaya || event.location || 'غير محدد';
            const progress = maxParticipants > 0 ? Math.min(100, Math.round((spotsTaken / maxParticipants) * 100)) : 0;

            return (
              <article
                key={event.id}
                className="group overflow-hidden rounded-3xl border border-[#22352d] bg-[#111a17] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/40"
                onClick={() => setSelectedEvent(event)}
                role="button"
                tabIndex={0}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                    eventKey.preventDefault();
                    setSelectedEvent(event);
                  }
                }}
              >
                <div className="relative aspect-video overflow-hidden bg-linear-to-br from-emerald-950 via-[#12332a] to-[#334155] flex items-center justify-center">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl opacity-50">📅</span>
                  )}
                  <div className="absolute top-3 right-3 rounded-full bg-[#10b981] px-3 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-900/30">
                    مفتوح للتسجيل
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-950/30">
                    {seatsLeft <= 5 ? 'عاجل' : `${seatsLeft} مقعد متبقٍ`}
                  </div>
                </div>

                <div className="flex h-full flex-col p-5 text-right">
                  <div className="mb-4">
                    <p className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-[#3b82f6]">
                      {associationName}
                      <span className="text-[#10b981]">✓</span>
                    </p>
                    <h2 className="line-clamp-2 text-xl font-black text-white">{event.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#9eb0a7]">{event.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-[#9eb0a7]">
                    <div className="rounded-2xl border border-[#22352d] bg-[#0f1714] p-3">
                      <div className="mb-1 flex items-center justify-end gap-2"><span>{'🕒'}</span><span>الوقت</span></div>
                      <div className="text-white">{event.time || formatDateTime(event.start_date)}</div>
                    </div>
                    <div className="rounded-2xl border border-[#22352d] bg-[#0f1714] p-3">
                      <div className="mb-1 flex items-center justify-end gap-2"><span>{'📅'}</span><span>التاريخ</span></div>
                      <div className="text-white">{formatDate(event.start_date)}</div>
                    </div>
                    <div className="col-span-2 rounded-2xl border border-[#22352d] bg-[#0f1714] p-3">
                      <div className="mb-1 flex items-center justify-end gap-2"><span>{'📍'}</span><span>الموقع</span></div>
                      <div className="text-white">{location}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#9eb0a7]">
                      <span>{spotsTaken} / {maxParticipants}</span>
                      <span>{seatsLeft} seats available</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1c2a24] overflow-hidden">
                      <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(eventClick) => {
                      eventClick.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f97316] px-4 py-3 font-bold text-white transition-all duration-200 hover:bg-[#ea670f]"
                  >
                    Book my place now
                    <FiArrowLeft />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <EventJoinModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}

export default Events