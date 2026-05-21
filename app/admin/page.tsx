"use client";

import { useEffect, useMemo, useState } from "react";
import { allTags } from "@/lib/siteData";
import { supabase } from "@/lib/supabase";

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
  const [paymentOrders, setPaymentOrders] = useState<any[]>([]);

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

    async function loadOrders() {
      const { data } = await supabase
        .from("payment_orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (data) {
        setPaymentOrders(data);
      }
    }

    loadOrders();
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

  async function approveOrder(order: any) {
    const items = order.items || [];

    const newRules = items.map((item: any) => ({
      id: makeId(),
      email: order.user_email,
      type: item.type,
      materialId: item.materialId,
      folderId:
        item.type === "folder"
          ? item.folderId
          : undefined,
    }));

    const updatedRules = [
      ...newRules,
      ...accessRules,
    ];

    setAccessRules(updatedRules);

    await supabase
      .from("payment_orders")
      .update({
        payment_status: "approved",
      })
      .eq("id", order.id);

    setPaymentOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? {
              ...item,
              payment_status: "approved",
            }
          : item
      )
    );

    alert("تم قبول الطلب");
  }

  async function rejectOrder(order: any) {
    await supabase
      .from("payment_orders")
      .update({
        payment_status: "rejected",
      })
      .eq("id", order.id);

    setPaymentOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? {
              ...item,
              payment_status: "rejected",
            }
          : item
      )
    );

    alert("تم رفض الطلب");
  }

  function logoutAdmin() {
    localStorage.removeItem("uniford_admin");
    localStorage.removeItem("uniford_admin_edit");
    window.location.href = "/login";
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#071b3a]"
    >
      <section className="mx-auto max-w-7xl">

        {/* باقي الكود القديم حقك هنا بدون تغيير */}

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">
                طلبات الدفع
              </h2>

              <p className="mt-2 text-slate-500">
                مراجعة وقبول أو رفض الطلبات.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-5 py-3 font-black text-[#1877d2]">
              {paymentOrders.length} طلب
            </div>
          </div>

          {paymentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed bg-slate-50 p-10 text-center">
              <p className="text-xl font-bold text-slate-500">
                لا توجد طلبات.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {paymentOrders.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border bg-slate-50"
                >
                  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black">
                          {order.user_email}
                        </h3>

                        <span
                          className={`rounded-full px-4 py-1 text-sm font-black ${
                            order.payment_status ===
                            "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.payment_status ===
                                "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {order.payment_status ===
                          "approved"
                            ? "تم القبول"
                            : order.payment_status ===
                              "rejected"
                            ? "مرفوض"
                            : "بانتظار المراجعة"}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-slate-500">
                            طريقة الدفع
                          </p>

                          <p className="mt-2 text-xl font-black">
                            {order.payment_method ===
                            "bank_transfer"
                              ? "تحويل بنكي"
                              : "بطاقة / Apple Pay"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-sm text-slate-500">
                            الإجمالي
                          </p>

                          <p className="mt-2 text-xl font-black text-[#1877d2]">
                            {order.total_price} ر.س
                          </p>
                        </div>
                      </div>

                      {order.payment_status ===
                        "pending" && (
                        <div className="mt-6 flex flex-wrap gap-4">
                          <button
                            onClick={() =>
                              approveOrder(order)
                            }
                            className="rounded-2xl bg-emerald-600 px-7 py-3 font-black text-white"
                          >
                            قبول الطلب
                          </button>

                          <button
                            onClick={() =>
                              rejectOrder(order)
                            }
                            className="rounded-2xl bg-red-600 px-7 py-3 font-black text-white"
                          >
                            رفض الطلب
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      {order.transfer_image ? (
                        <div className="overflow-hidden rounded-[28px] bg-white p-4 shadow-sm">
                          <p className="mb-4 text-lg font-black">
                            صورة الحوالة
                          </p>

                          <img
                            src={order.transfer_image}
                            alt="Transfer"
                            className="w-full rounded-2xl object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-[28px] bg-white p-8 text-center">
                          <div>
                            <div className="text-7xl">
                              💳
                            </div>

                            <p className="mt-4 text-lg font-black">
                              تم الدفع إلكترونيًا
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}