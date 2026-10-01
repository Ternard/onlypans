import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";

const MENU: Record<string, string[]> = {
  mains: ["Chevon dry fry", "Chevon wet fry", "Beef stew", "Chicken", "Fish"],
  sides: ["Veg rice", "Pilau", "Chapati", "Mandazi", "Kachumbari", "Greens"],
  extras: ["Tea service", "Fresh juice", "Wine pairing", "Fruit platters", "Dessert"],
};

const SERVICES = [
  {
    title: "Full Event Catering",
    text: "We plan the menu, shop, cook, set up and serve. Ideal for graduations, weddings, birthdays and corporate dinners.",
    points: ["Buffet or plated service", "10 – 500 guests", "Serving staff & clean-up"],
  },
  {
    title: "Labour + Equipment",
    text: "You buy the ingredients from our tailored shopping list; we bring the team, the pans and the know-how.",
    points: ["Custom shopping list", "Chefs, burners & serving ware", "Transport priced by location"],
  },
  {
    title: "Private Dining",
    text: "A chef's table in your home or a venue of your choice, for anniversaries, proposals and intimate dinners.",
    points: ["Multi-course menus", "Plated, restaurant-style service", "Wine pairing on request"],
  },
  {
    title: "Wine & Beverage Service",
    text: "From Kenyan tea service and fresh juices to curated wines and mocktails, matched to your menu.",
    points: ["Curated wine selection", "Mocktails & fresh juices", "Bar setup & service"],
  },
];

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const [category, names] of Object.entries(MENU)) {
    for (const name of names) {
      await payload.create({ collection: "menu-items", data: { name, category: category as "mains" | "sides" | "extras" }, req });
    }
  }
  for (const [i, s] of SERVICES.entries()) {
    await payload.create({
      collection: "services",
      data: { title: s.title, text: s.text, points: s.points.map((point) => ({ point })), displayOrder: i },
      req,
    });
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({ collection: "menu-items", where: { id: { exists: true } }, req });
  await payload.delete({ collection: "services", where: { id: { exists: true } }, req });
}
