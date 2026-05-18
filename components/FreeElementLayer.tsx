"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ContentStyles,
  ContentType,
  SiteContent,
  getDrafts,
  getFreeElements,
  setDraft,
} from "@/lib/cms";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function defaultStyles(type: ContentType, pagePath: string): ContentStyles {
  return {
    pagePath,
    x: 120,
    y: typeof window !== "undefined" ? window.scrollY + 180 : 180,
    width: type === "free_text" ? "220px" : "90px",
    height: type === "free_text" ? "auto" : "90px",
    borderRadius: "18px",
    objectFit: "contain",
    fontSize: type === "free_emoji" ? "48px" : "22px",
    color: "#071b3a",
  };
}

export default function FreeElementLayer() {
  const pathname = usePathname();

  const [editMode, setEditMode] = useState(false);
  const [elements, setElements] = useState<SiteContent[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectedElement = elements.find((item) => item.id === selectedId);

  useEffect(() => {
    async function load() {
      const isEdit = localStorage.getItem("uniford_admin_edit") === "true";
      setEditMode(isEdit);

      const savedElements = await getFreeElements(pathname);
      const drafts = getDrafts().filter(
        (item) => item.styles?.pagePath === pathname && !item.styles?.hidden
      );

      const merged = [...drafts, ...savedElements].filter(
        (item, index, array) => array.findIndex((x) => x.id === item.id) === index
      );

      setElements(merged);
    }

    load();

    function refresh() {
      load();
    }

    window.addEventListener("uniford_cms_drafts_changed", refresh);
    return () => window.removeEventListener("uniford_cms_drafts_changed", refresh);
  }, [pathname]);

  function addElement(type: "free_text" | "free_image" | "free_emoji") {
    const pageKey = encodeURIComponent(pathname);

    const element: SiteContent = {
      id: `free.${pageKey}.${makeId()}`,
      type,
      value:
        type === "free_text"
          ? "نص جديد"
          : type === "free_emoji"
          ? "⭐"
          : "https://uniford.net/wp-content/uploads/2026/03/images-1.jpg",
      styles: defaultStyles(type, pathname),
    };

    setElements((prev) => [element, ...prev]);
    setSelectedId(element.id);
    setDraft(element);
  }

  function updateElement(id: string, update: Partial<SiteContent>) {
    setElements((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const next = {
          ...item,
          ...update,
          styles: {
            ...item.styles,
            ...update.styles,
          },
        };

        setDraft(next);
        return next;
      })
    );
  }

  function hideElement(id: string) {
    const element = elements.find((item) => item.id === id);

    if (!element) {
      return;
    }

    const next = {
      ...element,
      styles: {
        ...element.styles,
        hidden: true,
      },
    };

    setDraft(next);
    setElements((prev) => prev.filter((item) => item.id !== id));
    setSelectedId("");
  }

  function startDrag(
    event: React.PointerEvent<HTMLDivElement>,
    element: SiteContent
  ) {
    if (!editMode) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("[data-no-drag='true']")) {
      return;
    }

    event.preventDefault();

    const x = element.styles?.x || 0;
    const y = element.styles?.y || 0;

    setDraggingId(element.id);
    setSelectedId(element.id);
    setDragOffset({
      x: event.clientX - x,
      y: event.clientY + window.scrollY - y,
    });
  }

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingId) {
      return;
    }

    const x = event.clientX - dragOffset.x;
    const y = event.clientY + window.scrollY - dragOffset.y;

    updateElement(draggingId, {
      styles: {
        x,
        y,
      },
    });
  }

  function stopDrag() {
    setDraggingId("");
  }

  function renderElement(element: SiteContent) {
    const styles = element.styles || {};

    if (element.type === "free_text") {
      return (
        <div
          style={{
            width: styles.width || "220px",
            fontSize: styles.fontSize || "22px",
            color: styles.color || "#071b3a",
          }}
          className="rounded-xl bg-white/70 p-2 font-black shadow-sm backdrop-blur"
        >
          {element.value}
        </div>
      );
    }

    if (element.type === "free_emoji") {
      return (
        <div
          style={{
            fontSize: styles.fontSize || "48px",
            width: styles.width || "90px",
            height: styles.height || "90px",
          }}
          className="flex items-center justify-center"
        >
          {element.value}
        </div>
      );
    }

    return (
      <img
        src={element.value}
        alt="عنصر مضاف"
        style={{
          width: styles.width || "90px",
          height: styles.height || "90px",
          borderRadius: styles.borderRadius || "18px",
          objectFit: styles.objectFit || "contain",
        }}
        className="bg-white/70 p-2 shadow-sm backdrop-blur"
      />
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 z-[80]"
        style={{
          minHeight: "100%",
          pointerEvents: editMode ? "auto" : "none",
        }}
        onPointerMove={onMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            onPointerDown={(event) => startDrag(event, element)}
            className={`absolute ${
              editMode ? "cursor-move" : "pointer-events-none"
            } ${
              selectedId === element.id
                ? "rounded-2xl outline outline-2 outline-blue-500"
                : ""
            }`}
            style={{
              right: "auto",
              left: element.styles?.x || 0,
              top: element.styles?.y || 0,
            }}
          >
            {renderElement(element)}

            {editMode && (
              <button
                data-no-drag="true"
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedId(element.id);
                }}
                className="absolute -top-3 -left-3 rounded-full bg-[#071b3a] px-3 py-1 text-xs font-bold text-white shadow"
              >
                تعديل
              </button>
            )}
          </div>
        ))}
      </div>

      {editMode && (
        <div className="fixed right-5 top-24 z-[999] w-72 rounded-3xl bg-white p-5 text-[#071b3a] shadow-2xl">
          <h2 className="text-xl font-black">إضافة عناصر</h2>

          <div className="mt-4 grid gap-2">
            <button
              onClick={() => addElement("free_text")}
              className="rounded-xl bg-[#071b3a] py-3 font-bold text-white"
            >
              إضافة نص
            </button>

            <button
              onClick={() => addElement("free_image")}
              className="rounded-xl bg-blue-600 py-3 font-bold text-white"
            >
              إضافة صورة
            </button>

            <button
              onClick={() => addElement("free_emoji")}
              className="rounded-xl bg-orange-500 py-3 font-bold text-white"
            >
              إضافة إيموجي
            </button>
          </div>

          {selectedElement && (
            <div className="mt-5 border-t pt-5">
              <h3 className="font-black">تعديل العنصر المحدد</h3>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-bold">
                    النص / الرابط / الإيموجي
                  </label>

                  <textarea
                    value={selectedElement.value}
                    onChange={(event) =>
                      updateElement(selectedElement.id, {
                        value: event.target.value,
                      })
                    }
                    rows={3}
                    className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold">العرض</label>
                    <input
                      dir="ltr"
                      value={selectedElement.styles?.width || ""}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: { width: event.target.value },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-left text-black outline-none"
                      placeholder="120px"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold">الارتفاع</label>
                    <input
                      dir="ltr"
                      value={selectedElement.styles?.height || ""}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: { height: event.target.value },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-left text-black outline-none"
                      placeholder="120px"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold">حجم الخط</label>
                    <input
                      dir="ltr"
                      value={selectedElement.styles?.fontSize || ""}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: { fontSize: event.target.value },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-left text-black outline-none"
                      placeholder="24px"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold">اللون</label>
                    <input
                      dir="ltr"
                      value={selectedElement.styles?.color || ""}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: { color: event.target.value },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-left text-black outline-none"
                      placeholder="#071b3a"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold">الزوايا</label>
                    <input
                      dir="ltr"
                      value={selectedElement.styles?.borderRadius || ""}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: { borderRadius: event.target.value },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-left text-black outline-none"
                      placeholder="16px"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold">عرض الصورة</label>
                    <select
                      value={selectedElement.styles?.objectFit || "contain"}
                      onChange={(event) =>
                        updateElement(selectedElement.id, {
                          styles: {
                            objectFit: event.target.value as "contain" | "cover",
                          },
                        })
                      }
                      className="w-full rounded-xl border bg-slate-50 px-3 py-2 text-black outline-none"
                    >
                      <option value="contain">كاملة</option>
                      <option value="cover">تملأ</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => hideElement(selectedElement.id)}
                  className="w-full rounded-xl bg-red-600 py-3 font-bold text-white"
                >
                  حذف العنصر
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs leading-6 text-slate-500">
            اسحبي أي عنصر بالماوس لتحريكه، وبعد الانتهاء اضغطي حفظ كل التعديلات من الشريط السفلي.
          </p>
        </div>
      )}
    </>
  );
}