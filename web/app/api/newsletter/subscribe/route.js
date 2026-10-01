import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { SITE } from "@/lib/site";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { newsletterSignupChefEmail } from "@/lib/emailTemplates";

export async function POST(request) {
  const body = await request.json();
  const { email } = body;

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

  await payload.create({ collection: "newsletter-subscribers", data: { email } });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const { subject, html } = newsletterSignupChefEmail({ email }, SITE);
    await sendEmail({ to: chefEmail, subject, html });
  }

  return apiResponse(true, "Subscribed successfully");
}
