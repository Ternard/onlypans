export const Events = {
  slug: "events",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "eventDate", type: "date", required: true },
    {
      name: "timeOptions",
      type: "array",
      labels: { singular: "Time option", plural: "Time options" },
      minRows: 1,
      admin: { description: "One or more time slots guests can choose from (e.g. 6:00 PM, 8:00 PM)." },
      fields: [
        { name: "time", type: "text", required: true },
        { name: "availableTickets", type: "number" },
      ],
    },
    { name: "venue", type: "text" },
    { name: "ticketPrice", type: "number", defaultValue: 0 },
    { name: "availableTickets", type: "number", defaultValue: 0 },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload a photo, or leave empty and use the Image URL field below." },
    },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Used only if no photo is uploaded above." },
    },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
  ],
};
