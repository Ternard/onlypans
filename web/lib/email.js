import { Resend } from "resend";

let cached;

function resendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!cached) {
    cached = new Resend(process.env.RESEND_API_KEY);
  }
  return cached;
}

// Resend's shared sandbox sender — works immediately without owning a domain.
// Swap for a verified address (e.g. orders@yourdomain.com) once a domain is set up.
const DEFAULT_FROM = "Only Pans <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, replyTo }) {
  const resend = resendClient();
  if (!resend) {
    console.log(`[email skipped — RESEND_API_KEY not set] to=${to} subject="${subject}"`);
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM || DEFAULT_FROM,
    to,
    subject,
    html,
    replyTo,
  });

  if (error) {
    console.error("Failed to send email:", error);
    return { error };
  }
  return { data };
}

export function chefNotificationEmail() {
  const raw = process.env.CHEF_NOTIFICATION_EMAIL;
  if (!raw) return null;
  const addresses = raw.split(",").map((address) => address.trim()).filter(Boolean);
  return addresses.length > 1 ? addresses : addresses[0] || null;
}
