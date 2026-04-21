import { useState } from "react";
import AssocDashboardNavbar from "../Components/dashboard/AssocDashboardNavbar";
import DashboardFooter from "../Components/dashboard/DashboardFooter";
import CampaignsDashboardStats from "../Components/dashboard/CampaignsDashboardStats";
import CreateCampaignForm from "../Components/dashboard/CreateCampaignForm";
import CampaignsTable from "../Components/dashboard/CampaignsTable";

/**
 * AssocCampaignsDashboardPage.jsx
 *
 * ROUTE: /dashboard/association/campaigns
 *
 * ACCESS: Protected — association accounts only.
 * Wrap with <ProtectedRoute role="association"> in App.jsx.
 *
 * PURPOSE:
 * The association's campaign management interface. Allows them to:
 *   1. View overall donation stats (total raised, active campaigns, donor count)
 *   2. Create a new campaign via inline form
 *   3. View, filter, and manage all their campaigns in a table
 *
 * PAGE LAYOUT (top to bottom):
 * ┌────────────────────────────────────────────────┐
 * │  AssocDashboardNavbar  (إدارة الحملات active)  │
 * ├────────────────────────────────────────────────┤
 * │  Page header: title + export + create buttons  │
 * ├────────────────────────────────────────────────┤
 * │  CampaignsDashboardStats  (3 KPI cards)        │
 * ├────────────────────────────────────────────────┤
 * │  CreateCampaignForm  (بيانات الحملة الجديدة)  │
 * ├────────────────────────────────────────────────┤
 * │  CampaignsTable  (آخر الحملات)                 │
 * ├────────────────────────────────────────────────┤
 * │  DashboardFooter                               │
 * └────────────────────────────────────────────────┘
 *
 * STATE:
 * - showCreateForm: toggles visibility of the create campaign form
 * - campaigns: list of campaigns (mock → replace with API)
 * Adding a new campaign via the form prepends it to the campaigns list.
 */

// ── Mock campaigns data ──────────────────────────────────────────────────────
// Replace with: GET /api/associations/me/campaigns
const mockCampaigns = [
  {
    id: 1,
    title: "قفة رمضان 2024",
    image: null,
    imageEmoji: "🍱",
    donors: 45,
    raised: 350000,
    goal: 500000,
    progress: 70,
    status: "نشطة",
    statusColor: "green",
    createdAt: "قبل 45 يوم",
  },
  {
    id: 2,
    title: "حقيبة مدرسية للأيتام",
    image: null,
    imageEmoji: "🎒",
    donors: 124,
    raised: 450000,
    goal: 700000,
    progress: 64,
    status: "انتظار",
    statusColor: "yellow",
    createdAt: "قبل 12 يوم",
  },
  {
    id: 3,
    title: "كسوة الشتاء",
    image: null,
    imageEmoji: "🧥",
    donors: 6,
    raised: 800000,
    goal: 800000,
    progress: 100,
    status: "مكتملة",
    statusColor: "blue",
    createdAt: "قبل 3 أيام",
  },
];

export default function AssocCampaignsDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  // Called when CreateCampaignForm submits successfully
  const handleCampaignCreated = (newCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowCreateForm(false);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-950 text-white" dir="rtl">
      <AssocDashboardNavbar activeTab="/dashboard/association/campaigns" />

      <main className="pt-14">

        {/* ── Page Header ── */}
        <div className="bg-gray-950 border-b border-gray-800/60 sticky top-14 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">

              {/* Left: action buttons */}
              <div className="flex items-center gap-2">
                {/* Export report */}
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all duration-200">
                  <span>📊</span>
                  تصدير التقرير
                </button>
                {/* Create new campaign */}
                <button
                  onClick={() => setShowCreateForm((v) => !v)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40"
                >
                  <span className="text-base leading-none">+</span>
                  إنشاء حملة جديدة
                </button>
              </div>

              {/* Right: title */}
              <div className="text-right">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  إدارة التبرعات الخيرية
                </h1>
                <p className="text-gray-400 text-xs mt-0.5">
                  قم بإنشاء وتفعيل ومراقبة حملات تبرع الخاصة بك
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <CampaignsDashboardStats />

          {/* Create campaign form (toggle) */}
          {showCreateForm && (
            <CreateCampaignForm
              onCreated={handleCampaignCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          <CampaignsTable campaigns={campaigns} setCampaigns={setCampaigns} />
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
