import { formatKsh } from "@/lib/currency";

function shell(title, bodyHtml, accent = "#BC3737") {
  return `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: ${accent}; margin-bottom: 4px;">${title}</h2>
      ${bodyHtml}
    </div>
  `;
}

export function cateringRequestChefEmail(data, brand) {
  return {
    subject: `New catering request — ${data.name}`,
    html: shell(
      "New Catering Request",
      `
        <p><strong>${data.name}</strong> (${data.email}${data.phone ? `, ${data.phone}` : ""}) requested catering for ${brand.name}.</p>
        <ul>
          ${data.eventDate ? `<li>Date: ${data.eventDate}${data.eventTime ? ` at ${data.eventTime}` : ""}</li>` : ""}
          ${data.location ? `<li>Location: ${data.location}</li>` : ""}
          ${data.guestCount ? `<li>Guests: ${data.guestCount}</li>` : ""}
          ${data.cateringType ? `<li>Type: ${data.cateringType}</li>` : ""}
          ${data.budget ? `<li>Budget: ${data.budget}</li>` : ""}
        </ul>
        ${data.eventDetails ? `<p>${data.eventDetails}</p>` : ""}
      `,
      brand.accent
    ),
  };
}

export function contactMessageChefEmail(data, brand) {
  return {
    subject: `New contact message — ${data.firstName}`,
    html: shell(
      "New Contact Message",
      `
        <p><strong>${data.firstName} ${data.lastName || ""}</strong> (${data.email}${data.phoneNumber ? `, ${data.phoneNumber}` : ""}) via ${brand.name}.</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
        <p>${data.message}</p>
      `,
      brand.accent
    ),
  };
}

export function newsletterSignupChefEmail(data, brand) {
  return {
    subject: `New newsletter signup — ${brand.name}`,
    html: shell("New Newsletter Signup", `<p>${data.email} subscribed via ${brand.name}.</p>`, brand.accent),
  };
}

export function orderChefEmail(order, brand) {
  const items = order.items
    .map((item) => `<li>${item.quantity} x ${item.productName} — ${formatKsh(item.subtotal)}</li>`)
    .join("");
  return {
    subject: `New paid order ${order.orderNumber} — ${brand.name}`,
    html: shell(
      "New Order",
      `
        <p><strong>${order.customerName}</strong> (${order.customerEmail}${order.customerPhone ? `, ${order.customerPhone}` : ""}) just paid for order ${order.orderNumber}.</p>
        ${order.shippingAddress ? `<p>Deliver to: ${order.shippingAddress}</p>` : ""}
        <ul>${items}</ul>
        <p><strong>Total: ${formatKsh(order.total)}</strong></p>
        ${order.notes ? `<p>Notes: ${order.notes}</p>` : ""}
      `,
      brand.accent
    ),
  };
}

export function orderCustomerEmail(order, brand) {
  const items = order.items
    .map((item) => `<li>${item.quantity} x ${item.productName} — ${formatKsh(item.subtotal)}</li>`)
    .join("");
  return {
    subject: `Your ${brand.name} order ${order.orderNumber} is confirmed`,
    html: shell(
      "Order Confirmed",
      `
        <p>Thanks, ${order.customerName}! Your order is confirmed and we're getting it ready.</p>
        <ul>${items}</ul>
        <p><strong>Total: ${formatKsh(order.total)}</strong></p>
      `,
      brand.accent
    ),
  };
}

export function bookingChefEmail(booking, event, brand) {
  return {
    subject: `New ticket booking — ${event.title}`,
    html: shell(
      "New Ticket Booking",
      `
        <p><strong>${booking.customerName}</strong> (${booking.customerEmail}${booking.customerPhone ? `, ${booking.customerPhone}` : ""}) booked ${booking.quantity} ticket(s) for <strong>${event.title}</strong>${booking.selectedTime ? ` at ${booking.selectedTime}` : ""}.</p>
        <p><strong>Total: ${formatKsh(booking.totalAmount)}</strong></p>
      `,
      brand.accent
    ),
  };
}

export function bookingCustomerEmail(booking, event, brand) {
  return {
    subject: `Your tickets for ${event.title} are confirmed`,
    html: shell(
      "Tickets Confirmed",
      `
        <p>Thanks, ${booking.customerName}! You're confirmed for <strong>${event.title}</strong>${booking.selectedTime ? ` at ${booking.selectedTime}` : ""}.</p>
        <p>Quantity: ${booking.quantity}</p>
        <p><strong>Total: ${formatKsh(booking.totalAmount)}</strong></p>
      `,
      brand.accent
    ),
  };
}
