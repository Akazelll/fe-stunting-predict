// components/children/ChildProfileBanner.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

export function ChildProfileBanner({
  child,
  ageMonths,
  latestResult,
}: {
  child: any;
  ageMonths: number;
  latestResult: string;
}) {
  return (
    <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
      <div>
        <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight mb-2'>
          {child.name}
        </h1>
        <div className='flex flex-wrap gap-2 items-center'>
          <Badge variant={child.gender === "L" ? "default" : "warning"}>
            {child.gender === "L" ? "Laki-laki" : "Perempuan"}
          </Badge>
          <Badge variant='neutral'>Usia: {ageMonths} Bulan</Badge>
        </div>
      </div>

      <div className='p-4 border-4 border-black font-black uppercase text-center bg-yellow-300 shadow-[4px_4px_0_0_#000] min-w-[200px]'>
        <p className='text-xs opacity-70 mb-1'>Status Terakhir</p>
        <p
          className={`text-2xl ${latestResult === "stunted" ? "text-red-600" : "text-black"}`}
        >
          {latestResult || "BELUM DICEK"}
        </p>
      </div>
    </div>
  );
}
