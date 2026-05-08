import React from "react";
import { BookHeart } from "lucide-react";

export function EducationHero() {
  return (
    <div className='bg-pink-200 p-8 md:p-12 border-4 border-black shadow-[8px_8px_0_0_#000] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden'>
      <div className='relative z-10 space-y-4 max-w-2xl'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] text-xs font-black uppercase'>
          <BookHeart className='w-4 h-4 text-pink-500' />
          <span>Smart Parenting Center</span>
        </div>
        <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight'>
          Edukasi Tumbuh <br className='hidden md:block' />
          Kembang Anak
        </h1>
        <p className='font-bold text-gray-800 text-sm md:text-lg'>
          Pelajari nutrisi yang tepat, tips kesehatan, dan panduan parenting
          cerdas untuk mencegah stunting dan memaksimalkan potensi anak Anda.
        </p>
      </div>
      <BookHeart className='w-48 h-48 text-pink-300 absolute -right-10 -bottom-10 opacity-60 transform rotate-12' />
    </div>
  );
}
