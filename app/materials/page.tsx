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
  tags?: string[];
  folders: Folder[];
  universitySlug?: string;
};

type FixedMaterial = {
  id: string;
  name: string;
  price: string;
  tags: string[];
  folders: Folder[];
};

type CartItem = {
  id: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
  name: string;
  price: string;
};

const MATERIALS_KEY = "uniford_admin_materials";
const CART_KEY = "uniford_cart";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function getTagName(slug: string) {
  return allTags.find((tag) => tag.slug === slug)?.name || slug;
}

function fixMaterial(material: Material): FixedMaterial {
  return {
    id: material.id,
    name: material.name,
    price: material.price,
    tags: Array.isArray(material.tags)
      ? material.tags
      : material.universitySlug
      ? [material.universitySlug]
      : [],
    folders: Array.isArray(material.folders) ? material.folders : [],
  };
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [materials, setMaterials] = useState<FixedMaterial[]>([]);
  const [message, setMessage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<FixedMaterial | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    setTag(params.get("tag") || "");

    const savedMaterials = localStorage.getItem(MATERIALS_KEY);

    if (savedMaterials) {
      const parsedMaterials: Material[] = JSON.parse(savedMaterials);
      const fixedMaterials = parsedMaterials.map(fixMaterial);

      setMaterials(fixedMaterials);
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(fixedMaterials));
    }
  }, []);

  const pageTitle = useMemo(() => {
    if (tag) {
      const selectedTag = allTags.find((item) => item.slug === tag);
      return selectedTag?.name || "المواد";
    }

    if (search) {
      return `نتائج البحث عن: ${search}`;
    }

    return "المواد والدورات";
  }, [tag, search]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const tagNames = material.tags.map((item) => getTagName(item)).join(" ");
      const text = `${material.name} ${material.price} ${tagNames}`.toLowerCase();

      const matchesSearch = search
        ? text.includes(search.toLowerCase())
        : true;

      const matchesTag = tag ? material.tags.includes(tag) : true;

      return matchesSearch && matchesTag;
    });
  }, [materials, search, tag]);

  function addMaterialToCart(material: FixedMaterial) {
    const savedCart = localStorage.getItem(CART_KEY);
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const exists = cart.some(
      (item) => item.type === "material" && item.materialId === material.id
    );

    if (exists) {
      setMessage("هذه المادة موجودة في السلة بالفعل.");
      return;
    }

    const newItem: CartItem = {
      id: makeId(),
      type: "material",
      materialId: material.id,
      name: material.name,
      price: material.price,
    };

    localStorage.setItem(CART_KEY, JSON.stringify([newItem, ...cart]));
    setMessage("تمت إضافة المادة إلى السلة.");
  }

  function addFolderToCart(material: FixedMaterial, folder: Folder) {
    const savedCart = localStorage.getItem(CART_KEY);
    const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const exists = cart.some(
      (item) => item.type === "folder" && item.folderId === folder.id
    );

    if (exists) {
      setMessage("هذا الملف موجود في السلة بالفعل.");
      return;
    }

    const newItem: CartItem = {
      id: makeId(),
      type: "folder",
      materialId: material.id,
      folderId: folder.id,
      name: `${material.name} - ${folder.name}`,
      price: folder.price,
    };

    localStorage.setItem(CART_KEY, JSON.stringify([newItem, ...cart]));
    setMessage("تمت إضافة الملف إلى السلة.");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-black">{pageTitle}</h1>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600">
            تصفح المواد المضافة من لوحة الإدارة، أو ابحث باسم المادة أو التصنيف.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-4 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مادة..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-right text-black outline-none transition focus:border-[#1877d2] focus:bg-white"
          />
        </div>

        {message && (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-blue-50 p-4 text-center font-bold text-[#071b3a]">
            {message}
          </div>
        )}

        {filteredMaterials.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">📚</div>

            <h2 className="mt-4 text-2xl font-black">لا توجد مواد مطابقة</h2>

            <p className="mt-2 text-slate-500">
              أضف مواد من لوحة الإدارة مع التصنيف المناسب وستظهر هنا.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#071b3a] to-[#1877d2] p-6 text-center text-white">
                  <div>
                    <p className="text-3xl font-black">{material.name}</p>

                    <p className="mt-3 text-sm text-blue-100">
                      {material.tags.map((item) => getTagName(item)).join(" - ")}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-black">{material.name}</h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {material.tags.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1877d2]"
                      >
                        {getTagName(item)}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="font-black">سعر المادة كاملة</p>

                    <p className="mt-1 text-2xl font-black text-[#1877d2]">
                      {material.price} ريال
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <button
                      onClick={() => setSelectedMaterial(material)}
                      className="w-full rounded-xl border border-[#071b3a] bg-white py-3 font-bold text-[#071b3a] transition hover:bg-slate-50"
                    >
                      عرض التفاصيل
                    </button>

                    <button
                      onClick={() => addMaterialToCart(material)}
                      className="w-full rounded-xl bg-[#071b3a] py-3 font-bold text-white transition hover:bg-[#0b2a55]"
                    >
                      إضافة المادة للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedMaterial && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
              <div>
                <h2 className="text-3xl font-black">{selectedMaterial.name}</h2>

                <p className="mt-2 text-slate-600">
                  السعر الكامل:{" "}
                  <span className="font-black text-[#1877d2]">
                    {selectedMaterial.price} ريال
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedMaterial.tags.map((tag) => (
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
                onClick={() => setSelectedMaterial(null)}
                className="rounded-xl bg-slate-100 px-5 py-2 font-bold text-[#071b3a]"
              >
                إغلاق
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => addMaterialToCart(selectedMaterial)}
                className="w-full rounded-xl bg-[#071b3a] py-3 font-black text-white"
              >
                إضافة المادة كاملة للسلة
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black">ملفات المادة</h3>

              {selectedMaterial.folders.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed bg-slate-50 p-8 text-center">
                  <p className="font-bold text-slate-500">
                    لا توجد ملفات داخل هذه المادة حتى الآن.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {selectedMaterial.folders.map((folder) => (
                    <div key={folder.id} className="rounded-2xl border bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-xl font-black">{folder.name}</h4>
                          <p className="mt-1 text-sm text-slate-600">
                            {folder.items.length} محتوى داخل الملف
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-4 py-1 text-sm font-black text-[#1877d2]">
                          {folder.price} ريال
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {folder.items.length === 0 ? (
                          <p className="text-sm text-slate-400">
                            لا يوجد محتوى داخل هذا الملف.
                          </p>
                        ) : (
                          folder.items.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl bg-white p-3 text-sm font-bold"
                            >
                              {item.type === "video_file" ? "🎥" : "📄"} {item.name}
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => addFolderToCart(selectedMaterial, folder)}
                        className="mt-5 w-full rounded-xl bg-emerald-700 py-3 font-bold text-white"
                      >
                        شراء هذا الملف فقط
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}