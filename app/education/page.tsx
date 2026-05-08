"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useEducation } from "@/hooks/useEducation";

// Components
import { EducationHero } from "@/components/education/EducationHero";
import { EducationSearchFilter } from "@/components/education/EducationSearchFilter";
import { EducationCard } from "@/components/education/EducationCard";
import { RecommendationSection } from "@/components/education/RecommendationSection";
import { EducationPagination } from "@/components/education/EducationPagination";
import {
  QuickTipsSection,
  FAQSection,
  EducationStates,
} from "@/components/education/Widgets";

export default function EducationPage() {
  const {
    data,
    paginatedData,
    recommendedData,
    userCondition,
    isLoading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useEducation();

  return (
    <AppLayout>
      <div className='space-y-8 max-w-7xl mx-auto pb-10'>
        {/* 1. Hero Section */}
        <EducationHero />

        {/* 2. Search & Filter Bar */}
        <EducationSearchFilter filters={filters} setFilters={setFilters} />

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* LEFT CONTENT (Main Article Grid & Recommendation) */}
          <div className='lg:col-span-3 space-y-8'>
            {/* 3. Personalized Recommendation */}
            {!isLoading &&
              !error &&
              filters.search === "" &&
              filters.category === "all" && (
                <RecommendationSection
                  recommendations={recommendedData}
                  userCondition={userCondition}
                />
              )}

            {/* 4. Main Education Grid */}
            <div>
              <div className='flex items-center justify-between mb-6 border-b-4 border-black pb-2'>
                <h2 className='text-2xl font-black uppercase tracking-tight'>
                  Koleksi Artikel
                </h2>
                <span className='font-bold text-sm bg-black text-white px-3 py-1 rounded-full shadow-[2px_2px_0_0_#000]'>
                  {data.length} Total
                </span>
              </div>

              {/* States Handling */}
              <EducationStates
                isLoading={isLoading}
                error={error}
                isEmpty={!isLoading && !error && paginatedData.length === 0}
              />

              {/* Grid (Max 5 items) */}
              {!isLoading && !error && paginatedData.length > 0 && (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Render data berdasarkan Pagination */}
                    {paginatedData.map((article) => (
                      <EducationCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* 5. Pagination Control */}
                  <EducationPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR (Widgets) */}
          <div className='lg:col-span-1 space-y-6'>
            <QuickTipsSection />
            <FAQSection />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
