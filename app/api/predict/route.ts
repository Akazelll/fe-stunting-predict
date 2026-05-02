// app/api/predict/route.ts
import { NextRequest, NextResponse } from "next/server";

const HF_SPACE_URL =
  process.env.NEXT_PUBLIC_HF_SPACE_URL ||
  "https://akazelll-stunting-predict.hf.space";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mapping sesuai yang diminta app.py (Hugging Face)
    const payload = {
      Sex: body.sex === "1" ? "Male" : "Female",
      ASI_Eksklusif: body.asi_eksklusif === "1" ? "Yes" : "No",
      Age: Number(body.age),
      Birth_Weight: Number(body.birth_weight),
      Birth_Length: Number(body.birth_length),
      Body_Weight: Number(body.body_weight),
      Body_Length: Number(body.body_length),
    };

    const hfRes = await fetch(`${HF_SPACE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await hfRes.json();

    if (!hfRes.ok) {
      // Handle Error Pydantic
      let errMsg = "Prediksi gagal";
      if (Array.isArray(data.detail)) {
        errMsg = data.detail
          .map((err: any) => `${err.loc[err.loc.length - 1]}: ${err.msg}`)
          .join(", ");
      } else if (data.detail) {
        errMsg = data.detail;
      }
      return NextResponse.json({ error: errMsg }, { status: hfRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/predict] error detail:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
