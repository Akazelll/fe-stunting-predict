"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ProbabilityBar,
  ZScoreBadge,
  WhoFlagBadge,
} from "@/components/BrutalDisplay";
import { PredictInput, PredictResult } from "@/types/predict";

const riskConfig = {
  LOW: { label: "RISIKO RENDAH", bg: "bg-[#86EFAC]", icon: "OK" },
  MEDIUM: { label: "RISIKO SEDANG", bg: "bg-[#FDE047]", icon: "AWAS" },
  HIGH: { label: "RISIKO TINGGI", bg: "bg-[#FCA5A5]", icon: "BAHAYA" },
};

export default function PredictionHistoryDetailPage() {
  const params = useParams();
  const childId = params.id as string;
  const predictionId = params.predictionId as string;
  const supabase = createClient();

  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ VERSI STABIL (Pastikan jumlah item selalu konsisten)
  useEffect(() => {
    async function fetchDetail() {
      const { data } = await supabase
        .from("predictions")
        .select(
          `
        *,
        children ( name )
      `,
        )
        .eq("id", predictionId)
        .single();

      if (data) {
        setPrediction(data);
      }
      setIsLoading(false);
    }

    if (predictionId) {
      fetchDetail();
    }
  }, [predictionId, supabase]);

  if (isLoading)
    return (
      <div className='min-h-screen bg-[#6EE7B7] flex items-center justify-center font-black text-2xl uppercase text-black'>
        Memuat...
      </div>
    );
  if (!prediction)
    return (
      <div className='min-h-screen bg-white flex items-center justify-center text-black'>
        Data tidak ditemukan.
      </div>
    );

  const input = prediction.input_data as PredictInput;
  const result = prediction.input_data as unknown as PredictResult;
  const cfg = riskConfig[result.risk_level || "LOW"];

  return (
    <div className='min-h-screen bg-[#6EE7B7] p-4 sm:p-10 text-black'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <Link href={`/children/${childId}`}>
          <Button
            variant='outline'
            className='border-4 border-black bg-white shadow-neo font-black uppercase'
          >
            &larr; Kembali
          </Button>
        </Link>

        <div className='bg-white border-4 border-black shadow-neo'>
          <div className={`p-8 border-b-4 border-black ${cfg.bg}`}>
            <h1 className='text-4xl font-black uppercase tracking-tight'>
              Detail Riwayat: {prediction.children.name}
            </h1>
            <p className='font-black mt-2 bg-black text-white inline-block px-3 py-1'>
              📅{" "}
              {new Date(prediction.created_at).toLocaleDateString("id-ID", {
                dateStyle: "full",
              })}
            </p>
          </div>

          <div className='p-8 space-y-10'>
            {/* 1. DATA PENGUKURAN */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-6 border-4 border-black shadow-neo-sm font-black uppercase text-sm text-center'>
              <div>
                <p className='opacity-50'>Tinggi</p>
                <p className='text-2xl'>{input.Body_Length} cm</p>
              </div>
              <div>
                <p className='opacity-50'>Berat</p>
                <p className='text-2xl'>{input.Body_Weight} kg</p>
              </div>
              <div>
                <p className='opacity-50'>Usia</p>
                <p className='text-2xl'>{input.Age} Bln</p>
              </div>
              <div>
                <p className='opacity-50'>ASI</p>
                <p className='text-2xl'>{input.ASI_Eksklusif}</p>
              </div>
            </div>

            {/* 2. ANALISIS AI */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-white border-4 border-black shadow-neo p-6 space-y-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Probabilitas
                </h4>
                <ProbabilityBar
                  label='Stunting'
                  value={result.probability?.stunting ?? 0}
                  color='#FCA5A5'
                />
                <ProbabilityBar
                  label='Tidak Stunting'
                  value={result.probability?.tidak_stunting ?? 0}
                  color='#86EFAC'
                />
              </div>

              <div className='bg-white border-4 border-black shadow-neo p-6 space-y-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Z-Score WHO
                </h4>
                <ZScoreBadge
                  label='LAZ (Tinggi/Umur)'
                  value={result.who_flags?.length_for_age_z ?? 0}
                />
                <ZScoreBadge
                  label='WAZ (Berat/Umur)'
                  value={result.who_flags?.weight_for_age_z ?? 0}
                />
              </div>

              <div className='md:col-span-2 bg-white border-4 border-black shadow-neo p-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-6'>
                  Indikator WHO
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <WhoFlagBadge
                    label='Indikator Stunting'
                    value={result.who_flags?.stunting_who_indicator ?? 0}
                    isRisk
                  />
                  <WhoFlagBadge
                    label='Stunting Berat'
                    value={result.who_flags?.severe_stunting ?? 0}
                    isRisk
                  />
                  <WhoFlagBadge
                    label='Underweight'
                    value={result.who_flags?.underweight ?? 0}
                    isRisk
                  />
                  <WhoFlagBadge
                    label='BBLR'
                    value={result.who_flags?.low_birth_weight ?? 0}
                    isRisk={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
