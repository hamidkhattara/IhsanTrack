import { useState } from "react";
import AssocDashboardNavbar from "../Components/dashboard/AssocDashboardNavbar";
import DashboardFooter from "../Components/dashboard/DashboardFooter";
import EventsDashboardStats from "../Components/dashboard/EventsDashboardStats";
import CreateEventForm from "../Components/dashboard/CreateEventForm";
import EventsTable from "../Components/dashboard/EventsTable";

/**
 * AssocEventsDashboardPage.jsx
 *
 * ROUTE: /dashboard/association/events
 *
 * ACCESS: Protected — association accounts only.
 * Wrap with <ProtectedRoute role="association"> in App.jsx.
 *
 * PURPOSE:
 * The association's event & volunteer management interface. Allows them to:
 *   1. View overall event stats (published events, total volunteers, ongoing events)
 *   2. Create a new participation event/campaign via inline form
 *   3. View, filter, manage all their events in a table
 *   4. See who signed up (volunteers) for each event
 *
 * PAGE LAYOUT (top to bottom):
 * ┌──────────────────────────────────────────────────────┐
 * │  AssocDashboardNavbar (إدارة الفعاليات tab active)  │
 * ├──────────────────────────────────────────────────────┤
 * │  Page header: title + subtitle + create button       │
 * ├──────────────────────────────────────────────────────┤
 * │  EventsDashboardStats  (3 KPI cards)                 │
 * ├──────────────────────────────────────────────────────┤
 * │  CreateEventForm  (بيانات الحملة الجديدة)           │
 * ├──────────────────────────────────────────────────────┤
 * │  EventsTable  (events list + volunteer drawer)       │
 * ├──────────────────────────────────────────────────────┤
 * │  DashboardFooter                                     │
 * └──────────────────────────────────────────────────────┘
 *
 * STATE:
 * - showCreateForm: toggles the create event form
 * - events: array of event objects (mock → replace with API)
 * - selectedEvent: when set, shows the volunteers side panel
 *
 * API ENDPOINTS (production):
 *   GET    /api/associations/me/events          → load events list
 *   POST   /api/associations/me/events          → create event
 *   DELETE /api/associations/me/events/:id      → delete event
 *   GET    /api/events/:id/volunteers           → list volunteers for an event
 *   DELETE /api/events/:id/volunteers/:userId   → remove a volunteer
 */

// ── Mock events data ─────────────────────────────────────────────────────────
const mockEvents = [
  {
    id: 1,
    title: "قفة رمضان 2024",
    image: null,
    imageEmoji: "🍱",
    volunteers: 45,
    maxVolunteers: 100,
    raised: 150000,
    goal: 500000,
    progress: 70,
    status: "نشطة",
    statusColor: "green",
    createdAt: "قبل 45 يوم",
    category: "غذاء",
  },
  {
    id: 2,
    title: "حقيبة مدرسية للأيتام",
    image: null,
    imageEmoji: "🎒",
    volunteers: 124,
    maxVolunteers: 200,
    raised: 450000,
    goal: 700000,
    progress: 64,
    status: "انتظار",
    statusColor: "yellow",
    createdAt: "قبل 12 يوم",
    category: "تعليم",
  },
  {
    id: 3,
    title: "كسوة الشتاء",
    image: null,
    imageEmoji: "🧥",
    volunteers: 6,
    maxVolunteers: 50,
    raised: 800000,
    goal: 800000,
    progress: 100,
    status: "مكتملة",
    statusColor: "blue",
    createdAt: "قبل 3 أيام",
    category: "إغاثة",
  },
];

// ── Mock volunteers per event ─────────────────────────────────────────────────
const mockVolunteers = {
  1: [
    { id: 101, name: "أحمد بن علي", phone: "+213 550 123 456", wilaya: "الجزائر", joinedAt: "منذ يومين", avatar: "أ" },
    { id: 102, name: "فاطمة الزهراء", phone: "+213 661 234 567", wilaya: "وهران", joinedAt: "منذ 3 أيام", avatar: "ف" },
    { id: 103, name: "يوسف مرابط", phone: "+213 770 345 678", wilaya: "قسنطينة", joinedAt: "منذ 5 أيام", avatar: "ي" },
  ],
  2: [
    { id: 201, name: "سارة بوعلام", phone: "+213 550 456 789", wilaya: "عنابة", joinedAt: "منذ يوم", avatar: "س" },
    { id: 202, name: "كريم لعقاب", phone: "+213 660 567 890", wilaya: "سطيف", joinedAt: "منذ 4 أيام", avatar: "ك" },
  ],
  3: [
    { id: 301, name: "نور الهدى", phone: "+213 771 678 901", wilaya: "تيزي وزو", joinedAt: "منذ أسبوع", avatar: "ن" },
  ],
};

export default function AssocEventsDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState(null); // for volunteers drawer
  const [volunteers, setVolunteers] = useState(mockVolunteers);

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setVolunteers((prev) => ({ ...prev, [newEvent.id]: [] }));
    setShowCreateForm(false);
  };

  const handleRemoveVolunteer = (eventId, volunteerId) => {
    setVolunteers((prev) => ({
      ...prev,
      [eventId]: prev[eventId].filter((v) => v.id !== volunteerId),
    }));
    // Update volunteer count on the event
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, volunteers: Math.max(0, e.volunteers - 1) } : e
      )
    );
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-950 text-white" dir="rtl">
      <AssocDashboardNavbar activeTab="/dashboard/association/events" />

      <main className="pt-14">
        {/* ── Page Header ── */}
        <div className="bg-gray-950 border-b border-gray-800/60 sticky top-14 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: create button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateForm((v) => !v)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40"
                >
                  <span className="text-base leading-none">+</span>
                  إنشاء فعالية جديدة
                </button>
              </div>
              {/* Right: title */}
              <div className="text-right">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  إدارة الحملات والمتطوعين
                </h1>
                <p className="text-gray-400 text-xs mt-0.5">
                  قم بإدارة فعالياتك التطوعية وتتبعت جميع المشاركين المتطوعين الخيرية التطوعية
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <EventsDashboardStats />

          {showCreateForm && (
            <CreateEventForm
              onCreated={handleEventCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          <EventsTable
            events={events}
            setEvents={setEvents}
            volunteers={volunteers}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onRemoveVolunteer={handleRemoveVolunteer}
          />
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
