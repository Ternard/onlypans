import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
  "https://images.unsplash.com/photo-1529193591184-2de580ef65f9?w=1600",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600",
];

export default async function BrandHome({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const [{ docs: products }, { docs: heroImages }] = await Promise.all([
    payload.find({
      collection: "products",
      where: { isAvailable: { equals: true } },
      limit: 4,
    }),
    payload.find({
      collection: "hero-images",
      where: { isActive: { equals: true }, brand: { equals: brand.dbKey } },
      sort: "displayOrder",
      limit: 10,
    }),
  ]);

  const images =
    heroImages.length > 0
      ? heroImages.map((img) => ({
          id: img.id,
          imageUrl: img.photo?.sizes?.hero?.url || img.photo?.url || img.imageUrl,
        }))
      : FALLBACK_IMAGES.map((imageUrl, id) => ({ id, imageUrl }));

  return (
    <>
      <HeroCarousel images={images} accent={brand.accent} dark={brand.dark}>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {brand.name}
        </h1>
        <p className="max-w-xl text-base opacity-90 sm:text-lg">
          {brand.tagline} &mdash; slow-smoked, made fresh, delivered anywhere.
        </p>
        <a
          href={`/${brand.slug}/shop`}
          className="mt-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
          style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
        >
          Order Now
        </a>
      </HeroCarousel>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Popular Picks</h2>
          <span
            className="hidden h-1 flex-1 rounded-full sm:ml-6 sm:block"
            style={{ backgroundImage: `linear-gradient(90deg, ${brand.accent}55, transparent)` }}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} accent={brand.accent} />
          ))}
        </div>
      </section>
    </>
  );
}
