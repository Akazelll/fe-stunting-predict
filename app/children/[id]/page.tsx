"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Import Komponen & Hook Proyek
import { InputField,SelectField } from "@/components/BrutalInputs";
import { ProbabilityBar, ZScoreBadge } from "@/components/BrutalDisplay";
import { usePredict } from "@/hooks/usePredict";
import { PredictResult } from "@/types/predict";

const riskConfig = {
  LOW: {
    label: "RISIKO RENDAH",
    bg: "bg-[#86EFAC]",
    icon: "OK",
    desc: "Pertumbuhan anak normal. Tetap pantau tumbuh kembang secara rutin.",
  },
  MEDIUM: {
    label: "RISIKO SEDANG",
    bg: "bg-[#FDE047]",
    icon: "AWAS",
    desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
  },
  HIGH: {
    label: "RISIKO TINGGI",
    bg: "bg-[#FCA5A5]",
    icon: "BAHAYA",
    desc: "Anak terindikasi stunting. Segera konsultasikan dengan ahli gizi.",
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

  useEffect(() => {
    if (child) {
      const ageMonths = calculateAgeMonths(child.birth_date).toString();
      const sexMapping = child.gender === "L" ? "Male" : "Female";

      handleChange("Age", ageMonths);
      handleChange("Sex", sexMapping);
      handleChange("Birth_Weight", child.birth_weight?.toString() || "");
      handleChange("Birth_Length", child.birth_length?.toString() || "");
    }
  }, [child]);

  // Simpan hasil ke database secara otomatis setelah prediksi sukses
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
    let months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth());
    if (today.getDate() < birth.getDate()) months--;
    return Math.max(0, months);
  }

  async function savePredictionToDatabase(resultData: PredictResult) {
    try {
      const ageMonths = calculateAgeMonths(child.birth_date);
      const dbStatus =
        resultData.prediction === 1
          ? "stunted"
          : resultData.risk_level === "LOW"
            ? "normal"
            : "risk";

      await supabase.from("growth_records").insert([
        {
          child_id: id,
          height_cm: Number(form.Body_Length),
          weight_kg: Number(form.Body_Weight),
          age_months: ageMonths,
        },
      ]);

      await supabase.from("predictions").insert([
        {
          child_id: id,
          input_data: { ...form, ...resultData },
          result: dbStatus,
          confidence_score: resultData.probability.stunting,
        },
      ]);
      fetchChildData();
    } catch (e) {
      console.error("Gagal simpan:", e);
    }
  }

  if (isLoadingData)
    return (
      <div className='min-h-screen bg-[#6EE7B7] flex items-center justify-center font-black text-2xl uppercase'>
        Sinkronisasi Data...
      </div>
    );

  return (
    <div className='min-h-screen bg-[#6EE7B7] pb-16 font-sans text-black'>
      <main className='max-w-6xl mx-auto px-4 py-10 space-y-10'>
        {/* Banner Profil Anak */}
        <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div>
            <Link
              href='/dashboard'
              className='text-sm font-black uppercase underline mb-4 block'
            >
              &larr; Kembali ke Dashboard
            </Link>
            <h1 className='text-4xl font-black uppercase tracking-tight'>
              {child.name}
            </h1>
            <p className='font-bold mt-2 bg-[#FEF08A] inline-block px-2 border-2 border-black uppercase'>
              Profil: {child.gender === "L" ? "Laki-laki" : "Perempuan"} •{" "}
              {calculateAgeMonths(child.birth_date)} Bulan
            </p>
          </div>
          <div className='p-4 border-4 border-black font-black uppercase text-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
            <p className='text-xs opacity-60'>Status Terakhir</p>
            <p className='text-xl'>
              {predictionsList[0]?.result || "BELUM ADA DATA"}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* FORM INPUT UTAMA */}
          <div className='lg:col-span-3'>
            <form
              onSubmit={handleSubmit}
              className='bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col'
            >
              <div className='px-6 py-5 border-b-4 border-black bg-[#93C5FD]'>
                <h3 className='font-black text-xl uppercase tracking-widest'>
                  Pantau Tumbuh Kembang
                </h3>
              </div>

              <div className='p-6 md:p-8 space-y-8'>
                {/* Section 1: Data Statis (Otomatis & Terkunci)[cite: 1] */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-70'>
                  <InputField
                    label='Jenis Kelamin'
                    name='Sex'
                    value={form.Sex}
                    onChange={() => {}}
                    readOnly
                    hint='Data Profil'
                  />
                  <InputField
                    label='Umur Saat Ini'
                    name='Age'
                    value={form.Age}
                    unit='bulan'
                    onChange={() => {}}
                    readOnly
                    hint='Dihitung Otomatis'
                  />
                </div>

                <div className='flex items-center gap-4'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-xs font-black bg-black text-white px-3 py-1'>
                    DATA KELAHIRAN (TERKUNCI)
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-70'>
                  <InputField
                    label='Berat Lahir'
                    name='Birth_Weight'
                    value={form.Birth_Weight}
                    unit='kg'
                    onChange={() => {}}
                    readOnly
                    hint='Dari Pendaftaran'
                  />
                  <InputField
                    label='Panjang Lahir'
                    name='Birth_Length'
                    value={form.Birth_Length}
                    unit='cm'
                    onChange={() => {}}
                    readOnly
                    hint='Dari Pendaftaran'
                  />
                </div>

                <div className='flex items-center gap-4'>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                  <span className='text-xs font-black bg-[#86EFAC] px-3 py-1 border-2 border-black'>
                    INPUT PENGUKURAN SEKARANG
                  </span>
                  <div className='flex-1 border-b-4 border-black border-dashed' />
                </div>

                {/* Section 2: Data Dinamis (Yang perlu diisi ortu)[cite: 1] */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <InputField
                    label='Berat Badan Sekarang'
                    name='Body_Weight'
                    value={form.Body_Weight}
                    onChange={handleChange}
                    unit='kg'
                    type='number'
                    step={0.1}
                    hint='Timbangan terbaru'
                  />
                  <InputField
                    label='Tinggi Badan Sekarang'
                    name='Body_Length'
                    value={form.Body_Length}
                    onChange={handleChange}
                    unit='cm'
                    type='number'
                    step={0.1}
                    hint='Tinggi terbaru'
                  />
                </div>

                <SelectField
                  label='Status ASI Eksklusif'
                  name='ASI_Eksklusif'
                  value={form.ASI_Eksklusif}
                  options={[
                    { label: "Ya (6 Bulan Pertama)", value: "Yes" },
                    { label: "Tidak", value: "No" },
                  ]}
                  onChange={handleChange}
                />
              </div>

              <div className='p-6 border-t-4 border-black bg-white'>
                <Button
                  type='submit'
                  disabled={isPredicting}
                  className='w-full h-20 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-black font-black text-2xl uppercase rounded-none'
                >
                  {isPredicting ? "ANALISIS AI..." : "CEK RISIKO STUNTING"}
                </Button>
              </div>
            </form>
          </div>

          {/* SIDEBAR HASIL & RIWAYAT */}
          <div className='lg:col-span-2 space-y-6'>
            {aiResult && (
              <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                {(() => {
                  const cfg = riskConfig[aiResult.risk_level];
                  return (
                    <div
                      className={`p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${cfg.bg}`}
                    >
                      <div className='flex items-center gap-4 mb-4'>
                        <div className='w-14 h-14 bg-white border-4 border-black flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                          {cfg.icon}
                        </div>
                        <div>
                          <p className='text-xs font-black uppercase bg-white px-2 border-2 border-black inline-block mb-1'>
                            Hasil Prediksi
                          </p>
                          <p className='font-black text-2xl uppercase leading-none'>
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

                <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6'>
                  <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                    Detail Skor WHO
                  </h4>
                  <ProbabilityBar
                    label='Probabilitas Stunting'
                    value={aiResult.probability.stunting}
                    color='#FCA5A5'
                  />
                  <div className='space-y-4 pt-2'>
                    <ZScoreBadge
                      label='Z-Score (TB/U)'
                      value={aiResult.who_flags.length_for_age_z}
                    />
                    <ZScoreBadge
                      label='Z-Score (BB/U)'
                      value={aiResult.who_flags.weight_for_age_z}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[500px]'>
              <div className='px-6 py-4 border-b-4 border-black bg-slate-100 font-black uppercase text-sm'>
                Riwayat Pengukuran
              </div>
              <div className='overflow-y-auto divide-y-4 divide-black'>
                {predictionsList.length === 0 ? (
                  <p className='p-10 text-center font-bold opacity-40 uppercase'>
                    Belum ada riwayat
                  </p>
                ) : (
                  predictionsList.map((p) => (
                    <Link
                      key={p.id}
                      href={`/children/${id}/history/${p.id}`}
                      className='block p-4 hover:bg-amber-50 group transition-colors'
                    >
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-black group-hover:underline text-sm'>
                          {new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black 
                          ${p.result === "stunted" ? "bg-[#FCA5A5]" : "bg-[#86EFAC]"}`}
                        >
                          {p.result}
                        </span>
                      </div>
                      <p className='text-[11px] font-bold text-gray-500 uppercase'>
                        TB: {p.input_data.Body_Length}cm • BB:{" "}
                        {p.input_data.Body_Weight}kg
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
