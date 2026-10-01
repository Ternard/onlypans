export const Products = {
  slug: "products",
  admin: { group: "Shop", useAsTitle: "name" },
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
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "wearables",
      options: [
        { label: "Wearables", value: "wearables" },
        { label: "Cookware", value: "cookware" },
        { label: "eBooks & Recipes", value: "ebooks" },
      ],
      admin: { description: "Which Shop tab this item appears under." },
    },
    { name: "isAvailable", type: "checkbox", defaultValue: true },
  ],
};
