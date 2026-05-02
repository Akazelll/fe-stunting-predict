// hooks/usePredict.ts
import { useState } from "react";
import { PredictInput, PredictResult } from "@/types/predict";

const INITIAL_FORM: PredictInput = {
  Sex: "Male",
  Age: 12,
  Birth_Weight: 3.0,
  Birth_Length: 50,
  Body_Weight: 8.0,
  Body_Length: 72,
  ASI_Eksklusif: "Yes",
};

export function usePredict() {
  const [form, setForm] = useState<PredictInput>(INITIAL_FORM);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://akazelll-stunting-predict.hf.space";

  const handleChange = (name: keyof PredictInput, val: string) => {
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "Sex" || name === "ASI_Eksklusif"
          ? val
          : val === ""
            ? ""
            : parseFloat(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.detail || `Server error: ${res.status}`);
      }

      const data: PredictResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  return {
    form,
    result,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
