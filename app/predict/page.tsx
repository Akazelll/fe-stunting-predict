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
    <div className='mb-4'>
      <div className='flex justify-between mb-2 items-center'>
        <span className='text-sm font-black text-black uppercase tracking-wide bg-white px-2 py-0.5 border-2 border-black'>
          {label}
        </span>
        <span className='text-base font-black text-black'>{pct}%</span>
      </div>
      <div className='w-full bg-white border-4 border-black h-5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden'>
        <div
          className='h-full border-r-4 border-black transition-all duration-700 ease-out'
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
  const brutalColors =
    active && isRisk
      ? "bg-[#FCA5A5] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
      : active
        ? "bg-[#FDE047] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
        : "bg-white text-black opacity-80 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 border-2 border-black font-bold text-sm transition-all ${brutalColors}`}
    >
      <span
        className={`w-4 h-4 border-2 border-black flex-shrink-0 ${active && isRisk ? "bg-red-500" : active ? "bg-yellow-400" : "bg-slate-200"}`}
      />
      {label}
    </div>
  );
}

function ZScoreBadge({ label, value }: { label: string; value: number }) {
  const color =
    value < -3 ? "bg-[#FCA5A5]" : value < -2 ? "bg-[#FDE047]" : "bg-[#86EFAC]";

  return (
    <div
      className={`flex justify-between items-center px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm text-black ${color}`}
    >
      <span className='font-black uppercase tracking-wide'>{label}</span>
      <span className='font-black tabular-nums bg-white px-2 py-0.5 border-2 border-black'>
        {value.toFixed(2)}
      </span>
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
      <label className='block text-sm font-black text-black uppercase tracking-wide mb-2'>
        {label}
        {unit && (
          <span className='ml-2 text-xs font-bold text-black bg-white px-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
            {unit}
          </span>
        )}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-4 py-3 rounded-none border-4 border-black bg-white text-black font-bold
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] 
          focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FEF08A]
          text-sm transition-all placeholder-slate-400'
      />
      {hint && (
        <p className='text-xs font-bold text-black mt-2 bg-white inline-block px-1 border-2 border-black'>
          * {hint}
        </p>
      )}
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
      <label className='block text-sm font-black text-black uppercase tracking-wide mb-2'>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className='w-full px-4 py-3 rounded-none border-4 border-black bg-white text-black font-bold
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] 
          focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-[#FEF08A]
          text-sm transition-all appearance-none cursor-pointer'
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className='font-bold'>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p className='text-xs font-bold text-black mt-2 bg-white inline-block px-1 border-2 border-black'>
          * {hint}
        </p>
      )}
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
      bg: "bg-[#86EFAC]",
      border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
      text: "text-black",
      badge: "bg-white border-4 border-black text-black",
      icon: "OK",
      desc: "Pertumbuhan anak tergolong normal. Tetap pantau tumbuh kembang secara rutin.",
    },
    MEDIUM: {
      label: "RISIKO SEDANG",
      bg: "bg-[#FDE047]",
      border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
      text: "text-black",
      badge: "bg-white border-4 border-black text-black",
      icon: "AWAS",
      desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
    },
    HIGH: {
      label: "RISIKO TINGGI",
      bg: "bg-[#FCA5A5]",
      border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
      text: "text-black",
      badge: "bg-white border-4 border-black text-black",
      icon: "BAHAYA",
      desc: "Anak terindikasi stunting. Segera konsultasikan dengan dokter atau ahli gizi.",
    },
  };

  return (
    <div className='min-h-screen bg-[#6EE7B7] pb-16 font-sans'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white border-b-4 border-black'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center gap-4'>
          <div className='w-12 h-12 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-xl'>
            SP
          </div>
          <div>
            <h1 className='text-xl font-black text-black uppercase tracking-tight'>
              Stunting Predict
            </h1>
            <p className='text-sm font-bold text-black mt-0.5 bg-[#A7F3D0] inline-block px-2 border-2 border-black'>
              Deteksi dini risiko stunting anak
            </p>
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-4 py-10 space-y-10'>
        {/* Hero */}
        <div className='text-center space-y-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8'>
          <h2 className='text-3xl sm:text-4xl font-black text-black uppercase tracking-tight'>
            Prediksi Status Stunting
          </h2>
          <p className='text-black font-bold text-base max-w-2xl mx-auto bg-[#FEF08A] p-2 border-2 border-black'>
            Masukkan data antropometri anak untuk mendapatkan prediksi risiko
            stunting menggunakan model Machine Learning berbasis data 13.814
            anak.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* ── Form ── */}
          <div className='lg:col-span-3'>
            <form
              onSubmit={handleSubmit}
              className='bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col'
            >
              {/* Form Header */}
              <div className='px-6 py-5 border-b-4 border-black bg-[#93C5FD]'>
                <h3 className='font-black text-black text-xl uppercase tracking-widest'>
                  Data Anak
                </h3>
              </div>

              <div className='p-6 md:p-8 space-y-8 flex-1'>
                {/* Row 1 */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
                <div className='flex items-center gap-4 py-2'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-sm text-black font-black bg-[#FCA5A5] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                    DATA LAHIR
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                {/* Row 2 */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
                <div className='flex items-center gap-4 py-2'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-sm text-black font-black bg-[#86EFAC] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                    DATA SAAT INI
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                {/* Row 3 */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
                      label: "Tidak — tidak mendapat ASI",
                      value: "No",
                    },
                  ]}
                  onChange={handleChange}
                  hint='Pemberian ASI eksklusif selama 6 bulan pertama'
                />
              </div>

              {/* Form Footer */}
              <div className='p-6 border-t-4 border-black bg-white flex flex-col sm:flex-row gap-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 py-4 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FACC15] 
                    active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                    text-black font-black text-base uppercase tracking-widest transition-all disabled:opacity-50
                    disabled:cursor-not-allowed flex items-center justify-center gap-3'
                >
                  {loading ? (
                    <>
                      <svg
                        className='animate-spin w-6 h-6'
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
                      ANALISIS...
                    </>
                  ) : (
                    "PREDIKSI SEKARANG"
                  )}
                </button>
                <button
                  type='button'
                  onClick={handleReset}
                  className='px-6 py-4 bg-white border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:bg-slate-100 font-black text-base uppercase tracking-widest transition-all
                    active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                >
                  RESET
                </button>
              </div>
            </form>
          </div>

          {/* ── Result Panel ── */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Error */}
            {error && (
              <div className='bg-[#FCA5A5] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5'>
                <div className='flex items-start gap-4'>
                  <span className='bg-white text-black font-black text-xl px-3 py-1 border-4 border-black'>
                    !
                  </span>
                  <div>
                    <p className='font-black text-black text-lg uppercase'>
                      Gagal Memproses
                    </p>
                    <p className='text-black font-bold text-sm mt-1 bg-white p-2 border-2 border-black'>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder */}
            {!result && !loading && !error && (
              <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center space-y-4 h-full flex flex-col justify-center min-h-[300px]'>
                <div className='w-20 h-20 bg-[#93C5FD] border-4 border-black flex items-center justify-center mx-auto text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                  🧒
                </div>
                <p className='text-base text-black font-bold border-2 border-black p-3 bg-[#FEF08A]'>
                  Isi form di sebelah kiri dan klik <br />
                  <span className='font-black uppercase'>
                    Prediksi Sekarang
                  </span>{" "}
                  <br />
                  untuk melihat hasil analisis.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6 animate-pulse min-h-[300px]'>
                <div className='h-8 bg-slate-300 border-2 border-black w-3/4' />
                <div className='h-20 bg-slate-200 border-4 border-black' />
                <div className='space-y-3'>
                  <div className='h-4 bg-slate-300 border-2 border-black w-full' />
                  <div className='h-4 bg-slate-300 border-2 border-black w-5/6' />
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='h-12 bg-slate-200 border-4 border-black'
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className='space-y-6'>
                {/* Risk Card */}
                {(() => {
                  const cfg = riskConfig[result.risk_level];
                  return (
                    <div className={`p-6 ${cfg.bg} ${cfg.border}`}>
                      <div className='flex items-center gap-4 mb-4'>
                        <div
                          className={`w-14 h-14 ${cfg.badge} flex items-center justify-center text-black font-black text-sm p-1 text-center leading-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                        >
                          {cfg.icon}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-black uppercase tracking-wider text-black bg-white px-2 py-0.5 border-2 border-black inline-block mb-1`}
                          >
                            Hasil Prediksi
                          </p>
                          <p
                            className={`font-black text-2xl text-black uppercase`}
                          >
                            {result.label}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center justify-between mt-6'>
                        <span
                          className={`text-sm font-black px-4 py-2 ${cfg.badge} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-bold mt-4 p-3 bg-white border-4 border-black text-black`}
                      >
                        {cfg.desc}
                      </p>
                    </div>
                  );
                })()}

                {/* Probability */}
                <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
                  <h4 className='text-sm font-black text-black uppercase tracking-widest mb-6 border-b-4 border-black pb-2'>
                    Distribusi Probabilitas
                  </h4>
                  <ProbabilityBar
                    label='Stunting'
                    value={result.probability?.stunting ?? 0}
                    color='#FCA5A5'
                  />
                  <div className='mt-6'>
                    <ProbabilityBar
                      label='Tidak Stunting'
                      value={result.probability?.tidak_stunting ?? 0}
                      color='#86EFAC'
                    />
                  </div>
                </div>

                {/* Z-Scores */}
                <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
                  <h4 className='text-sm font-black text-black uppercase tracking-widest mb-5 border-b-4 border-black pb-2'>
                    Z-Score WHO
                  </h4>
                  <div className='space-y-4'>
                    <ZScoreBadge
                      label='Panjang / Umur (LAZ)'
                      value={result.who_flags.length_for_age_z}
                    />
                    <ZScoreBadge
                      label='Berat / Umur (WAZ)'
                      value={result.who_flags.weight_for_age_z}
                    />
                  </div>
                  <p className='text-xs font-bold text-black mt-4 bg-[#FEF08A] p-2 border-2 border-black text-center'>
                    Z-Score &lt; −2 = berisiko <br /> Z-Score &lt; −3 = sangat
                    berisiko
                  </p>
                </div>

                {/* WHO Flags */}
                <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
                  <h4 className='text-sm font-black text-black uppercase tracking-widest mb-5 border-b-4 border-black pb-2'>
                    Indikator WHO
                  </h4>
                  <div className='grid grid-cols-1 gap-3'>
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
                <div className='text-center p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                  <p className='text-xs font-bold text-black'>
                    Model:{" "}
                    <code className='bg-[#93C5FD] px-2 py-1 border-2 border-black font-black'>
                      {result.model_used}
                    </code>
                  </p>
                  <p className='text-xs font-bold text-black mt-2 uppercase'>
                    * Hasil bukan pengganti diagnosis medis *
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className='bg-[#C084FC] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
          <div className='w-14 h-14 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0 text-black font-black text-2xl'>
            ℹ
          </div>
          <div className='flex-1'>
            <p className='text-black font-black text-lg uppercase tracking-wide'>
              Tentang Prediksi Ini
            </p>
            <p className='text-black font-bold text-sm mt-2 leading-relaxed bg-white p-3 border-2 border-black'>
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
