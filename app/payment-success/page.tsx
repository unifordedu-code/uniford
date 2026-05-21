export default function Page() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-6"
    >
      <div className="max-w-xl rounded-[36px] bg-white p-10 text-center shadow-2xl">
        <div className="text-8xl">
          ✅
        </div>

        <h1 className="mt-6 text-4xl font-black text-[#071b3a]">
          تم إرسال الطلب بنجاح
        </h1>

        <p className="mt-5 text-lg leading-9 text-slate-600">
          تم استلام طلب الدفع الخاص بك،
          وسيتم مراجعته من الإدارة قريبًا.
        </p>

        <a
          href="/dashboard"
          className="mt-8 inline-block rounded-2xl bg-[#071b3a] px-8 py-4 text-lg font-black text-white transition hover:bg-[#0b2a55]"
        >
          الذهاب إلى حسابي
        </a>
      </div>
    </main>
  );
}