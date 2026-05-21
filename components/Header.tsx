"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { universities } from "@/lib/siteData";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showUniversities, setShowUniversities] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    }

    checkUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="transition hover:scale-105"
        >
          <img
            src="https://uniford.net/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-24-at-12.03.47-AM-300x292.jpeg"
            alt="UNIFORD"
            className="h-14 w-[150px] rounded-[20px] object-cover"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-bold text-[#071b3a] transition hover:text-[#1877d2]"
          >
            الرئيسية
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 font-bold text-[#071b3a] transition hover:text-[#1877d2]">
              الجامعات
              <ChevronDown size={18} />
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-4 w-[520px] rounded-3xl border bg-white p-4 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div className="space-y-2">
                {universities.map((uni) => (
                  <Link
                    key={uni.slug}
                    href={`/universities/${uni.slug}`}
                    className="flex items-center gap-4 rounded-2xl p-4 transition hover:bg-slate-50"
                  >
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="h-14 w-14 rounded-2xl object-contain"
                    />

                    <div>
                      <h3 className="font-black text-[#071b3a]">
                        {uni.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {uni.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/materials?tag=master"
            className="font-bold text-[#071b3a] transition hover:text-[#1877d2]"
          >
            الماجستير
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1 font-bold text-[#071b3a] transition hover:text-[#1877d2]">
              الشهادات المهنية
              <ChevronDown size={18} />
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-4 w-72 rounded-3xl border bg-white p-3 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <Link
                href="/certificates/cfa"
                className="block rounded-2xl p-4 transition hover:bg-orange-50"
              >
                <h3 className="font-black text-[#071b3a]">
                  CFA
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  شهادة المحلل المالي المعتمد
                </p>
              </Link>
            </div>
          </div>

          <Link
            href="/about"
            className="font-bold text-[#071b3a] transition hover:text-[#1877d2]"
          >
            من نحن
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="transition hover:scale-110"
          >
            <img
              src="https://uniford.net/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-16-at-11.33.31-PM.jpeg"
              alt="Cart"
              className="h-14 w-14 rounded-[22px] object-cover"
            />
          </Link>

          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="hidden rounded-2xl bg-[#071b3a] px-5 py-2 font-bold text-white transition hover:bg-[#0b2a55] md:block"
          >
            {isLoggedIn ? "حسابي" : "تسجيل الدخول"}
          </Link>

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="rounded-xl p-2 transition hover:bg-slate-100 md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="animate-fadeUp border-t bg-white p-5 md:hidden">
          <div className="space-y-3">
            <Link
              href="/"
              className="block rounded-xl p-3 font-bold text-[#071b3a] hover:bg-slate-100"
            >
              الرئيسية
            </Link>

            <button
              onClick={() =>
                setShowUniversities(!showUniversities)
              }
              className="flex w-full items-center justify-between rounded-xl p-3 font-bold text-[#071b3a] hover:bg-slate-100"
            >
              الجامعات
              <ChevronDown size={18} />
            </button>

            {showUniversities && (
              <div className="space-y-2 pr-4">
                {universities.map((uni) => (
                  <Link
                    key={uni.slug}
                    href={`/universities/${uni.slug}`}
                    className="block rounded-xl bg-slate-50 p-3"
                  >
                    {uni.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/materials?tag=master"
              className="block rounded-xl p-3 font-bold text-[#071b3a] hover:bg-slate-100"
            >
              الماجستير
            </Link>

            <button
              onClick={() =>
                setShowCertificates(!showCertificates)
              }
              className="flex w-full items-center justify-between rounded-xl p-3 font-bold text-[#071b3a] hover:bg-slate-100"
            >
              الشهادات المهنية
              <ChevronDown size={18} />
            </button>

            {showCertificates && (
              <div className="space-y-2 pr-4">
                <Link
                  href="/certificates/cfa"
                  className="block rounded-xl bg-orange-50 p-3"
                >
                  CFA
                </Link>
              </div>
            )}

            <Link
              href="/about"
              className="block rounded-xl p-3 font-bold text-[#071b3a] hover:bg-slate-100"
            >
              من نحن
            </Link>

            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="block rounded-2xl bg-[#071b3a] py-3 text-center font-bold text-white"
            >
              {isLoggedIn ? "حسابي" : "تسجيل الدخول"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}