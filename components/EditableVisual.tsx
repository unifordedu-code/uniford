"use client";

import { useEffect, useState } from "react";
import { ContentStyles, getContent, setDraft } from "@/lib/cms";

type Props = {
  id: string;
  defaultValue: string;
  defaultMode?: "emoji" | "image";
  alt?: string;
  defaultStyles?: ContentStyles;
};

export default function EditableVisual({
  id,
  defaultValue,
  defaultMode = "emoji",
  alt = "عنصر",
  defaultStyles,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"emoji" | "image">(defaultMode);
  const [styles, setStyles] = useState<ContentStyles>({
    width: defaultStyles?.width || "40px",
    height: defaultStyles?.height || "40px",
    borderRadius: defaultStyles?.borderRadius || "12px",
    objectFit: defaultStyles?.objectFit || "contain",
    fontSize: defaultStyles?.fontSize || "28px",
  });

  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEditMode(localStorage.getItem("uniford_admin_edit") === "true");

    async function load() {
      const content = await getContent(id, defaultValue);
      setValue(content.value);
      setStyles((prev) => ({
        ...prev,
        ...content.styles,
      }));

      if (content.styles?.objectFit || content.value.startsWith("http")) {
        setMode("image");
      }
    }

    load();
  }, [id, defaultValue]);

  function applyChange() {
    setDraft({
      id,
      type: mode === "image" ? "image" : "text",
      value,
      styles: {
        ...styles,
        objectFit: mode === "image" ? styles.objectFit || "contain" : undefined,
      },
    });

    setOpen(false);
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      {mode === "image" ? (
        <img
          src={value}
          alt={alt}
          style={{
            width: styles.width,
            height: styles.height,
            borderRadius: styles.borderRadius,
            objectFit: styles.objectFit,
          }}
        />
      ) : (
        <span style={{ fontSize: styles.fontSize }}>{value}</span>
      )}

      {editMode && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
          className="absolute -left-3 -top-3 rounded-full bg-[#071b3a] px-2 py-1 text-[10px] font-bold text-white"
        >
          تعديل
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-[#071b3a] shadow-2xl">
            <h2 className="text-2xl font-black">تعديل الشكل</h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block font-bold">النوع</label>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as "emoji" | "image")}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black"
                >
                  <option value="emoji">إيموجي</option>
                  <option value="image">صورة من رابط</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  {mode === "image" ? "رابط الصورة" : "الإيموجي"}
                </label>
                <input
                  dir={mode === "image" ? "ltr" : "rtl"}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <input
                  dir="ltr"
                  value={styles.width || ""}
                  onChange={(event) =>
                    setStyles((prev) => ({ ...prev, width: event.target.value }))
                  }
                  placeholder="العرض 40px"
                  className="rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                />

                <input
                  dir="ltr"
                  value={styles.height || ""}
                  onChange={(event) =>
                    setStyles((prev) => ({ ...prev, height: event.target.value }))
                  }
                  placeholder="الارتفاع 40px"
                  className="rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                />

                <input
                  dir="ltr"
                  value={styles.fontSize || ""}
                  onChange={(event) =>
                    setStyles((prev) => ({ ...prev, fontSize: event.target.value }))
                  }
                  placeholder="حجم الإيموجي 28px"
                  className="rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                />

                <input
                  dir="ltr"
                  value={styles.borderRadius || ""}
                  onChange={(event) =>
                    setStyles((prev) => ({
                      ...prev,
                      borderRadius: event.target.value,
                    }))
                  }
                  placeholder="الزوايا 12px"
                  className="rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                />

                <select
                  value={styles.objectFit || "contain"}
                  onChange={(event) =>
                    setStyles((prev) => ({
                      ...prev,
                      objectFit: event.target.value as "contain" | "cover",
                    }))
                  }
                  className="rounded-xl border bg-slate-50 px-4 py-3 text-black"
                >
                  <option value="contain">الصورة كاملة</option>
                  <option value="cover">تملأ المكان</option>
                </select>
              </div>

              <button
                type="button"
                onClick={applyChange}
                className="w-full rounded-xl bg-[#071b3a] py-3 font-black text-white"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}