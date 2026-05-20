import React from "react";
import { X, BookOpen, Clock } from "lucide-react";

export function EducationDetailModal({ article, onClose }: any) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
      <div className='bg-[#f8f5ef] border-[3px] border-black shadow-[12px_12px_0_0_#000] w-full max-w-3xl max-h-[90vh] flex flex-col'>
        <div className='bg-[#ffe01b] p-6 border-b-[3px] border-black flex justify-between items-start'>
          <h2 className='text-2xl font-black uppercase'>{article.title}</h2>
          <button
            onClick={onClose}
            className='border-[3px] border-black bg-[#ff5a66] p-1 shadow-[4px_4px_0_0_#000]'
          >
            <X className='w-6 h-6' />
          </button>
        </div>
        <div className='p-6 overflow-y-auto font-bold'>{article.content}</div>
      </div>
    </div>
  );
}
