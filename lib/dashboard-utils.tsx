import React from "react";
import { CheckCircle2, AlertCircle, Activity, Calendar } from "lucide-react";

export type Prediction = {
  result: "normal" | "risk" | "stunted";
  created_at: string;
};

export type Child = {
  id: string;
  name: string;
  gender: "L" | "P";
  birth_date: string;
  predictions: Prediction[];
};

export const calculateAgeInMonths = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  const yearsDiff = today.getFullYear() - birthDate.getFullYear();
  const monthsDiff = today.getMonth() - birthDate.getMonth();
  return yearsDiff * 12 + monthsDiff;
};

export const getLatestStatus = (predictions?: Prediction[]) => {
  if (!predictions || predictions.length === 0) return null;
  const sorted = [...predictions].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return sorted[0].result;
};

export const getStatusUI = (status: "normal" | "risk" | "stunted" | null) => {
  switch (status) {
    case "normal":
      return {
        label: "Normal",
        color: "bg-green-300 text-black",
        icon: <CheckCircle2 className='w-4 h-4' />,
      };
    case "risk":
      return {
        label: "Beresiko",
        color: "bg-yellow-300 text-black",
        icon: <AlertCircle className='w-4 h-4' />,
      };
    case "stunted":
      return {
        label: "Stunting",
        color: "bg-red-500 text-white",
        icon: <Activity className='w-4 h-4' />,
      };
    default:
      return {
        label: "Belum Dicek",
        color: "bg-gray-200 text-gray-600",
        icon: <Calendar className='w-4 h-4' />,
      };
  }
};
