"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  defaultSrc: string;
  alt: string;
  defaultStyles?: React.CSSProperties;
};

export default function EditableImage({
  id,
  defaultSrc,
  alt,
  defaultStyles,
}: Props) {
  const [src, setSrc] = useState(defaultSrc);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(id);

    if (saved) {
      setSrc(saved);
    }

    setEditMode(
      localStorage.getItem("uniford_admin_edit") ===
        "true"
    );
  }, [id]);

  function save() {
    localStorage.setItem(id, src);
    setEditing(false);
  }

  if (!editMode) {
    return (
      <img
        src={src}
        alt={alt}
        style={defaultStyles}
      />
    );
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <img
        src={src}
        alt={alt}
        style={defaultStyles}
      />

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={src}
            onChange={(e) =>
              setSrc(e.target.value)
            }
            className="rounded-xl border border-slate-300 px-3 py-1 text-sm text-black outline-none"
          />

          <button
            onClick={save}
            className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white"
          >
            حفظ
          </button>
        </div>
      ) : (
        <button
          onClick={() =>
            setEditing(true)
          }
          className="w-fit rounded-xl bg-[#1877d2] px-3 py-1 text-xs font-bold text-white"
        >
          تعديل
        </button>
      )}
    </div>
  );
}