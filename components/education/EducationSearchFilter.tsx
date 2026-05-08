import React from "react";
import { Search, Filter } from "lucide-react";
import { EducationFilterState } from "@/types/education";
import { Input } from "@/components/ui/input";

interface Props {
  filters: EducationFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EducationFilterState>>;
}

export function EducationSearchFilter({ filters, setFilters }: Props) {
  return (
    <div className='bg-white p-5 border-4 border-black rounded-2xl shadow-[4px_4px_0_0_#000] flex flex-col md:flex-row gap-4'>
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
        <Input
          placeholder='Cari artikel edukasi...'
          className='pl-10 h-12 border-2 border-black rounded-xl font-bold focus-visible:ring-0 focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:shadow-none shadow-[2px_2px_0_0_#000] transition-all'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>

      <div className='flex gap-4'>
        <select
          className='h-12 px-4 border-2 border-black rounded-xl bg-yellow-100 font-bold uppercase text-sm shadow-[2px_2px_0_0_#000] cursor-pointer outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all'
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value as any }))
          }
        >
          <option value='all'>Semua Kategori</option>
          <option value='nutrition'>Nutrisi</option>
          <option value='parenting'>Parenting</option>
          <option value='health'>Kesehatan</option>
        </select>

        <select
          className='h-12 px-4 border-2 border-black rounded-xl bg-blue-100 font-bold uppercase text-sm shadow-[2px_2px_0_0_#000] cursor-pointer outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all'
          value={filters.ageGroup}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, ageGroup: e.target.value as any }))
          }
        >
          <option value='all'>Semua Usia</option>
          <option value='0-2'>Usia 0-2 Tahun</option>
          <option value='2-5'>Usia 2-5 Tahun</option>
        </select>
      </div>
    </div>
  );
}
