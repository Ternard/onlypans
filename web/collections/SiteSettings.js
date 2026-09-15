export const SiteSettings = {
  slug: "site-settings",
  admin: { useAsTitle: "settingKey" },
  fields: [
    { name: "settingKey", type: "text", required: true },
    { name: "settingValue", type: "text", required: true },
    { name: "brand", type: "select", options: ["only-pans", "pans-and-wine"] },
  ],
};
