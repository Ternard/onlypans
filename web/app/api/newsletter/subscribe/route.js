import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { getBrandByDbKey } from "@/lib/brands";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { newsletterSignupChefEmail } from "@/lib/emailTemplates";

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

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const brandInfo = getBrandByDbKey(brand) || { name: "Only Pans", accent: "#BC3737" };
    const { subject, html } = newsletterSignupChefEmail({ email }, brandInfo);
    await sendEmail({ to: chefEmail, subject, html });
  }

  return apiResponse(true, "Subscribed successfully");
}
