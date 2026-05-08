// components/children/MeasurementForm.tsx
import React from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MeasurementForm({
  form,
  handleChange,
  handleSubmit,
  isPredicting,
}: any) {
  return (
    <Card>
      <CardHeader className='bg-blue-300'>
        <CardTitle>Pantau Tumbuh Kembang</CardTitle>
      </CardHeader>

      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Data Statis */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-100 border-2 border-dashed border-gray-400'>
            <div className='space-y-2 opacity-70 cursor-not-allowed'>
              <Label>Jenis Kelamin</Label>
              <Input
                value={form.Sex}
                readOnly
                className='pointer-events-none'
              />
              <p className='text-[10px] font-bold text-gray-500 uppercase'>
                Data Profil
              </p>
            </div>
            <div className='space-y-2 opacity-70 cursor-not-allowed'>
              <Label>Umur Saat Ini (Bulan)</Label>
              <Input
                value={form.Age}
                readOnly
                className='pointer-events-none'
              />
              <p className='text-[10px] font-bold text-gray-500 uppercase'>
                Dihitung Otomatis
              </p>
            </div>
          </div>

          {/* Data Kelahiran */}
          <div className='flex items-center gap-4 py-2'>
            <div className='flex-1 border-b-4 border-black border-dashed' />
            <span className='text-[10px] font-black bg-black text-white px-3 py-1 uppercase'>
              Data Kelahiran (Terkunci)
            </span>
            <div className='flex-1 border-b-4 border-black border-dashed' />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-100 border-2 border-dashed border-gray-400'>
            <div className='space-y-2 opacity-70 cursor-not-allowed'>
              <Label>Berat Lahir (kg)</Label>
              <Input
                value={form.Birth_Weight}
                readOnly
                className='pointer-events-none'
              />
            </div>
            <div className='space-y-2 opacity-70 cursor-not-allowed'>
              <Label>Panjang Lahir (cm)</Label>
              <Input
                value={form.Birth_Length}
                readOnly
                className='pointer-events-none'
              />
            </div>
          </div>

          {/* Input Aktif */}
          <div className='flex items-center gap-4 py-2'>
            <div className='flex-1 border-b-4 border-black border-dashed' />
            <span className='text-[10px] font-black bg-green-400 border-2 border-black px-3 py-1 uppercase shadow-[2px_2px_0_0_#000]'>
              Input Pengukuran Sekarang
            </span>
            <div className='flex-1 border-b-4 border-black border-dashed' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Body_Weight'>Berat Badan Sekarang (kg)</Label>
            <Input
              id='Body_Weight'
              name='Body_Weight'
              type='number'
              step='0.1'
              value={form.Body_Weight}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='Body_Length'>Tinggi Badan Sekarang (cm)</Label>
            <Input
              id='Body_Length'
              name='Body_Length'
              type='number'
              step='0.1'
              value={form.Body_Length}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='ASI_Eksklusif'>Status ASI Eksklusif</Label>
            <select
              id='ASI_Eksklusif'
              name='ASI_Eksklusif'
              value={form.ASI_Eksklusif}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className='flex h-12 w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium shadow-[4px_4px_0_0_#000000] focus-visible:outline-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0_0_#000000] cursor-pointer'
            >
              <option value='Yes'>Ya (6 Bulan Pertama)</option>
              <option value='No'>Tidak</option>
            </select>
          </div>

          <div className='pt-6 border-t-4 border-black'>
            <Button
              type='submit'
              disabled={isPredicting}
              className='w-full h-16 text-xl'
              variant='primary'
            >
              {isPredicting ? "ANALISIS AI..." : "CEK RISIKO STUNTING"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
