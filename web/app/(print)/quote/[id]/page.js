import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import { formatKsh } from "@/lib/currency";
import { SITE } from "@/lib/site";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function QuotePage({ params }) {
  const { id } = await params;
  const payload = await payloadClient();
  // Only a logged-in admin may view a quotation.
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) notFound();
  const q = await payload.findByID({ collection: "quotes", id }).catch(() => null);
  if (!q) notFound();

  const rose = "#a4636a";
  const cell = { padding: "10px 8px", verticalAlign: "top", whiteSpace: "pre-wrap", borderBottom: "1px solid #e6d6cd" };
  const num = { ...cell, textAlign: "right", whiteSpace: "nowrap" };
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: 32 }}>
      <style>{`@media print { .no-print { display: none } @page { margin: 12mm } }`}</style>
      <PrintButton />
      <div style={{ background: "#efe4d9", textAlign: "center", padding: "24px 0", color: rose }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 4 }}>PANS&amp;WINE</div>
        <div style={{ letterSpacing: 6 }}>{SITE.byline.toUpperCase()}</div>
      </div>
      <h2 style={{ color: rose }}>{q.title}</h2>
      <h3 style={{ margin: "24px 0 4px" }}>QUOTATION #{q.quoteNumber}</h3>
      <p style={{ margin: 0 }}>
        {q.customerName}
        {q.pax ? ` · ${q.pax} pax` : ""}
        {q.eventDate ? ` · ${q.eventDate}` : ""}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, borderTop: "2px dotted " + rose }}>
        <thead>
          <tr style={{ borderBottom: "2px dotted " + rose, textAlign: "left" }}>
            <th style={cell}>Item</th>
            <th style={num}>Qty</th>
            <th style={num}>Price</th>
            <th style={num}>Total</th>
          </tr>
        </thead>
        <tbody>
          {(q.items || []).map((it) => (
            <tr key={it.id}>
              <td style={cell}>{String(it.description ?? "").trim()}</td>
              <td style={num}>{it.qty ?? 1}</td>
              <td style={num}>{formatKsh(it.unitPrice)}</td>
              <td style={num}>{formatKsh(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: "#efe4d9", padding: 16, textAlign: "right", fontSize: 22, fontWeight: 700, marginTop: 16 }}>
        Total {formatKsh(q.total)}
      </div>
      {q.notes && <p style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>{q.notes}</p>}
      <div style={{ borderTop: "2px dotted " + rose, marginTop: 24, paddingTop: 12 }}>
        <div>Contact us</div>
        <div>{SITE.phone}</div>
        <div>{SITE.email}</div>
        <p style={{ fontSize: 13 }}>{SITE.tagline}</p>
      </div>
    </div>
  );
}
