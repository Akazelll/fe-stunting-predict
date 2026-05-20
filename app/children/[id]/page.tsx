// app/children/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { usePredict } from "@/hooks/usePredict";
import { PredictResult } from "@/types/predict";
import { calculateAgeMonths } from "@/lib/child-utils";

// Components
import { ChildProfileBanner } from "@/components/children/ChildProfileBanner";
import { MeasurementForm } from "@/components/children/MeasurementForm";
import { PredictionResultCard } from "@/components/children/PredictionResultCard";
import { MeasurementHistory } from "@/components/children/MeasurementHistory";

export default function ChildDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [child, setChild] = useState<any>(null);
  const [birthRecord, setBirthRecord] = useState<any>(null);
  const [predictionsList, setPredictionsList] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    form,
    result: aiResult,
    loading: isPredicting,
    error: predictError,
    handleChange,
    handleSubmit,
  } = usePredict();

  useEffect(() => {
    if (id) fetchChildData();
  }, [id]);

  useEffect(() => {
    if (!child) return;
    handleChange("Age", calculateAgeMonths(child.birth_date).toString());
    handleChange("Sex", child.gender === "L" ? "Male" : "Female");
    handleChange("Birth_Weight", birthRecord?.weight_kg?.toString() ?? "");
    handleChange("Birth_Length", birthRecord?.height_cm?.toString() ?? "");
  }, [child, birthRecord]);

  useEffect(() => {
    if (aiResult && child) savePredictionToDatabase(aiResult);
  }, [aiResult]);

  async function fetchChildData() {
    setIsLoadingData(true);
    const { data: childData } = await supabase
      .from("children")
      .select("*")
      .eq("id", id)
      .single();
    setChild(childData);

    const { data: birthData } = await supabase
      .from("growth_records")
      .select("weight_kg, height_cm")
      .eq("child_id", id)
      .eq("age_months", 0)
      .single();
    setBirthRecord(birthData ?? null);

    const { data: predData } = await supabase
      .from("predictions")
      .select("*")
      .eq("child_id", id)
      .order("created_at", { ascending: false });
    setPredictionsList(predData || []);
    setIsLoadingData(false);
  }

  async function savePredictionToDatabase(resultData: PredictResult) {
    try {
      const ageMonths = calculateAgeMonths(child.birth_date);

      // ✅ PERBAIKAN: Menyesuaikan dengan format API ('Stunting' dan 'Rendah')
      const dbStatus =
        resultData.prediction === "Stunting"
          ? "stunted"
          : resultData.risk_level === "Rendah"
            ? "normal"
            : "risk";

      await supabase.from("growth_records").insert([
        {
          child_id: id,
          height_cm: Number(form.Body_Length),
          weight_kg: Number(form.Body_Weight),
          age_months: ageMonths,
        },
      ]);
      await supabase.from("predictions").insert([
        {
          child_id: id,
          input_data: { ...form, ...resultData },
          result: dbStatus,
          // Sudah menggunakan properti yang benar
          confidence_score: resultData.stunting_probability ?? 0,
        },
      ]);

      fetchChildData();
    } catch (e) {
      console.error("Gagal simpan:", e);
    }
  }

  if (isLoadingData) {
    return (
      <AppLayout>
        <div className='flex justify-center py-20'>
          <div className='animate-pulse bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]'>
            <span className='font-black uppercase text-2xl'>
              Sinkronisasi Data...
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className='space-y-8 max-w-6xl mx-auto'>
        <div>
          <Button asChild variant='secondary'>
            <Link href='/child'>&larr; Kembali</Link>
          </Button>
        </div>

        <ChildProfileBanner
          child={child}
          ageMonths={calculateAgeMonths(child.birth_date)}
          latestResult={predictionsList[0]?.result}
        />

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Form */}
          <div className='lg:col-span-3'>
            <MeasurementForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isPredicting={isPredicting}
            />
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-2 space-y-8'>
            <PredictionResultCard
              aiResult={aiResult}
              predictError={predictError}
            />
            <MeasurementHistory
              predictionsList={predictionsList}
              childId={id}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
