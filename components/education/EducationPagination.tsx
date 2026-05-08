import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EducationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center gap-4 mt-10 pt-6 border-t-4 border-black border-dashed'>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='bg-white text-black border-2 border-black hover:bg-yellow-300 shadow-[2px_2px_0_0_#000] disabled:opacity-50 disabled:shadow-none'
      >
        <ChevronLeft className='w-5 h-5 mr-1' />
        <span className='font-black uppercase text-sm'>Prev</span>
      </Button>

      <div className='px-4 py-2 bg-white border-2 border-black font-black text-sm uppercase shadow-[2px_2px_0_0_#000]'>
        Halaman {currentPage} / {totalPages}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='bg-white text-black border-2 border-black hover:bg-yellow-300 shadow-[2px_2px_0_0_#000] disabled:opacity-50 disabled:shadow-none'
      >
        <span className='font-black uppercase text-sm'>Next</span>
        <ChevronRight className='w-5 h-5 ml-1' />
      </Button>
    </div>
  );
}
