// lib/api.ts
const API_BASE_URL = "https://akazelll-stunting-predict.hf.space";

export async function predictStunting(data: any) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
