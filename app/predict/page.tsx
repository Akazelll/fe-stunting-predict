"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PredictInput {
  Sex: "Male" | "Female";
  Age: number;
  Birth_Weight: number;
  Birth_Length: number;
  Body_Weight: number;
  Body_Length: number;
  ASI_Eksklusif: "Yes" | "No";
}

interface WhoFlags {
  length_for_age_z: number;
  weight_for_age_z: number;
  stunting_who_indicator: 0 | 1;
  severe_stunting: 0 | 1;
  underweight: 0 | 1;
  low_birth_weight: 0 | 1;
}

interface PredictResult {
  prediction: 0 | 1;
  label: string;
  probability: {
    stunting: number;
    tidak_stunting: number;
  };
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  who_flags: WhoFlags;
  model_used: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const API_BASE = "https://akazelll-stunting-predict.hf.space";

const INITIAL_FORM: PredictInput = {
  Sex: "Male",
  Age: 12,
  Birth_Weight: 3.0,
  Birth_Length: 50,
  Body_Weight: 8.0,
  Body_Length: 72,
  ASI_Eksklusif: "Yes",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProbabilityBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className='mb-3'>
      <div className='flex justify-between mb-1'>
        <span className='text-sm font-medium text-slate-700'>{label}</span>
        <span className='text-sm font-bold' style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className='w-full bg-slate-100 rounded-full h-3 overflow-hidden'>
        <div
          className='h-3 rounded-full transition-all duration-700 ease-out'
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function WhoFlagBadge({
  label,
  value,
  isRisk,
}: {
  label: string;
  value: number;
  isRisk: boolean;
}) {
  const active = value === 1;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
        active && isRisk
          ? "bg-red-50 border border-red-200 text-red-700"
          : active
            ? "bg-amber-50 border border-amber-200 text-amber-700"
            : "bg-slate-50 border border-slate-200 text-slate-500"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${active && isRisk ? "bg-red-500" : active ? "bg-amber-400" : "bg-slate-300"}`}
      />
      {label}
    </div>
  );
}

function ZScoreBadge({ label, value }: { label: string; value: number }) {
  const color =
    value < -3
      ? "bg-red-100 text-red-700 border-red-200"
      : value < -2
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : "bg-green-100 text-green-700 border-green-200";

  return (
    <div
      className={`flex justify-between items-center px-3 py-2 rounded-lg border text-sm ${color}`}
    >
      <span className='font-medium'>{label}</span>
      <span className='font-bold tabular-nums'>{value.toFixed(2)}</span>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
  unit,
  hint,
}: {
  label: string;
  name: keyof PredictInput;
  value: number | string;
  onChange: (name: keyof PredictInput, val: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1'>
        {label}
        {unit && (
          <span className='ml-1 text-xs font-normal text-slate-400'>
            ({unit})
          </span>
        )}
      </label>
      {hint && <p className='text-xs text-slate-400 mb-1'>{hint}</p>}
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
          text-sm transition placeholder-slate-300'
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  name: keyof PredictInput;
  value: string;
  options: { label: string; value: string }[];
  onChange: (name: keyof PredictInput, val: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className='block text-sm font-semibold text-slate-700 mb-1'>
        {label}
      </label>
      {hint && <p className='text-xs text-slate-400 mb-1'>{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
          text-sm transition appearance-none cursor-pointer'
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PredictPage() {
  const [form, setForm] = useState<PredictInput>(INITIAL_FORM);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(
          errData?.detail || `Server error: ${res.status} ${res.statusText}`,
        );
      }

      const data: PredictResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan tidak dikenal.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  const riskConfig = {
    LOW: {
      label: "RISIKO RENDAH",
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-700",
      badge: "bg-emerald-500",
      icon: "✓",
      desc: "Pertumbuhan anak tergolong normal. Tetap pantau tumbuh kembang secara rutin.",
    },
    MEDIUM: {
      label: "RISIKO SEDANG",
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-700",
      badge: "bg-amber-500",
      icon: "!",
      desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
    },
    HIGH: {
      label: "RISIKO TINGGI",
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-700",
      badge: "bg-red-500",
      icon: "✕",
      desc: "Anak terindikasi stunting. Segera konsultasikan dengan dokter atau ahli gizi.",
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200/70'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm'>
            SP
          </div>
          <div>
            <h1 className='text-sm font-bold text-slate-800 leading-none'>
              Stunting Predict
            </h1>
            <p className='text-xs text-slate-400 mt-0.5'>
              Deteksi dini risiko stunting anak
            </p>
          </div>
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-4 py-8 space-y-8'>
        {/* Hero */}
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-extrabold text-slate-800 tracking-tight'>
            Prediksi Status Stunting
          </h2>
          <p className='text-slate-500 text-sm max-w-xl mx-auto'>
            Masukkan data antropometri anak untuk mendapatkan prediksi risiko
            stunting menggunakan model Machine Learning berbasis data 13.814
            anak.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* ── Form ── */}
          <div className='lg:col-span-3'>
            <form
              onSubmit={handleSubmit}
              className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'
            >
              {/* Form Header */}
              <div className='px-6 py-4 border-b border-slate-100 bg-slate-50/50'>
                <h3 className='font-bold text-slate-700 text-sm uppercase tracking-wider'>
                  Data Anak
                </h3>
              </div>

              <div className='p-6 space-y-5'>
                {/* Row 1 */}
                <div className='grid grid-cols-2 gap-4'>
                  <SelectField
                    label='Jenis Kelamin'
                    name='Sex'
                    value={form.Sex}
                    options={[
                      { label: "Laki-laki", value: "Male" },
                      { label: "Perempuan", value: "Female" },
                    ]}
                    onChange={handleChange}
                  />
                  <InputField
                    label='Umur'
                    name='Age'
                    value={form.Age}
                    onChange={handleChange}
                    unit='bulan'
                    min={1}
                    max={60}
                    step={1}
                    hint='Rentang 1–60 bulan'
                  />
                </div>

                {/* Divider */}
                <div className='flex items-center gap-3'>
                  <div className='flex-1 h-px bg-slate-100' />
                  <span className='text-xs text-slate-400 font-medium'>
                    DATA LAHIR
                  </span>
                  <div className='flex-1 h-px bg-slate-100' />
                </div>

                {/* Row 2 */}
                <div className='grid grid-cols-2 gap-4'>
                  <InputField
                    label='Berat Lahir'
                    name='Birth_Weight'
                    value={form.Birth_Weight}
                    onChange={handleChange}
                    unit='kg'
                    min={0}
                    max={10}
                    step={0.1}
                    hint='Contoh: 3.2'
                  />
                  <InputField
                    label='Panjang Lahir'
                    name='Birth_Length'
                    value={form.Birth_Length}
                    onChange={handleChange}
                    unit='cm'
                    min={30}
                    max={70}
                    step={0.1}
                    hint='Contoh: 50'
                  />
                </div>

                {/* Divider */}
                <div className='flex items-center gap-3'>
                  <div className='flex-1 h-px bg-slate-100' />
                  <span className='text-xs text-slate-400 font-medium'>
                    DATA SAAT INI
                  </span>
                  <div className='flex-1 h-px bg-slate-100' />
                </div>

                {/* Row 3 */}
                <div className='grid grid-cols-2 gap-4'>
                  <InputField
                    label='Berat Badan'
                    name='Body_Weight'
                    value={form.Body_Weight}
                    onChange={handleChange}
                    unit='kg'
                    min={0}
                    max={30}
                    step={0.1}
                    hint='Berat saat ini'
                  />
                  <InputField
                    label='Tinggi Badan'
                    name='Body_Length'
                    value={form.Body_Length}
                    onChange={handleChange}
                    unit='cm'
                    min={30}
                    max={130}
                    step={0.1}
                    hint='Panjang/tinggi saat ini'
                  />
                </div>

                {/* ASI */}
                <SelectField
                  label='ASI Eksklusif'
                  name='ASI_Eksklusif'
                  value={form.ASI_Eksklusif}
                  options={[
                    { label: "Ya — mendapat ASI eksklusif", value: "Yes" },
                    {
                      label: "Tidak — tidak mendapat ASI eksklusif",
                      value: "No",
                    },
                  ]}
                  onChange={handleChange}
                  hint='Pemberian ASI eksklusif selama 6 bulan pertama'
                />
              </div>

              {/* Form Footer */}
              <div className='px-6 pb-6 flex gap-3'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98]
                    text-white font-bold text-sm transition-all shadow-sm disabled:opacity-60
                    disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <svg
                        className='animate-spin w-4 h-4'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v8z'
                        />
                      </svg>
                      Menganalisis...
                    </>
                  ) : (
                    "Prediksi Sekarang"
                  )}
                </button>
                <button
                  type='button'
                  onClick={handleReset}
                  className='px-4 py-3 rounded-xl border border-slate-200 text-slate-500
                    hover:bg-slate-50 text-sm font-medium transition-all'
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* ── Result Panel ── */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-2xl p-4'>
                <div className='flex items-start gap-3'>
                  <span className='text-red-500 text-lg mt-0.5'>⚠</span>
                  <div>
                    <p className='font-bold text-red-700 text-sm'>
                      Gagal memproses
                    </p>
                    <p className='text-red-600 text-xs mt-1 leading-relaxed'>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder */}
            {!result && !loading && !error && (
              <div className='bg-white rounded-2xl border border-slate-200 border-dashed p-8 text-center space-y-3'>
                <div className='w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-2xl'>
                  🧒
                </div>
                <p className='text-sm text-slate-400 leading-relaxed'>
                  Isi form di sebelah kiri dan klik{" "}
                  <strong>Prediksi Sekarang</strong> untuk melihat hasil
                  analisis.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className='bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse'>
                <div className='h-5 bg-slate-100 rounded-lg w-3/4' />
                <div className='h-12 bg-slate-100 rounded-xl' />
                <div className='space-y-2'>
                  <div className='h-3 bg-slate-100 rounded w-full' />
                  <div className='h-3 bg-slate-100 rounded w-5/6' />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className='h-8 bg-slate-100 rounded-lg' />
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <>
                {/* Risk Card */}
                {(() => {
                  const cfg = riskConfig[result.risk_level];
                  return (
                    <div
                      className={`rounded-2xl border-2 p-5 ${cfg.bg} ${cfg.border}`}
                    >
                      <div className='flex items-center gap-3 mb-3'>
                        <div
                          className={`w-10 h-10 rounded-xl ${cfg.badge} flex items-center justify-center text-white font-black text-lg`}
                        >
                          {cfg.icon}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${cfg.text} opacity-70`}
                          >
                            Hasil Prediksi
                          </p>
                          <p className={`font-extrabold text-base ${cfg.text}`}>
                            {result.label}
                          </p>
                        </div>
                        <span
                          className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge} text-white`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${cfg.text} opacity-80`}
                      >
                        {cfg.desc}
                      </p>
                    </div>
                  );
                })()}

                {/* Probability */}
                <div className='bg-white rounded-2xl border border-slate-200 p-5'>
                  <h4 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-4'>
                    Distribusi Probabilitas
                  </h4>
                  <ProbabilityBar
                    label='Stunting'
                    value={result.probability?.stunting ?? 0}
                    color='#ef4444'
                  />
                  <ProbabilityBar
                    label='Tidak Stunting'
                    value={result.probability?.tidak_stunting ?? 0}
                    color='#10b981'
                  />
                </div>

                {/* Z-Scores */}
                <div className='bg-white rounded-2xl border border-slate-200 p-5'>
                  <h4 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-3'>
                    Z-Score WHO
                  </h4>
                  <div className='space-y-2'>
                    <ZScoreBadge
                      label='Panjang / Umur (LAZ)'
                      value={result.who_flags.length_for_age_z}
                    />
                    <ZScoreBadge
                      label='Berat / Umur (WAZ)'
                      value={result.who_flags.weight_for_age_z}
                    />
                  </div>
                  <p className='text-xs text-slate-400 mt-2'>
                    Z-Score &lt; −2 = berisiko · &lt; −3 = sangat berisiko
                  </p>
                </div>

                {/* WHO Flags */}
                <div className='bg-white rounded-2xl border border-slate-200 p-5'>
                  <h4 className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-3'>
                    Indikator WHO
                  </h4>
                  <div className='grid grid-cols-1 gap-2'>
                    <WhoFlagBadge
                      label='Indikator Stunting WHO'
                      value={result.who_flags.stunting_who_indicator}
                      isRisk
                    />
                    <WhoFlagBadge
                      label='Stunting Berat'
                      value={result.who_flags.severe_stunting}
                      isRisk
                    />
                    <WhoFlagBadge
                      label='Berat Badan Kurang'
                      value={result.who_flags.underweight}
                      isRisk
                    />
                    <WhoFlagBadge
                      label='Berat Lahir Rendah'
                      value={result.who_flags.low_birth_weight}
                      isRisk={false}
                    />
                  </div>
                </div>

                {/* Footer note */}
                <p className='text-center text-xs text-slate-400 pb-2'>
                  Model:{" "}
                  <code className='bg-slate-100 px-1.5 py-0.5 rounded text-slate-500'>
                    {result.model_used}
                  </code>{" "}
                  · Hasil bukan pengganti diagnosis medis
                </p>
              </>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className='bg-teal-600 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
          <div className='w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-white text-lg'>
            ℹ
          </div>
          <div className='flex-1'>
            <p className='text-white font-bold text-sm'>Tentang Prediksi Ini</p>
            <p className='text-teal-100 text-xs mt-1 leading-relaxed'>
              Sistem ini menggunakan model Machine Learning yang dilatih dengan
              13.814 data anak. Prediksi bersifat indikatif dan tidak
              menggantikan pemeriksaan medis oleh tenaga kesehatan profesional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
