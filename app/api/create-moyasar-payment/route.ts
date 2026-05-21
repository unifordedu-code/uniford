import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = Number(body.amount) * 100;

    const auth = Buffer.from(
      `${process.env.MOYASAR_SECRET_KEY}:`
    ).toString("base64");

    const response = await fetch(
      "https://api.moyasar.com/v1/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "SAR",
          description: "UNIFORD ORDER",
          callback_url:
            `${process.env.NEXT_PUBLIC_SITE_URL}/payment-complete`,
          source: {
            type: "creditcard",
            name: body.email,
            number: "4111111111111111",
            month: 12,
            year: 2030,
            cvc: "123",
          },
          metadata: {
            email: body.email,
            items: JSON.stringify(body.items),
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      url: data.source?.transaction_url || data.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "payment_failed" },
      { status: 500 }
    );
  }
}