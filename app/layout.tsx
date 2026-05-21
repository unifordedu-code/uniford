import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditSaveBar from "@/components/EditSaveBar";
import FreeElementLayer from "@/components/FreeElementLayer";
import UniversalEditor from "@/components/UniversalEditor";
import PageLoader from "@/components/PageLoader";

export const metadata: Metadata = {
  title: "UNIFORD",
  description: "منصة تعليمية جامعية ومهنية",
  icons: {
    icon: "https://uniford.net/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-24-at-12.03.47-AM-300x292.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="relative bg-[#f7f9fc] text-[#071b3a]"
      >
        <PageLoader />

        <Header />

        <div className="page-transition">
          {children}
        </div>

        <Footer />

        <FreeElementLayer />
        <UniversalEditor />
        <EditSaveBar />
      </body>
    </html>
  );
}