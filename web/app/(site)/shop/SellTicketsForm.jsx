"use client";

import { useState } from "react";
import FormField from "@/components/FormField";

// Listing requests land in the CMS under Contact Messages (subject starts with "Ticket listing").
export default function SellTicketsForm() {
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const f = new FormData(e.target);
    const message = [
      `Event: ${f.get("eventName")}`,
      `Date: ${f.get("eventDate")}`,
      `Venue: ${f.get("venue")}`,
      `Tickets to sell: ${f.get("ticketCount")}`,
      `Price per ticket (KSh): ${f.get("price")}`,
      f.get("details") && `Details: ${f.get("details")}`,
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.get("name"),
          email: f.get("email"),
          phoneNumber: f.get("phone"),
          subject: `Ticket listing: ${f.get("eventName")}`,
          message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      if (data.success) e.target.reset();
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormField label="Your name *" name="name" required autoComplete="name" />
      <FormField label="Phone / WhatsApp *" name="phone" type="tel" required autoComplete="tel" />
      <div className="sm:col-span-2">
        <FormField label="Email *" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="sm:col-span-2">
        <FormField label="Event name *" name="eventName" required />
      </div>
      <FormField label="Event date *" name="eventDate" type="date" required />
      <FormField label="Venue" name="venue" />
      <FormField label="Number of tickets *" name="ticketCount" type="number" min="1" required />
      <FormField label="Price per ticket (KSh) *" name="price" type="number" min="0" required />
      <div className="sm:col-span-2">
        <FormField label="Anything else?" name="details" as="textarea" rows={3} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Sending…" : "Submit for Listing"}
        </button>
        <p role="status" className="mt-3 text-sm font-medium">
          {status === "success" && <span className="text-green-700">Received! We&apos;ll review your event and get back to you shortly.</span>}
          {status === "error" && <span className="text-red-700">Something went wrong. Please try again or WhatsApp us.</span>}
        </p>
      </div>
    </form>
  );
}
