"use client";
import { useDocumentInfo } from "@payloadcms/ui";

const link = { fontWeight: 600, textDecoration: "underline", marginRight: 20 };

export default function QuoteLink() {
  const { id } = useDocumentInfo();
  if (!id) return <p>Save the quotation first, then download links appear here.</p>;
  return (
    <p>
      <a href={`/quote/${id}/pdf`} style={link}>Download quotation PDF</a>
      <a href={`/quote/${id}`} target="_blank" rel="noreferrer" style={link}>Open printable page</a>
      <a href={`/quote/${id}/pdf?view=shopping`} style={link}>Download shopping list PDF</a>
    </p>
  );
}
