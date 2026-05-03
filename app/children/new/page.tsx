"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InputField, SelectField } from "@/components/BrutalInputs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewChildPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Untuk mencegah hydration error

  const [form, setForm] = useState({
    name: "",
    birth_date: "",
    gender: "L",
    birth_weight: "",
    birth_length: "",
  });

  // Pastikan komponen sudah terpasang di client sebelum render penuh
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdate = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Silakan login kembali.");

      const { error } = await supabase.from("children").insert([
        {
          user_id: user.id,
          name: form.name,
          birth_date: form.birth_date,
          gender: form.gender,
          birth_weight: form.birth_weight
            ? parseFloat(form.birth_weight)
            : null,
          birth_length: form.birth_length
            ? parseFloat(form.birth_length)
            : null,
        },
      ]);

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  // Jika belum mounted, tampilkan loading/kosong untuk menghindari mismatch
  if (!isMounted) return null;

  return (
    <div className='min-h-screen bg-[#A7F3D0] p-6 sm:p-10 font-sans text-black'>
      <div className='max-w-2xl mx-auto'>
        <Link
          href='/dashboard'
          className='inline-block mb-6 font-black uppercase underline decoration-4 hover:text-blue-600 transition-all'
        >
          &larr; Batal
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden'
        >
          <div className='bg-[#93C5FD] p-6 border-b-4 border-black'>
            <h1 className='text-3xl font-black uppercase tracking-tight'>
              Registrasi Anak
            </h1>
            <p className='font-bold text-sm'>
              Data kelahiran di bawah akan digunakan otomatis untuk prediksi
              gizi.
            </p>
          </div>

          <div className='p-8 space-y-6'>
            <InputField
              label='Nama Lengkap Anak'
              name='name'
              value={form.name}
              // Memastikan menangani e.target.value ATAU nilai langsung
              onChange={(e: any) =>
                handleUpdate("name", e.target ? e.target.value : e)
              }
              required
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <InputField
                label='Tanggal Lahir'
                name='birth_date'
                type='date'
                value={form.birth_date}
                onChange={(e: any) =>
                  handleUpdate("birth_date", e.target ? e.target.value : e)
                }
                required
              />
              <SelectField
                label='Jenis Kelamin'
                name='gender'
                value={form.gender}
                options={[
                  { label: "Laki-laki", value: "L" },
                  { label: "Perempuan", value: "P" },
                ]}
                onChange={(val: any) => handleUpdate("gender", val)}
              />
            </div>

            <div className='flex items-center gap-4 py-2'>
              <div className='flex-1 border-b-4 border-black border-dashed' />
              <span className='text-[10px] font-black bg-yellow-300 px-2 py-1 border-2 border-black uppercase'>
                Data Kelahiran
              </span>
              <div className='flex-1 border-b-4 border-black border-dashed' />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <InputField
                label='Berat Lahir (kg)'
                name='birth_weight'
                type='number'
                step='0.01'
                value={form.birth_weight}
                onChange={(e: any) =>
                  handleUpdate("birth_weight", e.target ? e.target.value : e)
                }
                placeholder='Misal: 3.2'
                required
              />
              <InputField
                label='Panjang Lahir (cm)'
                name='birth_length'
                type='number'
                step='0.1'
                value={form.birth_length}
                onChange={(e: any) =>
                  handleUpdate("birth_length", e.target ? e.target.value : e)
                }
                placeholder='Misal: 49.5'
                required
              />
            </div>
          </div>

          <div className='p-8 bg-slate-50 border-t-4 border-black'>
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-16 bg-[#FDE047] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl uppercase rounded-none transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
            >
              {loading ? "MENYIMPAN..." : "DAFTARKAN ANAK"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
