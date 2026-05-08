import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";
import {
  Child,
  getLatestStatus,
  getStatusUI,
  calculateAgeInMonths,
} from "@/lib/dashboard-utils";

export function ChildMonitoringList({
  childrenData,
}: {
  childrenData: Child[];
}) {
  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-end border-b-4 border-black pb-4'>
        <div>
          <h2 className='text-2xl font-black uppercase tracking-tight'>
            Monitoring Anak
          </h2>
          <p className='font-bold text-gray-600'>
            Daftar pemantauan yang terdaftar di sistem.
          </p>
        </div>
      </div>

      {childrenData.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {childrenData.map((child) => {
            const latestStatus = getLatestStatus(child.predictions);
            const statusUI = getStatusUI(latestStatus);

            return (
              <div
                key={child.id}
                className='bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000] flex flex-col justify-between min-h-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] transition-all'
              >
                <div>
                  <div className='flex justify-between items-start mb-4'>
                    <h3
                      className='text-xl font-black uppercase truncate max-w-37.5'
                      title={child.name}
                    >
                      {child.name}
                    </h3>
                    <div
                      className={`px-3 py-1 border-2 border-black text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0_0_#000] ${statusUI.color}`}
                    >
                      {statusUI.label}
                    </div>
                  </div>
                  <div className='space-y-1 mb-6'>
                    <p className='text-sm font-bold uppercase text-gray-500'>
                      Usia:{" "}
                      <span className='text-black'>
                        {calculateAgeInMonths(child.birth_date)} Bulan
                      </span>
                    </p>
                    <p className='text-sm font-bold uppercase text-gray-500'>
                      Gender:{" "}
                      <span className='text-black'>
                        {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  className='w-full border-2 border-black bg-white text-black hover:bg-yellow-300 shadow-[2px_2px_0_0_#000] rounded-none font-black uppercase'
                >
                  <Link href={`/children/${child.id}`}>Lihat Detail</Link>
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0_0_#000]'>
          <Baby className='w-16 h-16 text-black mx-auto mb-4' />
          <h3 className='text-2xl font-black uppercase mb-2'>Belum Ada Data</h3>
          <p className='font-bold text-gray-600 max-w-sm mx-auto'>
            Saat ini belum ada data pemantauan anak yang tersedia untuk
            ditampilkan.
          </p>
        </div>
      )}
    </div>
  );
}
