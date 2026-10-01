import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { darajaEnabled, normalizePhone, stkPush } from "@/lib/daraja";
import { expireOrder } from "@/lib/payments";
import { SITE } from "@/lib/site";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { orderChefEmail } from "@/lib/emailTemplates";

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(request) {
  const body = await request.json();
  const {
    customerName, customerEmail, customerPhone,
    shippingAddress, billingAddress, notes, items,
  } = body;
  const mpesaPhone = normalizePhone(customerPhone);

  if (!customerName || !customerEmail || !items?.length) {
    return apiResponse(false, "Missing required fields: customerName, customerEmail, items");
  }

  if (!darajaEnabled()) return apiResponse(false, "M-Pesa is not available right now.");
  if (!mpesaPhone) return apiResponse(false, "Enter a valid Safaricom number, e.g. 0712345678.");

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const shippingCost = 0;
  const total = subtotal + tax + shippingCost;

  const payload = await payloadClient();
  const order = await payload.create({
    collection: "orders",
    data: {
      orderNumber: generateOrderNumber(),
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      paymentMethod: "mpesa",
      notes,
      subtotal,
      tax,
      shippingCost,
      total,
      status: "pending",
      paymentStatus: "pending",
      items: items.map((item) => ({
        productId: item.productId ?? null,
        productName: item.name,
        quantity: item.quantity,
        priceAtTime: item.price,
        subtotal: Number(item.price) * item.quantity,
      })),
    },
  });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const { subject, html } = orderChefEmail(order, SITE);
    await sendEmail({ to: chefEmail, subject, html, replyTo: customerEmail });
  }

  try {
    const { CheckoutRequestID } = await stkPush({
      phone: mpesaPhone, amount: total, reference: order.orderNumber, description: "Order",
    });
    await payload.update({ collection: "orders", id: order.id, data: { mpesaCheckoutRequestId: CheckoutRequestID } });
  } catch (err) {
    await expireOrder(payload, order.id);
    return apiResponse(false, "Could not start M-Pesa payment. Please check your number and try again.");
  }
  return apiResponse(true, "Check your phone to complete payment", { ...order, mpesa: true });
}
