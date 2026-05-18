"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      setMessage("حدث خطأ أثناء إرسال الرسالة");
    } else {
      setMessage(
        "إذا كان البريد الإلكتروني مسجلًا فسيتم إرسال رابط إعادة تعيين كلمة المرور."
      );
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-black text-[#071b3a]">
          نسيت كلمة المرور
        </h1>

        <p className="mt-3 text-center leading-7 text-slate-600">
          أدخل البريد الإلكتروني المرتبط بحسابك لإرسال رابط إعادة التعيين.
        </p>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#1877d2]"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-[#071b3a] py-3 font-bold text-white transition hover:bg-[#0b2a55]"
        >
          {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
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