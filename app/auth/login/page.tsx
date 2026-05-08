"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-amber-50 selection:bg-yellow-400 selection:text-black'>
      {/* KIRI/ATAS: Hero Section */}
      <div className='w-full lg:w-1/2 bg-blue-500 border-b-4 lg:border-b-0 lg:border-r-8 border-black p-6 py-10 lg:p-20 flex flex-col justify-center relative overflow-hidden'>
        {/* Elemen Dekoratif (Sembunyi di mobile agar tidak sumpek) */}
        <div className='absolute top-12 right-12 w-24 h-24 bg-yellow-400 rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce hidden lg:block'></div>
        <div className='absolute bottom-20 left-10 w-32 h-32 bg-red-500 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-12 hidden lg:block'></div>

        {/* Tipografi Utama disesuaikan ukurannya */}
        <div className='relative z-10 bg-white border-4 border-black p-3 lg:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-max mb-4 lg:mb-8 transform -rotate-2 hover:rotate-0 transition-transform'>
          <h1 className='text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-black'>
            Pantau.
            <br />
            Cegah.
            <br />
            Tumbuh.
          </h1>
        </div>

        <p className='relative z-10 text-lg lg:text-2xl font-bold text-white max-w-md leading-relaxed bg-black p-3 lg:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
          Pastikan masa depan si kecil dengan AI.
        </p>
      </div>

      {/* KANAN/BAWAH: Form Section */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative flex-1'>
        <Card className='w-full max-w-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white transform transition-all'>
          <CardHeader className='border-b-4 border-black bg-yellow-400 p-5 lg:p-8'>
            <CardTitle className='text-3xl lg:text-4xl font-black uppercase tracking-tight'>
              Masuk
            </CardTitle>
            <p className='font-bold text-base lg:text-lg mt-1 border-2 border-black inline-block px-2 bg-white w-max'>
              Akses Dashboard
            </p>
          </CardHeader>
          <CardContent className='p-5 lg:p-8 space-y-5 lg:space-y-6'>
            {errorMsg && (
              <div className='bg-red-500 text-white border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 text-xs lg:text-sm'>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className='space-y-5'>
              <div className='space-y-1 lg:space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-lg lg:text-xl font-black uppercase'
                >
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border-4 border-black text-lg lg:text-xl font-bold p-5 lg:p-6 focus-visible:ring-0 focus-visible:bg-yellow-100 focus-visible:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none transition-colors h-14 lg:h-16'
                  placeholder='budi@email.com'
                />
              </div>

              <div className='space-y-1 lg:space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-lg lg:text-xl font-black uppercase'
                >
                  Password
                </Label>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border-4 border-black text-lg lg:text-xl font-bold p-5 lg:p-6 focus-visible:ring-0 focus-visible:bg-yellow-100 focus-visible:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none transition-colors h-14 lg:h-16'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-14 lg:h-16 text-xl lg:text-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:translate-x-2 transition-all bg-blue-600 text-white hover:bg-blue-700 uppercase font-black rounded-none mt-2'
              >
                {isLoading ? "Memproses..." : "Login Sekarang"}
              </Button>
            </form>

            <div className='text-center pt-5 mt-5 relative'>
              <div className='absolute left-0 top-0 w-full h-[4px] bg-black'></div>
              <p className='font-black text-base lg:text-lg mb-3 lg:mb-4 bg-white inline-block px-3 lg:px-4 relative -top-4 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                Orang Tua Baru?
              </p>
              <Link href='/auth/register' className='block'>
                <Button
                  variant='secondary' // ✅ GANTI MENJADI SECONDARY
                  className='w-full h-12 lg:h-14 text-lg lg:text-xl border-4 border-black...'
                >
                  Buat Akun Gratis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
