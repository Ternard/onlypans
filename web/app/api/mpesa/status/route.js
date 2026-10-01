import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";

// Polled by the confirmation page. Returns only "paid" | "pending" | "failed" for a reference number.
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const order = params.get("order");
  const booking = params.get("booking");
  if (!order && !booking) return apiResponse(false, "Missing order or booking");

  const payload = await payloadClient();
  const { docs } = order
    ? await payload.find({ collection: "orders", where: { orderNumber: { equals: order } }, limit: 1 })
    : await payload.find({ collection: "event-bookings", where: { bookingNumber: { equals: booking } }, limit: 1 });
  const doc = docs[0];
  if (!doc) return apiResponse(false, "Not found");

  const state = order
    ? { paid: "paid", failed: "failed" }[doc.paymentStatus] ?? "pending"
    : { confirmed: "paid", cancelled: "failed" }[doc.status] ?? "pending";
  return apiResponse(true, "ok", { state });
}
