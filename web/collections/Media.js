export const Media = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 300, height: 300, position: "centre" },
      { name: "card", width: 600, height: 450, position: "centre" },
      { name: "hero", width: 1920, height: null, position: "centre" },
    ],
    formatOptions: { format: "webp", options: { quality: 80 } },
  },
  admin: { useAsTitle: "filename" },
  fields: [{ name: "alt", type: "text" }],
};
