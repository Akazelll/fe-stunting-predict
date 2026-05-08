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
import { GrowthChartPlaceholder } from "@/components/dashboard/GrowthChartPlaceholder";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { EducationWidget } from "@/components/dashboard/EducationWidget";

export default function DashboardPage() {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from("children")
          .select(
            "id, name, gender, birth_date, predictions (result, created_at)",
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
                <GrowthChartPlaceholder />
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
