// lib/child-utils.ts

export const riskConfig = {
  LOW: {
    label: "RISIKO RENDAH",
    bg: "bg-green-400",
    icon: "✅",
    desc: "Pertumbuhan anak normal. Tetap pantau tumbuh kembang secara rutin.",
  },
  MEDIUM: {
    label: "RISIKO SEDANG",
    bg: "bg-yellow-400",
    icon: "⚠️",
    desc: "Terdapat indikasi risiko stunting. Konsultasikan dengan tenaga kesehatan.",
  },
  HIGH: {
    label: "RISIKO TINGGI",
    bg: "bg-red-500 text-white",
    icon: "🚨",
    desc: "Anak terindikasi stunting. Segera konsultasikan dengan ahli gizi.",
  },
};

export function calculateAgeMonths(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months--;
  return Math.max(0, months);
}
