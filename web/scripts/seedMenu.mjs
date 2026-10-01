import { getPayload } from "payload";
import config from "../payload.config.js";

const MENU = {
  mains: ["Chevon dry fry", "Chevon wet fry", "Beef stew", "Chicken", "Fish"],
  sides: ["Veg rice", "Pilau", "Chapati", "Mandazi", "Kachumbari", "Greens"],
  extras: ["Tea service", "Fresh juice", "Wine pairing", "Fruit platters", "Dessert"],
};

const payload = await getPayload({ config });
for (const [category, names] of Object.entries(MENU)) {
  for (const name of names) {
    const { totalDocs } = await payload.count({ collection: "menu-items", where: { name: { equals: name } } });
    if (!totalDocs) await payload.create({ collection: "menu-items", data: { name, category } });
  }
}
console.log("Menu seeded");
process.exit(0);
