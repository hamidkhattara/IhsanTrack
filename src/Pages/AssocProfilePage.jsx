import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import AssocHeroBanner from "../Components/association-profile/AssocHeroBanner";
import AssocHeader from "../Components/association-profile/AssocHeader";
import AssocStatsBar from "../Components/association-profile/AssocStatsBar";
import AssocAbout from "../Components/association-profile/AssocAbout";
import AssocUpcomingEvents from "../Components/association-profile/AssocUpcomingEvents";
import AssocCampaigns from "../Components/association-profile/AssocCampaigns";
import { useParams } from "react-router-dom";

/**
 * AssocProfilePage.jsx
 *
 * ROUTE: /associations/:id
 * e.g.  /associations/1  → loads جمعية الأمل الخيرية
 *
 * HOW DATA FLOWS:
 * - useParams() gives you the :id from the URL
 * - In production, fetch association data from:
 *     GET /api/associations/:id
 * - For now, mockAssociation is used as placeholder
 *
 * PAGE SECTIONS (top to bottom):
 *   1. Navbar  (global)
 *   2. AssocHeroBanner  — full-width cover image with back button
 *   3. AssocHeader      — logo, name, stats, follow/donate buttons
 *   4. AssocStatsBar    — 4 KPI numbers (followers, projects, volunteers, years)
 *   5. AssocAbout       — map card (left) + "من نحن" text (right)
 *   6. AssocUpcomingEvents — horizontal scrollable event cards
 *   7. AssocCampaigns   — active donation campaigns grid
 *   8. Footer  (global)
 */

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Replace with API call: fetch(`/api/associations/${id}`)
export const mockAssociation = {
  id: 1,
  name: "جمعية الأمل الخيرية",
  tagline: "نحن مستمدة الأمل لنبض الجزائر",
  verified: true,
  category: "خيرية",
  location: "وهران، الجزائر",
  lat: 35.6987,
  lng: -0.6349,
  founded: 2013,
  yearsActive: 12,
  followers: "15K",
  projects: 89,
  volunteers: "350+",
  coverImage: null, // replace with "/images/assoc/cover.jpg"
  logoImage: null,  // replace with "/images/assoc/logo.jpg"
  about: [
    "تأسست جمعية الأمل في ربيع 2013 في مدينة وهران، يدفع أعمالها هاجس الدعم الاجتماعي للفئات الهشة؛ انطلقت من فكرة بسيطة: لا يُقيم الله أحداً في يوم القيامة على أساس الكلام الذي قاله، بل على المدى الذي وصل فيه عمله الخيري إلى الآخرين.",
    "تعمل الجمعية على تمكين المجتمع من خلال برامج التعليم والصحة والدعم النفسي للأسر المتضررة، وشاركت في إنجاز أكثر من 89 مشروع على مستوى ولايات غرب الجزائر.",
    "نسعى من خلال كل مبادرة إلى بناء جسور الثقة بين المتبرعين والمستفيدين، عبر الشفافية الكاملة والمتابعة الميدانية لكل تبرع.",
  ],
  tags: ["تعليم", "صحة", "إغاثة", "رياضة", "بيئة"],
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    website: "https://amal-asso.dz",
  },
  upcomingEvents: [
    {
      id: 1,
      title: "يوم اليتام",
      date: "15 أبريل 2026",
      location: "وهران",
      category: "اجتماعي",
      categoryColor: "bg-orange-500",
      image: null,
      imageEmoji: "🧒",
      badge: "قريباً",
      badgeColor: "bg-yellow-600",
    },
    {
      id: 2,
      title: "طاولة مدرسية",
      date: "22 أبريل 2026",
      location: "سيدي بلعباس",
      category: "تعليم",
      categoryColor: "bg-blue-600",
      image: null,
      imageEmoji: "📐",
      badge: "مفتوح",
      badgeColor: "bg-green-600",
    },
    {
      id: 3,
      title: "القافلة الطبية الشاملة",
      date: "1 مايو 2026",
      location: "تلمسان",
      category: "صحة",
      categoryColor: "bg-red-500",
      image: null,
      imageEmoji: "🚑",
      badge: "قريباً",
      badgeColor: "bg-yellow-600",
    },
  ],
  activeCampaigns: [
    {
      id: 10,
      title: "محفظتي مستقبل",
      description: "توفير الأدوات المدرسية للأطفال المحتاجين في المناطق الريفية",
      raised: 87000,
      goal: 150000,
      donors: 210,
      daysLeft: 18,
      category: "تعليم",
      categoryColor: "bg-blue-600",
      image: null,
      imageEmoji: "🎒",
      urgent: false,
    },
    {
      id: 11,
      title: "دفء الشتاء",
      description: "تأمين ملابس شتوية وبطانيات للأسر المعوزة قبيل فصل الشتاء",
      raised: 134000,
      goal: 200000,
      donors: 398,
      daysLeft: 9,
      category: "إغاثة",
      categoryColor: "bg-orange-600",
      image: null,
      imageEmoji: "🧥",
      urgent: true,
    },
    {
      id: 12,
      title: "قفة رمضان 2023",
      description: "توزيع قفف رمضانية مليئة بالمواد الغذائية على الأسر المحتاجة",
      raised: 210000,
      goal: 210000,
      donors: 640,
      daysLeft: 0,
      category: "غذاء",
      categoryColor: "bg-green-600",
      image: null,
      imageEmoji: "🍱",
      urgent: false,
      completed: true,
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

export default function AssocProfilePage() {
  const { id } = useParams();
  // In production: const assoc = useFetch(`/api/associations/${id}`);
  const assoc = mockAssociation;

  return (
    <div className="font-arabic min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />

      {/* No top padding here — hero banner fills under the navbar */}
      <main className="pt-16">
        <AssocHeroBanner assoc={assoc} />
        <AssocHeader assoc={assoc} />
        <AssocStatsBar assoc={assoc} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
          <AssocAbout assoc={assoc} />
          <AssocUpcomingEvents events={assoc.upcomingEvents} />
          <AssocCampaigns campaigns={assoc.activeCampaigns} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
