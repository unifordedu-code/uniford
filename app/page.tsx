"use client";

import Link from "next/link";
import { useState } from "react";
import { universities } from "@/lib/siteData";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";

export default function Home() {
  const [search, setSearch] = useState("");

  function runSearch() {
    const value = search.trim();

    if (!value) {
      return;
    }

    window.location.href = `/materials?search=${encodeURIComponent(value)}`;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] text-[#071b3a]">
      <section className="relative overflow-hidden bg-gradient-to-l from-white via-[#eef4fb] to-[#dce8f5]">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl"></div>

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="rounded-3xl bg-white/60 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-56 rounded-2xl bg-gradient-to-br from-[#0b2a55] to-[#d9e6f5] p-6 text-white shadow-lg">
                <div className="h-full rounded-xl border border-white/30 bg-white/10 p-4">
                  <p className="text-sm">UNIFORD</p>
                  <div className="mt-10 h-20 rounded-lg bg-white/20"></div>
                </div>
              </div>

              <div className="mx-auto mt-4 h-20 w-28 rounded-b-full bg-[#0b2a55] pt-6 text-center text-xs text-white">
                يوني فورد
              </div>
            </div>
          </div>

          <div className="order-1 text-center md:order-2">
            <h2 className="text-4xl font-black leading-[1.6] md:text-5xl">
              <EditableText
                id="home.hero.title.line1"
                defaultValue="موادك الجامعية والماجستير"
              />
              <br />
              <EditableText
                id="home.hero.title.line2"
                defaultValue="وشهاداتك المهنية في"
              />{" "}
              <span className="text-[#1877d2]">
                <EditableText
                  id="home.hero.title.blue"
                  defaultValue="مكان واحد"
                />
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-9 text-slate-700">
              <EditableText
                id="home.hero.description"
                defaultValue="منصة يوني فورد التعليمية تساعد على الوصول إلى المواد حسب الجامعة والبرنامج من خلال شروحات منظمة ومسارات تعليمية مهنية."
              />
            </p>

            <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-md transition focus-within:ring-2 focus-within:ring-[#1877d2]">
              <span className="text-2xl">🔍</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runSearch();
                  }
                }}
                className="w-full bg-transparent text-right text-black placeholder:text-slate-400 outline-none"
                placeholder="ابحث باسم الجامعة، المادة، رمز المقرر، برنامج الماجستير..."
              />

              <button
                type="button"
                onClick={runSearch}
                className="rounded-lg bg-[#071b3a] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#0b2a55]"
              >
                بحث
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/universities"
                className="rounded-xl bg-[#071b3a] px-8 py-4 font-bold text-white shadow transition hover:-translate-y-1 hover:bg-[#0b2a55] hover:shadow-lg"
              >
                <EditableText
                  id="home.hero.button.university"
                  defaultValue="اختيار الجامعة 🏛️"
                />
              </Link>

              <Link
                href="/materials"
                className="rounded-xl bg-white px-8 py-4 font-bold text-[#071b3a] shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <EditableText
                  id="home.hero.button.materials"
                  defaultValue="تصفح المواد 📖"
                />
              </Link>

              <Link
                href="/request"
                className="rounded-xl bg-white px-8 py-4 font-bold text-[#071b3a] shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <EditableText
                  id="home.hero.button.request"
                  defaultValue="طلب مادة ➕"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-8 text-center text-3xl font-black">
          <EditableText id="home.choose.title" defaultValue="اختر ما يناسبك" />
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="text-5xl">🎓</div>

            <h3 className="mt-4 text-2xl font-black text-emerald-700">
              <EditableText
                id="home.choose.bachelor.title"
                defaultValue="البكالوريوس"
              />
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              <EditableText
                id="home.choose.bachelor.description"
                defaultValue="شروحات ومراجعات للمواد الجامعية حسب الجامعة والمقرر."
              />
            </p>

            <Link
              href="/materials?tag=bachelor"
              className="-mt-1 block w-full rounded-xl bg-emerald-700 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg"
            >
              <EditableText
                id="home.choose.bachelor.button"
                defaultValue="تصفح مواد البكالوريوس"
              />
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="text-5xl">🎓</div>

            <h3 className="mt-4 text-2xl font-black text-violet-700">
              <EditableText
                id="home.choose.master.title"
                defaultValue="الماجستير"
              />
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              <EditableText
                id="home.choose.master.description"
                defaultValue="دعم أكاديمي لمواد وبرامج الماجستير في أكثر من جامعة."
              />
            </p>

            <Link
              href="/materials?tag=master"
              className="mt-6 block w-full rounded-xl bg-violet-700 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-violet-800 hover:shadow-lg"
            >
              <EditableText
                id="home.choose.master.button"
                defaultValue="تصفح مواد الماجستير"
              /
             >
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="text-5xl">💼</div>

            <h3 className="mt-4 text-2xl font-black text-orange-600">
              <EditableText
                id="home.choose.certificates.title"
                defaultValue="الشهادات المهنية"
              />
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              <EditableText
                id="home.choose.certificates.description"
                defaultValue="برامج تعليمية متخصصة للشهادات المهنية مثل CFA."
              />
            </p>

            <Link
              href="/certificates/cfa"
              className="mt-6 block w-full rounded-xl bg-orange-600 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg"
            >
              <EditableText
                id="home.choose.certificates.button"
                defaultValue="استعراض الشهادات المهنية"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">
            <EditableText
              id="home.universities.title"
              defaultValue="الجامعات المتاحة"
            />
          </h2>

          <Link
            className="text-sm font-bold text-[#1877d2]"
            href="/universities"
          >
            <EditableText
              id="home.universities.showAll"
              defaultValue="عرض جميع الجامعات"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {universities.map((uni) => (
            <Link
              key={uni.slug}
              href={`/universities/${uni.slug}`}
              className="rounded-2xl border bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 p-2 text-2xl">
                {uni.logo ? (
                  <EditableImage
                    id={`home.university.logo.${uni.slug}`}
                    defaultSrc={uni.logo}
                    alt={uni.name}
                    defaultStyles={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  "🏛️"
                )}
              </div>

              <p className="text-base font-bold">
                <EditableText
                  id={`home.university.name.${uni.slug}`}
                  defaultValue={uni.name}
                />
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                <EditableText
                  id={`home.university.desc.${uni.slug}`}
                  defaultValue={uni.desc}
                />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid items-center gap-8 rounded-2xl bg-gradient-to-l from-[#eef7f2] to-white p-8 shadow-sm transition hover:shadow-xl md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">
              <EditableText
                id="home.cfa.title"
                defaultValue="الاستعداد لشهادة CFA مع يوني فورد"
              />
            </h2>

            <p className="mt-3 leading-8 text-slate-600">
              <EditableText
                id="home.cfa.description"
                defaultValue="برنامج مهني منظم يساعد على فهم المفاهيم المالية والاستعداد لاختبار CFA بخطة واضحة."
              />
            </p>

            <Link
              href="/certificates/cfa"
              className="mt-10 inline-block rounded-lg bg-emerald-700 px-8 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg"
            >
              <EditableText id="home.cfa.button" defaultValue="عرض البرنامج" />
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl bg-[#071b3a] px-10 py-14 text-center text-white shadow-xl transition hover:rotate-1 hover:scale-105">
              <p className="text-5xl font-black">
                <EditableText id="home.cfa.card.title" defaultValue="CFA" />
              </p>

              <p className="mt-3">
                <EditableText
                  id="home.cfa.card.subtitle"
                  defaultValue="Chartered Financial Analyst"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 pb-12 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-3xl font-black">
            <EditableText id="home.stats.students.number" defaultValue="+70K" />
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <EditableText
              id="home.stats.students.label"
              defaultValue="طالب وطالبة"
            />
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-3xl font-black">
            <EditableText id="home.stats.hours.number" defaultValue="+6,000" />
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <EditableText
              id="home.stats.hours.label"
              defaultValue="ساعة تعليمية"
            />
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-3xl font-black">
            <EditableText id="home.stats.teachers.number" defaultValue="+350" />
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <EditableText
              id="home.stats.teachers.label"
              defaultValue="مدرب ومشرف"
            />
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-3xl font-black">
            <EditableText
              id="home.stats.satisfaction.number"
              defaultValue="99%"
            />
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <EditableText
              id="home.stats.satisfaction.label"
              defaultValue="رضا العملاء"
            />
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:shadow-xl">
          <h2 className="text-3xl font-black text-[#071b3a]">
            <EditableText id="home.request.title" defaultValue="طلب مادة" />
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-8 text-slate-600">
            <EditableText
              id="home.request.description"
              defaultValue="عند عدم توفر المادة المطلوبة، يمكن إرسال طلب إضافة مادة وسيتم التواصل لاحقًا."
            />
          </p>

          <Link
            href="/request"
            className="mt-6 inline-block rounded-xl bg-[#071b3a] px-8 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-[#0b2a55] hover:shadow-lg"
          >
            <EditableText
              id="home.request.button"
              defaultValue="الانتقال إلى صفحة الطلب"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}