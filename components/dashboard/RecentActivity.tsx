import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Child, getLatestStatus, getStatusUI } from "@/lib/dashboard-utils";

export function RecentActivity({ childrenData }: { childrenData: Child[] }) {
  const childrenWithPredictions = childrenData.filter(
    (c) => c.predictions?.length > 0,
  );

  return (
    <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden'>
      <div className='bg-yellow-300 p-4 border-b-4 border-black'>
        <h2 className='text-lg font-black uppercase'>Pemeriksaan Terakhir</h2>
      </div>
      <div className='p-0'>
        {childrenWithPredictions.length > 0 ? (
          childrenWithPredictions.slice(0, 4).map((child, idx) => {
            const latest = child.predictions.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )[0];
            return (
              <div
                key={child.id}
                className={`flex justify-between items-center p-4 ${idx !== 0 ? "border-t-2 border-black" : ""}`}
              >
                <div>
                  <p className='font-black text-sm uppercase'>{child.name}</p>
                  <p className='text-xs font-bold text-gray-500'>
                    {new Date(latest.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_0_#000] ${getStatusUI(latest.result).color}`}
                >
                  {getStatusUI(latest.result).label}
                </div>
              </div>
            );
          })
        ) : (
          <div className='p-6 text-center'>
            <p className='text-sm font-bold text-gray-500 uppercase'>
              Belum ada riwayat.
            </p>
          </div>
        )}
      </div>
      {childrenWithPredictions.length > 0 && (
        <div className='border-t-4 border-black'>
          <Link
            href='/child'
            className='p-4 flex items-center justify-center gap-2 text-sm font-black uppercase text-center bg-gray-100 hover:bg-yellow-300 transition-colors'
          >
            Lihat Semua <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      )}
    </div>
  );
}
