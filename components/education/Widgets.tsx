import React from "react";
import { Lightbulb, Info } from "lucide-react";

export function QuickTipsSection() {
  return (
    <div className='bg-blue-100 border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0_0_#000]'>
      <div className='flex items-center gap-2 mb-4'>
        <Lightbulb className='w-6 h-6 text-yellow-500' />
        <h3 className='text-lg font-black uppercase'>Tips Hari Ini</h3>
      </div>
      <p className='font-bold text-gray-800 text-sm'>
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
      a: "Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis terutama pada 1.000 Hari Pertama Kehidupan (HPK).",
    },
    {
      q: "Apakah anak pendek pasti stunting?",
      a: "Tidak semua anak pendek itu stunting. Stunting disertai dengan terhambatnya perkembangan kognitif dan rentan penyakit.",
    },
    {
      q: "Kapan harus ke dokter?",
      a: "Jika kurva berat atau tinggi badan anak tidak naik selama 2 bulan berturut-turut pada buku KIA.",
    },
  ];

  return (
    <div className='bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0_0_#000]'>
      <div className='flex items-center gap-2 mb-6'>
        <Info className='w-6 h-6 text-blue-500' />
        <h3 className='text-lg font-black uppercase'>Tanya Jawab</h3>
      </div>
      <div className='space-y-4'>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className='border-2 border-black rounded-xl p-4 bg-gray-50 hover:bg-yellow-50 transition-colors'
          >
            <h4 className='font-black text-sm uppercase mb-1'>{faq.q}</h4>
            <p className='text-xs font-semibold text-gray-600'>{faq.a}</p>
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className='h-64 bg-gray-200 border-4 border-black rounded-2xl shadow-[4px_4px_0_0_#000]'
          ></div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className='bg-red-200 border-4 border-black p-6 font-black uppercase text-red-900 text-center shadow-[4px_4px_0_0_#000]'>
        ⚠️ Error: {error}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className='bg-white border-4 border-black border-dashed p-12 text-center rounded-2xl shadow-[4px_4px_0_0_#000]'>
        <span className='text-5xl mb-4 block'>🔍</span>
        <h3 className='text-2xl font-black uppercase'>Tidak Ditemukan</h3>
        <p className='font-bold text-gray-500'>
          Coba ubah kata kunci atau filter pencarian Anda.
        </p>
      </div>
    );
  }
  return null;
}
