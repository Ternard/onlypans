import { getPayload } from "payload";
import config from "../payload.config.js";

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

const payload = await getPayload({ config });
for (const [i, s] of SERVICES.entries()) {
  const { totalDocs } = await payload.count({ collection: "services", where: { title: { equals: s.title } } });
  if (!totalDocs) {
    await payload.create({ collection: "services", data: { ...s, points: s.points.map((point) => ({ point })), displayOrder: i } });
  }
}
console.log("Services seeded");
process.exit(0);
