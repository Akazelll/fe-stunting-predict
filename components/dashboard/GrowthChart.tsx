import React from "react";
import { TrendingUp, LineChart as LineChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GrowthChartProps {
  data: any[];
  childName?: string; // Menambahkan childName sebagai string opsional
}

export function GrowthChart({ data, childName }: GrowthChartProps) {
  // Grafik hanya akan terbentuk logis jika ada minimal 2 titik data
  const hasEnoughData = data && data.length > 1;

  return (
    <div className='bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]'>
      <div className='flex justify-between items-center mb-6 border-b-4 border-black pb-4'>
        <div>
          <h2 className='text-xl font-black uppercase'>
            Statistik Tumbuh Kembang
          </h2>
          {childName && hasEnoughData && (
            <p className='text-xs font-bold mt-1 bg-yellow-300 border-2 border-black inline-block px-2 py-0.5 shadow-[2px_2px_0_0_#000]'>
              Menampilkan Grafik: {childName}
            </p>
          )}
        </div>
        <LineChartIcon className='w-8 h-8 text-black' />
      </div>

      {hasEnoughData ? (
        <div className='h-72 w-full border-4 border-black p-4 bg-[#f8f5ef] shadow-inner'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#000'
                opacity={0.3}
              />
              <XAxis
                dataKey='age_months'
                tick={{ fill: "#000", fontWeight: "900", fontSize: 12 }}
                axisLine={{ stroke: "#000", strokeWidth: 3 }}
                tickLine={{ stroke: "#000", strokeWidth: 2 }}
              />
              <YAxis
                tick={{ fill: "#000", fontWeight: "900", fontSize: 12 }}
                axisLine={{ stroke: "#000", strokeWidth: 3 }}
                tickLine={{ stroke: "#000", strokeWidth: 2 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "3px solid black",
                  borderRadius: "0",
                  boxShadow: "4px 4px 0 0 #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontWeight: "black",
                  fontSize: "12px",
                  marginTop: "10px",
                }}
              />
              <Line
                type='monotone'
                name='Tinggi (cm)'
                dataKey='height_cm'
                stroke='#ff5a66'
                strokeWidth={4}
                dot={{ stroke: "#000", strokeWidth: 2, fill: "#ff5a66", r: 5 }}
                activeDot={{ stroke: "#000", strokeWidth: 2, r: 8 }}
              />
              <Line
                type='monotone'
                name='Berat (kg)'
                dataKey='weight_kg'
                stroke='#8ec5ff'
                strokeWidth={4}
                dot={{ stroke: "#000", strokeWidth: 2, fill: "#8ec5ff", r: 5 }}
                activeDot={{ stroke: "#000", strokeWidth: 2, r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className='h-64 bg-gray-100 border-4 border-black border-dashed flex flex-col items-center justify-center text-center p-6 shadow-inner'>
          <div className='bg-white p-3 border-4 border-black shadow-[4px_4px_0_0_#000] mb-4'>
            <TrendingUp className='w-8 h-8 text-black' />
          </div>
          <p className='font-black text-gray-800 uppercase'>Belum Cukup Data</p>
          <p className='font-bold text-gray-500 text-sm mt-2 max-w-xs'>
            Grafik akan tersedia secara otomatis setelah anak memiliki minimal 2
            data pengukuran historis.
          </p>
        </div>
      )}
    </div>
  );
}
