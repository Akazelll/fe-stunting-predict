"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { predictStunting } from "@/lib/api";

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    umur_bulan: "",
    berat_badan: "",
    tinggi_badan: "",
  });
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await predictStunting(formData);
      setResult(res.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-bg p-4'>
      <Card className='w-full max-w-md bg-white'>
        <CardHeader>
          <CardTitle className='text-2xl font-black'>
            Prediksi Stunting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label className='font-bold'>Umur (Bulan)</Label>
              <Input
                name='umur_bulan'
                type='number'
                required
                onChange={handleChange}
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-bold'>Berat Badan (kg)</Label>
              <Input
                name='berat_badan'
                type='number'
                step='0.1'
                required
                onChange={handleChange}
              />
            </div>
            <div className='space-y-2'>
              <Label className='font-bold'>Tinggi Badan (cm)</Label>
              <Input
                name='tinggi_badan'
                type='number'
                step='0.1'
                required
                onChange={handleChange}
              />
            </div>
            <Button type='submit' className='w-full mt-4'>
              Analisis Model
            </Button>
          </form>
          {result && (
            <div className='mt-6 p-4 border-neo border-black bg-main text-white font-bold text-center text-lg'>
              Hasil: {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
