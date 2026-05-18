import Link from "next/link";
import EditableText from "@/components/EditableText";

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-[#031b3c] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-black">
            <EditableText id="footer.brand.title" defaultValue="يوني فورد" />
          </h2>

          <p className="mt-3 leading-7 text-blue-100">
            <EditableText
              id="footer.brand.description"
              defaultValue="منصة تعليمية متميزة للطلاب الجامعيين والشهادات المهنية."
            />
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-black">
            <EditableText id="footer.links.title" defaultValue="روابط سريعة" />
          </h3>

          <Link href="/" className="block leading-8 text-blue-100">
            <EditableText id="footer.links.home" defaultValue="الرئيسية" />
          </Link>

          <Link href="/universities" className="block leading-8 text-blue-100">
            <EditableText id="footer.links.universities" defaultValue="الجامعات" />
          </Link>

          <Link href="/materials?tag=master" className="block leading-8 text-blue-100">
            <EditableText id="footer.links.master" defaultValue="الماجستير" />
          </Link>

          <Link href="/about" className="block leading-8 text-blue-100">
            <EditableText id="footer.links.about" defaultValue="من نحن" />
          </Link>
        </div>

        <div>
          <h3 className="mb-3 font-black">
            <EditableText id="footer.services.title" defaultValue="خدماتنا" />
          </h3>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.services.one" defaultValue="شروحات ومراجعات" />
          </p>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.services.two" defaultValue="فيديوهات تعليمية" />
          </p>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.services.three" defaultValue="استشارات تعليمية" />
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-black">
            <EditableText id="footer.contact.title" defaultValue="تواصل معنا" />
          </h3>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.contact.phone" defaultValue="9200 24 65" />
          </p>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.contact.email" defaultValue="info@uniford.net" />
          </p>

          <p className="leading-8 text-blue-100">
            <EditableText id="footer.contact.whatsapp" defaultValue="واتساب" />
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-blue-100">
        <EditableText
          id="footer.copyright"
          defaultValue="جميع الحقوق محفوظة © 2026 شركة يوني فورد المحدودة"
        />
      </div>
    </footer>
  );
}