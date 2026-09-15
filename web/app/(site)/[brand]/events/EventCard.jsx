"use client";

import { useState } from "react";
import { formatKsh } from "@/lib/currency";

export default function EventCard({ event, brand }) {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(event.timeOptions?.[0]?.time ?? "");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const imageSrc = event.photo?.url || event.imageUrl;

  async function handlePurchase(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/events/${event.id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          quantity: Number(quantity),
          selectedTime: selectedTime || undefined,
          brand: brand.dbKey,
        }),
      });
      const data = await res.json();
      setStatus({ ok: data.success, message: data.message });
    } catch {
      setStatus({ ok: false, message: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/5 shadow-sm">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          {imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt={event.title} className="h-20 w-20 rounded-lg object-cover" />
          )}
          <div>
            <h2 className="font-semibold">{event.title}</h2>
            <p className="text-sm text-black/60">{event.description}</p>
            <p className="mt-1 text-sm text-black/50">
              {new Date(event.eventDate).toLocaleDateString()} · {event.venue}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ color: brand.accent }}>
            {formatKsh(event.ticketPrice)}
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
          >
            {open ? "Close" : "Get Tickets"}
          </button>
        </div>
      </div>

      {open && (
        <form onSubmit={handlePurchase} className="flex flex-col gap-3 border-t border-black/5 p-5">
          {event.timeOptions?.length > 0 && (
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Time
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
              >
                {event.timeOptions.map((opt) => (
                  <option key={opt.time} value={opt.time}>
                    {opt.time}
                    {opt.availableTickets != null ? ` (${opt.availableTickets} left)` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-semibold sm:w-32">
            Quantity
            <input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 text-base font-normal"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 self-start rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
          >
            {submitting ? "Processing..." : "Confirm purchase"}
          </button>
          {status && (
            <p className={`text-sm font-semibold ${status.ok ? "text-green-700" : "text-red-700"}`}>
              {status.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
