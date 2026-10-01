"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatKsh } from "@/lib/currency";
import FormField from "@/components/FormField";

export default function CartView() {
  const router = useRouter();
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(e.target)), items }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      if (data.data?.mpesa) {
        router.push(`/order-confirmation?order=${data.data.orderNumber}&pay=mpesa`);
        return;
      }
      if (data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
        return;
      }
      setError("Checkout is not available right now. Please try again later.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-dark mt-6">Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <ul className="divide-y divide-ink/10 rounded-2xl bg-white px-5 shadow-sm ring-1 ring-ink/5">
          {items.map((item) => (
            <li key={item.productId} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-ink/50">{formatKsh(item.price)} each</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  aria-label={`Quantity of ${item.name}`}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                  className="field w-20 text-center"
                />
                <span className="w-28 text-right font-semibold">{formatKsh(item.price * item.quantity)}</span>
                <button type="button" onClick={() => removeItem(item.productId)} className="text-sm text-ink/40 hover:text-red-700">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between px-1 font-display text-xl font-semibold">
          <span>Subtotal</span>
          <span className="text-rose-deep">{formatKsh(subtotal)}</span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="flex flex-col gap-4 self-start rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
        <h2 className="text-2xl font-bold">Delivery details</h2>
        <FormField label="Name *" name="customerName" required autoComplete="name" />
        <FormField label="Email *" name="customerEmail" type="email" required autoComplete="email" />
        <FormField label="M-Pesa phone *" name="customerPhone" type="tel" required autoComplete="tel" placeholder="0712345678" />
        <FormField label="Delivery address" name="shippingAddress" autoComplete="street-address" />
        <button type="submit" disabled={submitting} className="btn btn-primary mt-2">
          {submitting ? "Processing…" : "Checkout & Pay"}
        </button>
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
      </form>
    </div>
  );
}
