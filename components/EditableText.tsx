"use client";

import { useEffect, useState } from "react";
import { ContentStyles, getContent, setDraft } from "@/lib/cms";

type Props = {
  id: string;
  defaultValue: string;
  className?: string;
};

function isImageUrl(value: string) {
  const text = value.trim().toLowerCase();

  return (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("/")
  );
}

export default function EditableText({ id, defaultValue, className }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [draftValue, setDraftValue] = useState(defaultValue);

  const [styles, setStyles] = useState<ContentStyles>({
    width: "120px",
    height: "120px",
    borderRadius: "16px",
    objectFit: "contain",
  });

  const [draftStyles, setDraftStyles] = useState<ContentStyles>({
    width: "120px",
    height: "120px",
    borderRadius: "16px",
    objectFit: "contain",
  });

  const [isAdminEdit, setIsAdminEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setIsAdminEdit(localStorage.getItem("uniford_admin_edit") === "true");

    async function load() {
      const content = await getContent(id, defaultValue);

      setValue(content.value);
      setDraftValue(content.value);

      const loadedStyles: ContentStyles = {
        width: "120px",
        height: "120px",
        borderRadius: "16px",
        objectFit: "contain",
        ...content.styles,
      };

      setStyles(loadedStyles);
      setDraftStyles(loadedStyles);
    }

    load();
  }, [id, defaultValue]);

  function applyChange() {
    const nextValue = draftValue.trim();

    setValue(nextValue);
    setStyles(draftStyles);
    setChanged(true);

    setDraft({
      id,
      type: isImageUrl(nextValue) ? "image" : "text",
      value: nextValue,
      styles: isImageUrl(nextValue) ? draftStyles : {},
    });

    setOpen(false);
  }

  function renderValue() {
    if (!value.trim()) {
      return null;
    }

    if (isImageUrl(value)) {
      return (
        <img
          src={value}
          alt="صورة"
          style={{
            width: styles.width || "120px",
            height: styles.height || "120px",
            borderRadius: styles.borderRadius || "16px",
            objectFit: styles.objectFit || "contain",
          }}
          className="inline-block bg-white/70 p-2 shadow-sm"
        />
      );
    }

    return <span className={className}>{value}</span>;
  }

  if (!isAdminEdit) {
    return <>{renderValue()}</>;
  }

  return (
    <span className="relative inline-flex items-center gap-2">
      {renderValue()}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDraftValue(value);
          setDraftStyles(styles);
          setOpen(true);
        }}
        className="inline-flex rounded-md bg-[#071b3a] px-2 py-1 text-xs font-bold text-white shadow"
      >
        تعديل
      </button>

      {changed && (
        <span className="rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
          غير محفوظ
        </span>
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
            <h2 className="text-2xl font-black">تعديل النص</h2>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              اكتبي النص الجديد. ولو حطيتي رابط صورة، بيتحول العنصر لصورة.
              تقدري كمان تتركيه فارغ عشان ينحذف من الصفحة.
            </p>

            <textarea
              dir="rtl"
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              rows={6}
              className="mt-5 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-right text-lg font-bold leading-9 text-black outline-none transition focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
              placeholder="اكتبي النص أو رابط صورة"
            />

            {isImageUrl(draftValue) && draftValue.trim() && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black">إعدادات الصورة</h3>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
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
                      placeholder="120px"
                      className="w-full rounded-xl border bg-white px-4 py-3 text-left text-black outline-none"
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
                      placeholder="120px"
                      className="w-full rounded-xl border bg-white px-4 py-3 text-left text-black outline-none"
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
                      className="w-full rounded-xl border bg-white px-4 py-3 text-left text-black outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block font-bold">طريقة عرض الصورة</label>
                  <select
                    value={draftStyles.objectFit || "contain"}
                    onChange={(e) =>
                      setDraftStyles((prev) => ({
                        ...prev,
                        objectFit: e.target.value as "contain" | "cover",
                      }))
                    }
                    className="w-full rounded-xl border bg-white px-4 py-3 text-black outline-none"
                  >
                    <option value="contain">تظهر كاملة</option>
                    <option value="cover">تملأ المكان</option>
                  </select>
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4 text-center">
                  <p className="mb-3 font-bold text-slate-500">معاينة</p>

                  <img
                    src={draftValue}
                    alt="معاينة"
                    style={{
                      width: draftStyles.width || "120px",
                      height: draftStyles.height || "120px",
                      borderRadius: draftStyles.borderRadius || "16px",
                      objectFit: draftStyles.objectFit || "contain",
                    }}
                    className="mx-auto bg-white p-2 shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={applyChange}
                className="rounded-xl bg-[#071b3a] px-8 py-3 font-black text-white"
              >
                تطبيق التعديل
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
      )}
    </span>
  );
}