"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useEducation } from "@/hooks/useEducation";

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
      {/* Background Page */}
      <div className='min-h-screen bg-[#f8f5ef] py-10'>
        <div className='space-y-8 max-w-7xl mx-auto px-4'>
          {/* 1. Hero Section */}
          <EducationHero />

          {/* 2. Search & Filter Bar */}
          <EducationSearchFilter filters={filters} setFilters={setFilters} />

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            {/* LEFT CONTENT */}
            <div className='lg:col-span-3 space-y-8'>
              {!isLoading &&
                !error &&
                filters.search === "" &&
                filters.category === "all" && (
                  <RecommendationSection
                    recommendations={recommendedData}
                    userCondition={userCondition}
                  />
                )}

              <div>
                <div className='flex items-center justify-between mb-6 border-b-[3px] border-black pb-2'>
                  <h2 className='text-2xl font-black uppercase tracking-tight'>
                    Koleksi Artikel
                  </h2>
                  <span className='font-black text-sm bg-black text-white px-4 py-2 border-[3px] border-black'>
                    {data.length} TOTAL
                  </span>
                </div>

                <EducationStates
                  isLoading={isLoading}
                  error={error}
                  isEmpty={!isLoading && !error && paginatedData.length === 0}
                />

                {!isLoading && !error && paginatedData.length > 0 && (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {paginatedData.map((article) => (
                        <EducationCard key={article.id} article={article} />
                      ))}
                    </div>

                    <EducationPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className='lg:col-span-1 space-y-6'>
              <QuickTipsSection />
              <FAQSection />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
