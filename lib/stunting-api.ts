// lib/stunting-api.ts
// Ganti HF_SPACE_URL dengan URL HuggingFace Space Anda setelah deploy

const HF_SPACE_URL =
  process.env.NEXT_PUBLIC_HF_SPACE_URL ||
  "https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space";

export type ModelType = "best" | "decision_tree" | "naive_bayes" | "svm";

export interface PredictInput {
  age: number;
  sex: number; // 0 = Perempuan, 1 = Laki-laki
  birth_weight: number; // kg
  birth_length: number; // cm
  body_weight: number; // kg
  body_length: number; // cm
  asi_eksklusif: number; // 0 = Tidak, 1 = Ya
  model?: ModelType;
}

export interface PredictResult {
  prediction: number; // 0 atau 1
  label: string; // "Stunting" atau "Tidak Stunting"
  probability_stunting: number;
  probability_normal: number;
  model_used: string;
  features_used: number;
}

export interface HealthResult {
  status: string;
  models_loaded: string[];
  feature_count: number;
}

export async function checkHealth(): Promise<HealthResult> {
  const res = await fetch(`${HF_SPACE_URL}/health`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 }, // cache 60 detik
  });
  if (!res.ok) throw new Error(`Health check gagal: ${res.status}`);
  return res.json();
}

export async function predictStunting(
  data: PredictInput,
): Promise<PredictResult> {
  const res = await fetch(`${HF_SPACE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, model: data.model ?? "best" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Prediksi gagal");
  }

  return res.json();
}
