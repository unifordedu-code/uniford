import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const course = body.course?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const note = body.note?.trim();

    if (!name || !course || !email) {
      return NextResponse.json(
        { error: "الاسم واسم الدورة والبريد الإلكتروني مطلوبة." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Uniford <onboarding@resend.dev>",
      to: process.env.REQUEST_TO_EMAIL || "info@uniford.net",
      subject: "طلب دورة جديد من منصة يوني فورد",
      html: `
        <div dir="rtl" style="font-family: Arial; line-height: 1.8;">
          <h2>طلب دورة جديد</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>اسم الدورة المطلوبة:</strong> ${course}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>رقم التواصل:</strong> ${phone || "غير مضاف"}</p>
          <p><strong>ملاحظة إضافية:</strong></p>
          <p>${note || "لا توجد ملاحظات"}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الطلب." },
      { status: 500 }
    );
  }
}