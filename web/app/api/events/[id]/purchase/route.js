import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";

function generateBookingNumber() {
  return `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const {
    customerName, customerEmail, customerPhone, quantity, selectedTime,
    paymentMethod = "CREDIT_CARD", brand = "only-pans",
  } = body;

  if (!customerName || !customerEmail || !quantity) {
    return apiResponse(false, "Missing required fields: customerName, customerEmail, quantity");
  }

  const payload = await payloadClient();

  let event;
  try {
    event = await payload.findByID({ collection: "events", id });
  } catch {
    return apiResponse(false, "Event not found");
  }

  const timeOptions = event.timeOptions || [];
  let slotIndex = -1;
  if (timeOptions.length > 0) {
    if (!selectedTime) {
      return apiResponse(false, "Please select a time");
    }
    slotIndex = timeOptions.findIndex((opt) => opt.time === selectedTime);
    if (slotIndex === -1) {
      return apiResponse(false, "Selected time is not valid for this event");
    }
    const slotAvailable = timeOptions[slotIndex].availableTickets;
    if (slotAvailable != null && slotAvailable < quantity) {
      return apiResponse(false, "Not enough tickets available for that time");
    }
  } else if (event.availableTickets < quantity) {
    return apiResponse(false, "Not enough tickets available");
  }

  const totalAmount = Number(event.ticketPrice) * quantity;

  const booking = await payload.create({
    collection: "event-bookings",
    data: {
      event: event.id,
      bookingNumber: generateBookingNumber(),
      customerName,
      customerEmail,
      customerPhone,
      selectedTime: selectedTime || null,
      quantity,
      totalAmount,
      paymentMethod,
      status: "confirmed",
      brand,
    },
  });

  if (slotIndex !== -1 && timeOptions[slotIndex].availableTickets != null) {
    const updatedOptions = [...timeOptions];
    updatedOptions[slotIndex] = {
      ...updatedOptions[slotIndex],
      availableTickets: updatedOptions[slotIndex].availableTickets - quantity,
    };
    await payload.update({
      collection: "events",
      id: event.id,
      data: { timeOptions: updatedOptions },
    });
  } else if (slotIndex === -1) {
    await payload.update({
      collection: "events",
      id: event.id,
      data: { availableTickets: event.availableTickets - quantity },
    });
  }

  return apiResponse(true, "Tickets purchased successfully", booking);
}
