"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function saveOrder() {
      const cart = JSON.parse(
        localStorage.getItem("uniford_cart") || "[]"
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const total = cart.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0),
        0
      );

      await supabase
        .from("payment_orders")
        .insert({
          user_email: user.email,
          items: cart,
          total_price: total.toString(),
          payment_method: "card",
          payment_status: "paid",
        });

      localStorage.removeItem("uniford_cart");

      setLoading(false);
    }

    saveOrder();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <p className="text-2xl font-black text-[#071b3a]">
          جاري تأكيد الدفع...
        </p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6"
    >
      <div className="max-w-xl rounded-[36px] bg-white p-10 text-center shadow-2xl animate-fadeUp">
        <div className="text-8xl">
          🎉
        </div>

        <h1 className="mt-6 text-5xl font-black text-[#071b3a]">
          تم الدفع بنجاح
        </h1>

        <p className="mt-5 text-lg leading-9 text-slate-600">
          تم تأكيد العملية وإرسال
          طلبك للإدارة وسيتم تفعيل
          المواد داخل حسابك.
        </p>

        <a
          href="/dashboard"
          className="mt-8 inline-block rounded-2xl bg-[#071b3a] px-8 py-4 text-lg font-black text-white transition hover:bg-[#0b2a55]"
        >
          الذهاب إلى حسابي
        </a>
      </div>
    </main>
  );
}