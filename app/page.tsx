import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen bg-[#FEF08A] flex flex-col items-center justify-center p-6 font-sans'>
      <main className='flex w-full max-w-4xl flex-col items-center text-center bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-10 sm:p-16'>
        {/* Badge */}
        <div className='mb-8'>
          <span className='bg-[#A7F3D0] text-black font-black uppercase tracking-widest text-sm px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] inline-block'>
            Machine Learning Powered
          </span>
        </div>

        {/* Main Title */}
        <h1 className='text-5xl sm:text-7xl font-black leading-none tracking-tighter text-black uppercase mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]'>
          Stunting <br className='sm:hidden' /> Predict
        </h1>

        {/* Subtitle / Description */}
        <p className='max-w-2xl text-lg sm:text-xl font-bold leading-relaxed text-black bg-[#93C5FD] p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10'>
          Deteksi dini risiko stunting pada anak Anda menggunakan model AI yang
          dilatih dengan belasan ribu data antropometri. Cepat, tepat, dan mudah
          digunakan!
        </p>

        {/* Call to Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4'>
          <Link
            href='/predict'
            className='flex h-16 w-full sm:w-[240px] items-center justify-center bg-[#C084FC] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
            text-black font-black text-xl uppercase tracking-widest transition-all 
            hover:bg-[#A855F7] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[8px] active:translate-y-[8px] active:shadow-none'
          >
            Mulai Prediksi
          </Link>

          <a
            href='https://github.com' // Bisa kamu ganti dengan link repo GitHub kamu nanti
            target='_blank'
            rel='noopener noreferrer'
            className='flex h-16 w-full sm:w-[240px] items-center justify-center bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
            text-black font-black text-xl uppercase tracking-widest transition-all 
            hover:bg-slate-100 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[8px] active:translate-y-[8px] active:shadow-none'
          >
            Lihat Source
          </a>
        </div>

        {/* Extra Info */}
        <div className='mt-16 pt-8 border-t-4 border-black border-dashed w-full flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm font-bold text-black uppercase tracking-wider'>
            Dibuat untuk mendeteksi{" "}
            <span className='bg-[#FCA5A5] px-1 border-2 border-black'>
              risiko awal
            </span>
          </p>
          <div className='flex gap-2'>
            <div className='w-4 h-4 bg-[#86EFAC] border-2 border-black'></div>
            <div className='w-4 h-4 bg-[#FDE047] border-2 border-black'></div>
            <div className='w-4 h-4 bg-[#FCA5A5] border-2 border-black'></div>
          </div>
        </div>
      </main>
    </div>
  );
}
