"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        localStorage.setItem(
          "uniford_user",
          JSON.stringify({
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              "مستخدم",
            email: session.user.email,
            role: "user",
          })
        );

        router.push("/dashboard");
      }
    }

    checkUser();
  }, []);

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (email === "admin" && password === "noor6331") {
        localStorage.setItem(
          "uniford_user",
          JSON.stringify({
            name: "Admin",
            email: "admin",
            role: "admin",
          })
        );

        router.push("/admin");
        return;
      }

      if (isLogin) {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          setLoading(false);
          return;
        }

        localStorage.setItem(
          "uniford_user",
          JSON.stringify({
            name:
              data.user.user_metadata?.name ||
              "مستخدم",
            email: data.user.email,
            role: "user",
          })
        );

        router.push("/dashboard");
      } else {
        const { data, error } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
            },
          });

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        await supabase.from("profiles").insert({
          id: data.user?.id,
          name,
          email,
        });

        localStorage.setItem(
          "uniford_user",
          JSON.stringify({
            name,
            email,
            role: "user",
          })
        );

        router.push("/dashboard");
      }
    } catch {
      setMessage("حدث خطأ غير متوقع");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-[#071b3a] px-8 py-10 text-center text-white">
          <h1 className="text-4xl font-black">
            {isLogin
              ? "تسجيل الدخول"
              : "إنشاء حساب"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-200">
            منصة تعليمية جامعية ومهنية
            متكاملة تساعد على تطوير
            المهارات الأكاديمية والمهنية.
          </p>
        </div>

        <div className="p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-bold text-[#071b3a]">
                  الاسم الكامل
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#1877d2] focus:ring-4 focus:ring-[#1877d2]/10"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-[#071b3a]">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#1877d2] focus:ring-4 focus:ring-[#1877d2]/10"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#071b3a]">
                كلمة المرور
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#1877d2] focus:ring-4 focus:ring-[#1877d2]/10"
                placeholder="أدخل كلمة المرور"
              />
            </div>

            {isLogin && (
              <div className="text-left">
                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-[#1877d2] transition hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#071b3a] py-3 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-[#0b2a55] hover:shadow-xl disabled:opacity-70"
            >
              {loading
                ? "جاري التحميل..."
                : isLogin
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
            </button>

            <div className="mt-5">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 font-bold text-[#071b3a] transition hover:bg-slate-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />

                تسجيل الدخول باستخدام Google
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() =>
                setIsLogin(!isLogin)
              }
              className="font-bold text-[#1877d2] transition hover:underline"
            >
              {isLogin
                ? "ليس لديك حساب؟ إنشاء حساب جديد"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}