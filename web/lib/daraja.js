// M-Pesa Daraja (STK Push). Set DARAJA_ENV=production for live; defaults to sandbox.
const BASE = () =>
  process.env.DARAJA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

export const darajaEnabled = () =>
  Boolean(
    process.env.DARAJA_CONSUMER_KEY && process.env.DARAJA_CONSUMER_SECRET &&
    process.env.DARAJA_SHORTCODE && process.env.DARAJA_PASSKEY && process.env.DARAJA_CALLBACK_URL
  );

// 07XX / 01XX / +254… / 254… -> 254XXXXXXXXX, or null if it isn't a Kenyan mobile number.
export function normalizePhone(input) {
  const digits = String(input ?? "").replace(/\D/g, "");
  const m = digits.match(/^(?:254|0)?([17]\d{8})$/);
  return m ? `254${m[1]}` : null;
}

let token = { value: null, expires: 0 };

async function accessToken() {
  if (token.value && Date.now() < token.expires) return token.value;
  const auth = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`).toString("base64");
  const res = await fetch(`${BASE()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const { access_token, expires_in } = await res.json();
  token = { value: access_token, expires: Date.now() + (Number(expires_in) - 60) * 1000 };
  return access_token;
}

// Returns Daraja's response; CheckoutRequestID ties the later callback to our record.
export async function stkPush({ phone: realPhone, amount, reference, description }) {
  // The sandbox never prompts a real handset; DARAJA_TEST_PHONE swaps in Safaricom's test number.
  const phone = (process.env.DARAJA_ENV !== "production" && process.env.DARAJA_TEST_PHONE) || realPhone;
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString("base64");
  const res = await fetch(`${BASE()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: process.env.DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: process.env.DARAJA_TRANSACTION_TYPE || "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: phone,
      PartyB: process.env.DARAJA_PARTY_B || process.env.DARAJA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.DARAJA_CALLBACK_URL,
      AccountReference: reference.slice(0, 12),
      TransactionDesc: description.slice(0, 13),
    }),
  });
  const data = await res.json();
  if (!res.ok || data.ResponseCode !== "0") {
    throw new Error(data.errorMessage || data.ResponseDescription || "STK push failed");
  }
  return data;
}
