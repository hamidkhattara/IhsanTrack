import { useState } from "react";
import { Link } from "react-router-dom";
import AssocDashboardNavbar from "../Components/dashboard/AssocDashboardNavbar";
import AssocEditCoverHeader from "../Components/association-profile/AssocEditCoverHeader";
import AssocEditBasicInfo from "../Components/association-profile/AssocEditBasicInfo";
import AssocEditSidebar from "../Components/association-profile/AssocEditSidebar";
import AssocEditLocation from "../Components/association-profile/AssocEditLocation";
import DashboardFooter from "../Components/dashboard/DashboardFooter";

/**
 * AssocEditProfilePage.jsx
 *
 * ROUTE: /dashboard/association/profile
 *
 * ACCESS: Protected — only logged-in associations can access this.
 * Wrap with <ProtectedRoute role="association"> in App.jsx.
 *
 * WHAT THIS PAGE IS:
 * The association's private edit interface for their public profile.
 * Changes here update what visitors see on /associations/:id.
 *
 * PAGE LAYOUT:
 * ┌─────────────────────────────────────────────────────┐
 * │  AssocDashboardNavbar  (fixed top)                  │
 * ├─────────────────────────────────────────────────────┤
 * │  Page header: title + save/cancel buttons           │
 * ├─────────────────────────────────────────────────────┤
 * │  AssocEditCoverHeader  (cover upload + logo + name) │
 * ├────────────────────────┬────────────────────────────┤
 * │  AssocEditSidebar      │  AssocEditBasicInfo         │
 * │  (left/RTL-right):     │  (right/RTL-left):          │
 * │  - Account status      │  - Basic info fields        │
 * │  - Social links        │  - Contact details          │
 * │                        ├────────────────────────────┤
 * │                        │  AssocEditLocation          │
 * │                        │  - Address input            │
 * │                        │  - Map picker               │
 * └────────────────────────┴────────────────────────────┘
 * │  DashboardFooter                                    │
 * └─────────────────────────────────────────────────────┘
 *
 * FORM STATE:
 * All form fields are controlled via a single `formData` state object.
 * On "حفظ التغييرات" → call PATCH /api/associations/:id with formData.
 * On "إلغاء" → reset to original data or navigate(-1).
 */

// Initial form state — in production load from: GET /api/associations/me
const initialFormData = {
  name: "جمعية الأمل الخيرية",
  fullName: "جمعية الأمل الخيرية",
  description:
    "تأسست جمعية الأمل في ربيع 2013 في مدينة وهران، يدفع أعمالها هاجس الدعم الاجتماعي للفئات الهشة؛ انطلقت من فكرة بسيطة: لا يُقيم الله أحداً في يوم القيامة على أساس الكلام الذي قاله، بل على المدى الذي وصل فيه عمله الخيري إلى الآخرين. تعمل الجمعية على تمكين المجتمع من خلال برامج التعليم والصحة والدعم النفسي للأسر المتضررة.",
  email: "contact@alaimal-charity.dz",
  phone: "+213 551 123 456",
  address: "حي التوتي 2، بلوك 7، باب الزوار، الجزائر العاصمة",
  locationNote: "قرب المركز الصحي بابن الجزائر الهاشمي",
  lat: 35.6987,
  lng: -0.6349,
  facebook: "",
  instagram: "",
  website: "https://alaimal-charity.dz",
  coverImage: null,
  logoImage: null,
  profileCompletion: 86,
  accountStatus: "جزائري",
  accountType: "بطاقة التوثيق",
};

export default function AssocEditProfilePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generic field updater — used by all child components via prop
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // In production: await fetch("/api/associations/me", { method: "PATCH", body: JSON.stringify(formData) })
    await new Promise((r) => setTimeout(r, 900)); // simulate API delay
    setSaving(false);
    setSaved(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSaved(false);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-950 text-white" dir="rtl">
      <AssocDashboardNavbar />

      <main className="pt-14">
        {/* ── Page Header ── */}
        <div className="bg-gray-950 border-b border-gray-800/60 sticky top-14 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Title block */}
              <div className="flex items-center gap-3">
                {/* Save / Cancel buttons */}
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all duration-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    saved
                      ? "bg-green-700 text-white border border-green-600"
                      : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : saved ? (
                    "✓ تم الحفظ"
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>

              {/* Title right side */}
              <div className="text-right">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  إدارة ملف الجمعية
                </h1>
                <p className="text-gray-400 text-xs mt-0.5">
                  قم بتحديث معلومات ملفك الشخصي العام والصورة والموقع الجغرافي
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cover + Logo header ── */}
        <AssocEditCoverHeader formData={formData} updateField={updateField} />

        {/* ── Main body ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* SIDEBAR — LEFT column (RTL: right visually) */}
            <div className="lg:col-span-1 lg:order-2 space-y-5">
              <AssocEditSidebar formData={formData} updateField={updateField} />
            </div>

            {/* MAIN PANEL — RIGHT column (RTL: left visually) */}
            <div className="lg:col-span-2 lg:order-1 space-y-5">
              <AssocEditBasicInfo formData={formData} updateField={updateField} />
              <AssocEditLocation formData={formData} updateField={updateField} />
            </div>

          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
