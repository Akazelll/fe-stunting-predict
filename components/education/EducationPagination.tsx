import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function EducationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: any) {
  if (totalPages <= 1) return null;

  const btn =
    "border-[3px] border-black bg-white text-black font-black uppercase px-4 py-2 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] disabled:opacity-50 disabled:shadow-none flex items-center gap-1";

  return (
    <div className='flex items-center justify-center gap-4 mt-10 pt-6 border-t-[3px] border-black'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={btn}
      >
        <ChevronLeft className='w-4 h-4' /> Prev
      </button>
      <div className='px-4 py-2 border-[3px] border-black bg-[#ffe01b] font-black uppercase text-sm shadow-[4px_4px_0_0_#000]'>
        {currentPage} / {totalPages}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={btn}
      >
        Next <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
}
