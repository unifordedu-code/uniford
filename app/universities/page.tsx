import Link from "next/link";
import { universities } from "@/lib/siteData";

export default function UniversitiesPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]"
    >
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fadeUp">
          <h1 className="text-5xl font-black">
            الجامعات
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            اختر جامعتك للوصول إلى
            المواد والمحاضرات والدورات
            الخاصة بها.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {universities.map((uni) => (
            <Link
              key={uni.slug}
              href={`/universities/${uni.slug}`}
              className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex justify-center">
                <img
                  src={uni.logo}
                  alt={uni.name}
                  className="h-28 w-28 object-contain transition duration-300 group-hover:scale-110"
                />
              </div>

              <div className="mt-7 text-center">
                <h2 className="text-2xl font-black text-[#071b3a]">
                  {uni.name}
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {uni.desc}
                </p>

                <div className="mt-6 rounded-2xl bg-[#071b3a] py-3 font-bold text-white transition group-hover:bg-[#1877d2]">
                  دخول الجامعة
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}