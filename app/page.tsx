import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#FDFBF7] font-sans text-black selection:bg-yellow-300 selection:text-black'>
      {/* Navbar Khusus Landing Page */}
      <nav className='border-b-4 border-black bg-white py-4 px-6 sticky top-0 z-50 flex justify-between items-center shadow-sm'>
        <div className='text-2xl font-black uppercase tracking-widest bg-yellow-300 px-2 border-2 border-black shadow-[2px_2px_0_0_#000] rotate-1 hover:rotate-0 transition-transform'>
          Stunt<span className='text-blue-600'>Check</span>
        </div>
        <div className='flex items-center gap-4'>
          <Link
            href='/auth/login'
            className='hidden sm:block font-bold uppercase hover:underline decoration-4 underline-offset-4'
          >
            Masuk
          </Link>
          <Button asChild variant='primary'>
            <Link href='/auth/register'>Mulai Sekarang</Link>
          </Button>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-32'>
        {/* =========================================
            HERO SECTION
            ========================================= */}
        <section className='flex flex-col lg:flex-row items-center gap-16'>
          <div className='flex-1 space-y-8'>
            <h1 className='text-5xl md:text-7xl font-black uppercase leading-[1.1]'>
              Pantau Gizi Anak, <br />
              <span className='bg-green-400 px-3 border-4 border-black shadow-[6px_6px_0_0_#000] inline-block mt-3 -rotate-1'>
                Cegah Stunting
              </span>
            </h1>
            <p className='text-xl font-bold text-gray-700 border-l-4 border-black pl-4 max-w-xl'>
              Gunakan kecerdasan buatan (AI) dan standar pengukuran WHO untuk
              menganalisis risiko stunting pada anak secara cepat, akurat, dan
              terpercaya.
            </p>
            <div className='flex flex-wrap gap-4 pt-4'>
              <Button
                asChild
                variant='primary'
                className='text-lg h-16 px-8 text-xl'
              >
                <Link href='/dashboard'>Cek Kondisi Anak</Link>
              </Button>
              <Button
                asChild
                variant='secondary'
                className='text-lg h-16 px-8 bg-white text-black hover:bg-gray-100'
              >
                <Link href='#fitur'>Pelajari Fitur</Link>
              </Button>
            </div>
          </div>

          <div className='flex-1 flex justify-center w-full'>
            {/* Dekorasi Visual Neobrutalism (Pengganti Gambar) */}
            <div className='relative w-full max-w-[350px] aspect-square bg-yellow-300 border-4 border-black shadow-[16px_16px_0_0_#000] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300'>
              <div className='text-[120px] drop-shadow-md'>👶</div>

              {/* Badge Mengambang */}
              <div className='absolute -top-6 -left-6 bg-white border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0_0_#000] -rotate-6 text-sm'>
                Akurasi Tinggi 🎯
              </div>
              <div className='absolute -bottom-6 -right-6 bg-blue-400 text-white border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0_0_#000] rotate-6 text-xl'>
                Powered by AI 🤖
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            FITUR SECTION
            ========================================= */}
        <section id='fitur' className='space-y-12 scroll-mt-24'>
          <div className='text-center space-y-4'>
            <h2 className='text-4xl md:text-5xl font-black uppercase inline-block bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#000]'>
              Kenapa Memilih Kami?
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Card Fitur 1 */}
            <div className='bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 transition-transform'>
              <div className='w-16 h-16 bg-blue-300 border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#000] mb-6 -rotate-3'>
                🧠
              </div>
              <h3 className='text-2xl font-black uppercase mb-3'>
                Analisis AI
              </h3>
              <p className='font-bold text-gray-600'>
                Model Machine Learning kami dilatih untuk mendeteksi pola
                pertumbuhan dan memberikan prediksi tingkat risiko secara
                instan.
              </p>
            </div>

            {/* Card Fitur 2 */}
            <div className='bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 transition-transform'>
              <div className='w-16 h-16 bg-yellow-300 border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#000] mb-6 rotate-3'>
                📊
              </div>
              <h3 className='text-2xl font-black uppercase mb-3'>
                Standar WHO
              </h3>
              <p className='font-bold text-gray-600'>
                Hasil prediksi dilengkapi dengan kalkulasi Z-Score (TB/U dan
                BB/U) yang mengacu pada standar resmi organisasi kesehatan
                dunia.
              </p>
            </div>

            {/* Card Fitur 3 */}
            <div className='bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 transition-transform'>
              <div className='w-16 h-16 bg-red-400 border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#000] mb-6 -rotate-6'>
                📈
              </div>
              <h3 className='text-2xl font-black uppercase mb-3'>
                Rekam Jejak
              </h3>
              <p className='font-bold text-gray-600'>
                Pantau riwayat pertumbuhan anak dari waktu ke waktu. Semua data
                tersimpan aman dan mudah diakses kapan saja.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA BANNER
            ========================================= */}
        <section className='bg-blue-600 border-4 border-black p-10 md:p-16 text-center shadow-[12px_12px_0_0_#000] relative overflow-hidden'>
          <h2 className='text-4xl md:text-5xl font-black uppercase text-white mb-6 relative z-10'>
            Jangan Tunggu Sampai Terlambat
          </h2>
          <p className='text-xl font-bold text-blue-100 max-w-2xl mx-auto mb-8 relative z-10'>
            Deteksi dini adalah kunci. Daftarkan anak Anda sekarang dan mulai
            pantau perkembangannya hari ini.
          </p>
          <Button
            asChild
            variant='secondary'
            className='text-xl h-16 px-10 relative z-10 border-black text-black'
          >
            <Link href='/auth/register'>Buat Akun Gratis</Link>
          </Button>

          {/* Background Decoration */}
          <div className='absolute top-0 right-0 text-[200px] opacity-10 rotate-12 translate-x-1/4 -translate-y-1/4'>
            ⚡
          </div>
        </section>
      </main>

      {/* Footer Minimalis */}
      <footer className='border-t-4 border-black bg-white py-8 text-center mt-24'>
        <p className='font-black uppercase text-gray-800'>
          © {new Date().getFullYear()} StuntCheck. Dibuat untuk Generasi yang
          Lebih Sehat.
        </p>
      </footer>
    </div>
  );
}
