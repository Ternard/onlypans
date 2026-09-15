export const HeroImages = {
  slug: "hero-images",
  admin: { useAsTitle: "title" },
  fields: [
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
    { name: "title", type: "text" },
    { name: "subtitle", type: "text" },
    { name: "displayOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
  ],
};
