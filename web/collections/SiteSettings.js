export const SiteSettings = {
  slug: "site-settings",
  admin: { group: "Website", useAsTitle: "settingKey" },
  fields: [
    { name: "settingKey", type: "text", required: true },
    { name: "settingValue", type: "text", required: true },
  ],
};
