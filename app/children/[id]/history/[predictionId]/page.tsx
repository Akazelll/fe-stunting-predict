"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProbabilityBar, ZScoreBadge } from "@/components/BrutalDisplay"; // WhoFlagBadge dihapus
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

  if (isLoading)
    return (
      <div className='min-h-screen bg-[#6EE7B7] flex items-center justify-center font-black text-2xl uppercase'>
        Memuat...
      </div>
    );
  if (!prediction)
    return (
      <div className='min-h-screen bg-[#6EE7B7] flex items-center justify-center font-black text-2xl uppercase text-red-600'>
        Data Tidak Ditemukan
      </div>
    );

  const inputData = prediction.input_data as PredictInput;
  const aiResult = prediction.input_data as unknown as PredictResult;
  const cfg = riskConfig[aiResult?.risk_level || "LOW"];

  return (
    <div className='min-h-screen bg-[#6EE7B7] p-4 sm:p-10 text-black font-sans'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <Link href={`/children/${childId}`}>
          <Button
            variant='outline'
            className='border-4 border-black bg-white shadow-neo font-black uppercase rounded-none'
          >
            &larr; Kembali
          </Button>
        </Link>

        <div className='bg-white border-4 border-black shadow-neo'>
          <div className={`p-8 border-b-4 border-black ${cfg.bg}`}>
            <h1 className='text-4xl font-black uppercase tracking-tight'>
              Detail Riwayat: {prediction.children?.name}
            </h1>
            <p className='font-black mt-2 bg-black text-white inline-block px-3 py-1'>
              📅{" "}
              {new Date(prediction.created_at).toLocaleDateString("id-ID", {
                dateStyle: "full",
              })}
            </p>
          </div>

          <div className='p-8 space-y-10'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-6 border-4 border-black shadow-neo-sm font-black uppercase text-sm text-center'>
              <div>
                <p className='opacity-50'>Tinggi</p>
                <p className='text-2xl'>{inputData?.Body_Length} cm</p>
              </div>
              <div>
                <p className='opacity-50'>Berat</p>
                <p className='text-2xl'>{inputData?.Body_Weight} kg</p>
              </div>
              <div>
                <p className='opacity-50'>Usia</p>
                <p className='text-2xl'>{inputData?.Age} Bln</p>
              </div>
              <div>
                <p className='opacity-50'>ASI</p>
                <p className='text-2xl'>{inputData?.ASI_Eksklusif}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-white border-4 border-black shadow-neo p-6 space-y-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Probabilitas Gizi
                </h4>
                <ProbabilityBar
                  label='Peluang Stunting'
                  value={aiResult?.probability?.stunting ?? 0}
                  color='#FCA5A5'
                />
                <ProbabilityBar
                  label='Peluang Normal'
                  value={aiResult?.probability?.tidak_stunting ?? 0}
                  color='#86EFAC'
                />
              </div>

              <div className='bg-white border-4 border-black shadow-neo p-6 space-y-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Skor WHO (Z-Score)
                </h4>
                <ZScoreBadge
                  label='LAZ (Tinggi/Umur)'
                  value={aiResult?.who_flags?.length_for_age_z ?? 0}
                />
                <ZScoreBadge
                  label='WAZ (Berat/Umur)'
                  value={aiResult?.who_flags?.weight_for_age_z ?? 0}
                />
                <p className='text-[10px] font-bold mt-4 bg-[#FEF08A] p-2 border-2 border-black text-center shadow-neo-sm'>
                  Z-Score &lt; −2 = berisiko | Z-Score &lt; −3 = sangat berisiko
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
