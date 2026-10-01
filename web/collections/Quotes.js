export const Quotes = {
  slug: "quotes",
  admin: {
    group: "Requests",
    useAsTitle: "title",
    defaultColumns: ["quoteNumber", "title", "customerName", "total", "status"],
    description: "Build a quotation, then use 'Open printable quotation' to print it or save it as a PDF.",
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data;
        // Fill blanks from the linked catering request; never overwrite what the owner typed.
        if (data.cateringRequest) {
          const r = await req.payload.findByID({ collection: "catering-requests", id: data.cateringRequest, req }).catch(() => null);
          if (r) {
            data.customerName ||= r.name;
            data.customerEmail ||= r.email;
            data.customerPhone ||= r.phone;
            data.eventDate ||= r.eventDate;
            data.pax ||= r.guestCount;
            data.title ||= `${r.cateringType || "Catering"} for ${r.name}`;
            const menu = [r.selectedMeats, r.selectedSides, r.selectedDesserts].filter(Boolean).join(", ");
            if (!data.items?.length && menu) data.items = [{ description: menu, qty: 1, unitPrice: 0 }];
          }
        }
        let sum = 0;
        for (const it of data.items || []) {
          if (it.menuItem) {
            const m = await req.payload.findByID({ collection: "menu-items", id: it.menuItem, req }).catch(() => null);
            if (m) {
              it.description ||= m.name;
              if (!it.unitPrice && m.price) it.unitPrice = m.price;
            }
          }
          it.amount = Number(it.qty ?? 1) * Number(it.unitPrice || 0);
          sum += it.amount;
        }
        data.total = sum;
        if (operation === "create" && !data.quoteNumber) {
          const { totalDocs } = await req.payload.count({ collection: "quotes", req });
          data.quoteNumber = String(totalDocs + 1);
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "printLink", type: "ui", admin: { position: "sidebar", components: { Field: "/components/QuoteLink.jsx#default" } } },
    { name: "status", type: "select", defaultValue: "draft", options: ["draft", "sent", "accepted", "declined"], admin: { position: "sidebar" } },
    { name: "quoteNumber", type: "text", unique: true, admin: { position: "sidebar", description: "Automatic. Change it if you like." } },
    { name: "total", type: "number", admin: { position: "sidebar", readOnly: true, description: "Sum of all rows, automatic." } },
    {
      name: "cateringRequest",
      type: "relationship",
      relationTo: "catering-requests",
      admin: { description: "Optional: pick a customer request and save — their details, date, guests and menu are filled in for you." },
    },
    { name: "title", type: "text", admin: { description: "e.g. Beckham & Ted's Graduation Dinner" } },
    {
      type: "row",
      fields: [
        { name: "customerName", type: "text", admin: { description: "Filled from the request if left empty." } },
        { name: "customerEmail", type: "email" },
        { name: "customerPhone", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "eventDate", type: "text", admin: { description: "e.g. 14 December 2026" } },
        { name: "pax", type: "number", admin: { description: "Number of guests" } },
      ],
    },
    {
      name: "items",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      admin: { description: "Click 'Add Item' for each line. Qty 1 + a price = a lump sum." },
      fields: [
        { name: "menuItem", type: "relationship", relationTo: "menu-items", admin: { description: "Optional: pick a dish to fill in the description and price." } },
        { name: "description", type: "textarea" },
        {
          type: "row",
          fields: [
            { name: "qty", type: "number", defaultValue: 1 },
            { name: "unitPrice", type: "number", defaultValue: 0, admin: { description: "Price each (KSh)" } },
            { name: "amount", type: "number", admin: { readOnly: true, description: "Automatic" } },
          ],
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      defaultValue: "Labour + equipment when all ingredients are provided. Transport may vary.",
    },
    {
      name: "shoppingList",
      type: "array",
      labels: { singular: "Ingredient", plural: "Shopping list" },
      admin: { initCollapsed: true, description: "Optional: ingredients to buy. Download it from the sidebar." },
      fields: [{ name: "item", type: "text", required: true, admin: { description: "e.g. Rice 20kg" } }],
    },
  ],
};
