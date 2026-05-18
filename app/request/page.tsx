"use client";

import { useState } from "react";
import EditableText from "@/components/EditableText";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    course: "",
    email: "",
    phone: "",
    university: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function submitRequest() {
    setMessage("");

    if (!form.name.trim() || !form.course.trim() || !form.email.trim()) {
      setMessage("اكتب الاسم واسم المادة والبريد الإلكتروني.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          course: form.course,
          email: form.email,
          phone: form.phone,
          university: form.university,
          note: form.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "تعذر إرسال الطلب، حاول مرة أخرى.");
        setLoading(false);
        return;
      }

      setMessage("تم إرسال الطلب بنجاح، سيتم التواصل لاحقًا.");
      setForm({
        name: "",
        course: "",
        email: "",
        phone: "",
        university: "",
        notes: "",
      });
    } catch {
      setMessage("حدث خطأ أثناء الإرسال. تأكد من إعدادات الإرسال.");
    }

    setLoading(false);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f9fc] px-6 py-14 text-[#071b3a]">
      <section className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-black text-[#1877d2]">
              <EditableText id="request.badge" defaultValue="طلب إضافة مادة" />
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.5] md:text-5xl">
              <EditableText id="request.title" defaultValue="لم تجد المادة المطلوبة؟" />
            </h1>

            <p className="mt-4 max-w-3xl leading-9 text-slate-600">
              <EditableText
                id="request.description"
                defaultValue="يمكن إرسال طلب إضافة مادة أو دورة جديدة، وسيتم مراجعة الطلب والتواصل عند توفر المادة أو إمكانية إضافتها للمنصة."
              />
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-5">
                <div className="text-4xl">📚</div>
                <h3 className="mt-3 font-black">
                  <EditableText id="request.card1.title" defaultValue="مواد جامعية" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <EditableText
                    id="request.card1.desc"
                    defaultValue="يمكن طلب مواد البكالوريوس والماجستير."
                  />
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-5">
                <div className="text-4xl">🎥</div>
                <h3 className="mt-3 font-black">
                  <EditableText id="request.card2.title" defaultValue="فيديوهات تعليمية" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <EditableText
                    id="request.card2.desc"
                    defaultValue="يمكن طلب شرح أو فيديو لموضوع محدد."
                  />
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-5">
                <div className="text-4xl">💼</div>
                <h3 className="mt-3 font-black">
                  <EditableText id="request.card3.title" defaultValue="شهادات مهنية" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <EditableText
                    id="request.card3.desc"
                    defaultValue="يمكن اقتراح محتوى متعلق بالشهادات المهنية."
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#071b3a] to-[#0b2a55] p-8 text-white shadow-xl">
            <h2 className="text-3xl font-black">
              <EditableText id="request.form.title" defaultValue="نموذج الطلب" />
            </h2>

            <p className="mt-3 leading-8 text-blue-100">
              <EditableText
                id="request.form.desc"
                defaultValue="املأ البيانات التالية لإرسال الطلب إلى فريق المنصة."
              />
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block font-bold">الاسم</label>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="اكتب الاسم"
                  className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">اسم المادة المطلوبة</label>
                <input
                  value={form.course}
                  onChange={(e) => updateField("course", e.target.value)}
                  placeholder="مثال: مبادئ المحاسبة"
                  className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">البريد الإلكتروني</label>
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="example@email.com"
                  type="email"
                  className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">رقم التواصل</label>
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="اختياري"
                  className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">الجامعة أو التصنيف</label>
                <input
                  value={form.university}
                  onChange={(e) => updateField("university", e.target.value)}
                  placeholder="مثال: جامعة اليمامة / ماجستير / CFA"
                  className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">ملاحظات إضافية</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="اكتب أي تفاصيل إضافية"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/20 bg-white px-4 py-3 text-black outline-none"
                ></textarea>
              </div>

              {message && (
                <div className="rounded-xl bg-white/10 p-4 text-center font-bold text-white">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={submitRequest}
                disabled={loading}
                className="w-full rounded-xl bg-white py-3 font-black text-[#071b3a] transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "جاري الإرسال..." : "إرسال"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}