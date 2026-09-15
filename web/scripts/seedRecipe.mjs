import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.find({ collection: "recipes", limit: 1 });
  if (totalDocs === 0) {
    await payload.create({
      collection: "recipes",
      data: {
        title: "House BBQ Sauce",
        slug: "house-bbq-sauce",
        description: "Our signature sweet-and-smoky sauce, ready in 20 minutes.",
        prepTime: "20 min",
        servings: "makes 2 cups",
        brand: "only-pans",
        isPublished: true,
        ingredients: [
          { item: "1 cup ketchup" },
          { item: "1/4 cup apple cider vinegar" },
          { item: "1/4 cup brown sugar" },
          { item: "2 tbsp smoked paprika" },
          { item: "1 tbsp Worcestershire sauce" },
        ],
        steps: [
          { step: "Combine all ingredients in a saucepan over medium heat." },
          { step: "Simmer, stirring occasionally, for 15 minutes until thickened." },
          { step: "Cool and store in an airtight jar for up to 2 weeks." },
        ],
      },
    });
    console.log("Seeded sample recipe");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
