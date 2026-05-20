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

  const bgStyle =
    userCondition === "stunted"
      ? "bg-[#ff5a66]"
      : userCondition === "risk"
        ? "bg-[#ffe01b]"
        : "bg-[#8df0a8]";

  return (
    <div
      className={`border-[3px] border-black shadow-[8px_8px_0_0_#000] p-6 mb-10 ${bgStyle}`}
    >
      <div className='flex items-center gap-3 mb-6 border-b-[3px] border-black pb-4'>
        <div className='p-2 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000]'>
          <BrainCircuit className='w-6 h-6 text-black' />
        </div>
        <div>
          <h2 className='text-xl font-black uppercase'>Rekomendasi Pintar</h2>
          <p className='text-xs font-bold opacity-80'>
            Disesuaikan berdasarkan kondisi Anda.
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
