import React from "react";
import { Baby, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { Child, getLatestStatus } from "@/lib/dashboard-utils";

export function DashboardStats({ childrenData }: { childrenData: Child[] }) {
  const totalAnak = childrenData.length;
  let normalCount = 0;
  let riskCount = 0;
  let stuntingCount = 0;

  childrenData.forEach((child) => {
    const status = getLatestStatus(child.predictions);
    if (status === "normal") normalCount++;
    if (status === "risk") riskCount++;
    if (status === "stunted") stuntingCount++;
  });

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
      <div className='bg-white p-5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-36'>
        <div className='flex justify-between items-start'>
          <p className='text-sm font-black uppercase'>Total Anak</p>
          <Baby className='w-6 h-6' />
        </div>
        <h3 className='text-5xl font-black'>{totalAnak}</h3>
      </div>

      <div className='bg-green-300 p-5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-36'>
        <div className='flex justify-between items-start'>
          <p className='text-sm font-black uppercase'>Normal</p>
          <CheckCircle2 className='w-6 h-6' />
        </div>
        <h3 className='text-5xl font-black'>{normalCount}</h3>
      </div>

      <div className='bg-yellow-300 p-5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-36'>
        <div className='flex justify-between items-start'>
          <p className='text-sm font-black uppercase'>Beresiko</p>
          <AlertCircle className='w-6 h-6' />
        </div>
        <h3 className='text-5xl font-black'>{riskCount}</h3>
      </div>

      <div className='bg-red-400 p-5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between h-36 text-white'>
        <div className='flex justify-between items-start'>
          <p className='text-sm font-black uppercase'>Stunting</p>
          <Activity className='w-6 h-6' />
        </div>
        <h3 className='text-5xl font-black'>{stuntingCount}</h3>
      </div>
    </div>
  );
}
