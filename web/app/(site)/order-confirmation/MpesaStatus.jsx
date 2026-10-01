"use client";

import { useEffect, useState } from "react";

const COPY = {
  pending: "Check your phone and enter your M-Pesa PIN to complete payment…",
  paid: "Payment received. We'll be in touch shortly with details.",
  failed: "The payment was cancelled or didn't go through. Please try again.",
};

// Polls until the Daraja callback flips the record to paid/failed (gives up after ~3 min).
export default function MpesaStatus({ kind, reference }) {
  const [state, setState] = useState("pending");

  useEffect(() => {
    let tries = 0;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status?${kind}=${encodeURIComponent(reference)}`);
        const { data } = await res.json();
        if (data?.state) setState(data.state);
        if (data?.state !== "pending" || ++tries > 60) clearInterval(timer);
      } catch {}
    }, 3000);
    return () => clearInterval(timer);
  }, [kind, reference]);

  return (
    <p role="status" className={`mt-4 font-medium ${state === "failed" ? "text-red-700" : state === "paid" ? "text-green-700" : "text-ink/65"}`}>
      {COPY[state]}
    </p>
  );
}
