export const EventBookings = {
  slug: "event-bookings",
  admin: { useAsTitle: "bookingNumber" },
  fields: [
    { name: "event", type: "relationship", relationTo: "events", required: true },
    { name: "bookingNumber", type: "text", required: true, unique: true },
    { name: "customerName", type: "text", required: true },
    { name: "customerEmail", type: "email", required: true },
    { name: "customerPhone", type: "text" },
    { name: "selectedTime", type: "text" },
    { name: "quantity", type: "number", required: true },
    { name: "totalAmount", type: "number", required: true },
    { name: "paymentMethod", type: "text" },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: ["pending", "confirmed", "cancelled"],
    },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
    { name: "stripeSessionId", type: "text" },
    { name: "stripePaymentIntentId", type: "text" },
    {
      name: "reservationTable",
      type: "text",
      admin: { hidden: true, description: "Internal: table holding the reserved ticket count, for release on cancel/expiry." },
    },
    {
      name: "reservationId",
      type: "text",
      admin: { hidden: true, description: "Internal: row id holding the reserved ticket count, for release on cancel/expiry." },
    },
  ],
};
