import Link from "next/link";

export default function Page() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]"
    >
      <section className="mx-auto max-w-7xl animate-fadeUp">
        <div className="overflow-hidden rounded-[36px] bg-white shadow-2xl">
          <div className="grid items-center gap-8 bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-10 text-white md:grid-cols-2">
            <div>
              <h1 className="text-6xl font-black">
                CFA
              </h1>

              <p className="mt-4 text-2xl font-bold text-blue-100">
                Chartered Financial Analyst
              </p>

              <p className="mt-6 max-w-2xl leading-9 text-blue-100">
                صفحة احترافية مخصصة
                لبرنامج CFA تشمل
                المحاضرات والملفات
                والاختبارات والفيديوهات.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/materials?tag=cfa"
                  className="rounded-2xl bg-white px-8 py-3 font-black text-[#071b3a] transition hover:scale-105"
                >
                  عرض المواد
                </Link>

                <Link
                  href="/cart"
                  className="rounded-2xl bg-emerald-500 px-8 py-3 font-black text-white transition hover:scale-105"
                >
                  إضافة للسلة
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-[32px] bg-white/10 p-12 text-center backdrop-blur-xl">
                <h2 className="text-7xl font-black">
                  CFA
                </h2>

                <p className="mt-4 text-blue-100">
                  Professional Certificate
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-10 md:grid-cols-3">
            <div className="rounded-3xl border bg-slate-50 p-7 transition hover:-translate-y-2 hover:shadow-xl">
              <div className="text-5xl">
                📚
              </div>

              <h3 className="mt-5 text-2xl font-black">
                المحاضرات
              </h3>

              <p className="mt-3 leading-8 text-slate-600">
                جميع محاضرات CFA
                والشروحات الاحترافية.
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-7 transition hover:-translate-y-2 hover:shadow-xl">
              <div className="text-5xl">
                🎥
              </div>

              <h3 className="mt-5 text-2xl font-black">
                الفيديوهات
              </h3>

              <p className="mt-3 leading-8 text-slate-600">
                فيديوهات تعليمية
                احترافية عالية الجودة.
              </p>
            </div>

            <div className="rounded-3xl border bg-slate-50 p-7 transition hover:-translate-y-2 hover:shadow-xl">
              <div className="text-5xl">
                🧾
              </div>

              <h3 className="mt-5 text-2xl font-black">
                الاختبارات
              </h3>

              <p className="mt-3 leading-8 text-slate-600">
                اختبارات ومراجعات
                تدريبية متقدمة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}