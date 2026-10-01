export const Services = {
  slug: "services",
  admin: {
    group: "Website",
    useAsTitle: "title",
    defaultColumns: ["title", "displayOrder", "isPublished"],
    description: "The service cards on the Services page. Lowest 'Display order' shows first.",
  },
  defaultSort: "displayOrder",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "text", type: "textarea", required: true, label: "Description" },
    {
      name: "points",
      type: "array",
      label: "Bullet points",
      labels: { singular: "Bullet point", plural: "Bullet points" },
      fields: [{ name: "point", type: "text", required: true }],
    },
    { name: "displayOrder", type: "number", defaultValue: 0 },
    { name: "isPublished", type: "checkbox", defaultValue: true, admin: { description: "Untick to hide from the site without deleting." } },
  ],
};
