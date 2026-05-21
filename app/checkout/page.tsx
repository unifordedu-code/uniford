"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Moyasar: any;
  }
}

type CartItem = {
  id: string;
  type: "material" | "folder";
  materialId: string;
  folderId?: string;
  name: string;
  price: string;
};

const CART_KEY = "uniford_cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [transferImage, setTransferImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    async function getUser() {
      const { data } = await supabase.auth.getUser();

      setEmail(data.user?.email || "");
    }

    getUser();
  }, []);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  }, [cart]);

  useEffect(() => {
    if (
      paymentMethod !== "card" ||
      !email ||
      total <= 0
    ) {
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.moyasar.com/mpf/1.15.0/moyasar.js";

    script.onload = () => {
      const form = document.getElementById(
        "moyasar-form"
      );

      if (!form || !window.Moyasar) {
        return;
      }

      form.innerHTML = "";

      window.Moyasar.init({
        element: "#moyasar-form",
        amount: total * 100,
        currency: "SAR",
        description: "UNIFORD ORDER",
        publishable_api_key:
          process.env
            .NEXT_PUBLIC_MOYASAR_PK,
        callback_url:
          `${window.location.origin}/payment-complete`,
        methods: [
          "creditcard",
          "applepay",
        ],
      });
    };

    document.body.appendChild(script);
  }, [paymentMethod, total, email]);

  async function handleBankTransfer() {
    if (!transferImage.trim()) {
      alert("أرفق صورة التحويل.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("payment_orders")
      .insert({
        user_email: email,
        items: cart,
        total_price: total.toString(),
        payment_method: "bank_transfer",
        payment_status: "pending",
        transfer_image: transferImage,
      });

    setLoading(false);

    if (error) {
      alert("حدث خطأ أثناء إرسال الطلب.");
      return;
    }

    localStorage.removeItem(CART_KEY);

    window.location.href =
      "/payment-success";
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f9fc] px-6 py-12 text-[#071b3a]"
    >
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 text-center animate-fadeUp">
          <h1 className="text-5xl font-black">
            إتمام الدفع
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Apple Pay / Mada / Visa
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-[32px] bg-white p-8 shadow-xl">
              <h2 className="text-3xl font-black">
                طرق الدفع
              </h2>

              <div className="mt-8 grid gap-4">
                <button
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`rounded-3xl border p-6 text-right transition ${
                    paymentMethod === "card"
                      ? "border-[#1877d2] bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black">
                        Apple Pay / Visa / Mada
                      </h3>

                      <p className="mt-2 text-slate-500">
                        دفع مباشر وآمن.
                      </p>
                    </div>

                    <div className="text-5xl">
                      💳
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod(
                      "bank_transfer"
                    )
                  }
                  className={`rounded-3xl border p-6 text-right transition ${
                    paymentMethod ===
                    "bank_transfer"
                      ? "border-[#1877d2] bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black">
                        تحويل بنكي
                      </h3>

                      <p className="mt-2 text-slate-500">
                        تحويل مع رفع صورة.
                      </p>
                    </div>

                    <div className="text-5xl">
                      🏦
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="rounded-[32px] bg-white p-8 shadow-xl animate-fadeUp">
                <h2 className="text-3xl font-black">
                  الدفع الإلكتروني
                </h2>

                <div
                  id="moyasar-form"
                  className="mt-8 overflow-hidden rounded-3xl border bg-slate-50 p-5"
                />
              </div>
            )}

            {paymentMethod ===
              "bank_transfer" && (
              <div className="rounded-[32px] bg-white p-8 shadow-xl animate-fadeUp">
                <h2 className="text-3xl font-black">
                  معلومات التحويل
                </h2>

                <div className="mt-8 space-y-5 rounded-3xl bg-slate-50 p-6">
                  <div>
                    <p className="text-sm text-slate-500">
                      اسم المستفيد
                    </p>

                    <p className="mt-1 text-xl font-black">
                      شركة يونى فورد
                      للتدريب
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      البنك
                    </p>

                    <p className="mt-1 text-xl font-black">
                      مصرف الإنماء
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      رقم الحساب
                    </p>

                    <p className="mt-1 text-xl font-black">
                      68205062492000
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      IBAN
                    </p>

                    <p className="mt-1 break-all text-xl font-black">
                      SA3205000068205062492000
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-lg font-black">
                    رابط صورة الحوالة
                  </label>

                  <input
                    value={transferImage}
                    onChange={(e) =>
                      setTransferImage(
                        e.target.value
                      )
                    }
                    placeholder="رابط الصورة"
                    className="w-full rounded-2xl border bg-slate-50 px-5 py-4 text-black outline-none transition focus:border-[#1877d2]"
                  />
                </div>

                <button
                  onClick={handleBankTransfer}
                  disabled={loading}
                  className="mt-8 w-full rounded-2xl bg-[#071b3a] py-4 text-lg font-black text-white transition hover:bg-[#0b2a55]"
                >
                  {loading
                    ? "جاري الإرسال..."
                    : "إرسال طلب التحويل"}
                </button>
              </div>
            )}
          </div>

          <aside className="rounded-[32px] bg-white p-8 shadow-xl">
            <h2 className="text-3xl font-black">
              ملخص الطلب
            </h2>

            <div className="mt-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.type ===
                        "material"
                          ? "مادة كاملة"
                          : "ملف منفصل"}
                      </p>
                    </div>

                    <p className="text-lg font-black text-[#1877d2]">
                      {item.price} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  الإجمالي
                </span>

                <span className="text-3xl font-black text-[#1877d2]">
                  {total} ر.س
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}