"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewChildPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const birthDate = formData.get("birth_date") as string;
    const gender = formData.get("gender") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMsg("Sesi habis, silakan login kembali.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("children")
      .insert([{ user_id: user.id, name, birth_date: birthDate, gender }])
      .select()
      .single();

    if (error) {
      console.error(error);
      setErrorMsg("Gagal menyimpan data anak. Pastikan isian benar.");
      setIsLoading(false);
    } else {
      router.push(`/children/${data.id}`);
      router.refresh();
    }
  }

  return (
    <div className='min-h-screen bg-amber-50 p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center font-sans'>
      <div className='w-full max-w-2xl mb-6'>
        <Link href='/dashboard'>
          <Button
            variant='outline'
            className='border-4 border-black bg-white hover:bg-gray-100 font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all'
          >
            &larr; Kembali
          </Button>
        </Link>
      </div>

      <Card className='w-full max-w-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rounded-none'>
        <CardHeader className='border-b-4 border-black bg-green-400 p-6 sm:p-8'>
          <CardTitle className='text-3xl sm:text-4xl font-black uppercase tracking-tight transform -rotate-1 bg-white inline-block w-max px-2 border-2 border-black'>
            Registrasi Anak
          </CardTitle>
          <p className='font-bold text-lg sm:text-xl mt-3 text-black'>
            Lengkapi data profil si kecil untuk analisis AI.
          </p>
        </CardHeader>
        <CardContent className='p-6 sm:p-8'>
          {errorMsg && (
            <div className='bg-red-500 text-white border-4 border-black p-4 mb-6 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm transform rotate-1'>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6 sm:space-y-8'>
            <div className='space-y-2'>
              <Label
                htmlFor='name'
                className='text-xl sm:text-2xl font-black uppercase'
              >
                Nama Panggilan
              </Label>
              <Input
                id='name'
                name='name'
                required
                className='border-4 border-black text-xl font-bold p-6 sm:p-8 focus-visible:ring-0 focus-visible:bg-green-100 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none h-14 sm:h-16'
                placeholder='Misal: Budi'
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='birth_date'
                className='text-xl sm:text-2xl font-black uppercase'
              >
                Tanggal Lahir
              </Label>
              <Input
                id='birth_date'
                name='birth_date'
                type='date'
                required
                className='border-4 border-black text-xl font-bold p-6 sm:p-8 focus-visible:ring-0 focus-visible:bg-green-100 focus-visible:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none h-14 sm:h-16 uppercase'
              />
            </div>

            <div className='space-y-3 pb-4'>
              <Label className='text-xl sm:text-2xl font-black uppercase block mb-2'>
                Jenis Kelamin
              </Label>
              <div className='flex flex-col sm:flex-row gap-4'>
                <label className='flex-1 flex items-center justify-center gap-3 border-4 border-black p-5 sm:p-6 cursor-pointer hover:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] has-[:checked]:bg-blue-500 has-[:checked]:text-white has-[:checked]:shadow-none has-[:checked]:translate-x-1 has-[:checked]:translate-y-1'>
                  <input
                    type='radio'
                    name='gender'
                    value='L'
                    required
                    className='w-6 h-6 accent-black'
                  />
                  <span className='font-black text-xl uppercase'>
                    Laki-laki 👦
                  </span>
                </label>
                <label className='flex-1 flex items-center justify-center gap-3 border-4 border-black p-5 sm:p-6 cursor-pointer hover:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] has-[:checked]:bg-blue-500 has-[:checked]:text-white has-[:checked]:shadow-none has-[:checked]:translate-x-1 has-[:checked]:translate-y-1'>
                  <input
                    type='radio'
                    name='gender'
                    value='P'
                    required
                    className='w-6 h-6 accent-black'
                  />
                  <span className='font-black text-xl uppercase'>
                    Perempuan 👧
                  </span>
                </label>
              </div>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full h-16 sm:h-20 text-2xl sm:text-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all bg-yellow-400 text-black uppercase font-black rounded-none mt-4'
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
