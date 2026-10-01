import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { SITE } from "@/lib/site";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { contactMessageChefEmail } from "@/lib/emailTemplates";

export async function POST(request) {
  const body = await request.json();
  const { firstName, lastName, email, phoneNumber, subject, message } = body;

  if (!firstName || !email || !message) {
    return apiResponse(false, "Missing required fields: firstName, email, message");
  }

  const payload = await payloadClient();
  await payload.create({
    collection: "contact-messages",
    data: { firstName, lastName, email, phoneNumber, subject, message, status: "new" },
  });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const { subject: emailSubject, html } = contactMessageChefEmail(
      { firstName, lastName, email, phoneNumber, subject, message },
      SITE
    );
    await sendEmail({ to: chefEmail, subject: emailSubject, html, replyTo: email });
  }

  return apiResponse(true, "Message sent successfully");
}
