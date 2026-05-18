"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ContentStyles,
  SiteContent,
  getDomEdits,
  makePageKey,
  setDraft,
} from "@/lib/cms";

type SelectedData = {
  id: string;
  path: string;
  element: HTMLElement;
  value: string;
  mode: "text" | "image";
  styles: ContentStyles;
};

function isImageUrl(value: string) {
  const text = value.trim().toLowerCase();

  return (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("/")
  );
}

function isIgnoredElement(element: HTMLElement) {
  return !!element.closest(
    "[data-uniford-editor='true'], script, style, input, textarea, select"
  );
}

function getElementPath(element: HTMLElement) {
  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    const parentElement: HTMLElement | null = current.parentElement;

    if (!parentElement) {
      break;
    }

    const childrenArray: Element[] = Array.from(parentElement.children);

    const sameTagSiblings: Element[] = childrenArray.filter(
      (item: Element) => item.tagName === current?.tagName
    );

    const index = sameTagSiblings.indexOf(current);
    parts.unshift(`${current.tagName.toLowerCase()}-${index}`);

    current = parentElement;
  }

  return parts.join(".");
}

function findElementByPath(path: string) {
  const parts = path.split(".");
  let current: Element | null = document.body;

  for (const part of parts) {
    const [tag, indexText] = part.split("-");
    const index = Number(indexText);

    if (!current || Number.isNaN(index)) {
      return null;
    }

    const childrenArray: Element[] = Array.from(current.children);

    const sameTagChildren: Element[] = childrenArray.filter(
      (item: Element) => item.tagName.toLowerCase() === tag
    );

    current = sameTagChildren[index] || null;
  }

  return current as HTMLElement | null;
}

function getEditableTarget(rawTarget: HTMLElement) {
  if (isIgnoredElement(rawTarget)) {
    return null;
  }

  if (rawTarget.tagName.toLowerCase() === "img") {
    return rawTarget;
  }

  const imageInside = rawTarget.querySelector("img");

  if (imageInside && rawTarget.children.length === 1) {
    return imageInside as HTMLElement;
  }

  let target: HTMLElement | null = rawTarget;

  while (target && target !== document.body) {
    if (isIgnoredElement(target)) {
      return null;
    }

    const tag = target.tagName.toLowerCase();

    if (
      [
        "p",
        "span",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "button",
        "a",
        "label",
        "li",
        "div",
      ].includes(tag)
    ) {
      const text = target.textContent || "";
      const hasNoChildren = target.children.length === 0;
      const hasSimpleText = hasNoChildren && text.trim().length > 0;

      if (hasSimpleText) {
        return target;
      }
    }

    target = target.parentElement;
  }

  return null;
}

function applyEditToElement(
  element: HTMLElement,
  value: string,
  styles: ContentStyles,
  mode?: "text" | "image"
) {
  const shouldBeImage = mode === "image" || isImageUrl(value);

  element.setAttribute("data-uniford-edited", "true");
  element.style.display = element.style.display || "inline-block";
  element.style.position = element.style.position || "relative";
  element.style.transform = `translate(${styles.x || 0}px, ${
    styles.y || 0
  }px)`;

  if (styles.color) {
    element.style.color = styles.color;
  }

  if (styles.fontSize) {
    element.style.fontSize = styles.fontSize;
  }

  if (shouldBeImage) {
    if (element.tagName.toLowerCase() === "img") {
      const img = element as HTMLImageElement;

      img.src = value;
      img.style.width = styles.width || img.style.width || "80px";
      img.style.height = styles.height || img.style.height || "80px";
      img.style.borderRadius = styles.borderRadius || "12px";
      img.style.objectFit = styles.objectFit || "contain";

      return;
    }

    element.innerHTML = "";

    if (value.trim()) {
      const img = document.createElement("img");

      img.src = value;
      img.alt = "صورة";
      img.style.width = styles.width || "80px";
      img.style.height = styles.height || "80px";
      img.style.borderRadius = styles.borderRadius || "12px";
      img.style.objectFit = styles.objectFit || "contain";
      img.style.display = "inline-block";
      img.style.background = "white";
      img.style.padding = "4px";

      element.appendChild(img);
    }

    return;
  }

  element.textContent = value;
}

export default function UniversalEditor() {
  const pathname = usePathname();

  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<SelectedData | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [draftMode, setDraftMode] = useState<"text" | "image">("text");
  const [draftStyles, setDraftStyles] = useState<ContentStyles>({
    width: "80px",
    height: "80px",
    borderRadius: "12px",
    objectFit: "contain",
    fontSize: "",
    color: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function refreshMode() {
      const isEdit = localStorage.getItem("uniford_admin_edit") === "true";
      setEditMode(isEdit);
    }

    refreshMode();

    window.addEventListener("storage", refreshMode);
    window.addEventListener("uniford_cms_drafts_changed", refreshMode);

    return () => {
      window.removeEventListener("storage", refreshMode);
      window.removeEventListener("uniford_cms_drafts_changed", refreshMode);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;

    async function applySavedEdits() {
      const edits = await getDomEdits(pathname);

      if (cancelled) {
        return;
      }

      edits.forEach((edit) => {
        const prefix = `dom.${makePageKey(pathname)}.`;
        const path = edit.id.replace(prefix, "");
        const element = findElementByPath(path);

        if (element) {
          applyEditToElement(
            element,
            edit.value,
            edit.styles || {},
            edit.type === "image" ? "image" : "text"
          );
        }
      });
    }

    applySavedEdits();

    const timers = [
      window.setTimeout(applySavedEdits, 300),
      window.setTimeout(applySavedEdits, 800),
      window.setTimeout(applySavedEdits, 1500),
      window.setTimeout(applySavedEdits, 2500),
    ];

    observer = new MutationObserver(() => {
      applySavedEdits();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));

      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!editMode) {
      return;
    }

    function handleClick(event: MouseEvent) {
      const rawTarget = event.target as HTMLElement;
      const target = getEditableTarget(rawTarget);

      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const path = getElementPath(target);
      const id = `dom.${makePageKey(pathname)}.${path}`;

      const isImg = target.tagName.toLowerCase() === "img";
      const currentTransform = target.style.transform || "";
      const translateMatch = currentTransform.match(
        /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
      );

      const currentX = translateMatch ? Number(translateMatch[1]) : 0;
      const currentY = translateMatch ? Number(translateMatch[2]) : 0;

      const currentValue = isImg
        ? (target as HTMLImageElement).src
        : target.textContent || "";

      const currentStyles: ContentStyles = {
        width: isImg ? (target as HTMLImageElement).style.width || "80px" : "",
        height: isImg
          ? (target as HTMLImageElement).style.height || "80px"
          : "",
        borderRadius: target.style.borderRadius || "12px",
        objectFit:
          ((target as HTMLImageElement).style.objectFit as
            | "contain"
            | "cover") || "contain",
        fontSize: target.style.fontSize || "",
        color: target.style.color || "",
        x: currentX,
        y: currentY,
      };

      setSelected({
        id,
        path,
        element: target,
        value: currentValue,
        mode: isImg ? "image" : "text",
        styles: currentStyles,
      });

      setDraftValue(currentValue);
      setDraftMode(isImg ? "image" : "text");
      setDraftStyles(currentStyles);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [editMode, pathname]);

  function previewChange(
    nextValue: string,
    nextStyles: ContentStyles,
    nextMode: "text" | "image"
  ) {
    if (!selected) {
      return;
    }

    const finalMode =
      nextMode === "image" || isImageUrl(nextValue) ? "image" : "text";

    applyEditToElement(selected.element, nextValue, nextStyles, finalMode);
  }

  function updateValue(nextValue: string) {
    setDraftValue(nextValue);
    previewChange(nextValue, draftStyles, draftMode);
  }

  function updateMode(nextMode: "text" | "image") {
    setDraftMode(nextMode);
    previewChange(draftValue, draftStyles, nextMode);
  }

  function updateStyles(nextStyles: ContentStyles) {
    setDraftStyles(nextStyles);
    previewChange(draftValue, nextStyles, draftMode);
  }

  function applyChange() {
    if (!selected) {
      return;
    }

    const finalMode =
      draftMode === "image" || isImageUrl(draftValue) ? "image" : "text";

    applyEditToElement(selected.element, draftValue, draftStyles, finalMode);

    const content: SiteContent = {
      id: selected.id,
      type: finalMode,
      value: draftValue,
      styles: {
        ...draftStyles,
        pagePath: pathname,
      },
    };

    setDraft(content);
    setSelected(null);
  }

  if (!editMode) {
    return null;
  }

  return (
    <>
      <div
        data-uniford-editor="true"
        className="fixed left-5 top-24 z-[9999] rounded-2xl bg-[#071b3a] px-4 py-3 text-sm font-black text-white shadow-2xl"
      >
        اضغطي على أي نص / صورة / إيموجي لتعديله ✨
      </div>

      {selected && (
        <div
          data-uniford-editor="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4"
        >
          <div
            dir="rtl"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-[#071b3a] shadow-2xl"
          >
            <h2 className="text-2xl font-black">تعديل العنصر</h2>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              غيري أرقام التحريك، وراح تشوفي العنصر يتحرك مباشرة. استخدمي أرقام
              سالبة أو موجبة.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block font-bold">نوع العنصر</label>

                <select
                  value={draftMode}
                  onChange={(e) =>
                    updateMode(e.target.value as "text" | "image")
                  }
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none"
                >
                  <option value="text">نص / إيموجي</option>
                  <option value="image">صورة من رابط</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  {draftMode === "image" ? "رابط الصورة" : "النص أو الإيموجي"}
                </label>

                <textarea
                  dir={draftMode === "image" ? "ltr" : "rtl"}
                  value={draftValue}
                  onChange={(e) => updateValue(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-2xl border bg-white px-4 py-3 text-black outline-none focus:border-[#1877d2] focus:ring-2 focus:ring-blue-100"
                  placeholder={
                    draftMode === "image"
                      ? "https://example.com/image.png"
                      : "اكتبي النص أو الإيموجي"
                  }
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold">
                    تحريك يمين / يسار
                  </label>

                  <input
                    type="number"
                    value={draftStyles.x || 0}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        x: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    تحريك فوق / تحت
                  </label>

                  <input
                    type="number"
                    value={draftStyles.y || 0}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        y: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">العرض</label>

                  <input
                    dir="ltr"
                    value={draftStyles.width || ""}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        width: e.target.value,
                      })
                    }
                    placeholder="80px"
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">الارتفاع</label>

                  <input
                    dir="ltr"
                    value={draftStyles.height || ""}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        height: e.target.value,
                      })
                    }
                    placeholder="80px"
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">حجم الخط</label>

                  <input
                    dir="ltr"
                    value={draftStyles.fontSize || ""}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        fontSize: e.target.value,
                      })
                    }
                    placeholder="24px"
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">لون النص</label>

                  <input
                    dir="ltr"
                    value={draftStyles.color || ""}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        color: e.target.value,
                      })
                    }
                    placeholder="#071b3a"
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">زوايا الصورة</label>

                  <input
                    dir="ltr"
                    value={draftStyles.borderRadius || ""}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        borderRadius: e.target.value,
                      })
                    }
                    placeholder="12px"
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-left text-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    طريقة عرض الصورة
                  </label>

                  <select
                    value={draftStyles.objectFit || "contain"}
                    onChange={(e) =>
                      updateStyles({
                        ...draftStyles,
                        objectFit: e.target.value as "contain" | "cover",
                      })
                    }
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black"
                  >
                    <option value="contain">تظهر كاملة</option>
                    <option value="cover">تملأ المكان</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-7 text-[#071b3a]">
                مثال: لتحريك العنصر فوق اكتبي في خانة فوق/تحت رقم سالب مثل
                -20، ولتحريكه تحت اكتبي 20.
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  type="button"
                  onClick={applyChange}
                  className="rounded-xl bg-[#071b3a] px-8 py-3 font-black text-white"
                >
                  تطبيق التعديل
                </button>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-slate-200 px-8 py-3 font-bold text-[#071b3a]"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}