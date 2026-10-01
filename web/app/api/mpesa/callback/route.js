import { NextResponse } from "next/server";
import { payloadClient } from "@/lib/getPayload";
import { markOrderPaid, markBookingPaid, expireOrder, expireBooking } from "@/lib/payments";

const ack = () => NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

// Daraja callbacks are unsigned, so DARAJA_CALLBACK_URL must carry ?token=<DARAJA_CALLBACK_TOKEN>.
export async function POST(request) {
  const secret = process.env.DARAJA_CALLBACK_TOKEN;
  if (!secret || new URL(request.url).searchParams.get("token") !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cb = (await request.json().catch(() => null))?.Body?.stkCallback;
  if (!cb?.CheckoutRequestID) return ack();

  const payload = await payloadClient();
  const where = { mpesaCheckoutRequestId: { equals: cb.CheckoutRequestID } };
  const [orders, bookings] = await Promise.all([
    payload.find({ collection: "orders", where, limit: 1 }),
    payload.find({ collection: "event-bookings", where, limit: 1 }),
  ]);
  const order = orders.docs[0];
  const booking = bookings.docs[0];
  const record = order ?? booking;
  if (!record) return ack();

  if (cb.ResultCode === 0) {
    const meta = Object.fromEntries((cb.CallbackMetadata?.Item ?? []).map((i) => [i.Name, i.Value]));
    const expected = Math.ceil(order ? order.total : booking.totalAmount);
    // A short payment must not confirm the record; leave it pending for manual review.
    if (Number(meta.Amount) < expected) return ack();
    const extra = { mpesaReceipt: String(meta.MpesaReceiptNumber ?? "") };
    await (order ? markOrderPaid(payload, order.id, extra) : markBookingPaid(payload, booking.id, extra));
  } else {
    await (order ? expireOrder(payload, order.id) : expireBooking(payload, booking.id));
  }
  return ack();
}
