import { NextRequest, NextResponse } from "next/server";

const HF_SPACE_URL = "https://akazelll-stuntcheck.hf.space";

type FrontendPredictBody = {
  sex?: string;
  Sex?: string;
  age?: number | string;
  Age?: number | string;
  birth_weight?: number | string;
  Birth_Weight?: number | string;
  birth_length?: number | string;
  Birth_Length?: number | string;
  body_weight?: number | string;
  Body_Weight?: number | string;
  body_length?: number | string;
  Body_Length?: number | string;
  asi_eksklusif?: string;
  ASI_Eksklusif?: string;
};

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? 0 : numberValue;
}

function normalizeSex(value: unknown) {
  const sex = String(value ?? "").trim();

  if (sex === "1") return "Male";
  if (sex === "0") return "Female";
  if (sex === "Laki-laki") return "Laki-laki";
  if (sex === "Perempuan") return "Perempuan";
  if (sex === "Male") return "Male";
  if (sex === "Female") return "Female";

  return sex || "Male";
}

function normalizeAsi(value: unknown) {
  const asi = String(value ?? "").trim();

  if (asi === "1") return "Yes";
  if (asi === "0") return "No";
  if (asi === "Ya") return "Ya";
  if (asi === "Tidak") return "Tidak";
  if (asi === "Yes") return "Yes";
  if (asi === "No") return "No";

  return asi || "Yes";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FrontendPredictBody;

    const payload = {
      Age: toNumber(body.Age ?? body.age),
      Sex: normalizeSex(body.Sex ?? body.sex),
      Birth_Weight: toNumber(body.Birth_Weight ?? body.birth_weight),
      Birth_Length: toNumber(body.Birth_Length ?? body.birth_length),
      Body_Weight: toNumber(body.Body_Weight ?? body.body_weight),
      Body_Length: toNumber(body.Body_Length ?? body.body_length),
      ASI_Eksklusif: normalizeAsi(body.ASI_Eksklusif ?? body.asi_eksklusif),
    };

    console.log("[/api/predict] HF URL:", HF_SPACE_URL);
    console.log("[/api/predict] Payload sent:", payload);

    const hfRes = await fetch(`${HF_SPACE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await hfRes.json();

    console.log("[/api/predict] HF status:", hfRes.status);
    console.log("[/api/predict] HF response:", data);

    if (!hfRes.ok) {
      let errorMessage = "Prediksi gagal";

      if (Array.isArray(data.detail)) {
        errorMessage = data.detail
          .map((err: any) => {
            const field = err.loc?.[err.loc.length - 1] ?? "field";
            return `${field}: ${err.msg}`;
          })
          .join(", ");
      } else if (data.detail) {
        errorMessage = data.detail;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          hf_status: hfRes.status,
          hf_url: `${HF_SPACE_URL}/predict`,
          input_sent: payload,
          raw_response: data,
        },
        { status: hfRes.status },
      );
    }

    const isStunting = data.prediction === "yes";

    return NextResponse.json({
      prediction: isStunting ? "Stunting" : "Normal",
      is_stunting: isStunting,
      prediction_label: data.prediction_label,
      confidence: data.confidence,
      stunting_probability: data.probabilities?.yes ?? 0,
      risk_level: isStunting ? "Tinggi" : "Rendah",
      probabilities: {
        Normal: data.probabilities?.no ?? 0,
        Stunting: data.probabilities?.yes ?? 0,
      },
      recommendation: data.recommendation,
      model_used: "Decision Tree - Hugging Face Space",
      input_received: payload,
      raw_response: data,
    });
  } catch (err) {
    console.error("[/api/predict] error detail:", err);

    return NextResponse.json(
      {
        error: "Terjadi kesalahan server saat memproses prediksi",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
