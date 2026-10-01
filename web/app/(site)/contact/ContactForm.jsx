"use client";

import { useState } from "react";
import FormField from "@/components/FormField";

export default function ContactForm() {
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = new FormData(e.target);
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First name *" name="firstName" required autoComplete="given-name" />
        <FormField label="Last name" name="lastName" autoComplete="family-name" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email *" name="email" type="email" required autoComplete="email" />
        <FormField label="Phone" name="phoneNumber" type="tel" autoComplete="tel" />
      </div>
      <FormField label="Subject" name="subject" />
      <FormField label="Message *" name="message" as="textarea" rows={5} required />
      <button type="submit" disabled={submitting} className="btn btn-dark self-start">
        {submitting ? "Sending…" : "Send Message"}
      </button>
      <p role="status" className="text-sm font-medium">
        {status === "success" && <span className="text-green-700">Message sent — we&apos;ll get back to you soon.</span>}
        {status === "error" && <span className="text-red-700">Something went wrong. Please try again or WhatsApp us.</span>}
      </p>
    </form>
  );
}
