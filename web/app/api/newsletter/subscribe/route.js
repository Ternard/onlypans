import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";

export async function POST(request) {
  const body = await request.json();
  const { email, brand } = body;

  if (!email) {
    return apiResponse(false, "Email is required");
  }

  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "newsletter-subscribers",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (docs.length > 0) {
    return apiResponse(false, "This email is already subscribed");
  }

  await payload.create({ collection: "newsletter-subscribers", data: { email, brand } });
  return apiResponse(true, "Subscribed successfully");
}
