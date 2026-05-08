"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      setSuccessMsg(
        "Sip! Registrasi berhasil. Mengalihkan ke halaman Login...",
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row-reverse bg-amber-50 selection:bg-blue-500 selection:text-white'>
      {/* ATAS/KANAN: Hero Section */}
      <div className='w-full lg:w-1/2 bg-yellow-400 border-b-4 lg:border-b-0 lg:border-l-8 border-black p-6 py-10 lg:p-20 flex flex-col justify-center relative overflow-hidden'>
        {/* Elemen Dekoratif */}
        <div className='absolute top-20 right-20 w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-45 hidden lg:block hover:rotate-90 transition-transform duration-500'></div>
        <div className='absolute bottom-12 left-12 w-40 h-10 bg-blue-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden lg:block'></div>

        <div className='relative z-10 bg-red-500 border-4 border-black p-3 lg:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-max mb-4 lg:mb-8 transform rotate-2 hover:rotate-0 transition-transform text-white'>
          <h1 className='text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none'>
            Satu
            <br />
            Langkah
            <br />
            Awal.
          </h1>
        </div>

        <p className='relative z-10 text-lg lg:text-2xl font-bold text-black max-w-md leading-relaxed bg-white border-4 border-black p-3 lg:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
          Daftarkan diri Anda sebagai pahlawan pertumbuhan anak.
        </p>
      </div>

      {/* BAWAH/KIRI: Form Section */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative flex-1'>
        <Card className='w-full max-w-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white transform transition-all'>
          <CardHeader className='border-b-4 border-black bg-green-400 p-5 lg:p-8'>
            <CardTitle className='text-3xl lg:text-4xl font-black uppercase tracking-tight text-black'>
              Daftar
            </CardTitle>
            <p className='font-bold text-base lg:text-lg mt-1 text-black bg-white inline-block px-2 border-2 border-black w-max'>
              Platform Child Growth
            </p>
          </CardHeader>
          <CardContent className='p-5 lg:p-8 space-y-5 lg:space-y-6'>
            {errorMsg && (
              <div className='bg-red-500 text-white border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 text-xs lg:text-sm'>
                ⚠️ {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className='bg-yellow-400 text-black border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 text-xs lg:text-sm'>
                🎉 {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className='space-y-5'>
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
                  className='border-4 border-black text-lg lg:text-xl font-bold p-5 lg:p-6 focus-visible:ring-0 focus-visible:bg-green-100 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none transition-colors h-14 lg:h-16'
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border-4 border-black text-lg lg:text-xl font-bold p-5 lg:p-6 focus-visible:ring-0 focus-visible:bg-green-100 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none transition-colors h-14 lg:h-16'
                  placeholder='Minimal 6 karakter'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-14 lg:h-16 text-xl lg:text-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none active:translate-y-2 active:translate-x-2 transition-all bg-black text-white hover:bg-gray-800 uppercase font-black rounded-none mt-2'
              >
                {isLoading ? "Memproses..." : "Buat Akun"}
              </Button>
            </form>

            <div className='text-center pt-5 mt-5 relative border-t-4 border-black border-dashed'>
              <p className='font-black text-base lg:text-lg mb-3 lg:mb-4 mt-3 lg:mt-4'>
                Sudah jadi member?
              </p>
              <Link href='/auth/login' className='block'>
                <Button
                  variant='secondary' 
                  className='w-full h-12 lg:h-14 text-lg lg:text-xl border-4 border-black...'
                >
                  Login Sekarang
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    