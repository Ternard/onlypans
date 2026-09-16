import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import CartView from "./CartView";

export default async function CartPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Your Cart</h1>
      <CartView brand={brand} />
    </section>
  );
}
