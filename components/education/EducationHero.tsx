import React from "react";
import { BookHeart } from "lucide-react";

export function EducationHero() {
  return (
    <div className='border-[3px] border-black bg-[#8ec5ff] shadow-[10px_10px_0_0_#000] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden'>
      <div className='relative z-10 space-y-4 max-w-2xl'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-white border-[3px] border-black font-black uppercase text-xs shadow-[4px_4px_0_0_#000]'>
          <BookHeart className='w-4 h-4' />
          <span>Smart Parenting Center</span>
        </div>
        <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight text-black'>
          Edukasi Tumbuh Kembang Anak
        </h1>
        <p className='font-bold text-black text-sm md:text-lg opacity-90'>
          Pelajari nutrisi yang tepat, tips kesehatan, dan panduan parenting
          cerdas untuk mencegah stunting.
        </p>
      </div>
      <BookHeart className='w-48 h-48 text-black/20 absolute -right-10 -bottom-10' />
    </div>
  );
}
