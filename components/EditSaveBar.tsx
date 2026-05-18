"use client";

import { useEffect, useState } from "react";
import { clearDrafts, getDrafts, saveAllDrafts } from "@/lib/cms";

export default function EditSaveBar() {
  const [editMode, setEditMode] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setEditMode(localStorage.getItem("uniford_admin_edit") === "true");
    setDraftCount(getDrafts().length);
  }

  useEffect(() => {
    refresh();

    window.addEventListener("uniford_cms_drafts_changed", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("uniford_cms_drafts_changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  async function saveEverything() {
    setSaving(true);

    try {
      await saveAllDrafts();
      alert("تم حفظ كل التعديلات بنجاح.");
      window.location.reload();
    } catch {
      alert("تعذر حفظ التعديلات. تأكدي من جدول site_content في Supabase.");
    }

    setSaving(false);
  }

  function cancelChanges() {
    const ok = confirm("هل تريدين إلغاء التعديلات غير المحفوظة؟");

    if (!ok) {
      return;
    }

    clearDrafts();
    window.location.reload();
  }

  function stopEditMode() {
    localStorage.removeItem("uniford_admin_edit");
    clearDrafts();
    window.location.reload();
  }

  if (!editMode) {
    return null;
  }

  return (
    <div
      data-uniford-editor="true"
      className="fixed bottom-5 left-1/2 z-[99999] w-[calc(100%-24px)] max-w-3xl -translate-x-1/2 rounded-3xl bg-[#071b3a] p-4 text-white shadow-2xl"
      onClick={(event) => {
        event.stopPropagation();
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div data-uniford-editor="true" className="flex flex-wrap items-center justify-between gap-3">
        <div data-uniford-editor="true">
          <p data-uniford-editor="true" className="font-black">
            وضع تعديل الموقع مفعل
          </p>

          <p data-uniford-editor="true" className="text-sm text-blue-100">
            التعديلات غير المحفوظة: {draftCount}
          </p>
        </div>

        <div data-uniford-editor="true" className="flex flex-wrap gap-2">
          <button
            data-uniford-editor="true"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              saveEverything();
            }}
            disabled={saving || draftCount === 0}
            className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ كل التعديلات"}
          </button>

          <button
            data-uniford-editor="true"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              cancelChanges();
            }}
            className="rounded-xl bg-orange-500 px-5 py-2 font-bold text-white transition hover:bg-orange-600"
          >
            إلغاء التعديلات
          </button>

          <button
            data-uniford-editor="true"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              stopEditMode();
            }}
            className="rounded-xl bg-white px-5 py-2 font-bold text-[#071b3a] transition hover:bg-slate-100"
          >
            خروج من التعديل
          </button>
        </div>
      </div>
    </div>
  );
}