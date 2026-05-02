// Hapus /docs di belakangnya
const API_URL = "https://akazelll-stunting-predict.hf.space";

export async function predictStunting(data: any) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil hasil prediksi");
  }

  return response.json();
}
