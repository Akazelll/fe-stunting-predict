import React from "react";
import { Search } from "lucide-react";
import { EducationFilterState } from "@/types/education";
import { Input } from "@/components/ui/input";

interface Props {
  filters: EducationFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EducationFilterState>>;
}

export function EducationSearchFilter({ filters, setFilters }: Props) {
  const selectStyle =
    "h-12 px-4 border-[3px] border-black bg-white font-black uppercase text-sm shadow-[4px_4px_0_0_#000] cursor-pointer focus:outline-none";

  return (
    <div className='border-[3px] border-black bg-[#f8f5ef] shadow-[8px_8px_0_0_#000] p-5 flex flex-col md:flex-row gap-4'>
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black' />
        <Input
          placeholder='Cari artikel...'
          className='pl-10 h-12 border-[3px] border-black bg-white text-black font-bold shadow-[4px_4px_0_0_#000] focus-visible:ring-0'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>

      <div className='flex gap-4'>
        <select
          className={selectStyle}
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value as any }))
          }
        >
          <option value='all'>Kategori</option>
          <option value='nutrition'>Nutrisi</option>
          <option value='parenting'>Parenting</option>
          <option value='health'>Kesehatan</option>
        </select>
        <select
          className={selectStyle}
          value={filters.ageGroup}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, ageGroup: e.target.value as any }))
          }
        >
          <option value='all'>Usia</option>
          <option value='0-2'>0-2 Tahun</option>
          <option value='2-5'>2-5 Tahun</option>
        </select>
      </div>
    </div>
  );
}
