import { NextResponse } from "next/server";
import { payloadClient } from "@/lib/getPayload";
import { stripeClient } from "@/lib/stripe";
import { notifyOrderPaid, notifyBookingConfirmed } from "@/lib/notifications";

async function releaseReservation(pool, table, id, quantity) {
  if (!table || id == null) return;
  await pool.query(`UPDATE ${table} SET available_tickets = available_tickets + $1 WHERE id = $2`, [
    quantity,
    id,
  ]);
}

async function handleOrderPaid(payload, session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;
  const order = await payload.update({
    collection: "orders",
    id: orderId,
    data: {
      paymentStatus: "paid",
      status: "confirmed",
      stripePaymentIntentId: session.payment_intent ?? undefined,
    },
  });
  await notifyOrderPaid(order);
}

async function handleBookingPaid(payload, session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;
  const booking = await payload.update({
    collection: "event-bookings",
    id: bookingId,
    data: {
      status: "confirmed",
      stripePaymentIntentId: session.payment_intent ?? undefined,
    },
  });
  const eventId = typeof booking.event === "object" ? booking.event.id : booking.event;
  const event = await payload.findByID({ collection: "events", id: eventId });
  await notifyBookingConfirmed(booking, event);
}

async function handleBookingExpired(payload, session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;
  let booking;
  try {
    booking = await payload.findByID({ collection: "event-bookings", id: bookingId });
  } catch {
    return;
  }
  if (booking.status !== "pending") return;

  await releaseReservation(payload.db.pool, booking.reservationTable, booking.reservationId, booking.quantity);
  await payload.update({
    collection: "event-bookings",
    id: bookingId,
    data: { status: "cancelled" },
  });
}

async function handleOrderExpired(payload, session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;
  let order;
  try {
    order = await payload.findByID({ collection: "orders", id: orderId });
  } catch {
    return;
  }
  if (order.paymentStatus !== "pending") return;

  await payload.update({
    collection: "orders",
    id: orderId,
    data: { status: "cancelled", paymentStatus: "failed" },
  });
}

export async function POST(request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const payloadText = await request.text();
  const stripe = stripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payloadText, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const payload = await payloadClient();
  const session = event.data.object;
  const type = session.metadata?.type;

  if (event.type === "checkout.session.completed") {
    if (type === "event_booking") {
      await handleBookingPaid(payload, session);
    } else {
      await handleOrderPaid(payload, session);
    }
  } else if (event.type === "checkout.session.expired") {
    if (type === "event_booking") {
      await handleBookingExpired(payload, session);
    } else {
      await handleOrderExpired(payload, session);
    }
  }

  return NextResponse.json({ received: true });
}
