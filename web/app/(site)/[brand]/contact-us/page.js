import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import ContactForm from "./ContactForm";

export default async function ContactPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Contact Us</h1>
      <p className="mt-2 text-black/60">
        Questions, feedback, or a special request? Send {brand.name} a message.
      </p>
      <div className="mt-8">
        <ContactForm brand={brand} />
      </div>
    </section>
  );
}
