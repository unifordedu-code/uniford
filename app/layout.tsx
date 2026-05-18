import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditSaveBar from "@/components/EditSaveBar";
import FreeElementLayer from "@/components/FreeElementLayer";
import UniversalEditor from "@/components/UniversalEditor";

export const metadata: Metadata = {
  title: "يوني فورد",
  description: "منصة تعليمية للمواد الجامعية والماجستير والشهادات المهنية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="relative bg-[#f7f9fc]" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <FreeElementLayer />
        <UniversalEditor />
        <EditSaveBar />
      </body>
    </html>
  );
}