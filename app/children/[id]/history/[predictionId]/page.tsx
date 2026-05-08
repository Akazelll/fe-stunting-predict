"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Gunakan ekosistem UI Neobrutalism kita
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PredictInput, PredictResult } from "@/types/predict";

// ✅ Diperbaiki: Semua status memiliki properti 'text' agar TypeScript tidak komplain
const riskConfig = {
  LOW: {
    label: "RISIKO RENDAH",
    bg: "bg-green-400",
    text: "text-black",
    icon: "✅",
  },
  MEDIUM: {
    label: "RISIKO SEDANG",
    bg: "bg-yellow-400",
    text: "text-black",
    icon: "⚠️",
  },
  HIGH: {
    label: "RISIKO TINGGI",
    bg: "bg-red-500",
    text: "text-white",
    icon: "🚨",
  },
};

export default function PredictionHistoryDetailPage() {
  const params = useParams();
  const childId = params.id as string;
  const predictionId = params.predictionId as string;
  const supabase = createClient();

  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const { data } = await supabase
        .from("predictions")
        .select("*, children(name)")
        .eq("id", predictionId)
        .single();
      setPrediction(data);
      setIsLoading(false);
    }
    fetchDetail();
  }, [predictionId, supabase]);


  if (isLoading) {
    return (
      <AppLayout>
        <div className='flex justify-center py-20'>
          <div className='animate-pulse bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]'>
            <span className='font-black uppercase text-2xl'>
              Memuat Data...
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error/Empty State
  if (!prediction) {
    return (
      <AppLayout>
        <div className='flex justify-center py-20'>
          <div className='bg-red-300 border-4 border-black p-8 shadow-[8px_8px_0_0_#000] text-center max-w-md'>
            <span className='text-5xl block mb-4'>📭</span>
            <span className='font-black uppercase text-2xl'>
              Data Tidak Ditemukan
            </span>
            <p className='font-bold mt-2'>
              Riwayat prediksi ini mungkin sudah dihapus atau tidak tersedia.
            </p>
            <Button asChild variant='secondary' className='mt-6'>
              <Link href={`/children/${childId}`}>Kembali ke Profil</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const inputData = prediction.input_data as PredictInput;
  const aiResult = prediction.input_data as unknown as PredictResult;
  const cfg =
    riskConfig[(aiResult?.risk_level as keyof typeof riskConfig) || "LOW"];

  return (
    <AppLayout>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Tombol Kembali */}
        <div>
          <Button asChild variant='secondary'>
            <Link href={`/children/${childId}`}>&larr; Kembali ke Profil</Link>
          </Button>
        </div>

        {/* Header Section */}
        {/* ✅ Diperbaiki: cfg.text sekarang dipanggil tanpa fallback karena semua config pasti punya */}
        <div
          className={`border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 gap-6 ${cfg.bg} ${cfg.text}`}
        >
          <div>
            <div className='flex flex-wrap gap-2 mb-2'>
              <Badge
                variant='neutral'
                className='bg-black text-white px-2 py-1 shadow-none border-0'
              >
                📅{" "}
                {new Date(prediction.created_at).toLocaleDateString("id-ID", {
                  dateStyle: "full",
                })}
              </Badge>
            </div>
            <h1 className='text-3xl md:text-4xl font-black uppercase tracking-tight'>
              Riwayat: {prediction.children?.name}
            </h1>
          </div>

          {/* ✅ Diperbaiki: min-w-[200px] menjadi min-w-50 sesuai standar Tailwind */}
          <div className='bg-white border-4 border-black p-4 text-center min-w-50 shadow-[4px_4px_0_0_#000] text-black'>
            <p className='text-xs font-bold uppercase opacity-60 mb-1'>
              Status Hasil
            </p>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-2xl'>{cfg.icon}</span>
              <p className='text-2xl font-black uppercase'>{cfg.label}</p>
            </div>
          </div>
        </div>

        {/* Kartu Detail Data */}
        <Card>
          <CardContent className='p-6 md:p-8 space-y-10'>
            {/* Grid Metrik Input */}
            <div>
              <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4'>
                Data Terukur
              </h4>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='bg-blue-200 border-4 border-black p-4 text-center shadow-[4px_4px_0_0_#000]'>
                  <p className='text-xs font-bold uppercase opacity-70 mb-1'>
                    Tinggi
                  </p>
                  <p className='text-2xl font-black'>
                    {inputData?.Body_Length} cm
                  </p>
                </div>
                <div className='bg-yellow-200 border-4 border-black p-4 text-center shadow-[4px_4px_0_0_#000]'>
                  <p className='text-xs font-bold uppercase opacity-70 mb-1'>
                    Berat
                  </p>
                  <p className='text-2xl font-black'>
                    {inputData?.Body_Weight} kg
                  </p>
                </div>
                <div className='bg-green-200 border-4 border-black p-4 text-center shadow-[4px_4px_0_0_#000]'>
                  <p className='text-xs font-bold uppercase opacity-70 mb-1'>
                    Usia
                  </p>
                  <p className='text-2xl font-black'>{inputData?.Age} Bln</p>
                </div>
                <div className='bg-purple-200 border-4 border-black p-4 text-center shadow-[4px_4px_0_0_#000]'>
                  <p className='text-xs font-bold uppercase opacity-70 mb-1'>
                    ASI
                  </p>
                  <p className='text-lg font-black mt-1'>
                    {inputData?.ASI_Eksklusif === "Yes" ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>
            </div>

            {/* Area Analisis Data */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Kolom Kiri: Probabilitas */}
              <div className='bg-white border-4 border-black p-6 space-y-6 shadow-[8px_8px_0_0_#000]'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Probabilitas Gizi
                </h4>

                {/* Bar Peluang Stunting */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs font-black uppercase'>
                    <span>Peluang Stunting</span>
                    <span>
                      {((aiResult?.probability?.stunting || 0) * 100).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                  <div className='h-6 w-full bg-gray-200 border-2 border-black overflow-hidden relative'>
                    <div
                      className='h-full bg-red-400 border-r-2 border-black'
                      style={{
                        width: `${(aiResult?.probability?.stunting || 0) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bar Peluang Normal */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs font-black uppercase'>
                    <span>Peluang Normal</span>
                    <span>
                      {(
                        (aiResult?.probability?.tidak_stunting || 0) * 100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className='h-6 w-full bg-gray-200 border-2 border-black overflow-hidden relative'>
                    <div
                      className='h-full bg-green-400 border-r-2 border-black'
                      style={{
                        width: `${(aiResult?.probability?.tidak_stunting || 0) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Skor WHO */}
              <div className='bg-white border-4 border-black p-6 space-y-6 shadow-[8px_8px_0_0_#000] flex flex-col justify-between'>
                <div>
                  <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-6'>
                    Skor WHO (Z-Score)
                  </h4>

                  <div className='space-y-4'>
                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        LAZ (Tinggi/Umur)
                      </span>
                      <span className='font-black bg-yellow-300 px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult?.who_flags?.length_for_age_z?.toFixed(2) ??
                          "0.00"}
                      </span>
                    </div>

                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        WAZ (Berat/Umur)
                      </span>
                      <span className='font-black bg-blue-300 px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult?.who_flags?.weight_for_age_z?.toFixed(2) ??
                          "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className='text-[10px] font-bold mt-6 bg-yellow-300 p-2 border-2 border-black text-center shadow-[2px_2px_0_0_#000] uppercase'>
                  Z-Score &lt; −2 = Berisiko | Z-Score &lt; −3 = Sangat Berisiko
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
