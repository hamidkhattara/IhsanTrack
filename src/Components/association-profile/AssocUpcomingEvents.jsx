import { useState } from "react";
import { Link } from "react-router-dom";
import EventRegistrationModal from "../EventRegistrationModal";

/**
 * AssocUpcomingEvents.jsx
 *
 * USED ON: AssocProfilePage only
 *
 * KEY CHANGE: "سجّل الآن" button now opens EventRegistrationModal
 * instead of navigating to /events/:id.
 *
 * HOW IT CONNECTS:
 *   selectedEvent === null → modal hidden
 *   selectedEvent === obj  → EventRegistrationModal renders with that event
 *   onClose()              → resets selectedEvent to null
 */
export default function AssocUpcomingEvents({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!events || events.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/events"
          className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors flex items-center gap-1"
        >
          ← عرض الكل
        </Link>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-white">الفعاليات القادمة</h2>
          <div className="w-1 h-6 bg-green-500 rounded-full" />
        </div>
      </div>

      {/* Horizontal scrollable cards */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-green-800">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {/* Registration modal */}
      <EventRegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

/**
 * EventCard — individual upcoming event card
 * Props:
 *   event      — event data object
 *   onRegister — called when "سجّل الآن" is clicked → opens modal
 */
function EventCard({ event, onRegister }) {
  return (
    <div className="min-w-[220px] sm:min-w-[260px] bg-gray-900 border border-gray-800 hover:border-green-700/50 rounded-2xl overflow-hidden snap-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-950/30 group shrink-0">

      {/* Image area */}
      <div className="relative h-36 bg-gradient-to-br from-green-950 to-gray-800 flex items-center justify-center overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-500">
            {event.imageEmoji}
          </span>
        )}

        {/* Status badge */}
        <div className={`absolute top-3 right-3 ${event.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {event.badge}
        </div>

        {/* Category badge */}
        <div className={`absolute top-3 left-3 ${event.categoryColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-right">
        <h3 className="text-white font-bold text-sm mb-2 leading-snug group-hover:text-green-100 transition-colors">
          {event.title}
        </h3>

        {/* Date & location */}
        <div className="space-y-1 mb-3">
          <p className="text-gray-400 text-xs flex items-center gap-1 justify-end">
            <span>{event.date}</span>
            <span>📅</span>
          </p>
          <p className="text-gray-400 text-xs flex items-center gap-1 justify-end">
            <span>{event.location}</span>
            <span>📍</span>
          </p>
        </div>

        {/* Register button — triggers modal */}
        <button
          onClick={onRegister}
          className="w-full py-2 text-xs font-bold bg-green-600/20 hover:bg-green-600 border border-green-700/50 hover:border-green-600 text-green-300 hover:text-white rounded-xl transition-all duration-200"
        >
          سجّل الآن
        </button>
      </div>
    </div>
  );
}
