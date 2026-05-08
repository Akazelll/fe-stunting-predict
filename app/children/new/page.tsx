"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Import sistem layout dan komponen Neobrutalism kita
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function NewChildPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    birth_date: "",
    gender: "L",
    birth_weight: "",
    birth_length: "",
  });

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

      // Step 1: Insert anak — hanya kolom yang ada di skema
      const { data: child, error: childError } = await supabase
        .from("children")
        .insert([
          {
            user_id: user.id,
            name: form.name,
            birth_date: form.birth_date,
            gender: form.gender,
          },
        ])
        .select("id")
        .single();

      if (childError) throw childError;

      // Step 2: Simpan berat & panjang lahir sebagai growth record pertama (age_months = 0)
      if (form.birth_weight || form.birth_length) {
        const { error: growthError } = await supabase
          .from("growth_records")
          .insert([
            {
              child_id: child.id,
              weight_kg: form.birth_weight ? parseFloat(form.birth_weight) : 0,
              height_cm: form.birth_length ? parseFloat(form.birth_length) : 0,
              age_months: 0, // 0 = data lahir
            },
          ]);

        if (growthError) throw growthError;
      }

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AppLayout>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Tombol Kembali */}
        <div>
          <Button asChild variant='secondary'>
            <Link href='/dashboard'>&larr; Batal & Kembali</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className='bg-blue-300'>
            <CardTitle>Registrasi Anak</CardTitle>
            <p className='font-bold text-sm mt-1 text-black'>
              Data kelahiran di bawah akan digunakan otomatis untuk prediksi
              gizi.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-8 mt-4'>
              {/* Data Pribadi */}
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nama Lengkap Anak</Label>
                  <Input
                    id='name'
                    value={form.name}
                    onChange={(e) => handleUpdate("name", e.target.value)}
                    placeholder='Masukkan nama lengkap'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='birth_date'>Tanggal Lahir</Label>
                    <Input
                      id='birth_date'
                      type='date'
                      value={form.birth_date}
                      onChange={(e) =>
                        handleUpdate("birth_date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='gender'>Jenis Kelamin</Label>
                    {/* Native Select dimodifikasi agar senada dengan Input shadcn kita */}
                    <select
                      id='gender'
                      value={form.gender}
                      onChange={(e) => handleUpdate("gender", e.target.value)}
                      className='flex h-12 w-full rounded-none border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[4px_4px_0_0_#000000] transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0_0_#000000] focus-visible:border-blue-600 cursor-pointer'
                      required
                    >
                      <option value='L'>Laki-laki</option>
                      <option value='P'>Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Divider Visual */}
              <div className='flex items-center gap-4 py-2'>
                <div className='flex-1 border-b-4 border-black border-dashed' />
                <span className='text-xs font-black bg-yellow-300 px-3 py-1 border-2 border-black uppercase shadow-[2px_2px_0_0_#000]'>
                  Data Kelahiran
                </span>
                <div className='flex-1 border-b-4 border-black border-dashed' />
              </div>

              {/* Data Kelahiran */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='birth_weight'>Berat Lahir (kg)</Label>
                  <Input
                    id='birth_weight'
                    type='number'
                    step='0.01'
                    value={form.birth_weight}
                    onChange={(e) =>
                      handleUpdate("birth_weight", e.target.value)
                    }
                    placeholder='Misal: 3.2'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='birth_length'>Panjang Lahir (cm)</Label>
                  <Input
                    id='birth_length'
                    type='number'
                    step='0.1'
                    value={form.birth_length}
                    onChange={(e) =>
                      handleUpdate("birth_length", e.target.value)
                    }
                    placeholder='Misal: 49.5'
                    required
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <div className='pt-6'>
                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full h-14 text-lg'
                  // Custom class tambahan agar tombol ini berwarna kuning khas aksi utama
                  variant='primary'
                >
                  {loading ? "MENYIMPAN..." : "DAFTARKAN ANAK"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
