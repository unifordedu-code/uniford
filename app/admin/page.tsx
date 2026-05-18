"use client";

import { useEffect, useMemo, useState } from "react";
import { allTags } from "@/lib/siteData";

type ContentItem = {
  id: string;
  type: "video_file" | "file";
  name: string;
  vimeoUrl?: string;
  fileUrl?: string;
};

type Folder = {
  id: string;
  name: string;
  price: string;
  items: ContentItem[];
};

type Material = {
  id: string;
  name: string;
  price: string;
  tags: string[];
  folders: Folder[];
};

type AccessRule = {
  id: string;
  email: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
};

const MATERIALS_KEY = "uniford_admin_materials";
const ACCESS_KEY = "uniford_admin_access";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function getTagName(slug: string) {
  return allTags.find((tag) => tag.slug === slug)?.name || slug;
}

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);

  const [materialName, setMaterialName] = useState("");
  const [materialPrice, setMaterialPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderPrice, setFolderPrice] = useState("");

  const [selectedFolderMaterialId, setSelectedFolderMaterialId] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [itemType, setItemType] = useState<"video_file" | "file">("video_file");
  const [itemName, setItemName] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [accessEmail, setAccessEmail] = useState("");
  const [accessType, setAccessType] = useState<"material" | "folder">(
    "material"
  );
  const [accessMaterialId, setAccessMaterialId] = useState("");
  const [accessFolderId, setAccessFolderId] = useState("");

  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId
  );

  const selectedFolderMaterial = materials.find(
    (material) => material.id === selectedFolderMaterialId
  );

  const accessMaterial = materials.find(
    (material) => material.id === accessMaterialId
  );

  const totalFolders = useMemo(() => {
    return materials.reduce(
      (total, material) => total + material.folders.length,
      0
    );
  }, [materials]);

  const totalItems = useMemo(() => {
    return materials.reduce((total, material) => {
      const folderItems = material.folders.reduce(
        (sum, folder) => sum + folder.items.length,
        0
      );

      return total + folderItems;
    }, 0);
  }, [materials]);

  useEffect(() => {
    const adminSession = localStorage.getItem("uniford_admin");

    if (adminSession !== "true") {
      window.location.href = "/login";
      return;
    }

    setIsAdmin(true);
    setEditMode(localStorage.getItem("uniford_admin_edit") === "true");

    const savedMaterials = localStorage.getItem(MATERIALS_KEY);
    const savedAccess = localStorage.getItem(ACCESS_KEY);

    if (savedMaterials) {
      const parsedMaterials = JSON.parse(savedMaterials);

      const fixedMaterials: Material[] = parsedMaterials.map((item: any) => {
        if (Array.isArray(item.tags)) {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            tags: item.tags,
            folders: Array.isArray(item.folders) ? item.folders : [],
          };
        }

        const oldTag = item.universitySlug ? [item.universitySlug] : [];

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          tags: oldTag,
          folders: Array.isArray(item.folders) ? item.folders : [],
        };
      });

      setMaterials(fixedMaterials);
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(fixedMaterials));
    }

    if (savedAccess) {
      setAccessRules(JSON.parse(savedAccess));
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
    }
  }, [materials, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem(ACCESS_KEY, JSON.stringify(accessRules));
    }
  }, [accessRules, isAdmin]);

  function toggleEditMode() {
    const next = !editMode;
    setEditMode(next);

    if (next) {
      localStorage.setItem("uniford_admin_edit", "true");
      alert("تم تفعيل وضع تعديل الموقع. افتح الصفحة الرئيسية وعدّل النصوص والصور ثم اضغط حفظ.");
      window.location.href = "/";
      return;
    }

    localStorage.removeItem("uniford_admin_edit");
    alert("تم إيقاف وضع التعديل.");
  }

  function toggleTag(slug: string) {
    setSelectedTags((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug);
      }

      return [...prev, slug];
    });
  }

  function addMaterial() {
    if (!materialName.trim() || !materialPrice.trim()) {
      alert("اكتب اسم المادة والسعر.");
      return;
    }

    if (selectedTags.length === 0) {
      alert("اختر تصنيف واحد على الأقل للمادة.");
      return;
    }

    const newMaterial: Material = {
      id: makeId(),
      name: materialName.trim(),
      price: materialPrice.trim(),
      tags: selectedTags,
      folders: [],
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    setMaterialName("");
    setMaterialPrice("");
    setSelectedTags([]);
    setSelectedMaterialId(newMaterial.id);
  }

  function addFolder() {
    if (!selectedMaterialId || !folderName.trim() || !folderPrice.trim()) {
      alert("اختر المادة، واكتب اسم الملف وسعره.");
      return;
    }

    const newFolder: Folder = {
      id: makeId(),
      name: folderName.trim(),
      price: folderPrice.trim(),
      items: [],
    };

    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== selectedMaterialId) {
          return material;
        }

        return {
          ...material,
          folders: [newFolder, ...material.folders],
        };
      })
    );

    setFolderName("");
    setFolderPrice("");
    setSelectedFolderMaterialId(selectedMaterialId);
    setSelectedFolderId(newFolder.id);
  }

  function addItem() {
    if (!selectedFolderMaterialId || !selectedFolderId || !itemName.trim()) {
      alert("اختر المادة والملف، واكتب اسم المحتوى.");
      return;
    }

    if (itemType === "video_file" && (!vimeoUrl.trim() || !fileUrl.trim())) {
      alert("اكتب رابط Vimeo ورابط الملف.");
      return;
    }

    if (itemType === "file" && !fileUrl.trim()) {
      alert("اكتب رابط الملف.");
      return;
    }

    const newItem: ContentItem = {
      id: makeId(),
      type: itemType,
      name: itemName.trim(),
      vimeoUrl: itemType === "video_file" ? vimeoUrl.trim() : "",
      fileUrl: fileUrl.trim(),
    };

    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== selectedFolderMaterialId) {
          return material;
        }

        return {
          ...material,
          folders: material.folders.map((folder) => {
            if (folder.id !== selectedFolderId) {
              return folder;
            }

            return {
              ...folder,
              items: [newItem, ...folder.items],
            };
          }),
        };
      })
    );

    setItemName("");
    setVimeoUrl("");
    setFileUrl("");
  }

  function addAccess() {
    if (!accessEmail.trim() || !accessMaterialId) {
      alert("اكتب بريد المستخدم واختر المادة.");
      return;
    }

    if (accessType === "folder" && !accessFolderId) {
      alert("اختر الملف الذي تريد إضافة المستخدم إليه.");
      return;
    }

    const alreadyExists = accessRules.some((rule) => {
      return (
        rule.email.trim().toLowerCase() === accessEmail.trim().toLowerCase() &&
        rule.type === accessType &&
        rule.materialId === accessMaterialId &&
        rule.folderId === (accessType === "folder" ? accessFolderId : undefined)
      );
    });

    if (alreadyExists) {
      alert("هذه الصلاحية مضافة لهذا المستخدم بالفعل.");
      return;
    }

    const newRule: AccessRule = {
      id: makeId(),
      email: accessEmail.trim().toLowerCase(),
      type: accessType,
      materialId: accessMaterialId,
      folderId: accessType === "folder" ? accessFolderId : undefined,
    };

    setAccessRules((prev) => [newRule, ...prev]);
    setAccessEmail("");
  }

  function removeAccess(ruleId: string) {
    const ok = confirm("هل تريد إزالة هذه الصلاحية من المستخدم؟");

    if (!ok) {
      return;
    }

    setAccessRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  }

  function deleteMaterial(id: string) {
    const ok = confirm("هل تريد حذف هذه المادة؟ سيتم حذف ملفاتها وصلاحياتها.");

    if (!ok) {
      return;
    }

    setMaterials((prev) => prev.filter((material) => material.id !== id));
    setAccessRules((prev) => prev.filter((rule) => rule.materialId !== id));
  }

  function deleteFolder(materialId: string, folderId: string) {
    const ok = confirm(
      "هل تريد حذف هذا الملف؟ سيتم حذف المحتوى والصلاحيات المرتبطة به."
    );

    if (!ok) {
      return;
    }

    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== materialId) {
          return material;
        }

        return {
          ...material,
          folders: material.folders.filter((folder) => folder.id !== folderId),
        };
      })
    );

    setAccessRules((prev) => prev.filter((rule) => rule.folderId !== folderId));
  }

  function deleteItem(materialId: string, folderId: string, itemId: string) {
    const ok = confirm("هل تريد حذف هذا المحتوى؟");

    if (!ok) {
      return;
    }

    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== materialId) {
          return material;
        }

        return {
          ...material,
          folders: material.folders.map((folder) => {
            if (folder.id !== folderId) {
              return folder;
            }

            return {
              ...folder,
              items: folder.items.filter((item) => item.id !== itemId),
            };
          }),
        };
      })
    );
  }

  function logoutAdmin() {
    localStorage.removeItem("uniford_admin");
    localStorage.removeItem("uniford_admin_edit");
    window.location.href = "/login";
  }

  if (!isAdmin) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f9fc]"
      >
        <p className="text-xl font-black text-[#071b3a]">جاري التحقق...</p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-blue-100">
                لوحة تحكم الإدارة
              </p>

              <h1 className="mt-2 text-4xl font-black">
                إدارة المنصة والمواد والتعديل المباشر
              </h1>

              <p className="mt-3 max-w-3xl leading-8 text-blue-100">
                من هنا يمكن إضافة المواد والملفات والصلاحيات، ويمكن تفعيل وضع
                تعديل الموقع لتعديل النصوص والصور من الصفحات نفسها.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleEditMode}
                className={`rounded-xl px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:shadow-lg ${
                  editMode ? "bg-orange-500" : "bg-emerald-500"
                }`}
              >
                {editMode ? "إيقاف وضع التعديل" : "تفعيل وضع تعديل الموقع"}
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
              >
                فتح الصفحة الرئيسية
              </button>

              <button
                onClick={logoutAdmin}
                className="rounded-xl bg-white px-6 py-3 font-bold text-[#071b3a] transition hover:-translate-y-1 hover:shadow-lg"
              >
                تسجيل خروج الأدمن
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">وضع تعديل الموقع</h2>
          <p className="mt-2 leading-8 text-slate-600">
            عند تفعيل وضع التعديل، افتح الصفحة الرئيسية. ستظهر مربعات تعديل على
            النصوص وأزرار تعديل على الصور. بعد التعديل اضغط حفظ على كل عنصر،
            وسيتم حفظه في Supabase ليظهر للجميع.
          </p>

          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-[#071b3a]">
            الحالة الحالية: {editMode ? "مفعل ✅" : "غير مفعل"}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-black">{materials.length}</p>
            <p className="mt-2 text-slate-600">مادة</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-black">{totalFolders}</p>
            <p className="mt-2 text-slate-600">ملف داخل المواد</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-black">{totalItems}</p>
            <p className="mt-2 text-slate-600">فيديو أو ملف</p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl font-black">{accessRules.length}</p>
            <p className="mt-2 text-slate-600">صلاحية مستخدم</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">1. إضافة مادة</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              أضف المادة وحدد سعرها، ثم اختر كل التصنيفات التي تنتمي لها.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block font-bold">اسم المادة</label>
                <input
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="مثال: مبادئ المحاسبة"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">سعر المادة كاملة</label>
                <input
                  value={materialPrice}
                  onChange={(e) => setMaterialPrice(e.target.value)}
                  placeholder="مثال: 199"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-3 block font-bold">
                  التصنيفات التي تظهر فيها المادة
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  {allTags.map((tag) => (
                    <button
                      type="button"
                      key={tag.slug}
                      onClick={() => toggleTag(tag.slug)}
                      className={`rounded-xl border px-4 py-3 text-right font-bold transition ${
                        selectedTags.includes(tag.slug)
                          ? "border-[#1877d2] bg-blue-50 text-[#1877d2]"
                          : "bg-slate-50 text-[#071b3a] hover:bg-white"
                      }`}
                    >
                      <span className="ml-2">
                        {selectedTags.includes(tag.slug) ? "✅" : "⬜"}
                      </span>
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addMaterial}
                className="w-full rounded-xl bg-[#071b3a] py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#0b2a55] hover:shadow-lg"
              >
                إضافة المادة
              </button>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black">2. إضافة ملف داخل مادة</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              الملف يكون جزءًا داخل المادة، وله سعر منفصل لمن يريد شراءه وحده.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block font-bold">اختر المادة</label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="">اختر مادة</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">اسم الملف</label>
                <input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="مثال: ملف المحاضرات الأولى"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">سعر الملف وحده</label>
                <input
                  value={folderPrice}
                  onChange={(e) => setFolderPrice(e.target.value)}
                  placeholder="مثال: 49"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              <button
                onClick={addFolder}
                className="w-full rounded-xl bg-emerald-700 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg"
              >
                إضافة الملف
              </button>

              {selectedMaterial && (
                <div className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                  المادة المحددة: {selectedMaterial.name}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-black">3. إضافة محتوى داخل الملف</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              يمكن إضافة فيديو مع ملف، أو إضافة ملف فقط.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">اختر المادة</label>
                <select
                  value={selectedFolderMaterialId}
                  onChange={(e) => {
                    setSelectedFolderMaterialId(e.target.value);
                    setSelectedFolderId("");
                  }}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="">اختر مادة</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">اختر الملف</label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="">اختر ملف</option>
                  {selectedFolderMaterial?.folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name} - {folder.price} ريال
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">نوع المحتوى</label>
                <select
                  value={itemType}
                  onChange={(e) =>
                    setItemType(e.target.value as "video_file" | "file")
                  }
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="video_file">فيديو مع ملف</option>
                  <option value="file">ملف فقط</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">اسم المحتوى</label>
                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="مثال: المحاضرة الأولى"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              {itemType === "video_file" && (
                <div>
                  <label className="mb-2 block font-bold">رابط Vimeo</label>
                  <input
                    value={vimeoUrl}
                    onChange={(e) => setVimeoUrl(e.target.value)}
                    placeholder="https://player.vimeo.com/video/..."
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block font-bold">رابط الملف</label>
                <input
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="رابط PDF أو ملف خارجي"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>
            </div>

            <button
              onClick={addItem}
              className="mt-6 rounded-xl bg-orange-600 px-8 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg"
            >
              إضافة المحتوى
            </button>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-black">
              4. إضافة مستخدم إلى مادة أو ملف
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              اكتب البريد الإلكتروني الذي سجّل به المستخدم، ثم اختر المادة أو الملف.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">بريد المستخدم</label>
                <input
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  placeholder="user@email.com"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">نوع الصلاحية</label>
                <select
                  value={accessType}
                  onChange={(e) =>
                    setAccessType(e.target.value as "material" | "folder")
                  }
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="material">إضافة إلى مادة كاملة</option>
                  <option value="folder">إضافة إلى ملف محدد</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">اختر المادة</label>
                <select
                  value={accessMaterialId}
                  onChange={(e) => {
                    setAccessMaterialId(e.target.value);
                    setAccessFolderId("");
                  }}
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                >
                  <option value="">اختر مادة</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              {accessType === "folder" && (
                <div>
                  <label className="mb-2 block font-bold">اختر الملف</label>
                  <select
                    value={accessFolderId}
                    onChange={(e) => setAccessFolderId(e.target.value)}
                    className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
                  >
                    <option value="">اختر ملف</option>
                    {accessMaterial?.folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={addAccess}
              className="mt-6 rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#0b2a55] hover:shadow-lg"
            >
              إضافة الصلاحية
            </button>
          </section>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black">المواد الحالية</h2>

          {materials.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="text-xl font-bold text-slate-600">
                لا توجد مواد مضافة حتى الآن.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="rounded-2xl border bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black">{material.name}</h3>
                      <p className="mt-2 text-slate-600">
                        السعر الكامل:{" "}
                        <span className="font-black">
                          {material.price} ريال
                        </span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {material.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1877d2]"
                          >
                            {getTagName(tag)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMaterial(material.id)}
                      className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white"
                    >
                      حذف المادة
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {material.folders.length === 0 ? (
                      <div className="rounded-2xl bg-white p-5 text-slate-500">
                        لا توجد ملفات داخل هذه المادة.
                      </div>
                    ) : (
                      material.folders.map((folder) => (
                        <div key={folder.id} className="rounded-2xl bg-white p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-xl font-black">
                                {folder.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                السعر: {folder.price} ريال
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                deleteFolder(material.id, folder.id)
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                            >
                              حذف
                            </button>
                          </div>

                          <div className="mt-4 space-y-3">
                            {folder.items.length === 0 ? (
                              <p className="text-sm text-slate-400">
                                لا يوجد محتوى داخل هذا الملف.
                              </p>
                            ) : (
                              folder.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-xl border bg-slate-50 p-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-bold">{item.name}</p>
                                      <p className="text-xs text-slate-500">
                                        {item.type === "video_file"
                                          ? "فيديو مع ملف"
                                          : "ملف فقط"}
                                      </p>
                                    </div>

                                    <button
                                      onClick={() =>
                                        deleteItem(
                                          material.id,
                                          folder.id,
                                          item.id
                                        )
                                      }
                                      className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black">صلاحيات المستخدمين</h2>

          {accessRules.length === 0 ? (
            <p className="mt-5 text-slate-500">لا توجد صلاحيات مضافة.</p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {accessRules.map((rule) => {
                const material = materials.find(
                  (item) => item.id === rule.materialId
                );

                const folder = material?.folders.find(
                  (item) => item.id === rule.folderId
                );

                return (
                  <div key={rule.id} className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black">{rule.email}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {rule.type === "material"
                            ? `مضاف إلى المادة: ${
                                material?.name || "غير معروف"
                              }`
                            : `مضاف إلى الملف: ${folder?.name || "غير معروف"}`}
                        </p>
                      </div>

                      <button
                        onClick={() => removeAccess(rule.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}