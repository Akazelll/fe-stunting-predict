// // app/predict/page.tsx
// "use client";
// import { usePredict } from "@/hooks/usePredict";
// import { InputField, SelectField } from "@/components/BrutalInputs";
// import {
//   ProbabilityBar,
//   WhoFlagBadge,
//   ZScoreBadge,
// } from "@/components/BrutalDisplay";

// const riskConfig = {
//   LOW: {
//     label: "RISIKO RENDAH",
//     bg: "bg-[#86EFAC]",
//     border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
//     badge: "bg-white border-4 border-black",
//     icon: "OK",
//     desc: "Pertumbuhan anak tergolong normal. Tetap pantau tumbuh kembang secara rutin.",
//   },
//   MEDIUM: {
//     label: "RISIKO SEDANG",
//     bg: "bg-[#FDE047]",
//     border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
//     badge: "bg-white border-4 border-black",
//     icon: "AWAS",
//     desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
//   },
//   HIGH: {
//     label: "RISIKO TINGGI",
//     bg: "bg-[#FCA5A5]",
//     border: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
//     badge: "bg-white border-4 border-black",
//     icon: "BAHAYA",
//     desc: "Anak terindikasi stunting. Segera konsultasikan dengan dokter atau ahli gizi.",
//   },
// };

// export default function PredictPage() {
//   const {
//     form,
//     result,
//     loading,
//     error,
//     handleChange,
//     handleSubmit,
//     handleReset,
//   } = usePredict();

//   return (
//     <div className='min-h-screen bg-[#6EE7B7] pb-16 font-sans text-black'>
//       <header className='sticky top-0 z-10 bg-white border-b-4 border-black'>
//         <div className='max-w-6xl mx-auto px-4 py-4 flex items-center gap-4'>
//           <div className='w-12 h-12 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl'>
//             SP
//           </div>
//           <div>
//             <h1 className='text-xl font-black uppercase tracking-tight'>
//               Stunting Predict
//             </h1>
//             <p className='text-sm font-bold mt-0.5 bg-[#A7F3D0] inline-block px-2 border-2 border-black'>
//               Deteksi dini risiko stunting anak
//             </p>
//           </div>
//         </div>
//       </header>

//       <main className='max-w-6xl mx-auto px-4 py-10 space-y-10'>
//         <div className='text-center space-y-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8'>
//           <h2 className='text-3xl sm:text-4xl font-black uppercase tracking-tight'>
//             Prediksi Status Stunting
//           </h2>
//           <p className='font-bold text-base max-w-2xl mx-auto bg-[#FEF08A] p-2 border-2 border-black'>
//             Masukkan data antropometri anak untuk mendapatkan prediksi risiko
//             stunting menggunakan model Machine Learning berbasis data 13.814
//             anak.
//           </p>
//         </div>

//         <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
//           <div className='lg:col-span-3'>
//             <form
//               onSubmit={handleSubmit}
//               className='bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col'
//             >
//               <div className='px-6 py-5 border-b-4 border-black bg-[#93C5FD]'>
//                 <h3 className='font-black text-xl uppercase tracking-widest'>
//                   Data Anak
//                 </h3>
//               </div>
//               <div className='p-6 md:p-8 space-y-8 flex-1'>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
//                   <SelectField
//                     label='Jenis Kelamin'
//                     name='Sex'
//                     value={form.Sex}
//                     options={[
//                       { label: "Laki-laki", value: "Male" },
//                       { label: "Perempuan", value: "Female" },
//                     ]}
//                     onChange={handleChange}
//                   />
//                   <InputField
//                     label='Umur'
//                     name='Age'
//                     value={form.Age}
//                     onChange={handleChange}
//                     unit='bulan'
//                     min={1}
//                     max={60}
//                     step={1}
//                     hint='Rentang 1–60 bulan'
//                   />
//                 </div>
//                 <div className='flex items-center gap-4 py-2'>
//                   <div className='flex-1 border-b-4 border-black border-dashed' />
//                   <span className='text-sm font-black bg-[#FCA5A5] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
//                     DATA LAHIR
//                   </span>
//                   <div className='flex-1 border-b-4 border-black border-dashed' />
//                 </div>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
//                   <InputField
//                     label='Berat Lahir'
//                     name='Birth_Weight'
//                     value={form.Birth_Weight}
//                     onChange={handleChange}
//                     unit='kg'
//                     min={0}
//                     max={10}
//                     step={0.1}
//                     hint='Contoh: 3.2'
//                   />
//                   <InputField
//                     label='Panjang Lahir'
//                     name='Birth_Length'
//                     value={form.Birth_Length}
//                     onChange={handleChange}
//                     unit='cm'
//                     min={30}
//                     max={70}
//                     step={0.1}
//                     hint='Contoh: 50'
//                   />
//                 </div>
//                 <div className='flex items-center gap-4 py-2'>
//                   <div className='flex-1 border-b-4 border-black border-dashed' />
//                   <span className='text-sm font-black bg-[#86EFAC] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
//                     DATA SAAT INI
//                   </span>
//                   <div className='flex-1 border-b-4 border-black border-dashed' />
//                 </div>
//                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
//                   <InputField
//                     label='Berat Badan'
//                     name='Body_Weight'
//                     value={form.Body_Weight}
//                     onChange={handleChange}
//                     unit='kg'
//                     min={0}
//                     max={30}
//                     step={0.1}
//                     hint='Berat saat ini'
//                   />
//                   <InputField
//                     label='Tinggi Badan'
//                     name='Body_Length'
//                     value={form.Body_Length}
//                     onChange={handleChange}
//                     unit='cm'
//                     min={30}
//                     max={130}
//                     step={0.1}
//                     hint='Panjang/tinggi saat ini'
//                   />
//                 </div>
//                 <SelectField
//                   label='ASI Eksklusif'
//                   name='ASI_Eksklusif'
//                   value={form.ASI_Eksklusif}
//                   options={[
//                     { label: "Ya — mendapat ASI eksklusif", value: "Yes" },
//                     { label: "Tidak — tidak mendapat ASI", value: "No" },
//                   ]}
//                   onChange={handleChange}
//                   hint='Pemberian ASI eksklusif selama 6 bulan pertama'
//                 />
//               </div>
//               <div className='p-6 border-t-4 border-black bg-white flex flex-col sm:flex-row gap-4'>
//                 <button
//                   type='submit'
//                   disabled={loading}
//                   className='flex-1 py-4 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FACC15] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-black font-black text-base uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3'
//                 >
//                   {loading ? "ANALISIS..." : "PREDIKSI SEKARANG"}
//                 </button>
//                 <button
//                   type='button'
//                   onClick={handleReset}
//                   className='px-6 py-4 bg-white border-4 border-black font-black text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all'
//                 >
//                   RESET
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className='lg:col-span-2 space-y-6'>
//             {error && (
//               <div className='bg-[#FCA5A5] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5'>
//                 <div className='flex items-start gap-4'>
//                   <span className='bg-white px-3 py-1 border-4 border-black font-black text-xl'>
//                     !
//                   </span>
//                   <div>
//                     <p className='font-black text-lg uppercase'>
//                       Gagal Memproses
//                     </p>
//                     <p className='font-bold text-sm mt-1 bg-white p-2 border-2 border-black'>
//                       {error}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!result && !loading && !error && (
//               <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center h-full flex flex-col justify-center min-h-[300px]'>
//                 <div className='w-20 h-20 bg-[#93C5FD] border-4 border-black flex items-center justify-center mx-auto text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4'>
//                   🧒
//                 </div>
//                 <p className='text-base font-bold border-2 border-black p-3 bg-[#FEF08A]'>
//                   Isi form di sebelah kiri dan klik <br />
//                   <span className='font-black uppercase'>
//                     Prediksi Sekarang
//                   </span>
//                   <br />
//                   untuk melihat hasil analisis.
//                 </p>
//               </div>
//             )}

//             {loading && (
//               <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6 animate-pulse min-h-[300px]'>
//                 <div className='h-8 bg-slate-300 border-2 border-black w-3/4' />
//                 <div className='h-20 bg-slate-200 border-4 border-black' />
//                 <div className='space-y-3'>
//                   <div className='h-4 bg-slate-300 border-2 border-black w-full' />
//                   <div className='h-4 bg-slate-300 border-2 border-black w-5/6' />
//                 </div>
//                 <div className='grid grid-cols-1 gap-4'>
//                   {[0, 1, 2].map((i) => (
//                     <div
//                       key={i}
//                       className='h-12 bg-slate-200 border-4 border-black'
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {result && !loading && (
//               <div className='space-y-6'>
//                 {(() => {
//                   const cfg = riskConfig[result.risk_level];
//                   return (
//                     <div className={`p-6 ${cfg.bg} ${cfg.border}`}>
//                       <div className='flex items-center gap-4 mb-4'>
//                         <div
//                           className={`w-14 h-14 ${cfg.badge} flex items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
//                         >
//                           {cfg.icon}
//                         </div>
//                         <div>
//                           <p className='text-sm font-black uppercase bg-white px-2 py-0.5 border-2 border-black inline-block mb-1'>
//                             Hasil Prediksi
//                           </p>
//                           <p className='font-black text-2xl uppercase'>
//                             {result.label}
//                           </p>
//                         </div>
//                       </div>
//                       <div className='mt-6'>
//                         <span
//                           className={`text-sm font-black px-4 py-2 ${cfg.badge} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
//                         >
//                           {cfg.label}
//                         </span>
//                       </div>
//                       <p className='text-sm font-bold mt-4 p-3 bg-white border-4 border-black'>
//                         {cfg.desc}
//                       </p>
//                     </div>
//                   );
//                 })()}

//                 <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
//                   <h4 className='text-sm font-black uppercase tracking-widest mb-6 border-b-4 border-black pb-2'>
//                     Distribusi Probabilitas
//                   </h4>
//                   <ProbabilityBar
//                     label='Stunting'
//                     value={result.probability?.stunting ?? 0}
//                     color='#FCA5A5'
//                   />
//                   <div className='mt-6'>
//                     <ProbabilityBar
//                       label='Tidak Stunting'
//                       value={result.probability?.tidak_stunting ?? 0}
//                       color='#86EFAC'
//                     />
//                   </div>
//                 </div>

//                 <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
//                   <h4 className='text-sm font-black uppercase tracking-widest mb-5 border-b-4 border-black pb-2'>
//                     Z-Score WHO
//                   </h4>
//                   <div className='space-y-4'>
//                     <ZScoreBadge
//                       label='Panjang / Umur (LAZ)'
//                       value={result.who_flags.length_for_age_z}
//                     />
//                     <ZScoreBadge
//                       label='Berat / Umur (WAZ)'
//                       value={result.who_flags.weight_for_age_z}
//                     />
//                   </div>
//                   <p className='text-xs font-bold mt-4 bg-[#FEF08A] p-2 border-2 border-black text-center'>
//                     Z-Score &lt; −2 = berisiko <br /> Z-Score &lt; −3 = sangat
//                     berisiko
//                   </p>
//                 </div>

//                 <div className='bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6'>
//                   <h4 className='text-sm font-black uppercase tracking-widest mb-5 border-b-4 border-black pb-2'>
//                     Indikator WHO
//                   </h4>
//                   <div className='grid grid-cols-1 gap-3'>
//                     <WhoFlagBadge
//                       label='Indikator Stunting WHO'
//                       value={result.who_flags.stunting_who_indicator}
//                       isRisk
//                     />
//                     <WhoFlagBadge
//                       label='Stunting Berat'
//                       value={result.who_flags.severe_stunting}
//                       isRisk
//                     />
//                     <WhoFlagBadge
//                       label='Berat Badan Kurang'
//                       value={result.who_flags.underweight}
//                       isRisk
//                     />
//                     <WhoFlagBadge
//                       label='Berat Lahir Rendah'
//                       value={result.who_flags.low_birth_weight}
//                       isRisk={false}
//                     />
//                   </div>
//                 </div>

//                 <div className='text-center p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
//                   <p className='text-xs font-bold'>
//                     Model:{" "}
//                     <code className='bg-[#93C5FD] px-2 py-1 border-2 border-black font-black'>
//                       {result.model_used}
//                     </code>
//                   </p>
//                   <p className='text-xs font-bold mt-2 uppercase'>
//                     * Hasil bukan pengganti diagnosis medis *
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className='bg-[#C084FC] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center'>
//           <div className='w-14 h-14 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0 text-2xl font-black'>
//             ℹ
//           </div>
//           <div className='flex-1'>
//             <p className='font-black text-lg uppercase tracking-wide'>
//               Tentang Prediksi Ini
//             </p>
//             <p className='font-bold text-sm mt-2 leading-relaxed bg-white p-3 border-2 border-black'>
//               Sistem ini menggunakan model Machine Learning yang dilatih dengan
//               13.814 data anak. Prediksi bersifat indikatif dan tidak
//               menggantikan pemeriksaan medis oleh tenaga kesehatan profesional.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
