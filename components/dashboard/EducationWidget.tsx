import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function EducationWidget() {
  return (
    <div className='bg-pink-300 border-4 border-black shadow-[8px_8px_0_0_#000] p-6 relative overflow-hidden group'>
      <div className='relative z-10'>
        <h2 className='text-2xl font-black uppercase leading-tight mb-2'>
          Pusat
          <br />
          Edukasi Gizi
        </h2>
        <p className='font-bold text-black mb-6'>
          Baca referensi dan panduan pemenuhan gizi untuk mencegah risiko
          stunting.
        </p>
        <Button
          asChild
          className='border-4 border-black bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0_0_#000] rounded-none font-black uppercase transition-all'
        >
          <Link href='/education'>Mulai Membaca</Link>
        </Button>
      </div>
      <BookOpen className='w-32 h-32 text-pink-400 absolute -right-6 -bottom-6 opacity-50 transform group-hover:scale-110 transition-transform' />
    </div>
  );
}
