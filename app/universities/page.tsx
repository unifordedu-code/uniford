import Link from "next/link";
import EditableText from "@/components/EditableText";

export default function Page() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid items-center gap-8 bg-gradient-to-l from-[#071b3a] to-[#0b2a55] p-8 text-white md:grid-cols-2">
            <div>
              <h1 className="text-5xl font-black">
                <EditableText id="cfa.hero.title" defaultValue="CFA" />
              </h1>

              <p className="mt-4 text-2xl font-bold text-blue-100">
                <EditableText
                  id="cfa.hero.subtitle"
                  defaultValue="Chartered Financial Analyst"
                />
              </p>

              <p className="mt-5 max-w-2xl leading-9 text-blue-100">
                <EditableText
                  id="cfa.hero.description"
                  defaultValue="صفحة مخصصة لبرنامج CFA، وسيتم عرض الدروس والفيديوهات والمواد التدريبية الخاصة بالشهادة هنا."
                />
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/materials?tag=cfa"
                  className="rounded-xl bg-white px-7 py-3 font-bold text-[#071b3a]"
                >
                  <EditableText id="cfa.hero.button.materials" defaultValue="عرض مواد CFA" />
                </Link>

                <Link
                  href="/cart"
                  className="rounded-xl bg-emerald-600 px-7 py-3 font-bold text-white"
                >
                  <EditableText id="cfa.hero.button.cart" defaultValue="إضافة إلى السلة" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-3xl bg-white/10 p-10 text-center shadow-xl ring-1 ring-white/20">
                <p className="text-7xl font-black">
                  <EditableText id="cfa.card.title" defaultValue="CFA" />
                </p>

                <p className="mt-3 text-blue-100">
                  <EditableText id="cfa.card.subtitle" defaultValue="Professional Certificate" />
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-black">
              <EditableText id="cfa.content.title" defaultValue="محتوى البرنامج" />
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border bg-slate-50 p-6">
                <div className="text-4xl">📚</div>

                <h3 className="mt-4 text-xl font-black">
                  <EditableText id="cfa.content.lectures.title" defaultValue="المحاضرات" />
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  <EditableText
                    id="cfa.content.lectures.desc"
                    defaultValue="سيتم عرض محاضرات البرنامج هنا بعد إضافتها."
                  />
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <div className="text-4xl">🎥</div>

                <h3 className="mt-4 text-xl font-black">
                  <EditableText id="cfa.content.videos.title" defaultValue="الفيديوهات" />
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  <EditableText
                    id="cfa.content.videos.desc"
                    defaultValue="سيتم ربط فيديوهات البرنامج بهذه الصفحة."
                  />
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <div className="text-4xl">🧾</div>

                <h3 className="mt-4 text-xl font-black">
                  <EditableText id="cfa.content.tests.title" defaultValue="الاختبارات" />
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  <EditableText
                    id="cfa.content.tests.desc"
                    defaultValue="يمكن إضافة اختبارات ومراجعات تدريبية لاحقًا."
                  />
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-orange-50 p-8">
              <h2 className="text-2xl font-black text-orange-700">
                <EditableText id="cfa.note.title" defaultValue="ملاحظة" />
              </h2>

              <p className="mt-3 leading-8 text-slate-700">
                <EditableText
                  id="cfa.note.description"
                  defaultValue="هذه الصفحة جاهزة كبنية أولية، وعند إضافة فيديوهات أو ملفات CFA يمكن ربطها مباشرة من صفحة المواد أو لوحة التحكم لاحقًا."
                />
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}