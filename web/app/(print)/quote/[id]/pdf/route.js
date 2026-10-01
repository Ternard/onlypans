import { headers } from "next/headers";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { payloadClient } from "@/lib/getPayload";
import { formatKsh } from "@/lib/currency";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const rose = rgb(0.64, 0.39, 0.42);
const W = 595, H = 842, M = 48;

export async function GET(request, { params }) {
  const { id } = await params;
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) return new Response("Unauthorized", { status: 401 });
  const q = await payload.findByID({ collection: "quotes", id }).catch(() => null);
  if (!q) return new Response("Not found", { status: 404 });
  const shopping = new URL(request.url).searchParams.get("view") === "shopping";

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page, y;
  const newPage = () => {
    page = pdf.addPage([W, H]);
    y = H - M;
  };
  const text = (s, x, { f = font, size = 11, color = rose } = {}) => page.drawText(String(s), { x, y, size, font: f, color });
  const wrap = (s, f, size, width) => {
    const lines = [];
    for (const para of String(s ?? "").split("\n")) {
      let line = "";
      for (const word of para.split(" ")) {
        const t = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(t, size) > width && line) { lines.push(line); line = word; } else line = t;
      }
      lines.push(line);
    }
    return lines;
  };
  const ensure = (h) => { if (y - h < M) newPage(); };

  newPage();
  page.drawRectangle({ x: 0, y: H - 110, width: W, height: 110, color: rgb(0.94, 0.89, 0.85) });
  y = H - 55;
  text("PANS&WINE", W / 2 - bold.widthOfTextAtSize("PANS&WINE", 28) / 2, { f: bold, size: 28 });
  y -= 22;
  const by = SITE.byline.toUpperCase();
  text(by, W / 2 - font.widthOfTextAtSize(by, 12) / 2, { size: 12 });
  y = H - 150;
  text(q.title || "", M, { f: bold, size: 16 });
  y -= 26;
  text(shopping ? "SHOPPING LIST" : `QUOTATION #${q.quoteNumber}`, M, { f: bold, size: 13 });
  y -= 18;
  text([q.customerName, q.pax && `${q.pax} pax`, q.eventDate].filter(Boolean).join("  |  "), M);
  y -= 30;

  if (shopping) {
    for (const row of q.shoppingList || []) {
      for (const l of wrap(row.item, font, 12, W - 2 * M)) { ensure(18); text(l, M, { size: 12 }); y -= 18; }
    }
  } else {
    // Right edges of the numeric columns, so figures line up.
    const R = { qty: 335, price: 445, total: W - M - 8 };
    const right = (s, edge, o) => text(s, edge - (o?.f || font).widthOfTextAtSize(String(s), o?.size || 11), o);
    const rule = (yy, color = rgb(0.9, 0.84, 0.8)) => page.drawLine({ start: { x: M, y: yy }, end: { x: W - M, y: yy }, thickness: 0.7, color });
    page.drawRectangle({ x: M, y: y - 8, width: W - 2 * M, height: 26, color: rgb(0.94, 0.89, 0.85) });
    text("#", M + 8, { f: bold });
    text("DESCRIPTION", M + 30, { f: bold, size: 10 });
    right("QTY", R.qty, { f: bold, size: 10 });
    right("PRICE", R.price, { f: bold, size: 10 });
    right("TOTAL", R.total, { f: bold, size: 10 });
    y -= 30;
    let n = 0;
    for (const it of q.items || []) {
      const lines = wrap(String(it.description ?? "").trim(), font, 11, 255);
      ensure(lines.length * 15 + 14);
      text(String(++n), M + 8);
      right(String(it.qty ?? 1), R.qty);
      right(formatKsh(it.unitPrice), R.price);
      right(formatKsh(it.amount), R.total);
      for (const l of lines) { text(l, M + 30); y -= 15; }
      y -= 5;
      rule(y + 2);
      y -= 14;
    }
    ensure(60);
    y -= 10;
    page.drawRectangle({ x: W - M - 200, y: y - 12, width: 200, height: 34, color: rgb(0.94, 0.89, 0.85) });
    const t = `Total ${formatKsh(q.total)}`;
    text(t, W - M - 8 - bold.widthOfTextAtSize(t, 15), { f: bold, size: 15 });
    y -= 40;
    for (const l of wrap(q.notes, font, 11, W - 2 * M)) { ensure(15); text(l, M); y -= 15; }
  }

  ensure(80);
  y -= 24;
  for (const l of ["Contact us", SITE.phone, SITE.email]) { text(l, M); y -= 15; }
  text(SITE.tagline, M, { size: 9 });

  const name = `${shopping ? "shopping-list" : "quotation"}-${q.quoteNumber}.pdf`;
  return new Response(await pdf.save(), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${name}"` },
  });
}
