import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { stripeClient } from "@/lib/stripe";
import { notifyBookingConfirmed } from "@/lib/notifications";

function generateBookingNumber() {
  return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Atomically reserves `quantity` units against a numeric column, guarding against
// overselling under concurrent requests. A single UPDATE ... WHERE ... RETURNING is
// used instead of Payload's local API because Payload's where-based update resolves
// matches with a separate read before writing, which does not close the race window.
async function reserveAtomically(pool, table, id, quantity) {
  const { rows } = await pool.query(
    `UPDATE ${table} SET available_tickets = available_tickets - $1
     WHERE id = $2 AND available_tickets >= $1
     RETURNING available_tickets`,
    [quantity, id]
  );
  return rows.length > 0;
}

async function releaseReservation(pool, table, id, quantity) {
  await pool.query(`UPDATE ${table} SET available_tickets = available_tickets + $1 WHERE id = $2`, [
    quantity,
    id,
  ]);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const eventId = Number(id);
  const body = await request.json();
  const {
    customerName, customerEmail, customerPhone, selectedTime,
    paymentMethod = "CREDIT_CARD", brand = "only-pans", brandSlug,
  } = body;
  const quantity = Number(body.quantity);

  if (
    !customerName || !customerEmail ||
    !Number.isInteger(eventId) ||
    !Number.isInteger(quantity) || quantity < 1
  ) {
    return apiResponse(false, "Missing or invalid fields: customerName, customerEmail, quantity");
  }

  const payload = await payloadClient();
  const pool = payload.db.pool;

  let event;
  try {
    event = await payload.findByID({ collection: "events", id: eventId });
  } catch {
    return apiResponse(false, "Event not found");
  }

  const timeOptions = event.timeOptions || [];
  let reservation = null;

  if (timeOptions.length > 0) {
    if (!selectedTime) {
      return apiResponse(false, "Please select a time");
    }
    const slot = timeOptions.find((opt) => opt.time === selectedTime);
    if (!slot) {
      return apiResponse(false, "Selected time is not valid for this event");
    }
    if (slot.availableTickets != null) {
      const ok = await reserveAtomically(pool, "events_time_options", slot.id, quantity);
      if (!ok) {
        return apiResponse(false, "Not enough tickets available for that time");
      }
      reservation = { table: "events_time_options", id: slot.id };
    }
  } else if (event.availableTickets != null) {
    const ok = await reserveAtomically(pool, "events", eventId, quantity);
    if (!ok) {
      return apiResponse(false, "Not enough tickets available");
    }
    reservation = { table: "events", id: eventId };
  }

  const totalAmount = Number(event.ticketPrice) * quantity;
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  try {
    const booking = await payload.create({
      collection: "event-bookings",
      data: {
        event: eventId,
        bookingNumber: generateBookingNumber(),
        customerName,
        customerEmail,
        customerPhone,
        selectedTime: selectedTime || null,
        quantity,
        totalAmount,
        paymentMethod,
        status: stripeEnabled ? "pending" : "confirmed",
        brand,
        reservationTable: reservation?.table ?? null,
        reservationId: reservation?.id != null ? String(reservation.id) : null,
      },
    });

    if (!stripeEnabled) {
      await notifyBookingConfirmed(booking, event);
      return apiResponse(true, "Tickets purchased successfully", booking);
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          quantity,
          price_data: {
            currency: "kes",
            unit_amount: Math.round(Number(event.ticketPrice) * 100),
            product_data: { name: `${event.title}${selectedTime ? ` (${selectedTime})` : ""}` },
          },
        },
      ],
      metadata: { type: "event_booking", bookingId: String(booking.id) },
      success_url: `${origin}/${brandSlug}/order-confirmation?booking=${booking.bookingNumber}`,
      cancel_url: `${origin}/${brandSlug}/events`,
    });

    await payload.update({
      collection: "event-bookings",
      id: booking.id,
      data: { stripeSessionId: session.id },
    });

    return apiResponse(true, "Redirecting to payment", { ...booking, checkoutUrl: session.url });
  } catch {
    if (reservation) {
      await releaseReservation(pool, reservation.table, reservation.id, quantity);
    }
    return apiResponse(false, "Something went wrong processing your booking. Please try again.");
  }
}
