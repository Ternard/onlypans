export const metadata = { title: "Quotation" };

export default function PrintLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fff", color: "#6e3b2a", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
