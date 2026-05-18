"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
  name: string;
  price: string;
};

type AccessRule = {
  id: string;
  email: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
};

const CART_KEY = "uniford_cart";
const ACCESS_KEY = "uniford_admin_access";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email || "");
    }

    getUser();
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [cart]);

  function removeItem(id: string) {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  }

  function checkout() {
    if (!email) {
      window.location.href = "/login";
      return;
    }

    const savedAccess = localStorage.getItem(ACCESS_KEY);
    const accessRules: AccessRule[] = savedAccess ? JSON.parse(savedAccess) : [];

    const newRules: AccessRule[] = cart.map((item) => ({
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      type: item.type,
      materialId: item.materialId,
      folderId: item.type === "folder" ? item.folderId : undefined,
    }));

    localStorage.setItem(ACCESS_KEY, JSON.stringify([...newRules, ...accessRules]));
    localStorage.removeItem(CART_KEY);
    setCart([]);
    setMessage("تم إتمام الشراء التجريبي، وتمت إضافة المحتوى إلى دوراتي.");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-10 text-[#071b3a]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-4xl font-black">سلة المشتريات</h1>
          <p className="mt-3 text-slate-600">
            راجع العناصر ثم أتمم الشراء التجريبي لإضافتها إلى دوراتي.
          </p>

          {message && (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center font-bold text-emerald-800">
              {message}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="text-6xl">🛒</div>
              <h2 className="mt-4 text-2xl font-black">السلة فارغة حاليًا</h2>

              <Link
                href="/materials"
                className="mt-6 inline-block rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white"
              >
                تصفح المواد
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-slate-50 p-5"
                  >
                    <div>
                      <p className="text-xl font-black">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.type === "material" ? "مادة كاملة" : "ملف منفصل"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-xl font-black text-[#1877d2]">
                        {item.price} ريال
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-2xl font-black">ملخص الطلب</h3>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span>عدد العناصر</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between text-xl font-black">
                    <span>الإجمالي</span>
                    <span>{total} ريال</span>
                  </div>
                </div>

                <button
                  onClick={checkout}
                  className="mt-6 w-full rounded-xl bg-[#071b3a] py-3 font-bold text-white transition hover:bg-[#0b2a55]"
                >
                  إتمام الشراء التجريبي
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}