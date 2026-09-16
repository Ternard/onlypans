"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatKsh } from "@/lib/currency";

export default function CartView({ brand }) {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", shippingAddress: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          brand: brand.dbKey,
          brandSlug: brand.slug,
          items,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Something went wrong. Please try again.");
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
      <div className="mt-8">
        <p className="text-black/60">Your cart is empty.</p>
        <Link
          href={`/${brand.slug}/shop`}
          className="mt-4 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: brand.accent }}
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col gap-3 rounded-xl border border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-black/50">{formatKsh(item.price)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                className="w-16 rounded-lg border border-black/10 px-2 py-1.5 text-center"
              />
              <span className="w-24 text-right font-semibold">
                {formatKsh(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm font-semibold text-black/40 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-black/10 pt-4 text-lg font-extrabold">
        <span>Subtotal</span>
        <span style={{ color: brand.accent }}>{formatKsh(subtotal)}</span>
      </div>

      <form onSubmit={handleCheckout} className="flex flex-col gap-3 rounded-xl border border-black/5 p-5">
        <h2 className="font-bold">Delivery details</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Name
            <input
              required
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Email
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) => updateField("customerEmail", e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Phone
            <input
              value={form.customerPhone}
              onChange={(e) => updateField("customerPhone", e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Delivery Address
            <input
              value={form.shippingAddress}
              onChange={(e) => updateField("shippingAddress", e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 self-start rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
        >
          {submitting ? "Redirecting to payment..." : "Checkout & Pay"}
        </button>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </form>
    </div>
  );
}
