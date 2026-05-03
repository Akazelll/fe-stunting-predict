"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import Komponen & Hook Proyek Anda
import { InputField, SelectField } from "@/components/BrutalInputs";
import {
  ProbabilityBar,
  WhoFlagBadge,
  ZScoreBadge,
} from "@/components/BrutalDisplay";
import { usePredict } from "@/hooks/usePredict";
import { PredictResult } from "@/types/predict";

// Konfigurasi Risiko dari predict/page.tsx
const riskConfig = {
  LOW: {
    label: "RISIKO RENDAH",
    bg: "bg-[#86EFAC]",
    border: "border-4 border-black shadow-neo",
    badge: "bg-white border-4 border-black",
    icon: "OK",
    desc: "Pertumbuhan anak tergolong normal. Tetap pantau tumbuh kembang secara rutin.",
  },
  MEDIUM: {
    label: "RISIKO SEDANG",
    bg: "bg-[#FDE047]",
    border: "border-4 border-black shadow-neo",
    badge: "bg-white border-4 border-black",
    icon: "AWAS",
    desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
  },
  HIGH: {
    label: "RISIKO TINGGI",
    bg: "bg-[#FCA5A5]",
    border: "border-4 border-black shadow-neo",
    badge: "bg-white border-4 border-black",
    icon: "BAHAYA",
    desc: "Anak terindikasi stunting. Segera konsultasikan dengan dokter atau ahli gizi.",
  },
};

export default function ChildDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [child, setChild] = useState<any>(null);
  const [predictionsList, setPredictionsList] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    form,
    result: aiResult,
    loading: isPredicting,
    error: predictError,
    handleChange,
    handleSubmit,
  } = usePredict();

  useEffect(() => {
    if (id) fetchChildData();
  }, [id]);

  // Auto-fill data anak ke form prediksi
  useEffect(() => {
    if (child) {
      const ageMonths = calculateAgeMonths(child.birth_date).toString();
      const sexVal = child.gender === "L" ? "Male" : "Female";
      handleChange("Age", ageMonths);
      handleChange("Sex", sexVal);
    }
  }, [child]);

  // Simpan hasil ke Supabase saat prediksi selesai
  useEffect(() => {
    if (aiResult && child) savePredictionToDatabase(aiResult);
  }, [aiResult]);

  async function fetchChildData() {
    const { data: childData } = await supabase
      .from("children")
      .select("*")
      .eq("id", id)
      .single();
    setChild(childData);
    const { data: predData } = await supabase
      .from("predictions")
      .select("*")
      .eq("child_id", id)
      .order("created_at", { ascending: false });
    setPredictionsList(predData || []);
    setIsLoadingData(false);
  }

  function calculateAgeMonths(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();
    return (
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth())
    );
  }

  async function savePredictionToDatabase(resultData: PredictResult) {
    try {
      const ageMonths = calculateAgeMonths(child.birth_date);

      // --- 1. DEKLARASIKAN dbStatus DI SINI ---
      let dbStatus = "normal";
      if (resultData.prediction === 1) {
        dbStatus = "stunted";
      } else if (
        resultData.risk_level === "MEDIUM" ||
        resultData.risk_level === "HIGH"
      ) {
        dbStatus = "risk";
      }
      // ----------------------------------------

      const h = Number(form.Body_Length) || 0;
      const w = Number(form.Body_Weight) || 0;

      // Simpan ke growth_records untuk grafik pertumbuhan
      await supabase.from("growth_records").insert([
        {
          child_id: id,
          height_cm: h,
          weight_kg: w,
          age_months: ageMonths,
        },
      ]);

      // Simpan ke predictions dengan data LENGKAP agar indikator WHO muncul di history
      await supabase.from("predictions").insert([
        {
          child_id: id,
          // 🛡️ KRUSIAL: Pastikan resultData (yang berisi who_flags) ikut di-spread
          input_data: { ...form, ...resultData },
          result: dbStatus,
          confidence_score: resultData.probability.stunting,
        },
      ]);
      fetchChildData();
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoadingData)
    return (
      <div className='min-h-screen bg-[#6EE7B7] flex items-center justify-center font-black text-2xl uppercase'>
        Memuat...
      </div>
    );

  const latestStatus = predictionsList[0]?.result || "belum_diuji";

  return (
    <div className='min-h-screen bg-[#6EE7B7] pb-16 font-sans text-black'>
      <main className='max-w-6xl mx-auto px-4 py-10 space-y-10'>
        {/* Header Profil */}
        <div className='bg-white border-4 border-black shadow-neo p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div>
            <Link
              href='/dashboard'
              className='text-sm font-black uppercase underline mb-4 block'
            >
              &larr; Dashboard
            </Link>
            <h1 className='text-4xl font-black uppercase tracking-tight'>
              {child.name}
            </h1>
            <p className='font-bold mt-2 bg-[#FEF08A] inline-block px-2 border-2 border-black uppercase'>
              {calculateAgeMonths(child.birth_date)} Bulan •{" "}
              {child.gender === "L" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>
          <div
            className={`p-4 border-4 border-black font-black uppercase text-center shadow-neo-sm min-w-[200px]
            ${latestStatus === "stunted" ? "bg-[#FCA5A5]" : latestStatus === "risk" ? "bg-[#FDE047]" : "bg-[#86EFAC]"}`}
          >
            Status: {latestStatus}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* KOLOM FORM (3/5) */}
          <div className='lg:col-span-3'>
            <form
              onSubmit={handleSubmit}
              className='bg-white border-4 border-black shadow-neo flex flex-col'
            >
              <div className='px-6 py-5 border-b-4 border-black bg-[#93C5FD]'>
                <h3 className='font-black text-xl uppercase tracking-widest text-black'>
                  Catat Pengukuran Baru
                </h3>
              </div>
              <div className='p-6 md:p-8 space-y-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <InputField
                    label='Jenis Kelamin'
                    name='Sex'
                    value={form.Sex}
                    onChange={() => {}}
                    readOnly
                    hint='Dari profil'
                  />
                  <InputField
                    label='Umur'
                    name='Age'
                    value={form.Age}
                    unit='bulan'
                    onChange={() => {}}
                    readOnly
                    hint='Otomatis'
                  />
                </div>

                <div className='flex items-center gap-4 py-2'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-sm font-black bg-[#FCA5A5] px-3 py-1 border-2 border-black'>
                    DATA LAHIR
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <InputField
                    label='Berat Lahir'
                    name='Birth_Weight'
                    value={form.Birth_Weight}
                    onChange={handleChange}
                    unit='kg'
                    type='number'
                    step={0.1}
                  />
                  <InputField
                    label='Panjang Lahir'
                    name='Birth_Length'
                    value={form.Birth_Length}
                    onChange={handleChange}
                    unit='cm'
                    type='number'
                    step={0.1}
                  />
                </div>

                <div className='flex items-center gap-4 py-2'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-sm font-black bg-[#86EFAC] px-3 py-1 border-2 border-black'>
                    DATA SAAT INI
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <InputField
                    label='Berat Badan'
                    name='Body_Weight'
                    value={form.Body_Weight}
                    onChange={handleChange}
                    unit='kg'
                    type='number'
                    step={0.1}
                  />
                  <InputField
                    label='Tinggi Badan'
                    name='Body_Length'
                    value={form.Body_Length}
                    onChange={handleChange}
                    unit='cm'
                    type='number'
                    step={0.1}
                  />
                </div>

                <SelectField
                  label='ASI Eksklusif'
                  name='ASI_Eksklusif'
                  value={form.ASI_Eksklusif}
                  options={[
                    { label: "Ya", value: "Yes" },
                    { label: "Tidak", value: "No" },
                  ]}
                  onChange={handleChange}
                />
              </div>
              <div className='p-6 border-t-4 border-black bg-white'>
                <Button
                  type='submit'
                  disabled={isPredicting}
                  className='w-full h-16 bg-[#FDE047] border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-black font-black text-xl uppercase'
                >
                  {isPredicting ? "MENGANALISIS..." : "PREDIKSI SEKARANG"}
                </Button>
              </div>
            </form>
          </div>

          {/* KOLOM HASIL & HISTORY (2/5) */}
          <div className='lg:col-span-2 space-y-6'>
            {predictError && (
              <div className='bg-[#FCA5A5] border-4 border-black shadow-neo p-5 font-black uppercase text-sm'>
                ! {predictError}
              </div>
            )}

            {/* HASIL PREDIKSI INSTAN */}
            {aiResult && (
              <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
                {(() => {
                  const cfg = riskConfig[aiResult.risk_level];
                  return (
                    <div className={`p-6 ${cfg.bg} ${cfg.border}`}>
                      <div className='flex items-center gap-4 mb-4'>
                        <div
                          className={`w-14 h-14 ${cfg.badge} flex items-center justify-center font-black shadow-neo-sm`}
                        >
                          {cfg.icon}
                        </div>
                        <div>
                          <p className='text-sm font-black uppercase bg-white px-2 border-2 border-black inline-block mb-1'>
                            Hasil AI
                          </p>
                          <p className='font-black text-2xl uppercase'>
                            {aiResult.label}
                          </p>
                        </div>
                      </div>
                      <p className='text-sm font-bold p-3 bg-white border-4 border-black'>
                        {cfg.desc}
                      </p>
                    </div>
                  );
                })()}

                <div className='bg-white border-4 border-black shadow-neo p-6 space-y-6'>
                  <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                    Analisis Detail
                  </h4>
                  <ProbabilityBar
                    label='Peluang Stunting'
                    value={aiResult.probability.stunting}
                    color='#FCA5A5'
                  />
                  <ZScoreBadge
                    label='Z-Score (TB/U)'
                    value={aiResult.who_flags.length_for_age_z}
                  />
                </div>
              </div>
            )}

            {/* RIWAYAT PENGECEKAN */}
            <div className='bg-white border-4 border-black shadow-neo overflow-hidden'>
              <div className='px-6 py-4 border-b-4 border-black bg-slate-100 font-black uppercase'>
                Riwayat Data
              </div>
              <div className='divide-y-4 divide-black'>
                {predictionsList.map((p) => (
                  <Link
                    key={p.id}
                    href={`/children/${id}/history/${p.id}`}
                    className='block p-4 hover:bg-amber-50 group'
                  >
                    <div className='flex justify-between items-center'>
                      <span className='font-black group-hover:underline'>
                        {new Date(p.created_at).toLocaleDateString("id-ID")}
                      </span>
                      <span
                        className={`text-xs font-black uppercase px-2 py-1 border-2 border-black 
                        ${p.result === "stunted" ? "bg-red-400" : "bg-green-400"}`}
                      >
                        {p.result}
                      </span>
                    </div>
                    <p className='text-xs font-bold mt-1 text-gray-600'>
                      TB: {p.input_data.Body_Length}cm | BB:{" "}
                      {p.input_data.Body_Weight}kg &rarr;
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
