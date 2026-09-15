export const CookbookDownloads = {
  slug: "cookbook-downloads",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "The Cookbook" },
    { name: "file", type: "upload", relationTo: "media", required: true },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"], required: true },
  ],
};
