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

    const savedMaterials = localStorage.getItem(MATERIALS_KEY);
    const savedAccess = localStorage.getItem(ACCESS_KEY);

    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
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
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(ACCESS_KEY, JSON.stringify(accessRules));
  }, [accessRules]);

  function toggleEditMode() {
    const next = !editMode;

    setEditMode(next);

    if (next) {
      localStorage.setItem("uniford_admin_edit", "true");
      alert("تم تفعيل وضع التعديل.");
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
    if (!materialName || !materialPrice) {
      alert("اكتب اسم المادة والسعر");
      return;
    }

    const newMaterial: Material = {
      id: makeId(),
      name: materialName,
      price: materialPrice,
      tags: selectedTags,
      folders: [],
    };

    setMaterials((prev) => [newMaterial, ...prev]);

    setMaterialName("");
    setMaterialPrice("");
    setSelectedTags([]);
  }

  function addFolder() {
    if (!selectedMaterialId || !folderName || !folderPrice) {
      alert("أكمل البيانات");
      return;
    }

    const newFolder: Folder = {
      id: makeId(),
      name: folderName,
      price: folderPrice,
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
  }

  function addItem() {
    if (!selectedFolderMaterialId || !selectedFolderId || !itemName) {
      alert("أكمل البيانات");
      return;
    }

    const newItem: ContentItem = {
      id: makeId(),
      type: itemType,
      name: itemName,
      vimeoUrl,
      fileUrl,
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
    if (!accessEmail || !accessMaterialId) {
      alert("أكمل البيانات");
      return;
    }

    const newRule: AccessRule = {
      id: makeId(),
      email: accessEmail.toLowerCase(),
      type: accessType,
      materialId: accessMaterialId,
      folderId:
        accessType === "folder"
          ? accessFolderId
          : undefined,
    };

    setAccessRules((prev) => [newRule, ...prev]);

    setAccessEmail("");
  }

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
        <div className="rounded-3xl bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">
                لوحة تحكم الإدارة
              </h1>

              <p className="mt-3 text-blue-100">
                إدارة المواد والطلبات والدفع.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleEditMode}
                className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white"
              >
                {editMode
                  ? "إيقاف وضع التعديل"
                  : "تفعيل وضع التعديل"}
              </button>

              <button
                onClick={logoutAdmin}
                className="rounded-xl bg-white px-6 py-3 font-bold text-[#071b3a]"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}