export const NewsletterSubscribers = {
  slug: "newsletter-subscribers",
  admin: { useAsTitle: "email" },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};
