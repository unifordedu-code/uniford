"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const hash = window.location.hash;

      if (!hash) {
        setMessage("رابط إعادة التعيين غير صالح.");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        setMessage("رابط إعادة التعيين غير صالح.");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        setMessage("انتهت صلاحية رابط إعادة التعيين.");
        return;
      }

      setReady(true);
    }

    loadSession();
  }, []);

  async function updatePassword() {
    if (!password) {
      setMessage("أدخل كلمة المرور الجديدة.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("حدث خطأ أثناء تحديث كلمة المرور.");
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-black text-[#071b3a]">
          تعيين كلمة مرور جديدة
        </h1>

        <p className="mt-3 text-center leading-7 text-slate-600">
          أدخل كلمة المرور الجديدة لحسابك.
        </p>

        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!ready}
          className="mt-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#1877d2]"
        />

        <button
          onClick={updatePassword}
          disabled={!ready || loading}
          className="mt-5 w-full rounded-xl bg-[#071b3a] py-3 font-bold text-white transition hover:bg-[#0b2a55] disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
        </button>

        {message && (
          <div className="mt-4 rounded-xl bg-slate-100 p-4 text-center text-sm font-bold text-[#071b3a]">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}