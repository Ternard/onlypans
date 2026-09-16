import { payloadClient } from "@/lib/getPayload";
import { apiResponse } from "@/lib/apiResponse";
import { getBrandByDbKey } from "@/lib/brands";
import { sendEmail, chefNotificationEmail } from "@/lib/email";
import { cateringRequestChefEmail } from "@/lib/emailTemplates";

export async function POST(request) {
  const body = await request.json();
  const {
    name, email, phone, eventDate, eventTime, location, guestCount,
    cateringType, deliveryType, eventDetails, budget, referral,
    selectedMeats, selectedSides, selectedDesserts, brand,
  } = body;

  if (!name || !email) {
    return apiResponse(false, "Missing required fields: name, email");
  }

  const payload = await payloadClient();
  await payload.create({
    collection: "catering-requests",
    data: {
      name, email, phone, eventDate, eventTime, location,
      guestCount: guestCount ?? null,
      cateringType, deliveryType, eventDetails, budget, referral,
      selectedMeats: Array.isArray(selectedMeats) ? selectedMeats.join(", ") : selectedMeats,
      selectedSides: Array.isArray(selectedSides) ? selectedSides.join(", ") : selectedSides,
      selectedDesserts: Array.isArray(selectedDesserts) ? selectedDesserts.join(", ") : selectedDesserts,
      brand,
      status: "new",
    },
  });

  const chefEmail = chefNotificationEmail();
  if (chefEmail) {
    const brandInfo = getBrandByDbKey(brand) || { name: "Only Pans", accent: "#BC3737" };
    const { subject, html } = cateringRequestChefEmail(
      { name, email, phone, eventDate, eventTime, location, guestCount, cateringType, budget, eventDetails },
      brandInfo
    );
    await sendEmail({ to: chefEmail, subject, html, replyTo: email });
  }

  return apiResponse(true, "Catering request submitted successfully");
}
