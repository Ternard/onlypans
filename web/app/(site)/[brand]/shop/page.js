import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import ProductCard from "@/components/ProductCard";

export default async function ShopPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const { docs: products } = await payload.find({
    collection: "products",
    where: { isAvailable: { equals: true } },
    limit: 500,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Shop</h1>
      <p className="mt-2 max-w-xl text-black/60">
        Order {brand.name} online for pickup or delivery.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} accent={brand.accent} />
        ))}
        {products.length === 0 && (
          <p className="text-black/50">No products available right now.</p>
        )}
      </div>
    </section>
  );
}
