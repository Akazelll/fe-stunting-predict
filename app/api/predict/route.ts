// app/api/predict/route.ts
// Route ini bertindak sebagai proxy — HF_SPACE_URL disimpan di server (tidak ekspos ke client)

import { NextRequest, NextResponse } from "next/server";

const HF_SPACE_URL =
  process.env.HF_SPACE_URL ||
  process.env.NEXT_PUBLIC_HF_SPACE_URL ||
  "https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const hfRes = await fetch(`${HF_SPACE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await hfRes.json();

    if (!hfRes.ok) {
      return NextResponse.json(
        { error: data.detail ?? "Prediksi gagal" },
        { status: hfRes.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/predict] error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const hfRes = await fetch(`${HF_SPACE_URL}/health`);
    const data = await hfRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "unreachable" }, { status: 503 });
  }
}
