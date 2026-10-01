"use client";

import { useState } from "react";
import FormField from "@/components/FormField";


function CheckboxGroup({ title, options, name }) {
  if (!options.length) return null;
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink/80">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="cursor-pointer rounded-full border border-ink/15 bg-white px-4 py-2 text-sm transition has-[:checked]:border-rose-deep has-[:checked]:bg-rose/20 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rose"
          >
            <input type="checkbox" name={name} value={opt} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function BookingForm({ menu = [] }) {
  const names = (cat) => menu.filter((m) => m.category === cat).map((m) => m.name);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = new FormData(e.target);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      eventDate: form.get("eventDate"),
      eventTime: form.get("eventTime"),
      location: form.get("location"),
      guestCount: Number(form.get("guestCount")) || null,
      cateringType: form.get("cateringType"),
      eventDetails: form.get("eventDetails"),
      budget: form.get("budget"),
      referral: form.get("referral"),
      selectedMeats: form.getAll("selectedMeats"),
      selectedSides: form.getAll("selectedSides"),
      selectedDesserts: form.getAll("selectedDesserts"),
    };

    try {
      const res = await fetch("/api/catering/submit", {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Your name *" name="name" required autoComplete="name" />
        <FormField label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" />
      </div>
      <FormField label="Email *" name="email" type="email" required autoComplete="email" />
      <FormField label="Service" name="cateringType" as="select">
        <option>Full catering (we bring everything)</option>
        <option>Labour + equipment (you provide ingredients)</option>
        <option>Private dining / chef&apos;s table</option>
        <option>Wine &amp; beverage service</option>
        <option>Not sure yet</option>
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Event date" name="eventDate" type="date" />
        <FormField label="Time" name="eventTime" type="time" />
        <FormField label="Guests" name="guestCount" type="number" min="1" placeholder="e.g. 100" />
      </div>
      <FormField label="Venue / location" name="location" />

      <CheckboxGroup title="Mains" options={names("mains")} name="selectedMeats" />
      <CheckboxGroup title="Sides & starches" options={names("sides")} name="selectedSides" />
      <CheckboxGroup title="Drinks, fruit & extras" options={names("extras")} name="selectedDesserts" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Budget (KSh)" name="budget" />
        <FormField label="How did you hear about us?" name="referral" />
      </div>
      <FormField label="Anything else we should know?" name="eventDetails" as="textarea" rows={4} />

      <button type="submit" disabled={submitting} className="btn btn-dark self-start">
        {submitting ? "Sending…" : "Request a Quote"}
      </button>

      <p role="status" className="text-sm font-medium">
        {status === "success" && <span className="text-green-700">Thank you! We&apos;ll reach out within 24 hours with a quote.</span>}
        {status === "error" && <span className="text-red-700">Something went wrong. Please try again or WhatsApp us.</span>}
      </p>
    </form>
  );
}
