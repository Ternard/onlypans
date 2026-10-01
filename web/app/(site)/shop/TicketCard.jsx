"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatKsh } from "@/lib/currency";
import FormField from "@/components/FormField";
import { formatDate } from "@/lib/site";

// `event` is the trimmed shape from publicEvent() in lib/site.js.
export default function TicketCard({ event }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handlePurchase(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = new FormData(e.target);
    try {
      const res = await fetch(`/api/events/${event.id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("name"),
          customerEmail: form.get("email"),
          customerPhone: form.get("phone"),
          quantity: Number(form.get("quantity")),
          selectedTime: form.get("time") || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.mpesa) {
        router.push(`/order-confirmation?booking=${data.data.bookingNumber}&pay=mpesa`);
        return;
      }
      if (data.success && data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
        return;
      }
      setStatus({ ok: data.success, message: data.message });
    } catch {
      setStatus({ ok: false, message: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[16/9] bg-sand sm:aspect-auto sm:w-64 sm:shrink-0">
          {event.image && <Image src={event.image} alt="" fill sizes="(min-width: 640px) 256px, 100vw" className="object-cover" />}
          <div className="absolute left-4 top-4 rounded-lg bg-espresso/90 px-3 py-2 text-center leading-none text-cream">
            <span className="block font-display text-2xl font-bold text-rose">{formatDate(event.eventDate, { day: "numeric" })}</span>
            <span className="text-[0.65rem] uppercase tracking-widest">{formatDate(event.eventDate, { month: "short" })}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Hosted by {event.organizer}</p>
            <h3 className="mt-2 text-2xl font-bold">{event.title}</h3>
            {event.description && <p className="mt-1 text-sm leading-relaxed text-ink/65">{event.description}</p>}
            <p className="mt-2 text-sm text-ink/55">
              {formatDate(event.eventDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {event.venue && ` · ${event.venue}`}
            </p>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <span className="font-display text-2xl font-semibold text-rose-deep">{formatKsh(event.ticketPrice)}</span>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="btn btn-dark">
              {open ? "Close" : "Get Tickets"}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <form onSubmit={handlePurchase} className="grid gap-4 border-t border-ink/10 bg-cream/60 p-6 sm:grid-cols-2">
          {event.timeOptions.length > 0 && (
            <FormField label="Time" name="time" as="select">
              {event.timeOptions.map((opt) => (
                <option key={opt.time} value={opt.time}>
                  {opt.time}
                  {opt.availableTickets != null ? ` (${opt.availableTickets} left)` : ""}
                </option>
              ))}
            </FormField>
          )}
          <FormField label="Quantity" name="quantity" type="number" min="1" defaultValue="1" required />
          <FormField label="Full name" name="name" required autoComplete="name" />
          <FormField label="Email" name="email" type="email" required autoComplete="email" />
          <FormField label="M-Pesa phone *" name="phone" type="tel" required autoComplete="tel" placeholder="0712345678" />
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className="btn btn-primary w-full">
              {submitting ? "Processing…" : "Confirm & Pay"}
            </button>
          </div>
          {status && (
            <p role="status" className={`text-sm font-medium sm:col-span-2 ${status.ok ? "text-green-700" : "text-red-700"}`}>
              {status.message}
            </p>
          )}
        </form>
      )}
    </article>
  );
}
