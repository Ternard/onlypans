"use client";

export default function PrintButton() {
  return (
    <button className="no-print" onClick={() => window.print()} style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}>
      Print / Save as PDF
    </button>
  );
}
