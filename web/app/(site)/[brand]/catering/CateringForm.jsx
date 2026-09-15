"use client";

import { useState } from "react";
import FormField from "@/components/FormField";

const MEATS = ["Brisket", "Pulled Pork", "Spare Ribs", "BBQ Chicken"];
const SIDES = ["Mac & Cheese", "Cornbread", "Coleslaw", "Baked Beans"];
const DESSERTS = ["Banana Pudding", "Peach Cobbler"];

function CheckboxGroup({ title, options, name }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm">
            <input type="checkbox" name={name} value={opt} />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function CateringForm({ brand }) {
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
      deliveryType: form.get("deliveryType"),
      eventDetails: form.get("eventDetails"),
      budget: form.get("budget"),
      referral: form.get("referral"),
      selectedMeats: form.getAll("selectedMeats"),
      selectedSides: form.getAll("selectedSides"),
      selectedDesserts: form.getAll("selectedDesserts"),
      brand: brand.dbKey,
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
        <FormField label="Name" name="name" required accent={brand.accent} />
        <FormField label="Email" name="email" type="email" required accent={brand.accent} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Phone" name="phone" accent={brand.accent} />
        <FormField label="Guest count" name="guestCount" type="number" min="1" accent={brand.accent} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Event date" name="eventDate" type="date" accent={brand.accent} />
        <FormField label="Event time" name="eventTime" type="time" accent={brand.accent} />
      </div>
      <FormField label="Location" name="location" accent={brand.accent} />

      <CheckboxGroup title="Meats" options={MEATS} name="selectedMeats" />
      <CheckboxGroup title="Sides" options={SIDES} name="selectedSides" />
      <CheckboxGroup title="Desserts" options={DESSERTS} name="selectedDesserts" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Budget" name="budget" accent={brand.accent} />
        <FormField label="How did you hear about us?" name="referral" accent={brand.accent} />
      </div>
      <FormField label="Event details" name="eventDetails" as="textarea" rows={4} accent={brand.accent} />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 self-start rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        style={{ backgroundColor: brand.accent }}
      >
        {submitting ? "Submitting..." : "Request catering"}
      </button>

      {status === "success" && <p className="text-sm font-semibold text-green-700">Request submitted!</p>}
      {status === "error" && <p className="text-sm font-semibold text-red-700">Something went wrong. Try again.</p>}
    </form>
  );
}
