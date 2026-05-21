"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  defaultValue: string;
};

export default function EditableText({
  id,
  defaultValue,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(id);

    if (saved) {
      setValue(saved);
    }

    setEditMode(
      localStorage.getItem("uniford_admin_edit") ===
        "true"
    );
  }, [id]);

  function save() {
    localStorage.setItem(id, value);
    setEditing(false);
  }

  if (!editMode) {
    return <>{value}</>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-black outline-none"
          />

          <button
            onClick={save}
            className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white"
          >
            حفظ
          </button>
        </>
      ) : (
        <>
          <span>{value}</span>

          <button
            onClick={() =>
              setEditing(true)
            }
            className="rounded-xl bg-[#1877d2] px-3 py-1 text-xs font-bold text-white"
          >
            تعديل
          </button>
        </>
      )}
    </span>
  );
}