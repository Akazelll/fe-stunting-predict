"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

// Update tipe data untuk menampung relasi tabel predictions
type Prediction = {
  result: "normal" | "risk" | "stunted";
  created_at: string;
};

type Child = {
  id: string;
  name: string;
  gender: "L" | "P";
  birth_date: string;
  predictions: Prediction[]; // Array of predictions dari join Supabase
};

export default function DashboardPage() {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        // Query Join: Mengambil data anak beserta history prediksi mereka
        const { data, error: fetchError } = await supabase
          .from("children")
          .select(
            `
            id, 
            name, 
            gender, 
            birth_date,
            predictions (
              result,
              created_at
            )
          `,
          )
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setChildrenData((data as Child[]) || []);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data anak.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [supabase]);

  // Fungsi helper untuk menghitung umur dalam bulan
  const calculateAgeInMonths = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    const yearsDiff = today.getFullYear() - birthDate.getFullYear();
    const monthsDiff = today.getMonth() - birthDate.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  // Fungsi helper untuk mendapatkan status prediksi terakhir
  const getLatestStatus = (predictions?: Prediction[]) => {
    if (!predictions || predictions.length === 0) return null;
    // Urutkan berdasarkan tanggal terbaru
    const sorted = [...predictions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return sorted[0].result;
  };

  // Konfigurasi visual UI untuk masing-masing status
  const getStatusUI = (status: "normal" | "risk" | "stunted" | null) => {
    switch (status) {
      case "normal":
        return { label: "Normal", color: "bg-green-400 text-black" };
      case "risk":
        return { label: "Beresiko", color: "bg-yellow-400 text-black" };
      case "stunted":
        return { label: "Stunting", color: "bg-red-500 text-white" };
      default:
        return { label: "Belum Dicek", color: "bg-gray-200 text-gray-500" };
    }
  };

  return (
    <AppLayout>
      <div className='space-y-8'>
        {/* Header Dashboard */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-yellow-300 p-6 border-4 border-black shadow-[8px_8px_0_0_#000]'>
          <div>
            <h1 className='text-3xl md:text-4xl font-black uppercase'>
              Data Anak
            </h1>
            <p className='font-bold text-black mt-1'>
              Kelola dan pantau riwayat prediksi stunting anak.
            </p>
          </div>
          <Button asChild variant='primary' className='w-full sm:w-auto'>
            <Link href='/children/new'>+ Tambah Anak</Link>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-red-200 border-4 border-black p-4 mt-4 shadow-[4px_4px_0_0_#000]'>
            <p className='font-bold text-red-800 uppercase flex items-center gap-2'>
              <span className='text-xl'>⚠️</span> Error: {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='flex justify-center py-12'>
            <div className='animate-pulse bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]'>
              <span className='font-black uppercase text-xl'>
                Memuat Data...
              </span>
            </div>
          </div>
        )}

        {/* List Data Anak */}
        {!isLoading && childrenData.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {childrenData.map((child) => {
              const latestStatus = getLatestStatus(child.predictions);
              const statusUI = getStatusUI(latestStatus);

              return (
                <div
                  key={child.id}
                  className='group flex flex-col justify-between bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] transition-all'
                >
                  <div>
                    {/* Header Card: Nama & Gender */}
                    <div className='flex justify-between items-start mb-4'>
                      <h3
                        className='text-2xl font-black uppercase line-clamp-1'
                        title={child.name}
                      >
                        {child.name}
                      </h3>
                      <Badge
                        variant={child.gender === "L" ? "default" : "warning"}
                      >
                        {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </Badge>
                    </div>

                    {/* Informasi Metrik (Usia & Status) */}
                    <div className='flex gap-6 mb-6 border-l-4 border-black pl-3 py-1'>
                      <div>
                        <p className='text-xs font-bold text-gray-500 uppercase'>
                          Usia
                        </p>
                        <p className='font-black text-lg'>
                          {calculateAgeInMonths(child.birth_date)} Bulan
                        </p>
                      </div>

                      {/* Divider Visual */}
                      <div className='w-1 bg-black/10'></div>

                      <div>
                        <p className='text-xs font-bold text-gray-500 uppercase'>
                          Status Terakhir
                        </p>
                        <div
                          className={`mt-1 inline-flex items-center rounded-none border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0_0_#000] ${statusUI.color}`}
                        >
                          {statusUI.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className='flex gap-3 mt-4 pt-4 border-t-4 border-black'>
                    <Button asChild variant='primary' className='w-full'>
                      <Link href={`/children/${child.id}`}>Detail Profil</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && childrenData.length === 0 && (
          <div className='bg-white border-4 border-black p-10 text-center shadow-[8px_8px_0_0_#000]'>
            <div className='text-6xl mb-4'>👶</div>
            <h3 className='text-2xl font-black uppercase mb-2'>
              Belum Ada Data Anak
            </h3>
            <p className='font-bold text-gray-600 mb-6 max-w-md mx-auto'>
              Kamu belum menambahkan profil anak. Tambahkan sekarang untuk mulai
              melakukan prediksi stunting.
            </p>
            <Button asChild variant='primary'>
              <Link href='/children/new'>Tambah Data Pertama</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
