import { useState } from "react";
import { Link } from "react-router-dom";
import DonationModal from "./DonationModal";

/**
 * FeaturedCampaigns.jsx  (updated)
 *
 * USED ON: HomePage only
 *
 * KEY CHANGE: "تبرع الآن" button on each card now opens DonationModal
 * instead of navigating to /campaigns/:id.
 * The modal handles the full donation flow inline.
 *
 * HOW IT CONNECTS:
 *   selectedCampaign === null  → modal hidden
 *   selectedCampaign === obj   → DonationModal renders with that campaign
 *   onClose()                  → resets selectedCampaign to null
 */

const mockCampaigns = [
  {
    id: 1,
    title: "سقيا الماء للأسر المحتاجة",
    association: "جمعية الرحمة",
    assocId: 1,
    category: "صحة",
    categoryColor: "bg-red-600",
    raised: 50000,
    goal: 100000,
    donors: 124,
    daysLeft: 12,
    urgent: true,
    image: null,
    imageEmoji: "💧",
    description:
      "يهدف هذا المشروع إلى حفر آبار ارتوازية وتوصيل شبكات المياه للمناطق التي تعاني من الجفاف في ولايات الجنوب والداخل الجزائري. نسعى لتوفير مياه مستدامة ونظيفة لمئات العائلات التي تقطع مسافات طويلة للحصول على الماء. مساهمتكم تضمن حياة كريمة وصحة أفضل للأطفال وكبار السن.",
    recentDonors: [
      { id: 1, name: "أحمد محمد",       amount: 1000, timeAgo: "منذ 5 دقائق",  avatar: "أ", anonymous: false },
      { id: 2, name: "متبرع فاعل خير",  amount: 2500, timeAgo: "منذ 12 دقيقة", avatar: "م", anonymous: true  },
    ],
  },
  {
    id: 2,
    title: "شفاء طبي للأطفال",
    association: "مؤسسة الأمل",
    assocId: 2,
    category: "أطفال",
    categoryColor: "bg-blue-600",
    raised: 87000,
    goal: 200000,
    donors: 198,
    daysLeft: 8,
    urgent: true,
    image: null,
    imageEmoji: "👶",
    description:
      "توفير العلاج الطبي والدعم النفسي للأطفال المصابين بأمراض مزمنة في المستشفيات العمومية، وتأمين الأدوية اللازمة للعائلات التي لا تستطيع تحمل تكاليف العلاج.",
    recentDonors: [
      { id: 1, name: "فاطمة الزهراء", amount: 3000, timeAgo: "منذ 8 دقائق",  avatar: "ف", anonymous: false },
      { id: 2, name: "متبرع كريم",     amount: 500,  timeAgo: "منذ 20 دقيقة", avatar: "م", anonymous: true  },
    ],
  },
  {
    id: 3,
    title: "حقيبة مدرسية للطلاب",
    association: "جمعية التعليم",
    assocId: 3,
    category: "تعليم",
    categoryColor: "bg-yellow-600",
    raised: 210000,
    goal: 250000,
    donors: 540,
    daysLeft: 5,
    urgent: false,
    image: null,
    imageEmoji: "📚",
    description:
      "توفير الأدوات والمستلزمات المدرسية لأكثر من 500 طالب في المناطق النائية، لضمان حقهم في التعليم دون عوائق مادية.",
    recentDonors: [
      { id: 1, name: "يوسف مرابط", amount: 1500, timeAgo: "منذ 3 دقائق",  avatar: "ي", anonymous: false },
      { id: 2, name: "نور الهدى",  amount: 2000, timeAgo: "منذ 15 دقيقة", avatar: "ن", anonymous: false },
    ],
  },
];

export default function FeaturedCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  return (
    <section className="py-16 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <Link to="/campaigns" className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1 transition-colors">
            ← عرض جميع الحملات
          </Link>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">حملات عاجلة</h2>
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm">حملات تحتاج دعمك الآن</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonate={() => setSelectedCampaign(campaign)}
            />
          ))}
        </div>
      </div>

      <DonationModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </section>
  );
}

function CampaignCard({ campaign, onDonate }) {
  const progressPercent = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-green-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-950/40 group">
      <div className="relative h-44 bg-gradient-to-br from-green-950 to-gray-800 flex items-center justify-center overflow-hidden">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">{campaign.imageEmoji}</span>
        )}
        {campaign.urgent && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />عاجل
          </div>
        )}
        <div className={`absolute top-3 left-3 ${campaign.categoryColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
          {campaign.category}
        </div>
      </div>

      <div className="p-5 text-right">
        <Link to={`/associations/${campaign.assocId}`} className="text-green-400 text-xs font-medium hover:text-green-300 transition-colors mb-2 block">
          {campaign.association}
        </Link>
        <h3 className="text-white font-bold text-base mb-4 leading-snug line-clamp-2 group-hover:text-green-100 transition-colors">
          {campaign.title}
        </h3>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="text-green-400 font-semibold">{progressPercent}%</span>
            <span>{campaign.raised.toLocaleString("ar-DZ")} دج / {campaign.goal.toLocaleString("ar-DZ")} دج</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-l from-green-500 to-green-700 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="text-yellow-400 font-medium">⏳ {campaign.daysLeft} أيام متبقية</span>
          <span>👥 {campaign.donors} متبرع</span>
        </div>
        <button
          onClick={onDonate}
          className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-900/40"
        >
          تبرع الآن
        </button>
      </div>
    </div>
  );
}
