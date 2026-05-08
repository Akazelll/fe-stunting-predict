"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Import komponen Neobrutalism standar kita
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { usePredict } from "@/hooks/usePredict";
import { PredictResult } from "@/types/predict";

const riskConfig = {
  LOW: {
    label: "RISIKO RENDAH",
    bg: "bg-green-400",
    icon: "✅",
    desc: "Pertumbuhan anak normal. Tetap pantau tumbuh kembang secara rutin.",
  },
  MEDIUM: {
    label: "RISIKO SEDANG",
    bg: "bg-yellow-400",
    icon: "⚠️",
    desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
  },
  HIGH: {
    label: "RISIKO TINGGI",
    bg: "bg-red-500 text-white",
    icon: "🚨",
    desc: "Anak terindikasi stunting. Segera konsultasikan dengan ahli gizi.",
  },
};

export default function ChildDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  // ==========================================
  // LOGIC & STATE: 100% TIDAK DIUBAH
  // ==========================================
  const [child, setChild] = useState<any>(null);
  const [birthRecord, setBirthRecord] = useState<any>(null);
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
    if (!child) return;

    const ageMonths = calculateAgeMonths(child.birth_date).toString();
    const sexMapping = child.gender === "L" ? "Male" : "Female";

    handleChange("Age", ageMonths);
    handleChange("Sex", sexMapping);

    handleChange("Birth_Weight", birthRecord?.weight_kg?.toString() ?? "");
    handleChange("Birth_Length", birthRecord?.height_cm?.toString() ?? "");
  }, [child, birthRecord]);

  useEffect(() => {
    if (aiResult && child) savePredictionToDatabase(aiResult);
  }, [aiResult]);

  async function fetchChildData() {
    setIsLoadingData(true);

    const { data: childData } = await supabase
      .from("children")
      .select("*")
      .eq("id", id)
      .single();

    setChild(childData);

    const { data: birthData } = await supabase
      .from("growth_records")
      .select("weight_kg, height_cm")
      .eq("child_id", id)
      .eq("age_months", 0)
      .single();

    setBirthRecord(birthData ?? null);

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

  // ==========================================
  // RENDER UI: NEOBRUTALISM REFACTOR
  // ==========================================

  if (isLoadingData) {
    return (
      <AppLayout>
        <div className='flex justify-center py-20'>
          <div className='animate-pulse bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]'>
            <span className='font-black uppercase text-2xl'>
              Sinkronisasi Data...
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className='space-y-8 max-w-6xl mx-auto'>
        {/* Tombol Kembali */}
        <div>
          <Button asChild variant='secondary'>
            <Link href='/dashboard'>&larr; Kembali ke Dashboard</Link>
          </Button>
        </div>

        {/* Banner Profil Anak */}
        <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div>
            <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight mb-2'>
              {child.name}
            </h1>
            <div className='flex flex-wrap gap-2 items-center'>
              <Badge variant={child.gender === "L" ? "default" : "warning"}>
                {child.gender === "L" ? "Laki-laki" : "Perempuan"}
              </Badge>
              <Badge variant='neutral'>
                Usia: {calculateAgeMonths(child.birth_date)} Bulan
              </Badge>
            </div>
          </div>

          <div className='p-4 border-4 border-black font-black uppercase text-center bg-yellow-300 shadow-[4px_4px_0_0_#000] min-w-[200px]'>
            <p className='text-xs opacity-70 mb-1'>Status Terakhir</p>
            <p
              className={`text-2xl ${predictionsList[0]?.result === "stunted" ? "text-red-600" : "text-black"}`}
            >
              {predictionsList[0]?.result || "BELUM DICEK"}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* =========================================
              KOLOM KIRI: FORM INPUT UTAMA (COL-SPAN-3) 
              ========================================= */}
          <div className='lg:col-span-3'>
            <Card>
              <CardHeader className='bg-blue-300'>
                <CardTitle>Pantau Tumbuh Kembang</CardTitle>
              </CardHeader>

              <CardContent className='pt-6'>
                <form onSubmit={handleSubmit} className='space-y-8'>
                  {/* Section 1: Data Statis */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-100 border-2 border-dashed border-gray-400'>
                    <div className='space-y-2 opacity-70 cursor-not-allowed'>
                      <Label>Jenis Kelamin</Label>
                      <Input
                        value={form.Sex}
                        readOnly
                        className='pointer-events-none'
                      />
                      <p className='text-[10px] font-bold text-gray-500 uppercase'>
                        Data Profil
                      </p>
                    </div>
                    <div className='space-y-2 opacity-70 cursor-not-allowed'>
                      <Label>Umur Saat Ini (Bulan)</Label>
                      <Input
                        value={form.Age}
                        readOnly
                        className='pointer-events-none'
                      />
                      <p className='text-[10px] font-bold text-gray-500 uppercase'>
                        Dihitung Otomatis
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Data Kelahiran (Terkunci) */}
                  <div className='flex items-center gap-4 py-2'>
                    <div className='flex-1 border-b-4 border-black border-dashed' />
                    <span className='text-[10px] font-black bg-black text-white px-3 py-1 uppercase'>
                      Data Kelahiran (Terkunci)
                    </span>
                    <div className='flex-1 border-b-4 border-black border-dashed' />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-100 border-2 border-dashed border-gray-400'>
                    <div className='space-y-2 opacity-70 cursor-not-allowed'>
                      <Label>Berat Lahir (kg)</Label>
                      <Input
                        value={form.Birth_Weight}
                        readOnly
                        className='pointer-events-none'
                      />
                    </div>
                    <div className='space-y-2 opacity-70 cursor-not-allowed'>
                      <Label>Panjang Lahir (cm)</Label>
                      <Input
                        value={form.Birth_Length}
                        readOnly
                        className='pointer-events-none'
                      />
                    </div>
                  </div>

                  {/* Section 3: Input Aktif */}
                  <div className='flex items-center gap-4 py-2'>
                    <div className='flex-1 border-b-4 border-black border-dashed' />
                    <span className='text-[10px] font-black bg-green-400 border-2 border-black px-3 py-1 uppercase shadow-[2px_2px_0_0_#000]'>
                      Input Pengukuran Sekarang
                    </span>
                    <div className='flex-1 border-b-4 border-black border-dashed' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='Body_Weight'>
                      Berat Badan Sekarang (kg)
                    </Label>
                    <Input
                      id='Body_Weight'
                      name='Body_Weight'
                      type='number'
                      step='0.1'
                      value={form.Body_Weight}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      } // ✅ PERBAIKAN DI SINI
                      required
                    />
                    <p className='text-[10px] font-bold text-gray-500 uppercase'>
                      Timbangan Terbaru
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='Body_Length'>
                      Tinggi Badan Sekarang (cm)
                    </Label>
                    <Input
                      id='Body_Length'
                      name='Body_Length'
                      type='number'
                      step='0.1'
                      value={form.Body_Length}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      } // ✅ PERBAIKAN DI SINI
                      required
                    />
                    <p className='text-[10px] font-bold text-gray-500 uppercase'>
                      Tinggi Terbaru
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='ASI_Eksklusif'>Status ASI Eksklusif</Label>
                    <select
                      id='ASI_Eksklusif'
                      name='ASI_Eksklusif'
                      value={form.ASI_Eksklusif}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      } // ✅ PERBAIKAN DI SINI
                      className='flex h-12 w-full rounded-none border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_#000000] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0_0_#000000] focus-visible:border-blue-600 cursor-pointer'
                    >
                      <option value='Yes'>Ya (6 Bulan Pertama)</option>
                      <option value='No'>Tidak</option>
                    </select>
                  </div>

                  <div className='pt-6 border-t-4 border-black'>
                    <Button
                      type='submit'
                      disabled={isPredicting}
                      className='w-full h-16 text-xl'
                      variant='primary'
                    >
                      {isPredicting ? "ANALISIS AI..." : "CEK RISIKO STUNTING"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* =========================================
              KOLOM KANAN: SIDEBAR HASIL & RIWAYAT 
              ========================================= */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Error State */}
            {predictError && (
              <div className='bg-red-300 border-4 border-black p-4 font-bold text-sm shadow-[4px_4px_0_0_#000]'>
                ⚠️ {predictError}
              </div>
            )}

            {/* AI Result Card */}
            {aiResult && (
              <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                {(() => {
                  const cfg =
                    riskConfig[aiResult.risk_level as keyof typeof riskConfig];
                  return (
                    <div
                      className={`p-6 border-4 border-black shadow-[8px_8px_0_0_#000] ${cfg.bg}`}
                    >
                      <div className='flex items-center gap-4 mb-4'>
                        <div className='w-14 h-14 bg-white border-4 border-black flex items-center justify-center font-black text-2xl shadow-[4px_4px_0_0_#000]'>
                          {cfg.icon}
                        </div>
                        <div>
                          <p className='text-[10px] font-black uppercase bg-white px-2 border-2 border-black inline-block mb-1'>
                            Hasil Prediksi
                          </p>
                          <p className='font-black text-3xl uppercase leading-none'>
                            {cfg.label}
                          </p>
                        </div>
                      </div>
                      <p className='text-sm font-bold p-3 bg-white border-4 border-black'>
                        {cfg.desc}
                      </p>
                    </div>
                  );
                })()}

                {/* Detail WHO Scores (Pengganti BrutalDisplay) */}
                <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 space-y-6'>
                  <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                    Detail Skor WHO
                  </h4>

                  {/* Probability Bar Inline */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-xs font-black uppercase'>
                      <span>Probabilitas Stunting</span>
                      <span>
                        {(aiResult.probability.stunting * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className='h-6 w-full bg-gray-200 border-2 border-black overflow-hidden relative'>
                      <div
                        className='h-full bg-red-400 border-r-2 border-black transition-all duration-1000'
                        style={{
                          width: `${aiResult.probability.stunting * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Z-Scores Inline */}
                  <div className='space-y-3 pt-4'>
                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        Z-Score (TB/U)
                      </span>
                      <span className='font-black bg-yellow-300 px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult.who_flags.length_for_age_z.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        Z-Score (BB/U)
                      </span>
                      <span className='font-black bg-blue-300 px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult.who_flags.weight_for_age_z.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Riwayat Pengukuran */}
            <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col max-h-[500px]'>
              <div className='px-6 py-4 border-b-4 border-black bg-yellow-300 font-black uppercase'>
                Riwayat Pengukuran
              </div>

              <div className='overflow-y-auto divide-y-4 divide-black'>
                {predictionsList.length === 0 ? (
                  <div className='p-10 flex flex-col items-center justify-center text-center opacity-50'>
                    <span className='text-4xl mb-2'>📭</span>
                    <p className='font-bold uppercase'>Belum ada riwayat</p>
                  </div>
                ) : (
                  predictionsList.map((p) => (
                    <Link
                      key={p.id}
                      href={`/children/${id}/history/${p.id}`}
                      className='block p-5 hover:bg-blue-50 group transition-colors'
                    >
                      <div className='flex justify-between items-center mb-2'>
                        <span className='font-black group-hover:underline text-sm uppercase'>
                          {new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]
                          ${p.result === "stunted" ? "bg-red-400 text-white" : p.result === "risk" ? "bg-yellow-400 text-black" : "bg-green-400 text-black"}`}
                        >
                          {p.result}
                        </span>
                      </div>
                      <p className='text-xs font-bold text-gray-600 uppercase border-l-2 border-black pl-2'>
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
      </div>
    </AppLayout>
  );
}
