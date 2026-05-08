import React from "react";

export function DashboardHero() {
  return (
    <div className='bg-blue-300 p-6 md:p-10 border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col justify-center'>
      <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tight mb-2'>
        Pantau Tumbuh Kembang Anak.
      </h1>
      <p className='font-bold text-black max-w-2xl text-sm md:text-lg'>
        Dashboard pemantauan kesehatan terpusat. Lihat ringkasan nutrisi dan
        status pertumbuhan terkini tanpa mengubah data.
      </p>
    </div>
  );
}
