import React from "react";
import { Lightbulb, Info } from "lucide-react";

// Style constants
const neoPanel =
  "border-[3px] border-black bg-[#f8f5ef] shadow-[8px_8px_0_0_#000]";
const neoWhite = "border-[3px] border-black bg-white shadow-[6px_6px_0_0_#000]";
const neoBlue =
  "border-[3px] border-black bg-[#8ec5ff] shadow-[6px_6px_0_0_#000]";
const neoRed =
  "border-[3px] border-black bg-[#ff5a66] shadow-[6px_6px_0_0_#000]";

export function QuickTipsSection() {
  return (
    <div className={`p-6 ${neoBlue}`}>
      <div className='flex items-center gap-2 mb-4'>
        <Lightbulb className='w-6 h-6' />
        <h3 className='text-lg font-black uppercase'>Tips Hari Ini</h3>
      </div>
      <p className='font-bold text-black text-sm'>
        "Pastikan anak mendapatkan sumber protein hewani (seperti telur, ikan,
        atau daging ayam) setiap hari untuk mendukung pertumbuhan tinggi
        badannya."
      </p>
    </div>
  );
}

export function FAQSection() {
  const faqs = [
    {
      q: "Apa itu Stunting?",
      a: "Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis.",
    },
    {
      q: "Apakah anak pendek pasti stunting?",
      a: "Tidak selalu. Stunting disertai dengan terhambatnya perkembangan kognitif.",
    },
    {
      q: "Kapan harus ke dokter?",
      a: "Jika kurva berat atau tinggi badan tidak naik selama 2 bulan berturut-turut.",
    },
  ];

  return (
    <div className={`p-6 ${neoWhite}`}>
      <div className='flex items-center gap-2 mb-6'>
        <Info className='w-6 h-6' />
        <h3 className='text-lg font-black uppercase'>Tanya Jawab</h3>
      </div>
      <div className='space-y-4'>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className='border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_0_#000]'
          >
            <h4 className='font-black text-sm uppercase mb-1'>{faq.q}</h4>
            <p className='text-xs font-bold text-gray-700'>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationStates({
  isLoading,
  error,
  isEmpty,
}: {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
}) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse'>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-64 ${neoWhite}`}></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 font-black uppercase text-center ${neoRed}`}>
        ⚠️ Error: {error}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`p-12 text-center ${neoWhite}`}>
        <span className='text-5xl mb-4 block'>🔍</span>
        <h3 className='text-2xl font-black uppercase'>Tidak Ditemukan</h3>
        <p className='font-bold text-gray-700'>
          Coba ubah kata kunci atau filter pencarian Anda.
        </p>
      </div>
    );
  }

  return null;
}
