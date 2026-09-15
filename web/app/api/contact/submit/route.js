import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";

export async function POST(request) {
  const body = await request.json();
  const { firstName, lastName, email, phoneNumber, subject, message, brand } = body;

  if (!firstName || !email || !message) {
    return apiResponse(false, "Missing required fields: firstName, email, message");
  }

  const payload = await payloadClient();
  await payload.create({
    collection: "contact-messages",
    data: { firstName, lastName, email, phoneNumber, subject, message, brand, status: "new" },
  });

  return apiResponse(true, "Message sent successfully");
}
