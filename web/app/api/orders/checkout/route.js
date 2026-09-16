import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { stripeClient } from "@/lib/stripe";
import { getBrandByDbKey } from "@/lib/brands";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { orderChefEmail } from "@/lib/emailTemplates";

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(request) {
  const body = await request.json();
  const {
    customerName, customerEmail, customerPhone,
    shippingAddress, billingAddress, notes, brand, brandSlug, items,
  } = body;

  if (!customerName || !customerEmail || !items?.length) {
    return apiResponse(false, "Missing required fields: customerName, customerEmail, items");
  }

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
      paymentMethod: "card",
      notes,
      brand,
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
    const brandInfo = getBrandByDbKey(brand) || { name: "Only Pans", accent: "#BC3737" };
    const { subject, html } = orderChefEmail(order, brandInfo);
    await sendEmail({ to: chefEmail, subject, html, replyTo: customerEmail });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return apiResponse(true, "Order placed. Payments are not configured yet.", order);
  }

  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      ...items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "kes",
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: { name: item.name },
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency: "kes",
          unit_amount: Math.round(tax * 100),
          product_data: { name: "Tax" },
        },
      },
    ],
    metadata: { type: "order", orderId: String(order.id), orderNumber: order.orderNumber },
    success_url: `${origin}/${brandSlug}/order-confirmation?order=${order.orderNumber}`,
    cancel_url: `${origin}/${brandSlug}/cart`,
  });

  await payload.update({
    collection: "orders",
    id: order.id,
    data: { stripeSessionId: session.id },
  });

  return apiResponse(true, "Order created", { ...order, checkoutUrl: session.url });
}
