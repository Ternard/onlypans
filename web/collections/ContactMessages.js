export const ContactMessages = {
  slug: "contact-messages",
  admin: { group: "Requests", useAsTitle: "email" },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text" },
    { name: "email", type: "email", required: true },
    { name: "phoneNumber", type: "text" },
    { name: "subject", type: "text" },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "read", "replied"],
    },
  ],
};
