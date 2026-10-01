export const NewsletterSubscribers = {
  slug: "newsletter-subscribers",
  admin: { group: "Requests", useAsTitle: "email" },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};
