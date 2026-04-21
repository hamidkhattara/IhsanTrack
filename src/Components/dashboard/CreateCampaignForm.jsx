import { useState, useRef } from "react";

/**
 * CreateCampaignForm.jsx
 *
 * USED ON: AssocCampaignsDashboardPage (toggled by "+ إنشاء حملة جديدة" button)
 *
 * CONTAINS:
 * Card: "بيانات الحملة الجديدة"
 *
 * TWO-COLUMN layout (matches screenshot):
 *
 * LEFT column — صورة الغلاف:
 *   - Dashed upload zone (click or drag)
 *   - Preview image once selected
 *   - "اضغط لرفع صورة" hint text
 *   - "PNG, JPG" format hint
 *
 * RIGHT column — Form fields:
 *   - عنوان الحملة*      → text input
 *   - المبلغ المستهدف (دج)* → number input
 *   - وصف الحملة         → textarea (3 rows)
 *
 * Bottom: يلم الحملة (Submit green btn) + إلغاء (ghost btn)
 *
 * SUBMIT BEHAVIOR:
 * - Validates required fields
 * - Shows spinner on submit
 * - Calls onCreated(newCampaign) with new campaign object
 * - In production: POST /api/associations/me/campaigns
 *
 * Props:
 *   onCreated(campaign) — called after successful creation
 *   onCancel()          — called when user clicks إلغاء
 */

const EMPTY_FORM = {
  title: "",
  goal: "",
  description: "",
  coverImage: null,
};

export default function CreateCampaignForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => update("coverImage", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "عنوان الحملة مطلوب";
    if (!form.goal || Number(form.goal) <= 0) errs.goal = "المبلغ المستهدف يجب أن يكون أكبر من 0";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    // In production: await fetch("/api/associations/me/campaigns", { method:"POST", body: JSON.stringify(form) })
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);

    const newCampaign = {
      id: Date.now(),
      title: form.title,
      image: form.coverImage,
      imageEmoji: "🌟",
      donors: 0,
      raised: 0,
      goal: Number(form.goal),
      progress: 0,
      status: "انتظار",
      statusColor: "yellow",
      createdAt: "الآن",
    };

    setForm(EMPTY_FORM);
    onCreated(newCampaign);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

      {/* Card header */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-gray-800">
        <h3 className="text-white font-bold text-base">بيانات الحملة الجديدة</h3>
        <span className="text-green-400 text-lg">✏️</span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT — Cover image upload */}
          <div className="md:col-span-1">
            <p className="text-sm font-semibold text-gray-200 text-right mb-2">صورة الغلاف</p>
            <div
              className={`relative h-52 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center overflow-hidden
                ${dragOver ? "border-green-500 bg-green-900/20" : "border-gray-700 hover:border-green-600 bg-gray-800/50"}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              aria-label="رفع صورة الغلاف"
            >
              {form.coverImage ? (
                <>
                  <img src={form.coverImage} alt="غلاف" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">تغيير الصورة</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-700 border border-gray-600 flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">اضغط لرفع صورة</p>
                  <p className="text-gray-500 text-xs">أو اسحب وأفلت الملف هنا</p>
                  <p className="text-gray-600 text-xs">PNG, JPG — حتى 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
          </div>

          {/* RIGHT — Form fields */}
          <div className="md:col-span-2 space-y-4 text-right">

            {/* عنوان الحملة */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-200">
                عنوان الحملة<span className="text-green-400 mr-1">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="مثال: قفة رمضان 2025"
                className={inputCls(errors.title)}
                dir="rtl"
              />
              {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
            </div>

            {/* المبلغ المستهدف */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-200">
                المبلغ المستهدف (دج)<span className="text-green-400 mr-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  placeholder="0.00"
                  className={`${inputCls(errors.goal)} pl-14 text-left`}
                  dir="ltr"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">دج</span>
              </div>
              {errors.goal && <p className="text-red-400 text-xs">{errors.goal}</p>}
            </div>

            {/* وصف الحملة */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-200">وصف الحملة</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="اكتب وصفاً مختصراً لأهداف الحملة وأهدافها..."
                rows={4}
                className={`${inputCls()} resize-none leading-relaxed`}
                dir="rtl"
              />
            </div>

          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 justify-start mt-6 pt-5 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all duration-200"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              "✓ يلم الحملة"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = (hasError) =>
  `w-full bg-gray-800 border ${
    hasError ? "border-red-500 focus:border-red-400" : "border-gray-700 hover:border-gray-600 focus:border-green-500"
  } focus:ring-1 focus:ring-green-500/30 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 outline-none transition-all duration-200`;
