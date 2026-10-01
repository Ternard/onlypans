// Paid/expired transitions, called from the M-Pesa callback.
// All are idempotent: Safaricom may retry callbacks, so a repeat must not re-notify or re-release.
import { notifyOrderPaid, notifyBookingConfirmed } from "@/lib/notifications";

async function releaseReservation(pool, table, id, quantity) {
  if (!table || id == null) return;
  await pool.query(`UPDATE ${table} SET available_tickets = available_tickets + $1 WHERE id = $2`, [
    quantity,
    id,
  ]);
}

async function find(payload, collection, id) {
  try {
    return await payload.findByID({ collection, id });
  } catch {
    return null;
  }
}

export async function markOrderPaid(payload, orderId, extra = {}) {
  const current = await find(payload, "orders", orderId);
  if (!current || current.paymentStatus === "paid") return;
  const order = await payload.update({
    collection: "orders",
    id: orderId,
    data: { paymentStatus: "paid", status: "confirmed", ...extra },
  });
  await notifyOrderPaid(order);
}

export async function markBookingPaid(payload, bookingId, extra = {}) {
  const current = await find(payload, "event-bookings", bookingId);
  if (!current || current.status === "confirmed") return;
  const booking = await payload.update({
    collection: "event-bookings",
    id: bookingId,
    data: { status: "confirmed", ...extra },
  });
  const eventId = typeof booking.event === "object" ? booking.event.id : booking.event;
  const event = await payload.findByID({ collection: "events", id: eventId });
  await notifyBookingConfirmed(booking, event);
}

export async function expireBooking(payload, bookingId) {
  const booking = await find(payload, "event-bookings", bookingId);
  if (!booking || booking.status !== "pending") return;
  await releaseReservation(payload.db.pool, booking.reservationTable, booking.reservationId, booking.quantity);
  await payload.update({ collection: "event-bookings", id: bookingId, data: { status: "cancelled" } });
}

export async function expireOrder(payload, orderId) {
  const order = await find(payload, "orders", orderId);
  if (!order || order.paymentStatus !== "pending") return;
  await payload.update({
    collection: "orders",
    id: orderId,
    data: { status: "cancelled", paymentStatus: "failed" },
  });
}
