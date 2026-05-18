"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { universities, allTags } from "@/lib/siteData";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";

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
  const params = useParams();
  const slug = String(params.slug || "");

  const [materials, setMaterials] = useState<FixedMaterial[]>([]);
  const [message, setMessage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<FixedMaterial | null>(null);

  const university = universities.find((item) => item.slug === slug);

  useEffect(() => {
    const savedMaterials = localStorage.getItem(MATERIALS_KEY);

    if (savedMaterials) {
      const parsedMaterials: Material[] = JSON.parse(savedMaterials);
      const fixedMaterials = parsedMaterials.map(fixMaterial);
      setMaterials(fixedMaterials);
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(fixedMaterials));
    }
  }, []);

  const universityMaterials = useMemo(() => {
    return materials.filter((material) => material.tags.includes(slug));
  }, [materials, slug]);

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

  if (!university) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">🏛️</div>

          <h1 className="mt-5 text-3xl font-black">
            <EditableText
              id="university.notFound.title"
              defaultValue="الجامعة غير موجودة"
            />
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-8 text-slate-600">
            <EditableText
              id="university.notFound.description"
              defaultValue="الرابط الحالي لا يطابق أي جامعة مضافة في بيانات الموقع. افتح صفحة الجامعات واختر الجامعة من هناك."
            />
          </p>

          <Link
            href="/universities"
            className="mt-6 inline-block rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white"
          >
            <EditableText
              id="university.notFound.button"
              defaultValue="الرجوع إلى الجامعات"
            />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <Link href="/universities" className="font-bold text-[#1877d2]">
          <EditableText id="university.back" defaultValue="← الرجوع إلى الجامعات" />
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-8 text-white">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white p-3">
                {university.logo ? (
                  <EditableImage
                    id={`university.hero.logo.${university.slug}`}
                    defaultSrc={university.logo}
                    alt={university.name}
                    defaultStyles={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "16px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="text-4xl">🏛️</span>
                )}
              </div>

              <div>
                <h1 className="text-4xl font-black">
                  <EditableText
                    id={`university.hero.name.${university.slug}`}
                    defaultValue={university.name}
                  />
                </h1>

                <p className="mt-3 max-w-2xl leading-8 text-blue-100">
                  <EditableText
                    id={`university.hero.desc.${university.slug}`}
                    defaultValue={university.desc}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-black">
              <EditableText
                id={`university.materials.title.${university.slug}`}
                defaultValue="المواد المتاحة"
              />
            </h2>

            <p className="mt-3 text-slate-600">
              <EditableText
                id={`university.materials.desc.${university.slug}`}
                defaultValue={`تظهر هنا المواد التي تم تصنيفها من لوحة التحكم ضمن ${university.name}.`}
              />
            </p>

            {message && (
              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center font-bold text-[#071b3a]">
                {message}
              </div>
            )}

            {universityMaterials.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="text-6xl">📚</div>

                <h3 className="mt-4 text-2xl font-black">
                  <EditableText
                    id={`university.empty.title.${university.slug}`}
                    defaultValue="لا توجد مواد مضافة لهذه الجامعة حاليًا"
                  />
                </h3>

                <p className="mx-auto mt-3 max-w-2xl leading-8 text-slate-600">
                  <EditableText
                    id={`university.empty.desc.${university.slug}`}
                    defaultValue={`لإظهار المواد هنا، افتح لوحة الأدمن وأضف مادة ثم اختر تصنيف ${university.name}.`}
                  />
                </p>

                <Link
                  href="/materials"
                  className="mt-6 inline-block rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white"
                >
                  <EditableText
                    id={`university.empty.button.${university.slug}`}
                    defaultValue="تصفح كل المواد"
                  />
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {universityMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#071b3a] to-[#1877d2] p-6 text-center text-white">
                      <div>
                        <p className="text-3xl font-black">{material.name}</p>
                        <p className="mt-3 text-sm text-blue-100">
                          {material.tags.map((tag) => getTagName(tag)).join(" - ")}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-black">{material.name}</h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {material.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1877d2]"
                          >
                            {getTagName(tag)}
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
          </div>
        </div>
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