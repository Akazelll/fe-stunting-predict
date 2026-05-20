import React, { useState } from "react";
import { Apple, Users, Stethoscope, ArrowRight } from "lucide-react";
import { EducationContent } from "@/types/education";
import { EducationDetailModal } from "./EducationDetailModal";

const categoryStyles = {
  nutrition: { color: "bg-[#8df0a8]", icon: Apple, label: "Nutrisi" },
  parenting: { color: "bg-[#ffe01b]", icon: Users, label: "Parenting" },
  health: { color: "bg-[#8ec5ff]", icon: Stethoscope, label: "Kesehatan" },
};

export function EducationCard({ article }: { article: EducationContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const style = categoryStyles[article.category];
  const Icon = style.icon;

  return (
    <>
      <div className='border-[3px] border-black bg-white shadow-[6px_6px_0_0_#000] p-5 flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] transition-all'>
        <div>
          <div className='flex justify-between items-start mb-4'>
            <div
              className={`px-3 py-1 border-[3px] border-black font-black uppercase text-[10px] flex items-center gap-1 shadow-[4px_4px_0_0_#000] ${style.color}`}
            >
              <Icon className='w-3 h-3' /> {style.label}
            </div>
          </div>
          <h3 className='text-lg font-black uppercase tracking-tight mb-2 leading-tight'>
            {article.title}
          </h3>
          <p className='text-sm font-bold text-gray-700 line-clamp-3 mb-4'>
            {article.content.substring(0, 100)}...
          </p>
        </div>

        <div className='pt-4 border-t-[3px] border-black flex items-center justify-between mt-auto'>
          <p className='text-[10px] font-black uppercase'>
            Usia: {article.age_group} thn
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className='border-[3px] border-black bg-[#ffe01b] text-black font-black uppercase px-4 py-2 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:shadow-none text-xs flex items-center gap-1'
          >
            Baca <ArrowRight className='w-3 h-3' />
          </button>
        </div>
      </div>

      {isOpen && (
        <EducationDetailModal
          article={article}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
