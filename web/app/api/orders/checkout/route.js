import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(request) {
  const body = await request.json();
  const {
    customerName, customerEmail, customerPhone,
    shippingAddress, billingAddress, paymentMethod, notes, brand, items,
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
      paymentMethod,
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

  return apiResponse(true, "Order placed successfully", order);
}
