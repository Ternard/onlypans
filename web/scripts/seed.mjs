import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });

  const existingProducts = await payload.find({ collection: "products", limit: 1 });
  if (existingProducts.totalDocs === 0) {
    const products = [
      { name: "Brisket Platter", description: "Slow-smoked Texas-style brisket, tender and juicy", price: 34.99, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", stockQuantity: 50, category: "meats" },
      { name: "Spare Ribs", description: "Fall-off-the-bone spare ribs with signature dry rub", price: 29.99, imageUrl: "https://images.unsplash.com/photo-1529193591184-2de580ef65f9?w=400", stockQuantity: 45, category: "meats" },
      { name: "Pulled Pork Sandwich", description: "Slow-roasted pulled pork with coleslaw", price: 14.99, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", stockQuantity: 100, category: "sandwiches" },
      { name: "BBQ Chicken Plate", description: "Grilled chicken with house BBQ sauce", price: 18.99, imageUrl: "https://images.unsplash.com/photo-1587593810163-2c5e79ee3b8a?w=400", stockQuantity: 75, category: "meats" },
      { name: "Mac & Cheese", description: "Creamy four-cheese mac and cheese", price: 7.99, imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400", stockQuantity: 200, category: "sides" },
      { name: "Corn Bread", description: "Honey butter cornbread (6 pieces)", price: 5.99, imageUrl: "https://images.unsplash.com/photo-1559785091-8c3c7a9a5cf7?w=400", stockQuantity: 150, category: "sides" },
      { name: "Banana Pudding", description: "Bourbon-infused banana pudding", price: 6.99, imageUrl: "https://images.unsplash.com/photo-1531163943978-e9b1f7a37cb5?w=400", stockQuantity: 80, category: "desserts" },
      { name: "BBQ Sauce Bundle", description: "Set of 3 signature BBQ sauces (Original, Spicy, Sweet)", price: 19.99, imageUrl: "https://images.unsplash.com/photo-1572276596237-aa2f0b4cc9cd?w=400", stockQuantity: 60, category: "merchandise" },
    ];
    for (const data of products) {
      await payload.create({ collection: "products", data: { ...data, isAvailable: true } });
    }
    console.log("Seeded products");
  }

  const existingSettings = await payload.find({ collection: "site-settings", limit: 1 });
  if (existingSettings.totalDocs === 0) {
    await payload.create({ collection: "site-settings", data: { settingKey: "phone", settingValue: "(555) 123-4567", brand: "only-pans" } });
    await payload.create({ collection: "site-settings", data: { settingKey: "phone", settingValue: "(555) 765-4321", brand: "pans-and-wine" } });
    console.log("Seeded site settings");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
