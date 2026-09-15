import { getPayload } from "payload";
import config from "../payload.config.js";

const PHOTOS = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
  "https://images.unsplash.com/photo-1529193591184-2de580ef65f9?w=1600",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600",
  "https://images.unsplash.com/photo-1587593810163-2c5e79ee3b8a?w=1600",
];

async function seedFor(payload, brand) {
  const { totalDocs } = await payload.find({
    collection: "hero-images",
    where: { brand: { equals: brand } },
    limit: 1,
  });
  if (totalDocs > 0) return;

  for (let i = 0; i < PHOTOS.length; i++) {
    await payload.create({
      collection: "hero-images",
      data: { imageUrl: PHOTOS[i], displayOrder: i, isActive: true, brand },
    });
  }
  console.log("Seeded hero images for", brand);
}

async function main() {
  const payload = await getPayload({ config });
  await seedFor(payload, "only-pans");
  await seedFor(payload, "pans-and-wine");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
