// components/children/MeasurementHistory.tsx
import React from "react";
import Link from "next/link";

// Helper untuk mengubah text dari database ke UI Bahasa Indonesia
const formatStatus = (status: string) => {
  if (status === "stunted") return "Stunting";
  if (status === "risk") return "Berisiko";
  return "Normal";
};

export function MeasurementHistory({
  predictionsList,
  childId,
}: {
  predictionsList: any[];
  childId: string;
}) {
  return (
    <div className='bg-white border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col max-h-[500px]'>
      <div className='px-6 py-4 border-b-4 border-black bg-yellow-300 font-black uppercase'>
        Riwayat Pengukuran
      </div>
      <div className='overflow-y-auto divide-y-4 divide-black'>
        {predictionsList.length === 0 ? (
          <div className='p-10 flex flex-col items-center justify-center text-center opacity-50'>
            <span className='text-4xl mb-2'>📭</span>
            <p className='font-bold uppercase'>Belum ada riwayat</p>
          </div>
        ) : (
          predictionsList.map((p) => (
            <Link
              key={p.id}
              href={`/children/${childId}/history/${p.id}`}
              className='block p-5 hover:bg-blue-50 group transition-colors'
            >
              <div className='flex justify-between items-center mb-2'>
                <span className='font-black group-hover:underline text-sm uppercase'>
                  {new Date(p.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000] ${
                    p.result === "stunted"
                      ? "bg-red-400 text-white"
                      : p.result === "risk"
                        ? "bg-yellow-400 text-black"
                        : "bg-green-400 text-black"
                  }`}
                >
                  {/* Panggil helper formatter di sini */}
                  {formatStatus(p.result)}
                </span>
              </div>
              <p className='text-xs font-bold text-gray-600 uppercase border-l-2 border-black pl-2'>
                TB: {p.input_data.Body_Length}cm • BB:{" "}
                {p.input_data.Body_Weight}kg
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
