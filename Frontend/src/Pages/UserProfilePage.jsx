import Navbar from "../Components/Navbar";
import UserProfileHeader from "../Components/user/UserProfileHeader";
import UserStatsCards from "../Components/user/UserStatsCards";
import UserActivityTabs from "../Components/user/UserActivityTabs";
import UserFooter from "../Components/user/UserFooter";

/**
 * UserProfilePage.jsx
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ROUTE: /dashboard/user/profile   (or /profile for the logged-in user)
 *
 * ACCESS: Protected — logged-in users (donateurs / participants) only.
 * In production wrap with: <ProtectedRoute role="user">
 *
 * WHO SEES THIS PAGE:
 * The regular user (متبرع / مشارك) — NOT the association.
 * This is the user's personal dashboard showing:
 *   - Their profile info (avatar, name, email, member since)
 *   - Total donations amount
 *   - Number of events participated in
 *   - Full donation history (سجل التبرعات tab)
 *   - Full events history (سجل الفعاليات tab)
 *
 * PAGE LAYOUT (top to bottom):
 * ┌──────────────────────────────────────────────┐
 * │  Navbar  (public navbar, user is logged in)  │
 * ├──────────────────────────────────────────────┤
 * │  UserProfileHeader                           │
 * │  (avatar + name + email + member since)      │
 * ├──────────────────────────────────────────────┤
 * │  UserStatsCards                              │
 * │  (إجمالي التبرعات | الفعاليات المشارك فيها)  │
 * ├──────────────────────────────────────────────┤
 * │  UserActivityTabs                            │
 * │  (سجل التبرعات | سجل الفعاليات)             │
 * ├──────────────────────────────────────────────┤
 * │  UserFooter                                  │
 * └──────────────────────────────────────────────┘
 *
 * DATA:
 * Replace mockUser with: GET /api/users/me
 * Replace mockDonations with: GET /api/users/me/donations
 * Replace mockEvents with: GET /api/users/me/events
 */

// ── Mock user data ────────────────────────────────────────────────────────────
// In production: fetch from GET /api/users/me
export const mockUser = {
  id: 1,
  name: "محمد عبد الله",
  email: "mohammed@example.com",
  avatar: null,           // replace with "/images/users/avatar.jpg"
  avatarEmoji: "👨‍💻",
  verified: true,
  memberSince: "2021",
  totalDonations: 50000,
  totalEvents: 12,
};

// ── Mock donations history ────────────────────────────────────────────────────
// In production: fetch from GET /api/users/me/donations
export const mockDonations = [
  {
    id: 1,
    campaignTitle: "كفالة يتيم",
    campaignIcon: "🧒",
    campaignColor: "bg-orange-900/40 border-orange-800/40",
    date: "15 مارس 2024",
    amount: 5000,
    status: "مكتمل",
  },
  {
    id: 2,
    campaignTitle: "دعم الحقيبة المدرسية",
    campaignIcon: "🎒",
    campaignColor: "bg-blue-900/40 border-blue-800/40",
    date: "1 سبتمبر 2023",
    amount: 2500,
    status: "مكتمل",
  },
  {
    id: 3,
    campaignTitle: "مشروع سقي الماء",
    campaignIcon: "💧",
    campaignColor: "bg-cyan-900/40 border-cyan-800/40",
    date: "5 أوت 2023",
    amount: 10000,
    status: "مكتمل",
  },
  {
    id: 4,
    campaignTitle: "حملة الشفاء العاجل",
    campaignIcon: "🏥",
    campaignColor: "bg-red-900/40 border-red-800/40",
    date: "22 جويلية 2023",
    amount: 1000,
    status: "مكتمل",
  },
];

// ── Mock events history ───────────────────────────────────────────────────────
// In production: fetch from GET /api/users/me/events
export const mockUserEvents = [
  {
    id: 1,
    eventTitle: "حملة إعادة تشجير الأمازيغ",
    eventIcon: "🌱",
    eventColor: "bg-green-900/40 border-green-800/40",
    date: "15 أكتوبر 2023",
    location: "جبال الأطلس المتوسط",
    status: "حضرت",
  },
  {
    id: 2,
    eventTitle: "يوم اليتيم",
    eventIcon: "🧒",
    eventColor: "bg-orange-900/40 border-orange-800/40",
    date: "10 سبتمبر 2023",
    location: "وهران",
    status: "حضرت",
  },
  {
    id: 3,
    eventTitle: "قافلة طبية شاملة",
    eventIcon: "🚑",
    eventColor: "bg-red-900/40 border-red-800/40",
    date: "5 أوت 2023",
    location: "تلمسان",
    status: "مسجّل",
  },
];

export default function UserProfilePage() {
  return (
    <div className="font-arabic min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />

      <main className="pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <UserProfileHeader user={mockUser} />
          <UserStatsCards user={mockUser} />
          <UserActivityTabs donations={mockDonations} events={mockUserEvents} />
        </div>
      </main>

      <UserFooter />
    </div>
  );
}
