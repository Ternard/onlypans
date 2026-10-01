export const MenuItems = {
  slug: "menu-items",
  admin: {
    group: "Website",
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "isAvailable"],
    description: "The dishes customers can pick on the Services booking form. Also pickable when building a quote.",
  },
  defaultSort: "name",
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "mains",
      options: [
        { label: "Mains", value: "mains" },
        { label: "Sides & starches", value: "sides" },
        { label: "Drinks, fruit & extras", value: "extras" },
      ],
    },
    { name: "price", type: "number", admin: { description: "Optional price per person or per item (KSh). Pre-fills quotes; never shown on the site." } },
    { name: "isAvailable", type: "checkbox", defaultValue: true, admin: { description: "Untick to hide from the booking form without deleting." } },
  ],
};
