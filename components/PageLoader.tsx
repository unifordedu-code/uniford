"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <img
          src="https://uniford.net/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-24-at-12.03.47-AM-300x292.jpeg"
          alt="UNIFORD"
          className="h-28 w-28 animate-bounce rounded-[28px] object-cover shadow-2xl"
        />

        <div className="mt-8 h-2 w-48 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-full animate-pulse rounded-full bg-[#1877d2]" />
        </div>

        <p className="mt-5 text-lg font-black text-[#071b3a]">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}