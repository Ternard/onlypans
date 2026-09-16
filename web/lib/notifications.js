import { getBrandByDbKey } from "@/lib/brands";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { orderChefEmail, orderCustomerEmail, bookingChefEmail, bookingCustomerEmail } from "@/lib/emailTemplates";

export async function notifyOrderPaid(order) {
  const brand = getBrandByDbKey(order.brand) || { name: "Only Pans", accent: "#BC3737" };

  const customer = orderCustomerEmail(order, brand);
  await sendEmail({ to: order.customerEmail, subject: customer.subject, html: customer.html });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const chef = orderChefEmail(order, brand);
    await sendEmail({ to: chefEmail, subject: `[Paid] ${chef.subject}`, html: chef.html, replyTo: order.customerEmail });
  }
}

export async function notifyBookingConfirmed(booking, event) {
  const brand = getBrandByDbKey(booking.brand) || { name: "Only Pans", accent: "#BC3737" };

  const customer = bookingCustomerEmail(booking, event, brand);
  await sendEmail({ to: booking.customerEmail, subject: customer.subject, html: customer.html });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const chef = bookingChefEmail(booking, event, brand);
    await sendEmail({ to: chefEmail, subject: chef.subject, html: chef.html, replyTo: booking.customerEmail });
  }
}
