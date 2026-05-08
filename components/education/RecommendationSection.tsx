import React from "react";
import { BrainCircuit } from "lucide-react";
import { EducationContent, EducationCondition } from "@/types/education";
import { EducationCard } from "./EducationCard";

interface Props {
  recommendations: EducationContent[];
  userCondition: EducationCondition;
}

export function RecommendationSection({
  recommendations,
  userCondition,
}: Props) {
  if (recommendations.length === 0) return null;

  const getHeaderStyle = () => {
    if (userCondition === "stunted")
      return "bg-red-200 border-red-800 text-red-900";
    if (userCondition === "risk")
      return "bg-yellow-200 border-yellow-800 text-yellow-900";
    return "bg-green-200 border-green-800 text-green-900";
  };

  return (
    <div
      className={`border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000] p-6 mb-10 ${getHeaderStyle()}`}
    >
      <div className='flex items-center gap-3 mb-6 border-b-4 border-black/20 pb-4'>
        <div className='p-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]'>
          <BrainCircuit className='w-6 h-6 text-black' />
        </div>
        <div>
          <h2 className='text-xl font-black uppercase'>
            Rekomendasi Pintar Untuk Anda
          </h2>
          <p className='text-sm font-bold opacity-80'>
            Disesuaikan secara otomatis berdasarkan riwayat pemeriksaan terakhir
            anak Anda.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {recommendations.map((article) => (
          <EducationCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
