"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  universitySlug: string;
  universityName: string;
  price: string;
  folders: Folder[];
};

type AccessRule = {
  id: string;
  email: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
};

type CourseView = Material & {
  accessibleFolders: Folder[];
};

const MATERIALS_KEY = "uniford_admin_materials";
const ACCESS_KEY = "uniford_admin_access";

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [openFolderId, setOpenFolderId] = useState("");

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      const userEmail = data.user.email || "";
      setEmail(userEmail);

      const savedMaterials = localStorage.getItem(MATERIALS_KEY);
      const savedAccess = localStorage.getItem(ACCESS_KEY);

      if (savedMaterials) {
        setMaterials(JSON.parse(savedMaterials));
      }

      if (savedAccess) {
        setAccessRules(JSON.parse(savedAccess));
      }

      setLoading(false);
    }

    getUser();
  }, []);

  const myCourses: CourseView[] = useMemo(() => {
    const normalizedEmail = email.trim().toLowerCase();

    return materials
      .map((material) => {
        const rulesForMaterial = accessRules.filter(
          (rule) =>
            rule.email.trim().toLowerCase() === normalizedEmail &&
            rule.materialId === material.id
        );

        const hasFullMaterial = rulesForMaterial.some(
          (rule) => rule.type === "material"
        );

        const accessibleFolders = hasFullMaterial
          ? material.folders
          : material.folders.filter((folder) =>
              rulesForMaterial.some(
                (rule) => rule.type === "folder" && rule.folderId === folder.id
              )
            );

        return {
          ...material,
          accessibleFolders,
        };
      })
      .filter((material) => material.accessibleFolders.length > 0);
  }, [materials, accessRules, email]);

  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(myCourses[0].id);
      setOpenFolderId(myCourses[0].accessibleFolders[0]?.id || "");
    }
  }, [myCourses, selectedCourseId]);

  const selectedCourse = myCourses.find(
    (course) => course.id === selectedCourseId
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f9fc]"
      >
        <p className="text-xl font-bold text-[#071b3a]">جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-blue-100">لوحة الحساب</p>
              <h1 className="mt-2 text-4xl font-black">دوراتي</h1>
              <p className="mt-3 leading-8 text-blue-100">
                الحساب المسجل: {email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {myCourses.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">📚</div>
            <h2 className="mt-5 text-3xl font-black">لا توجد دورات مضافة للحساب</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-8 text-slate-600">
              عند شراء مادة أو عند إضافة الإدارة لهذا الحساب إلى مادة أو ملف،
              ستظهر الدورات هنا.
            </p>

            <Link
              href="/materials"
              className="mt-6 inline-block rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white"
            >
              تصفح المواد
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[330px_1fr]">
            <aside className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black">القائمة</h2>
              <p className="mt-2 text-sm text-slate-500">
                اختر المادة ثم افتح الملفات من السهم.
              </p>

              <div className="mt-5 space-y-3">
                {myCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setOpenFolderId(course.accessibleFolders[0]?.id || "");
                    }}
                    className={`w-full rounded-2xl border p-4 text-right transition hover:-translate-y-1 hover:shadow-md ${
                      selectedCourseId === course.id
                        ? "border-[#1877d2] bg-blue-50"
                        : "bg-white"
                    }`}
                  >
                    <p className="font-black">{course.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {course.universityName}
                    </p>
                    <p className="mt-2 text-xs font-bold text-[#1877d2]">
                      {course.accessibleFolders.length} ملف متاح
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              {selectedCourse && (
                <>
                  <div className="border-b pb-6">
                    <h2 className="text-3xl font-black">{selectedCourse.name}</h2>
                    <p className="mt-2 text-slate-600">
                      {selectedCourse.universityName}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black">ملفات المادة</h3>

                      {selectedCourse.accessibleFolders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() =>
                            setOpenFolderId(
                              openFolderId === folder.id ? "" : folder.id
                            )
                          }
                          className={`w-full rounded-2xl border p-4 text-right transition hover:bg-slate-50 ${
                            openFolderId === folder.id
                              ? "border-[#1877d2] bg-blue-50"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-black">{folder.name}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                {folder.items.length} محتوى
                              </p>
                            </div>

                            <span className="text-2xl">
                              {openFolderId === folder.id ? "⌃" : "⌄"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div>
                      {selectedCourse.accessibleFolders.map((folder) => {
                        if (folder.id !== openFolderId) {
                          return null;
                        }

                        return (
                          <div key={folder.id} className="rounded-3xl bg-slate-50 p-5">
                            <h3 className="text-2xl font-black">{folder.name}</h3>

                            {folder.items.length === 0 ? (
                              <div className="mt-5 rounded-2xl border border-dashed bg-white p-8 text-center">
                                <p className="font-bold text-slate-500">
                                  لا يوجد محتوى داخل هذا الملف حتى الآن.
                                </p>
                              </div>
                            ) : (
                              <div className="mt-5 space-y-5">
                                {folder.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm"
                                  >
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                      <h4 className="text-xl font-black">
                                        {item.name}
                                      </h4>

                                      <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-[#1877d2]">
                                        {item.type === "video_file"
                                          ? "فيديو مع ملف"
                                          : "ملف فقط"}
                                      </span>
                                    </div>

                                    {item.type === "video_file" && item.vimeoUrl && (
                                      <iframe
                                        className="aspect-video w-full rounded-xl bg-black"
                                        src={item.vimeoUrl}
                                        title={item.name}
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    )}

                                    {item.fileUrl && (
                                      <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        className="mt-4 inline-block rounded-xl bg-[#071b3a] px-6 py-3 font-bold text-white"
                                      >
                                        فتح الملف
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}