import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import CateringForm from "./CateringForm";

export default async function CateringPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Catering &amp; Events</h1>
      <p className="mt-2 text-black/60">
        Let {brand.name} cater your next event. Tell us the details below.
      </p>
      <div className="mt-8">
        <CateringForm brand={brand} />
      </div>
    </section>
  );
}
