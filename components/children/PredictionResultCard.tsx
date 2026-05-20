// components/children/PredictionResultCard.tsx
import React from "react";
import { riskConfig } from "@/lib/child-utils";

export function PredictionResultCard({
  aiResult,
  predictError,
}: {
  aiResult: any;
  predictError: string | null;
}) {
  if (!aiResult && !predictError) return null;

  return (
    <div className='space-y-6'>
      {predictError && (
        <div className='bg-red-300 border-4 border-black p-4 font-bold text-sm shadow-[4px_4px_0_0_#000]'>
          ⚠️ {predictError}
        </div>
      )}

      {aiResult &&
        (() => {
          // Fallback ke "Rendah" jika key tidak ada, mencegah undefined error sebelumnya
          const cfg =
            riskConfig[aiResult.risk_level as keyof typeof riskConfig] ||
            riskConfig.Rendah;

          return (
            <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
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

              <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 space-y-6'>
                <h4 className='font-black uppercase tracking-widest border-b-4 border-black pb-2'>
                  Detail Skor
                </h4>
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs font-black uppercase'>
                    <span>Probabilitas Stunting</span>
                    <span>
                      {/* PERBAIKAN DI SINI */}
                      {((aiResult.stunting_probability ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className='h-6 w-full bg-gray-200 border-2 border-black overflow-hidden relative'>
                    <div
                      className='h-full bg-red-400 border-r-2 border-black transition-all duration-1000'
                      style={{
                        /* PERBAIKAN DI SINI */
                        width: `${(aiResult.stunting_probability ?? 0) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Asumsi: who_flags di pass dari props yang sama, pastikan untuk memberi fallback (?) jika tidak ada */}
                {aiResult.who_flags && (
                  <div className='space-y-3 pt-4'>
                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        Z-Score (TB/U)
                      </span>
                      <span className='font-black bg-yellow-300 px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult.who_flags?.length_for_age_z?.toFixed(2) ??
                          "N/A"}
                      </span>
                    </div>
                    <div className='flex justify-between items-center border-b-2 border-black border-dashed pb-2'>
                      <span className='text-xs font-bold uppercase'>
                        Z-Score (BB/U)
                      </span>
                      <span className='font-black bg-blue-300 px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]'>
                        {aiResult.who_flags?.weight_for_age_z?.toFixed(2) ??
                          "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
