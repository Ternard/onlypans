export const OurStory = {
  slug: "our-story",
  admin: { useAsTitle: "brand" },
  fields: [
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"], required: true, unique: true },
    { name: "body", type: "textarea" },
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
  ],
};
