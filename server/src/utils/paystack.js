import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_BASE = "https://api.paystack.co";

export async function verifyPaystackTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Paystack verification failed");
  }
  return data; // data.data.status === 'success' when payment succeeded
}
