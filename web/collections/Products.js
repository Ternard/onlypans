export const Products = {
  slug: "products",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "price", type: "number", required: true },
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
    { name: "stockQuantity", type: "number", defaultValue: 0 },
    { name: "category", type: "text" },
    {
      name: "brand",
      type: "select",
      options: ["only-pans", "pans-and-wine"],
    },
    { name: "isAvailable", type: "checkbox", defaultValue: true },
  ],
};
