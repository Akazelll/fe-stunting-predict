"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface FormData {
  sex: "0" | "1"; // 0 = female, 1 = male
  asi_eksklusif: "0" | "1"; // 0 = no, 1 = yes
  age: string;
  birth_weight: string;
  birth_length: string;
  body_weight: string;
  body_length: string;
}

interface PredictResult {
  prediction: string;
  is_stunting: boolean;
  stunting_probability: number;
  risk_level: "Rendah" | "Sedang" | "Tinggi";
  probabilities: Record<string, number>;
  model_used: string;
  input_received: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function ToggleGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { label: string; value: string; icon?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-black uppercase tracking-widest text-black'>
        {label}
      </label>
      <div className='flex flex-wrap gap-4 sm:flex-nowrap'>
        {options.map((opt) => (
          <button
            key={opt.value}
            type='button'
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 border-4 border-black py-3 px-4 text-sm font-black transition-all rounded-none",
              value === opt.value
                ? "bg-[#a3e635] text-black translate-x-[4px] translate-y-[4px] shadow-none"
                : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#fef08a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
            )}
          >
            {opt.icon && <span className='text-lg'>{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  unit,
  min,
  max,
  step,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-black uppercase tracking-widest text-black'>
        {label}
      </label>
      <div className='relative'>
        <input
          type='number'
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step ?? 0.1}
          placeholder={placeholder ?? `${min}–${max}`}
          className={cn(
            "w-full rounded-none border-4 border-black bg-white px-4 py-3 pr-16",
            "text-base font-bold text-black placeholder-gray-400 shadow-[4px_4px_0px_0px_#000]",
            "transition-all outline-none",
            "focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:bg-[#e0f2fe]",
          )}
        />
        <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-black bg-white px-1'>
          {unit}
        </span>
      </div>
      {hint && <p className='text-xs font-bold text-gray-700'>{hint}</p>}
    </div>
  );
}

function RiskBadge({ level }: { level: "Rendah" | "Sedang" | "Tinggi" }) {
  const config = {
    Rendah: { bg: "bg-[#a3e635]", label: "RISIKO RENDAH" },
    Sedang: { bg: "bg-[#fde047]", label: "RISIKO SEDANG" },
    Tinggi: { bg: "bg-[#f87171]", label: "RISIKO TINGGI" },
  }[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-4 border-black px-4 py-1.5 text-sm font-black text-black shadow-[4px_4px_0px_0px_#000] rounded-none",
        config.bg,
      )}
    >
      {config.label}
    </span>
  );
}

function ProbabilityBar({
  label,
  value,
  isMain,
}: {
  label: string;
  value: number;
  isMain: boolean;
}) {
  return (
    <div className='space-y-1.5'>
      <div className='flex justify-between text-sm font-black text-black'>
        <span className='uppercase'>{label}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className='h-6 w-full overflow-hidden border-4 border-black bg-white rounded-none'>
        <div
          className={cn(
            "h-full border-r-4 border-black transition-all duration-500",
            isMain ? "bg-[#38bdf8]" : "bg-[#fde047]",
          )}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_FORM: FormData = {
  sex: "1",
  asi_eksklusif: "1",
  age: "",
  birth_weight: "",
  birth_length: "",
  body_weight: "",
  body_length: "",
};

export default function PredictPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const requiredFields: (keyof FormData)[] = [
    "age",
    "birth_weight",
    "birth_length",
    "body_weight",
    "body_length",
  ];
  const isFormValid = requiredFields.every(
    (f) => form[f] !== "" && !isNaN(Number(form[f])),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Prediksi gagal");
      }

      setResult(data as PredictResult);

      setTimeout(() => {
        document
          .getElementById("result-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  }

  return (
    <div className='min-h-screen bg-[#f4f4f0] font-sans selection:bg-[#fde047] selection:text-black'>
      {/* ── Background Dotted Pattern ── */}
      <div
        className='fixed inset-0 pointer-events-none opacity-30'
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className='relative mx-auto max-w-3xl px-4 py-12 sm:px-6'>
        {/* ── Header ── */}
        <div className='mb-10 flex flex-col items-center text-center'>
          <div className='mb-6 flex h-24 w-24 items-center justify-center border-4 border-black bg-[#ff90e8] text-5xl shadow-[8px_8px_0px_0px_#000] rotate-3 rounded-none'>
            👶
          </div>
          <h1 className='border-4 border-black bg-white px-8 py-3 text-4xl font-black uppercase tracking-tight text-black shadow-[8px_8px_0px_0px_#000] rounded-none'>
            Deteksi Stunting
          </h1>
          <p className='mt-6 bg-[#fde047] px-4 py-2 text-sm font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-none'>
            STANDAR WHO · MACHINE LEARNING
          </p>
        </div>

        {/* ── Form Card ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className='mb-12 border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000] rounded-none'>
            {/* Identitas */}
            <div className='border-b-4 border-black bg-[#38bdf8] px-6 py-4'>
              <h2 className='text-xl font-black uppercase tracking-widest text-black'>
                [ 1 ] Identitas Anak
              </h2>
            </div>
            <div className='space-y-6 px-6 py-8'>
              <ToggleGroup
                label='Jenis Kelamin'
                name='sex'
                value={form.sex}
                onChange={setField("sex")}
                options={[
                  { label: "LAKI-LAKI", value: "1", icon: "♂" },
                  { label: "PEREMPUAN", value: "0", icon: "♀" },
                ]}
              />
              <ToggleGroup
                label='ASI Eksklusif'
                name='asi_eksklusif'
                value={form.asi_eksklusif}
                onChange={setField("asi_eksklusif")}
                options={[
                  { label: "YA", value: "1", icon: "✓" },
                  { label: "TIDAK", value: "0", icon: "✗" },
                ]}
              />
              <InputField
                label='Usia Anak'
                name='age'
                value={form.age}
                onChange={setField("age")}
                unit='BLN'
                min={0}
                max={60}
                step={1}
                placeholder='0 – 60'
                hint='* UMUR DALAM BULAN (MAKS. 60 BULAN)'
              />
            </div>

            {/* Data Lahir */}
            <div className='border-b-4 border-t-4 border-black bg-[#ff90e8] px-6 py-4'>
              <h2 className='text-xl font-black uppercase tracking-widest text-black'>
                [ 2 ] Data Saat Lahir
              </h2>
            </div>
            <div className='grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2'>
              <InputField
                label='Berat Lahir'
                name='birth_weight'
                value={form.birth_weight}
                onChange={setField("birth_weight")}
                unit='KG'
                min={0.5}
                max={6}
                step={0.01}
                placeholder='0.5 – 6.0'
              />
              <InputField
                label='Panjang Lahir'
                name='birth_length'
                value={form.birth_length}
                onChange={setField("birth_length")}
                unit='CM'
                min={30}
                max={65}
                step={0.1}
                placeholder='30 – 65'
              />
            </div>

            {/* Data Sekarang */}
            <div className='border-b-4 border-t-4 border-black bg-[#a3e635] px-6 py-4'>
              <h2 className='text-xl font-black uppercase tracking-widest text-black'>
                [ 3 ] Antropometri Sekarang
              </h2>
            </div>
            <div className='grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2'>
              <InputField
                label='Berat Badan'
                name='body_weight'
                value={form.body_weight}
                onChange={setField("body_weight")}
                unit='KG'
                min={1}
                max={30}
                step={0.01}
                placeholder='1.0 – 30.0'
              />
              <InputField
                label='Tinggi Badan'
                name='body_length'
                value={form.body_length}
                onChange={setField("body_length")}
                unit='CM'
                min={40}
                max={130}
                step={0.1}
                placeholder='40 – 130'
              />
            </div>

            {/* Error */}
            {error && (
              <div className='border-t-4 border-black bg-[#f87171] px-6 py-5'>
                <h3 className='text-xl font-black uppercase text-black'>
                  ERROR: PREDIKSI GAGAL
                </h3>
                <p className='font-bold text-black border-2 border-black bg-white p-2 mt-2 inline-block shadow-[4px_4px_0px_0px_#000]'>
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <div className='flex flex-col gap-4 border-t-4 border-black bg-gray-100 p-6 sm:flex-row'>
              <button
                type='submit'
                disabled={!isFormValid || loading}
                className={cn(
                  "flex-1 border-4 border-black py-4 text-xl font-black uppercase tracking-wider text-black transition-all rounded-none",
                  isFormValid && !loading
                    ? "bg-[#fde047] shadow-[8px_8px_0px_0px_#000] hover:bg-[#facc15] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
                    : "cursor-not-allowed bg-gray-300 opacity-70",
                )}
              >
                {loading ? "MEMPROSES..." : "ANALISIS SEKARANG ⚡"}
              </button>
              {(result || error) && (
                <button
                  type='button'
                  onClick={handleReset}
                  className='border-4 border-black bg-white px-8 py-4 text-xl font-black uppercase tracking-wider text-black shadow-[8px_8px_0px_0px_#000] transition-all hover:bg-gray-200 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none rounded-none'
                >
                  RESET
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ── Result Card ── */}
        {result && (
          <div
            id='result-section'
            className='mt-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000] rounded-none'
          >
            {/* Result header */}
            <div
              className={cn(
                "border-b-4 border-black px-6 py-8 text-center",
                result.is_stunting ? "bg-[#f87171]" : "bg-[#a3e635]",
              )}
            >
              <p className='mb-3 text-sm font-black uppercase tracking-widest text-black bg-white inline-block px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_#000]'>
                HASIL ANALISIS
              </p>
              <h2 className='text-4xl sm:text-5xl font-black uppercase text-black'>
                {result.is_stunting ? "⚠️ BERISIKO STUNTING" : "✅ NORMAL"}
              </h2>
            </div>

            <div className='space-y-8 p-6'>
              {/* Risk badge + probability */}
              <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-4 border-black p-4 bg-[#f4f4f0] shadow-[6px_6px_0px_0px_#000]'>
                <div className='space-y-3'>
                  <p className='text-sm font-black uppercase tracking-widest text-black'>
                    TINGKAT RISIKO
                  </p>
                  <RiskBadge level={result.risk_level} />
                </div>
                <div className='sm:text-right'>
                  <p className='text-sm font-black uppercase tracking-widest text-black mb-1'>
                    PROBABILITAS
                  </p>
                  <p className='inline-block border-4 border-black bg-[#e0f2fe] px-4 py-2 text-5xl font-black shadow-[6px_6px_0px_0px_#000]'>
                    {(result.stunting_probability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Probability bars */}
              <div className='space-y-4 border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_#000]'>
                <p className='text-sm font-black uppercase tracking-widest text-black border-b-4 border-black pb-2 mb-4'>
                  DISTRIBUSI PROBABILITAS
                </p>
                {Object.entries(result.probabilities)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([label, value]) => (
                    <ProbabilityBar
                      key={label}
                      label={label}
                      value={value}
                      isMain={label === result.prediction}
                    />
                  ))}
              </div>

              {/* Interpretasi */}
              <div
                className={cn(
                  "border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]",
                  result.is_stunting ? "bg-[#fef2f2]" : "bg-[#f0fdf4]",
                )}
              >
                <h3 className='mb-3 text-2xl font-black uppercase bg-white inline-block border-2 border-black px-2'>
                  {result.is_stunting ? "PERLU PERHATIAN" : "KONDISI BAIK"}
                </h3>
                <p className='text-base font-bold text-black leading-relaxed'>
                  {result.is_stunting
                    ? "Anak menunjukkan indikasi risiko stunting berdasarkan data antropometri dan standar WHO. Segera konsultasikan dengan tenaga kesehatan atau dokter anak untuk evaluasi lebih lanjut."
                    : "Berdasarkan data yang dimasukkan, anak tidak menunjukkan indikasi stunting. Tetap pantau tumbuh kembang secara rutin sesuai jadwal posyandu."}
                </p>
              </div>

              {/* Footer info */}
              <div className='border-t-4 border-black pt-4 font-black uppercase text-black flex flex-col sm:flex-row justify-between'>
                <p>
                  MODEL:{" "}
                  <span className='bg-[#fde047] px-2 border-2 border-black ml-1'>
                    {result.model_used}
                  </span>
                </p>
                <p className='mt-2 sm:mt-0'>* BUKAN DIAGNOSIS MEDIS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
