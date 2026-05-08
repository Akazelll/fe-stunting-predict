import React from "react";
import { TrendingUp, LineChart } from "lucide-react";

export function GrowthChartPlaceholder() {
  return (
    <div className='bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]'>
      <div className='flex justify-between items-center mb-6 border-b-4 border-black pb-4'>
        <h2 className='text-xl font-black uppercase'>
          Statistik Tumbuh Kembang
        </h2>
        <LineChart className='w-6 h-6 text-black' />
      </div>
      <div className='h-48 bg-gray-100 border-4 border-black border-dashed flex flex-col items-center justify-center text-center p-4'>
        <TrendingUp className='w-12 h-12 text-gray-400 mb-2' />
        <p className='font-bold text-gray-500 uppercase'>
          Grafik akan tersedia jika terdapat data historis yang memadai.
        </p>
      </div>
    </div>
  );
}
