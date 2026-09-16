import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClearCartOnLoad from "./ClearCartOnLoad";

export default async function OrderConfirmationPage({ params, searchParams }) {
  const { brand: brandSlug } = await params;
  const { order, booking } = await searchParams;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);
  const reference = order || booking;

  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <ClearCartOnLoad />
      <h1 className="text-3xl font-extrabold sm:text-4xl">Thank you!</h1>
      <p className="mt-3 text-black/60">
        {reference ? `Your ${booking ? "booking" : "order"} ${reference} is confirmed.` : "You're confirmed."}{" "}
        We&apos;ll be in touch shortly with {booking ? "event" : "delivery"} details.
      </p>
      <Link
        href={`/${brand.slug}/shop`}
        className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
        style={{ backgroundColor: brand.accent }}
      >
        Continue Shopping
      </Link>
    </section>
  );
}
