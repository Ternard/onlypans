export const Recipes = {
  slug: "recipes",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "prepTime", type: "text" },
    { name: "servings", type: "text" },
    {
      name: "ingredients",
      type: "array",
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "steps",
      type: "array",
      fields: [{ name: "step", type: "textarea", required: true }],
    },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
    { name: "isPublished", type: "checkbox", defaultValue: true },
  ],
};
