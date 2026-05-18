"use client";

import { useEffect, useState } from "react";
import { ContentStyles, getContent, setDraft } from "@/lib/cms";

type Props = {
  id: string;
  defaultSrc: string;
  alt: string;
  defaultStyles?: ContentStyles;
};

export default function EditableImage({
  id,
  defaultSrc,
  alt,
  defaultStyles,
}: Props) {
  const [src, setSrc] = useState(defaultSrc);
  const [draftSrc, setDraftSrc] = useState(defaultSrc);

  const [styles, setStyles] = useState<ContentStyles>({
    width: defaultStyles?.width || "64px",
    height: defaultStyles?.height || "64px",
    borderRadius: defaultStyles?.borderRadius || "16px",
    objectFit: defaultStyles?.objectFit || "contain",
  });

  const [draftStyles, setDraftStyles] = useState<ContentStyles>({
    width: defaultStyles?.width || "64px",
    height: defaultStyles?.height || "64px",
    borderRadius: defaultStyles?.borderRadius || "16px",
    objectFit: defaultStyles?.objectFit || "contain",
  });

  const [isAdminEdit, setIsAdminEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setIsAdminEdit(localStorage.getItem("uniford_admin_edit") === "true");

    async function load() {
      const content = await getContent(id, defaultSrc);

      const loadedStyles = {
        width: defaultStyles?.width || "64px",
        height: defaultStyles?.height || "64px",
        borderRadius: defaultStyles?.borderRadius || "16px",
        objectFit: defaultStyles?.objectFit || "contain",
        ...content.styles,
      };

      setSrc(content.value);
      setDraftSrc(content.value);
      setStyles(loadedStyles);
      setDraftStyles(loadedStyles);
    }

    load();
  }, [id, defaultSrc, defaultStyles?.width, defaultStyles?.height, defaultStyles?.borderRadius, defaultStyles?.objectFit]);

  function applyChange() {
    if (!draftSrc.trim()) {
      alert("رابط الصورة لا يمكن أن يكون فارغًا.");
      return;
    }

    setSrc(draftSrc.trim());
    setStyles(draftStyles);
    setChanged(true);

    setDraft({
      id,
      type: "image",
      value: draftSrc.trim(),
      styles: draftStyles,
    });

    setOpen(false);
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        style={{
          width: styles.width,
          height: styles.height,
          borderRadius: styles.borderRadius,
          objectFit: styles.objectFit,
        }}
        className="bg-blue-50 p-2"
      />

      {isAdminEdit && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDraftSrc(src);
              setDraftStyles(styles);
              setOpen(true);
            }}
            className="absolute -left-3 -top-3 rounded-full bg-[#071b3a] px-3 py-1 text-xs font-bold text-white shadow-lg"
          >
            تعديل
          </button>

          {changed && (
            <span className="absolute -bottom-5 right-0 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
              غير محفوظ
            </span>
          )}
        </>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            dir="rtl"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-[#071b3a] shadow-2xl"
          >
            <h2 className="text-2xl font-black">تعديل الصورة</h2>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              ضع رابط الصورة، ثم عدّل المقاس والزوايا، وبعدها اضغط موافق.
              للحفظ النهائي اضغط زر حفظ كل التعديلات أسفل الصفحة.
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block font-bold">رابط الصورة</label>
                <input
                  dir="ltr"
                  value={draftSrc}
                  onChange={(e) => setDraftSrc(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block font-bold">العرض</label>
                  <input
                    dir="ltr"
                    value={draftStyles.width || ""}
                    onChange={(e) =>
                      setDraftStyles((prev) => ({
                        ...prev,
                        width: e.target.value,
                      }))
                    }
                    placeholder="64px"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">الارتفاع</label>
                  <input
                    dir="ltr"
                    value={draftStyles.height || ""}
                    onChange={(e) =>
                      setDraftStyles((prev) => ({
                        ...prev,
                        height: e.target.value,
                      }))
                    }
                    placeholder="64px"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">الزوايا</label>
                  <input
                    dir="ltr"
                    value={draftStyles.borderRadius || ""}
                    onChange={(e) =>
                      setDraftStyles((prev) => ({
                        ...prev,
                        borderRadius: e.target.value,
                      }))
                    }
                    placeholder="16px"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-bold">طريقة عرض الصورة</label>
                <select
                  value={draftStyles.objectFit || "contain"}
                  onChange={(e) =>
                    setDraftStyles((prev) => ({
                      ...prev,
                      objectFit: e.target.value as "contain" | "cover",
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="contain">تظهر كاملة</option>
                  <option value="cover">تملأ المكان</option>
                </select>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="mb-3 font-bold text-slate-600">معاينة الصورة</p>

                <img
                  src={draftSrc}
                  alt={alt}
                  style={{
                    width: draftStyles.width,
                    height: draftStyles.height,
                    borderRadius: draftStyles.borderRadius,
                    objectFit: draftStyles.objectFit,
                  }}
                  className="mx-auto bg-white p-2 shadow-sm"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={applyChange}
                  className="flex-1 rounded-xl bg-[#071b3a] px-8 py-3 font-black text-white"
                >
                  موافق
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-slate-200 px-8 py-3 font-bold text-[#071b3a]"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}