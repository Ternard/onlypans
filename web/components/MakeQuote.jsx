"use client";
import { useDocumentInfo } from "@payloadcms/ui";
import { useState } from "react";

export default function MakeQuote() {
  const { id } = useDocumentInfo();
  const [busy, setBusy] = useState(false);
  if (!id) return null;
  async function make() {
    setBusy(true);
    const res = await fetch("/api/quotes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cateringRequest: id }),
    });
    const json = await res.json();
    if (json.doc?.id) window.location.href = `/admin/collections/quotes/${json.doc.id}`;
    else { setBusy(false); alert("Could not create the quote."); }
  }
  return (
    <button type="button" onClick={make} disabled={busy} className="btn btn--style-primary btn--size-medium" style={{ marginBottom: 16 }}>
      {busy ? "Creating…" : "Create quote for this request"}
    </button>
  );
}
