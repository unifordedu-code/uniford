"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { universities } from "@/lib/siteData";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import EditableVisual from "@/components/EditableVisual";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    }

    checkUser();
  }, []);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center transition hover:scale-105">
          <EditableImage
            id="header.logo.image"
            defaultSrc="https://uniford.net/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-16-at-11.15.04-PM-300x300.jpeg"
            alt="يوني فورد"
            defaultStyles={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              objectFit: "contain",
            }}
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#071b3a] md:flex">
          <Link href="/" className="transition hover:text-[#1877d2]">
            <EditableText id="header.nav.home" defaultValue="الرئيسية" />
          </Link>

          <div className="group relative">
            <Link
              href="/universities"
              className="font-semibold transition hover:text-[#1877d2]"
            >
              <EditableText
                id="header.nav.universities"
                defaultValue="الجامعات"
              />
            </Link>

            <div className="invisible absolute right-0 top-full z-50 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="w-[560px] translate-y-2 rounded-3xl border bg-white p-5 shadow-2xl transition-all duration-200 group-hover:translate-y-0">
                <div className="mb-3 rounded-2xl bg-blue-50 px-5 py-4">
                  <p className="text-lg font-black text-[#071b3a]">
                    <EditableText
                      id="header.university.dropdown.title"
                      defaultValue="اختر الجامعة"
                    />
                  </p>

                  <p className="mt-1 text-sm font-normal text-slate-500">
                    <EditableText
                      id="header.university.dropdown.desc"
                      defaultValue="انتقل مباشرة إلى صفحة الجامعة والمواد الخاصة بها"
                    />
                  </p>
                </div>

                <div className="grid gap-3">
                  {universities.map((uni) => (
                    <Link
                      key={uni.slug}
                      href={`/universities/${uni.slug}`}
                      className="flex items-center gap-5 rounded-2xl px-5 py-4 text-sm font-bold text-[#071b3a] transition hover:bg-blue-50 hover:text-[#1877d2]"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl shadow-sm">
                        {uni.logo ? (
                          <EditableImage
                            id={`header.university.logo.${uni.slug}`}
                            defaultSrc={uni.logo}
                            alt={uni.name}
                            defaultStyles={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "14px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <EditableVisual
                            id={`header.university.emoji.${uni.slug}`}
                            defaultValue="🏛️"
                            defaultMode="emoji"
                            alt={uni.name}
                            defaultStyles={{
                              width: "50px",
                              height: "50px",
                              fontSize: "32px",
                              borderRadius: "14px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-black leading-7">
                          <EditableText
                            id={`header.university.name.${uni.slug}`}
                            defaultValue={uni.name}
                          />
                        </p>

                        <p className="mt-1 text-sm font-normal leading-7 text-slate-500">
                          <EditableText
                            id={`header.university.desc.${uni.slug}`}
                            defaultValue="عرض المواد الخاصة بالجامعة"
                          />
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#1877d2] shadow-sm">
                        دخول
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/materials?tag=master"
            className="transition hover:text-[#1877d2]"
          >
            <EditableText id="header.nav.master" defaultValue="الماجستير" />
          </Link>

          <div className="group relative">
            <Link
              href="/certificates/cfa"
              className="font-semibold transition hover:text-[#1877d2]"
            >
              <EditableText
                id="header.nav.certificates"
                defaultValue="الشهادات المهنية"
              />
            </Link>

            <div className="invisible absolute right-0 top-full z-50 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="w-72 translate-y-2 rounded-2xl border bg-white p-3 shadow-2xl transition-all duration-200 group-hover:translate-y-0">
                <Link
                  href="/certificates/cfa"
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-[#071b3a] transition hover:bg-orange-50 hover:text-orange-600"
                >
                  <EditableText
                    id="header.certificates.cfa"
                    defaultValue="CFA"
                  />

                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    <EditableText
                      id="header.certificates.cfa.desc"
                      defaultValue="شهادة المحلل المالي المعتمد"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="transition hover:text-[#1877d2]">
            <EditableText id="header.nav.about" defaultValue="من نحن" />
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-lg bg-[#071b3a] px-5 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b2a55] hover:shadow-lg"
          >
            <EditableText
              id={isLoggedIn ? "header.button.account" : "header.button.login"}
              defaultValue={isLoggedIn ? "حسابي" : "تسجيل الدخول"}
            />
          </Link>

          <Link
            href="/cart"
            className="rounded-xl bg-slate-100 px-3 py-2 text-2xl transition hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-md"
            title="سلة المشتريات"
          >
            <EditableVisual
              id="header.cart.icon"
              defaultValue="🛒"
              defaultMode="emoji"
              alt="سلة المشتريات"
              defaultStyles={{
                width: "32px",
                height: "32px",
                fontSize: "26px",
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}