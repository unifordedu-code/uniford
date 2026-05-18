import Link from "next/link";

export default function CoursePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="font-bold text-[#1877d2]">
          ← الرجوع للرئيسية
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-black text-[#071b3a]">
            مادة المحاسبة - الدرس الأول
          </h1>

          <p className="mt-3 text-slate-600">
            شاهدي الفيديو التعليمي الخاص بالمادة.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-black">
            <iframe
              className="aspect-video w-full"
              src="https://player.vimeo.com/video/1192290374"
              title="Course Video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-xl font-black text-[#071b3a]">
              وصف الدرس
            </h2>
            <p className="mt-2 leading-8 text-slate-600">
              هذا الدرس يشرح مقدمة المادة بطريقة بسيطة ومنظمة.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}