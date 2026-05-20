"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";
import { Child } from "@/lib/dashboard-utils";

// Components
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ChildMonitoringList } from "@/components/dashboard/ChildMonitoringList";
// PERUBAHAN: Import GrowthChart yang asli, bukan Placeholder
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { EducationWidget } from "@/components/dashboard/EducationWidget";

export default function DashboardPage() {
  const [childrenData, setChildrenData] = useState<Child[]>([]);

  // PERUBAHAN: State tambahan untuk menyimpan data Grafik
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [selectedChildName, setSelectedChildName] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Ambil Data Anak
        const { data: childrenRes, error: fetchError } = await supabase
          .from("children")
          .select(
            "id, name, gender, birth_date, predictions (result, created_at)",
          )
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const children = (childrenRes as Child[]) || [];
        setChildrenData(children);

        // 2. Jika ada anak, ambil Data Pertumbuhan anak pertama untuk ditampilkan di grafik
        if (children.length > 0) {
          const firstChild = children[0];
          setSelectedChildName(firstChild.name);

          const { data: records, error: recordError } = await supabase
            .from("growth_records")
            .select("age_months, height_cm, weight_kg")
            .eq("child_id", firstChild.id)
            .order("age_months", { ascending: true }); // Urutkan dari bulan terkecil ke terbesar

          if (!recordError && records) {
            setGrowthData(records);
          }
        }
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  return (
    <AppLayout>
      <div className='space-y-8'>
        <DashboardHero />

        {error && (
          <div className='bg-red-300 border-4 border-black p-4 flex items-center gap-3 shadow-[4px_4px_0_0_#000]'>
            <AlertCircle className='text-black w-6 h-6' />
            <p className='font-black uppercase'>Gagal memuat data: {error}</p>
          </div>
        )}

        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='bg-gray-200 h-36 border-4 border-black shadow-[4px_4px_0_0_#000]'
              ></div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <DashboardStats childrenData={childrenData} />

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8'>
              {/* Kolom Kiri */}
              <div className='lg:col-span-2 space-y-8'>
                <ChildMonitoringList childrenData={childrenData} />

                {/* PERUBAHAN: Panggil komponen grafik dengan mengirimkan props data */}
                <GrowthChart data={growthData} childName={selectedChildName} />
              </div>

              {/* Kolom Kanan (Widgets) */}
              <div className='space-y-8'>
                <RecentActivity childrenData={childrenData} />
                <EducationWidget />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
