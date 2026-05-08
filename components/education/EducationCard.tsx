import React, { useState } from "react";
import { Apple, Users, Stethoscope, ArrowRight } from "lucide-react";
import { EducationContent } from "@/types/education";
import { EducationDetailModal } from "./EducationDetailModal";
import { Button } from "@/components/ui/button";

const categoryStyles = {
  nutrition: { color: "bg-green-300", icon: Apple, label: "Nutrisi" },
  parenting: { color: "bg-pink-300", icon: Users, label: "Parenting" },
  health: { color: "bg-blue-300", icon: Stethoscope, label: "Kesehatan" },
};

export function EducationCard({ article }: { article: EducationContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const style = categoryStyles[article.category];
  const Icon = style.icon;

  return (
    <>
      <div className='bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0_0_#000] flex flex-col justify-between p-5 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all group'>
        <div>
          <div className='flex justify-between items-start mb-4'>
            <div
              className={`px-3 py-1 border-2 border-black rounded-lg text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0_0_#000] ${style.color}`}
            >
              <Icon className='w-3 h-3' /> {style.label}
            </div>
            {article.condition !== "normal" && (
              <div className='px-2 py-1 bg-red-400 text-white border-2 border-black rounded-lg text-[10px] font-black uppercase shadow-[2px_2px_0_0_#000]'>
                Penting
              </div>
            )}
          </div>
          <h3 className='text-xl font-black uppercase tracking-tight mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors'>
            {article.title}
          </h3>
          <p className='text-sm font-semibold text-gray-600 line-clamp-3 mb-4'>
            {article.content.substring(0, 120)}...
          </p>
        </div>

        <div className='pt-4 border-t-2 border-black border-dashed flex items-center justify-between mt-auto'>
          <p className='text-xs font-bold text-gray-500 uppercase'>
            Usia: {article.age_group} thn
          </p>
          {/* Perbaikan: Dihapus size="sm" dan ditambahkan padding manual px-3 py-1.5 */}
          <Button
            onClick={() => setIsOpen(true)}
            className='bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-xs flex items-center gap-1 px-3 py-1.5 h-auto'
          >
            Baca <ArrowRight className='w-3 h-3' />
          </Button>
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
