"use client";

import { useState } from "react";
import FormField from "@/components/FormField";

export default function ContactForm({ brand }) {
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = new FormData(e.target);
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phoneNumber: form.get("phoneNumber"),
      subject: form.get("subject"),
      message: form.get("message"),
      brand: brand.dbKey,
    };

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <FormField label="First name" name="firstName" required accent={brand.accent} />
        <FormField label="Last name" name="lastName" accent={brand.accent} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" name="email" type="email" required accent={brand.accent} />
        <FormField label="Phone" name="phoneNumber" accent={brand.accent} />
      </div>
      <FormField label="Subject" name="subject" accent={brand.accent} />
      <FormField label="Message" name="message" as="textarea" rows={5} required accent={brand.accent} />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 self-start rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        style={{ backgroundColor: brand.accent }}
      >
        {submitting ? "Sending..." : "Send message"}
      </button>

      {status === "success" && <p className="text-sm font-semibold text-green-700">Message sent!</p>}
      {status === "error" && <p className="text-sm font-semibold text-red-700">Something went wrong. Try again.</p>}
    </form>
  );
}
