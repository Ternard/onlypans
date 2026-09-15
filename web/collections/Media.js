export const Media = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf"],
  },
  admin: { useAsTitle: "filename" },
  fields: [{ name: "alt", type: "text" }],
};
