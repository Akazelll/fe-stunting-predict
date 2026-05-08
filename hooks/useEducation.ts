import { useState, useEffect, useMemo } from "react";
import {
  EducationContent,
  EducationFilterState,
  EducationCondition,
} from "@/types/education";
import { EducationService } from "@/services/education.service";

const ITEMS_PER_PAGE = 5;

export function useEducation() {
  const [data, setData] = useState<EducationContent[]>([]);
  const [userCondition, setUserCondition] =
    useState<EducationCondition>("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<EducationFilterState>({
    search: "",
    category: "all",
    ageGroup: "all",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [content, condition] = await Promise.all([
          EducationService.getAllContent(),
          EducationService.getUserCondition(),
        ]);
        setData(content);
        setUserCondition(condition);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data edukasi.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Reset ke halaman 1 setiap kali filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchCat =
        filters.category === "all" || item.category === filters.category;
      const matchAge =
        filters.ageGroup === "all" || item.age_group === filters.ageGroup;
      return matchSearch && matchCat && matchAge;
    });
  }, [data, filters]);

  // Hitung total halaman dan potong data untuk pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const recommendedData = useMemo(() => {
    return data.filter((item) => item.condition === userCondition).slice(0, 3);
  }, [data, userCondition]);

  return {
    data: filteredData, // Total data setelah difilter
    paginatedData, // Data yang ditampilkan per halaman (Maks 5)
    recommendedData,
    userCondition,
    isLoading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
