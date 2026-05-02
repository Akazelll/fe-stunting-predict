"use client";

import { useState } from "react";
import type { PredictResult, ModelType } from "@/lib/stunting-api";

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  age: string;
  sex: string;
  birth_weight: string;
  birth_length: string;
  body_weight: string;
  body_length: string;
  asi_eksklusif: string;
  model: ModelType;
}

const INITIAL_FORM: FormData = {
  age: "",
  sex: "1",
  birth_weight: "",
  birth_length: "",
  body_weight: "",
  body_length: "",
  asi_eksklusif: "1",
  model: "best",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function PredictPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        age: parseFloat(form.age),
        sex: parseInt(form.sex),
        birth_weight: parseFloat(form.birth_weight),
        birth_length: parseFloat(form.birth_length),
        body_weight: parseFloat(form.body_weight),
        body_length: parseFloat(form.body_length),
        asi_eksklusif: parseInt(form.asi_eksklusif),
        model: form.model,
      };

      // Gunakan API route Next.js sebagai proxy
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Prediksi gagal");
      }

      const data: PredictResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const isStunting = result?.prediction === 1;
  const probPct = result
    ? Math.round(
        (isStunting ? result.probability_stunting : result.probability_normal) *
          100,
      )
    : 0;

  return (
    <main className='min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-teal-800 mb-2'>
            🧠 Deteksi Risiko Stunting
          </h1>
          <p className='text-teal-600 text-sm'>
            Berdasarkan Standar WHO — Decision Tree · Naive Bayes · SVM
          </p>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Model Selector */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Algoritma Model
              </label>
              <select
                name='model'
                value={form.model}
                onChange={handleChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
              >
                <option value='best'>🏆 Model Terbaik (otomatis)</option>
                <option value='decision_tree'>🌳 Decision Tree</option>
                <option value='naive_bayes'>📊 Naive Bayes</option>
                <option value='svm'>⚙️ Support Vector Machine</option>
              </select>
            </div>

            {/* Row: Umur + Jenis Kelamin */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Umur Anak (bulan)
                </label>
                <input
                  type='number'
                  name='age'
                  value={form.age}
                  onChange={handleChange}
                  required
                  min={0}
                  max={60}
                  step={0.1}
                  placeholder='cth: 24'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Jenis Kelamin
                </label>
                <select
                  name='sex'
                  value={form.sex}
                  onChange={handleChange}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                >
                  <option value='1'>Laki-laki</option>
                  <option value='0'>Perempuan</option>
                </select>
              </div>
            </div>

            {/* Row: Berat Lahir + Panjang Lahir */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Berat Lahir (kg)
                </label>
                <input
                  type='number'
                  name='birth_weight'
                  value={form.birth_weight}
                  onChange={handleChange}
                  required
                  min={0.5}
                  max={6}
                  step={0.01}
                  placeholder='cth: 3.1'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Panjang Lahir (cm)
                </label>
                <input
                  type='number'
                  name='birth_length'
                  value={form.birth_length}
                  onChange={handleChange}
                  required
                  min={30}
                  max={65}
                  step={0.1}
                  placeholder='cth: 49'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                />
              </div>
            </div>

            {/* Row: Berat Badan + Panjang Badan */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Berat Badan Sekarang (kg)
                </label>
                <input
                  type='number'
                  name='body_weight'
                  value={form.body_weight}
                  onChange={handleChange}
                  required
                  min={1}
                  max={30}
                  step={0.01}
                  placeholder='cth: 10.5'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>
                  Panjang Badan Sekarang (cm)
                </label>
                <input
                  type='number'
                  name='body_length'
                  value={form.body_length}
                  onChange={handleChange}
                  required
                  min={40}
                  max={130}
                  step={0.1}
                  placeholder='cth: 85'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
                />
              </div>
            </div>

            {/* ASI */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                ASI Eksklusif (0–6 bulan pertama)
              </label>
              <select
                name='asi_eksklusif'
                value={form.asi_eksklusif}
                onChange={handleChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
              >
                <option value='1'>Ya, mendapat ASI Eksklusif</option>
                <option value='0'>Tidak mendapat ASI Eksklusif</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm'
            >
              {loading ? "⏳ Menganalisis..." : "🔍 Prediksi Sekarang"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6'>
            ⚠️ {error}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div
            className={`rounded-2xl shadow-lg p-6 border-2 ${
              isStunting
                ? "bg-red-50 border-red-300"
                : "bg-green-50 border-green-300"
            }`}
          >
            <div className='text-center mb-4'>
              <div className='text-5xl mb-2'>{isStunting ? "⚠️" : "✅"}</div>
              <h2
                className={`text-2xl font-bold ${
                  isStunting ? "text-red-700" : "text-green-700"
                }`}
              >
                {result.label}
              </h2>
              <p className='text-gray-500 text-sm mt-1'>
                Menggunakan model:{" "}
                <span className='font-semibold'>{result.model_used}</span>
              </p>
            </div>

            {/* Probability bars */}
            <div className='space-y-3 mt-4'>
              {/* Stunting bar */}
              <div>
                <div className='flex justify-between text-xs text-gray-600 mb-1'>
                  <span>Probabilitas Stunting</span>
                  <span className='font-semibold'>
                    {(result.probability_stunting * 100).toFixed(1)}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className='bg-red-400 h-3 rounded-full transition-all duration-700'
                    style={{
                      width: `${result.probability_stunting * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Normal bar */}
              <div>
                <div className='flex justify-between text-xs text-gray-600 mb-1'>
                  <span>Probabilitas Normal</span>
                  <span className='font-semibold'>
                    {(result.probability_normal * 100).toFixed(1)}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className='bg-green-400 h-3 rounded-full transition-all duration-700'
                    style={{
                      width: `${result.probability_normal * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Confidence */}
            <p className='text-center text-xs text-gray-400 mt-4'>
              Tingkat keyakinan:{" "}
              <span className='font-semibold text-gray-600'>{probPct}%</span> ·{" "}
              {result.features_used} fitur dianalisis
            </p>

            {/* Disclaimer */}
            {isStunting && (
              <div className='mt-4 bg-red-100 rounded-xl p-3 text-xs text-red-700'>
                ℹ️ Hasil ini bersifat indikatif. Segera konsultasikan dengan
                dokter atau tenaga kesehatan untuk penanganan lebih lanjut.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
