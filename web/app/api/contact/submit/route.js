import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { getBrandByDbKey } from "@/lib/brands";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { contactMessageChefEmail } from "@/lib/emailTemplates";

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

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const brandInfo = getBrandByDbKey(brand) || { name: "Only Pans", accent: "#BC3737" };
    const { subject: emailSubject, html } = contactMessageChefEmail(
      { firstName, lastName, email, phoneNumber, subject, message },
      brandInfo
    );
    await sendEmail({ to: chefEmail, subject: emailSubject, html, replyTo: email });
  }

  return apiResponse(true, "Message sent successfully");
}
