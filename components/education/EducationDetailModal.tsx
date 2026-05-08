import React from "react";
import { X, BookOpen, Clock } from "lucide-react";
import { EducationContent } from "@/types/education";

interface Props {
  article: EducationContent;
  onClose: () => void;
}

export function EducationDetailModal({ article, onClose }: Props) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white border-4 border-black rounded-2xl shadow-[12px_12px_0_0_#000] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Header Modal */}
        <div className='bg-yellow-300 p-4 border-b-4 border-black flex justify-between items-start'>
          <div>
            <div className='inline-flex items-center gap-1 px-2 py-1 bg-white border-2 border-black rounded-md text-[10px] font-black uppercase shadow-[2px_2px_0_0_#000] mb-2'>
              <BookOpen className='w-3 h-3' /> {article.category}
            </div>
            <h2 className='text-2xl md:text-3xl font-black uppercase leading-tight pr-4'>
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 bg-red-400 text-white border-2 border-black rounded-xl hover:bg-red-500 shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content Body */}
        <div className='p-6 overflow-y-auto flex-1 bg-[#FDFBF7]'>
          <div className='flex gap-4 mb-6 pb-4 border-b-2 border-black border-dashed text-xs font-bold text-gray-500 uppercase'>
            <span className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />{" "}
              {new Date(article.created_at).toLocaleDateString("id-ID")}
            </span>
            <span>Usia: {article.age_group} Tahun</span>
            <span>
              Sumber: <span className='text-black'>{article.source}</span>
            </span>
          </div>

          <div className='prose prose-lg max-w-none font-medium text-gray-800 leading-relaxed'>
            {article.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className='mb-4'>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
