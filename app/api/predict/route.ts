import { NextRequest, NextResponse } from "next/server";

const HF_SPACE_URL =
  process.env.NEXT_PUBLIC_HF_SPACE_URL ||
  "https://akazelll-stunting-predict.hf.space";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Mapping input dari frontend Next.js ke format Pydantic FastAPI
    const payload = {
      Sex: body.sex === "1" ? "Male" : "Female",
      ASI_Eksklusif: body.asi_eksklusif === "1" ? "Yes" : "No",
      Age: Number(body.age),
      Birth_Weight: Number(body.birth_weight),
      Birth_Length: Number(body.birth_length),
      Body_Weight: Number(body.body_weight),
      Body_Length: Number(body.body_length),
    };

    // 2. Fetch ke Hugging Face Space
    const hfRes = await fetch(`${HF_SPACE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await hfRes.json();

    // 3. Handle Error dari FastAPI/Pydantic
    if (!hfRes.ok) {
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

    // 4. MAPPING DATA DARI HUGGING FACE KE FORMAT FRONTEND
    // Terjemahkan risk level
    let translatedRisk = "Rendah";
    if (data.risk_level === "HIGH") translatedRisk = "Tinggi";
    else if (data.risk_level === "MEDIUM") translatedRisk = "Sedang";

    const formattedData = {
      prediction: data.prediction === 1 ? "Stunting" : "Normal",
      is_stunting: data.prediction === 1,
      stunting_probability: data.probability?.stunting || 0,
      risk_level: translatedRisk,
      probabilities: {
        Normal: data.probability?.tidak_stunting || 0,
        Stunting: data.probability?.stunting || 0,
      },
      model_used: "PIPELINE.PKL (Hugging Face)",
      input_received: data.input_echo || {},
    };

    // 5. Kirim data yang sudah rapi ke frontend
    return NextResponse.json(formattedData);
  } catch (err) {
    console.error("[/api/predict] error detail:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
