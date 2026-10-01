import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { darajaEnabled, normalizePhone, stkPush } from "@/lib/daraja";

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
  } = body;
  const quantity = Number(body.quantity);
  const mpesaPhone = normalizePhone(customerPhone);

  if (
    !customerName || !customerEmail ||
    !Number.isInteger(eventId) ||
    !Number.isInteger(quantity) || quantity < 1
  ) {
    return apiResponse(false, "Missing or invalid fields: customerName, customerEmail, quantity");
  }

  if (!darajaEnabled()) return apiResponse(false, "M-Pesa is not available right now.");
  if (!mpesaPhone) return apiResponse(false, "Enter a valid Safaricom number, e.g. 0712345678.");

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
        paymentMethod: "mpesa",
        status: "pending",
        reservationTable: reservation?.table ?? null,
        reservationId: reservation?.id != null ? String(reservation.id) : null,
      },
    });

    const { CheckoutRequestID } = await stkPush({
      phone: mpesaPhone, amount: totalAmount, reference: booking.bookingNumber, description: "Tickets",
    });
    await payload.update({ collection: "event-bookings", id: booking.id, data: { mpesaCheckoutRequestId: CheckoutRequestID } });
    return apiResponse(true, "Check your phone to complete payment", { ...booking, mpesa: true });
  } catch {
    if (reservation) {
      await releaseReservation(pool, reservation.table, reservation.id, quantity);
    }
    return apiResponse(false, "Something went wrong processing your booking. Please try again.");
  }
}
