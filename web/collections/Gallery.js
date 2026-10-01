export const Gallery = {
  slug: "gallery",
  admin: { group: "Website", useAsTitle: "caption", description: "Photos for the Gallery page." },
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
    { name: "caption", type: "text", admin: { description: "e.g. Beckham & Ted's Graduation Dinner" } },
    { name: "displayOrder", type: "number", defaultValue: 0 },
  ],
};
