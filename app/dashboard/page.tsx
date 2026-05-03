import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  // Ingat: di Next.js 15+, createClient di server wajib di-await
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch Data Anak & Prediksi Terakhir
  const { data: children, error } = await supabase
    .from("children")
    .select(
      `
      id,
      name,
      birth_date,
      gender,
      predictions ( result, created_at )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const childrenWithLatestPrediction =
    children?.map((child) => {
      const sortedPredictions = child.predictions?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const latestPrediction = sortedPredictions?.[0]?.result || "Belum diuji";
      return { ...child, latestPrediction };
    }) || [];

  return (
    <div className='min-h-screen bg-amber-50 p-4 sm:p-6 lg:p-10 font-sans'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-end border-b-8 border-black pb-6 gap-4'>
          <div>
            <h1 className='text-4xl sm:text-5xl font-black uppercase tracking-tight text-black bg-yellow-400 inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform'>
              Dashboard
            </h1>
            <p className='text-lg sm:text-xl font-bold mt-4 bg-white inline-block px-3 py-1 border-2 border-black'>
              Keluarga Sehat, Masa Depan Kuat.
            </p>
          </div>
          <Link href='/children/new' className='mt-2 md:mt-0'>
            <Button className='w-full md:w-auto h-14 px-8 text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-blue-500 text-white uppercase font-black rounded-none'>
              + Tambah Anak
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {childrenWithLatestPrediction.length === 0 ? (
          <Card className='border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-6 sm:p-10 text-center transform transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'>
            <CardContent className='pt-6'>
              <div className='text-7xl sm:text-8xl mb-6 animate-bounce'>👶</div>
              <h2 className='text-3xl sm:text-4xl font-black mb-3 uppercase'>
                Belum Ada Data
              </h2>
              <p className='mb-8 font-bold text-lg sm:text-xl text-gray-700 max-w-md mx-auto'>
                Langkah pertama mencegah stunting dimulai dari sini. Yuk,
                masukkan data si kecil!
              </p>
              <Link href='/children/new'>
                <Button className='h-16 px-10 text-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:translate-x-2 transition-all bg-green-400 text-black uppercase font-black rounded-none'>
                  Mulai Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Grid Data Anak */
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {childrenWithLatestPrediction.map((child) => (
              <Card
                key={child.id}
                className='border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white hover:-translate-y-2 transition-transform duration-200 rounded-none overflow-hidden'
              >
                <CardHeader className='border-b-4 border-black bg-yellow-400 p-5'>
                  <CardTitle className='text-2xl sm:text-3xl font-black uppercase flex justify-between items-center tracking-tight'>
                    <span className='truncate pr-2'>{child.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5 bg-[url('/bg-pattern.svg')]">
                  {/* Status Label */}
                  <div className='flex justify-between items-center bg-white border-4 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                    <span className='font-black uppercase text-sm'>Status</span>
                    <span
                      className={`text-sm px-3 py-1 border-2 border-black font-black uppercase
                      ${
                        child.latestPrediction === "normal"
                          ? "bg-green-400"
                          : child.latestPrediction === "risk"
                            ? "bg-yellow-400"
                            : child.latestPrediction === "stunted"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200"
                      }`}
                    >
                      {child.latestPrediction}
                    </span>
                  </div>

                  <div className='space-y-2 bg-white p-4 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'>
                    <div className='flex justify-between border-b-2 border-black border-dashed pb-2'>
                      <span>Gender</span>
                      <span className='uppercase'>
                        {child.gender === "L" ? "Laki-laki 👦" : "Perempuan 👧"}
                      </span>
                    </div>
                    <div className='flex justify-between pt-1'>
                      <span>Tgl Lahir</span>
                      <span>
                        {new Date(child.birth_date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <Link href={`/children/${child.id}`} className='block mt-4'>
                    <Button className='w-full h-14 text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-black text-white uppercase font-black rounded-none'>
                      Pantau Anak &rarr;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
    